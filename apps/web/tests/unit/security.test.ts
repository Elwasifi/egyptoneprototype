import { describe, it, expect } from 'vitest';
import { decide } from '@egypt-one/security';

describe('decide()', () => {
  it('allows a tourist to read public content', () => {
    const result = decide(
      { userId: 'u1', roles: ['TOURIST'], consents: [] },
      { action: 'read', resource: 'governorates', dataClass: 'PUBLIC' },
    );
    expect(result.allow).toBe(true);
  });

  it('denies a tourist reading another user\'s sensitive health data without consent', () => {
    const result = decide(
      { userId: 'u1', roles: ['TOURIST'], consents: [] },
      { action: 'read', resource: 'medical-record', dataClass: 'SENSITIVE', ownerUserId: 'u2' },
    );
    expect(result.allow).toBe(false);
  });

  it('always audits access to RESTRICTED_GOVERNMENT data', () => {
    const result = decide(
      { userId: 'gov1', roles: ['GOVERNMENT_ANALYST'], consents: [] },
      { action: 'read', resource: 'aggregate-intelligence', dataClass: 'RESTRICTED_GOVERNMENT' },
    );
    expect(result.audited).toBe(true);
  });
});
