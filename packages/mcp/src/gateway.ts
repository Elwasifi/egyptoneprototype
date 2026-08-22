import { MCP_TOOLS, toolByKey, type McpTool, type ToolContext } from './registry';
import type { DataClass } from '@egypt-one/types';

export interface GatewayResult<T = unknown> {
  ok: boolean;
  tool: string;
  data?: T;
  /** Always present on a refusal so the UI can say what happened and why. */
  refusal?: { code: 'UNKNOWN_TOOL' | 'NOT_CONNECTED' | 'PERMISSION' | 'RATE_LIMIT' | 'BAD_INPUT' | 'AGENT_NOT_ALLOWED'; message: string };
  sourceStatus: 'LIVE' | 'VERIFIED_DATA' | 'PARTNER_DATA' | 'DEMO' | 'SIMULATED' | 'PLANNED_INTEGRATION';
  dataClass: DataClass;
  sourceOwner: string;
}

type Handler = (input: unknown, ctx: ToolContext) => Promise<unknown>;
const handlers = new Map<string, Handler>();

/** Hosts register implementations at boot. A tool with no handler is not callable. */
export function registerHandler(toolKey: string, handler: Handler) {
  if (!toolByKey(toolKey)) throw new Error(`Cannot register a handler for an undeclared tool: ${toolKey}`);
  handlers.set(toolKey, handler);
}

export function registeredTools() {
  return MCP_TOOLS.map((t) => ({ ...t, implemented: handlers.has(t.key) }));
}

const counters = new Map<string, { n: number; resetAt: number }>();
function withinRate(key: string, perMin: number) {
  const now = Date.now();
  const c = counters.get(key);
  if (!c || now > c.resetAt) { counters.set(key, { n: 1, resetAt: now + 60_000 }); return true; }
  c.n += 1;
  return c.n <= perMin;
}

/**
 * The only way any agent reaches any data.
 *
 * Order of checks: declaration → agent allow-list → rate limit → schema →
 * connection state → permission → audit → run. A refusal is never silent.
 */
export async function callTool(
  toolKey: string,
  input: unknown,
  ctx: ToolContext,
  opts: { agentAllowedTools?: string[]; agentKey?: string } = {},
): Promise<GatewayResult> {
  const tool = toolByKey(toolKey) as McpTool | undefined;

  const base = (t?: McpTool) => ({
    tool: toolKey,
    sourceStatus: (t?.state === 'LIVE' ? 'LIVE' : t?.state === 'SANDBOX' ? 'DEMO' : 'PLANNED_INTEGRATION') as GatewayResult['sourceStatus'],
    dataClass: (t?.dataClass ?? 'PUBLIC') as DataClass,
    sourceOwner: t?.sourceOwner ?? 'Unknown',
  });

  if (!tool) {
    return { ok: false, ...base(), refusal: { code: 'UNKNOWN_TOOL', message: `Tool "${toolKey}" is not in the MCP registry.` } };
  }

  if (opts.agentAllowedTools && !opts.agentAllowedTools.includes(toolKey)) {
    return {
      ok: false, ...base(tool),
      refusal: { code: 'AGENT_NOT_ALLOWED', message: `${opts.agentKey ?? 'This agent'} is not permitted to call ${toolKey}.` },
    };
  }

  if (!withinRate(`${ctx.userId ?? 'anon'}:${toolKey}`, tool.rateLimitPerMin)) {
    return { ok: false, ...base(tool), refusal: { code: 'RATE_LIMIT', message: `Rate limit of ${tool.rateLimitPerMin}/min reached for ${toolKey}.` } };
  }

  const parsed = tool.inputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, ...base(tool), refusal: { code: 'BAD_INPUT', message: `Input did not match the declared schema for ${toolKey}.` } };
  }

  if (tool.state === 'PLANNED' || tool.state === 'DISABLED') {
    if (tool.auditRequired) ctx.audit({ action: 'tool.call', resource: toolKey, decision: 'DENY', dataClass: tool.dataClass, note: 'Integration not connected.' });
    return {
      ok: false, ...base(tool),
      refusal: { code: 'NOT_CONNECTED', message: `${tool.name} is a ${tool.state.toLowerCase()} integration owned by ${tool.sourceOwner}. No data is available and nothing is being inferred.` },
    };
  }

  const handler = handlers.get(toolKey);
  if (!handler) {
    return { ok: false, ...base(tool), refusal: { code: 'NOT_CONNECTED', message: `${tool.name} is declared but has no implementation registered in this deployment.` } };
  }

  if (tool.auditRequired) {
    ctx.audit({ action: 'tool.call', resource: toolKey, decision: 'ALLOW', dataClass: tool.dataClass, note: ctx.purpose });
  }

  try {
    const data = await handler(parsed.data, ctx);
    return { ok: true, ...base(tool), data };
  } catch (err) {
    return {
      ok: false, ...base(tool),
      refusal: { code: 'NOT_CONNECTED', message: `${tool.name} failed: ${(err as Error).message}` },
    };
  }
}
