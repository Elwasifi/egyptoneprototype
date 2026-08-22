import * as React from 'react';
import { AGENTS } from '@egypt-one/agents';
import { Badge } from '@egypt-one/ui';

/**
 * The agent graph, rendered from the registry rather than a diagram, so what
 * the page shows and what the platform enforces cannot drift apart.
 */
export function AgentGraph() {
  const concierge = AGENTS[0];
  const specialists = AGENTS.slice(1);

  return (
    <div className="grid gap-4">
      <div className="surface-gold p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-gold-600">Agent 0 — the only one the user sees</div>
            <h3 className="mt-1.5 text-[18px] font-semibold text-gold-200">{concierge.name}</h3>
            <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-ink-mid">{concierge.purpose}</p>
          </div>
          <Badge tone="gold">Orchestrator</Badge>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">Can</div>
            <ul className="grid gap-1 text-[12px] text-ink-mid">
              {concierge.canDo.map((c) => <li key={c}>· {c}</li>)}
            </ul>
          </div>
          <div>
            <div className="mb-2 text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">Cannot</div>
            <ul className="grid gap-1 text-[12px] text-danger/90">
              {concierge.cannotDo.map((c) => <li key={c}>· {c}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {specialists.map((a) => (
          <div key={a.key} className="surface p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.14em] text-gold-600">Agent {a.index}</div>
                <h4 className="mt-1 text-[14px] font-semibold text-ink-hi">{a.name}</h4>
              </div>
              {a.requiresHumanApproval && <Badge tone="warn">Human approval</Badge>}
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-ink-low">{a.purpose}</p>

            <div className="mt-3">
              <div className="mb-1.5 text-[10px] uppercase tracking-[0.14em] text-ink-faint">Cannot</div>
              <ul className="grid gap-0.5 text-[11.5px] text-danger/85">
                {a.cannotDo.slice(0, 3).map((c) => <li key={c}>· {c}</li>)}
              </ul>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {a.allowedTools.slice(0, 4).map((t) => (
                <span key={t} className="rounded border border-white/10 bg-white/4 px-1.5 py-0.5 font-mono text-[10px] text-ink-low">{t}</span>
              ))}
              {a.allowedTools.length > 4 && <span className="text-[10px] text-ink-faint">+{a.allowedTools.length - 4}</span>}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10.5px]">
              <span className="text-ink-faint">Roles:</span>
              <span className="text-ink-low">
                {a.requiredRoles === 'ANY' ? 'any signed-in user' : (a.requiredRoles as string[]).map((r) => r.replace(/_/g, ' ').toLowerCase()).join(', ')}
              </span>
            </div>
            {a.requiresConsent?.length ? (
              <div className="mt-1.5 text-[10.5px] text-turquoise">Requires consent: {a.requiresConsent.join(', ').toLowerCase()}</div>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-white/6 pt-2 text-[10px] text-ink-faint">
              <span>{a.rateLimitPerMin}/min</span>
              <span aria-hidden="true">·</span>
              <span title={a.deniedDataClasses.join(', ')}>denies {a.deniedDataClasses.length} data class{a.deniedDataClasses.length === 1 ? '' : 'es'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
