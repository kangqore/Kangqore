# Professional Services Pack — COM Playbook
## Deployment Lifecycle Notes from the Live Kangqore Global Deployment

---

### Week 1 — Foundation

1. Deploy Kangqore OS Foundation.
2. Seed ontology entity types from `ontology/entity-types.json`.
3. Create the `EnterpriseDefinition` with goals from `goals/enterprise-goals.json`. Adjust targets to match the specific customer.
4. Load policies from `policies/governance-rules.json` into `EnterprisePolicy` table.
5. Save the COIG **BASELINE** snapshot immediately. This is the before-state. No COIG number is meaningful without it.
6. Activate all 9 workflow templates.

### Week 2–3 — Delivery on WAANDA

1. Import all active projects and create `OntologyObject` entries for each.
2. Run `POST /admin/ontology/graph/auto-link` to seed relationships.
3. Trigger **Project Kick-off** workflow for each active project (even retroactively).
4. Run `POST /admin/projects/ops/sweep` to compute initial `ProjectOperationalState` for all projects.
5. Schedule **Milestone Review** workflow to trigger 7 days before each upcoming milestone.

### Week 4 — Finance on WAANDA

1. Import invoice history. Overdue invoices will trigger the **Collections Escalation** workflow.
2. Set the invoice approval threshold in `EnterprisePolicy` — default ₹5 lakh, adjust per customer.
3. Enable the **Budget Variance Alert** workflow on weekly schedule.

### Week 5 — Sales on WAANDA

1. Import leads. Run **Lead Qualification Flow** on all unscored leads.
2. Enable **Proposal Follow-up** workflow — configure day threshold (default: 5 days).
3. Review pipeline score distribution after qualification — ICP fit issues will appear here first.

### Week 6–7 — Coach and Checkpoint

1. ENTERPRISE_COACH has now run at least once. Review `/admin/enterprise/coach` for pattern insights.
2. Save a **CHECKPOINT** Gate 8 snapshot.
3. Run `GET /admin/enterprise/coig` — review Current / Expected / Potential triple number.
4. Generate Customer Zero Report: `GET /admin/enterprise/customer-zero`.
5. Review Enterprise DNA: `GET /admin/enterprise/dna`. Compare against `enterprise-dna.json` reference profile.

---

### Commercial Engineering Rule #1

> Every feature must improve COIG, OIS, Adoption, or Time-to-Value.
> If it improves none of them, don't build it.

Apply this rule to every customisation request from the customer.

---

### Pack Extraction (for the next deployment)

After 90 days, extract the updated pack:

1. Export active `EnterpriseGoal` records → update `goals/enterprise-goals.json`.
2. Export `CoachingInsight` records with `isActed: true` → add to `recommendations/seed-recommendations.json`.
3. Update `enterprise-dna.json` with the observed DNA profile for this deployment type.
4. Increment `version` in `manifest.json`.
5. Commit as `packs/professional-services/v1.1.0/`.

Each live deployment makes the next deployment faster and more accurate.
