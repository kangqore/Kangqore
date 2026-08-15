export interface ExecutivePolicy {
  policyId: string;
  statement: string;
}

export const CORE_EXECUTIVE_POLICIES: ExecutivePolicy[] = [
  { policyId: 'POL_EXEC_001', statement: 'Optimize long-term enterprise value.' },
  { policyId: 'POL_EXEC_002', statement: 'Prefer reversible decisions.' },
  { policyId: 'POL_EXEC_003', statement: 'Protect enterprise trust above growth.' },
  { policyId: 'POL_EXEC_004', statement: 'Escalate uncertainty; do not guess.' },
  { policyId: 'POL_EXEC_005', statement: 'Base all decisions strictly on evidence.' }
];
