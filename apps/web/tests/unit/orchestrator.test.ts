import { describe, it, expect } from 'vitest';
import { composeGuard } from '@egypt-one/agents';
import { agentByKey } from '@egypt-one/agents';

describe('composeGuard()', () => {
  it('downgrades a visa question with no authoritative citation to a non-official label', () => {
    const agent = agentByKey('GOV_SERVICES')!;
    const result = composeGuard({ agent, question: 'What visa do I need to enter Egypt?', citations: [] });
    expect(result.label).not.toBe('OFFICIAL_SOURCE');
  });
});
