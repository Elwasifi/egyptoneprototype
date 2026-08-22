import { describe, it, expect } from 'vitest';
import { computeCommission, REVENUE_RULES } from '@egypt-one/config';

describe('revenue rules', () => {
  it('never applies a commission to a government fee', () => {
    const { amount } = computeCommission('GOVERNMENT_FEE', 1000);
    expect(amount).toBe(0);
  });

  it('never applies a commission to a visa fee', () => {
    const { amount } = computeCommission('VISA_FEE', 500);
    expect(amount).toBe(0);
  });

  it('every commissionable rule declares a positive rate or an explicit non-percentage model', () => {
    for (const rule of REVENUE_RULES.filter((r) => r.commissionable)) {
      if (rule.model.kind === 'PERCENTAGE' || rule.model.kind === 'AFFILIATE') {
        expect(rule.model.pct).toBeGreaterThan(0);
      }
    }
  });
});
