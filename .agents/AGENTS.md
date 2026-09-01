# Workspace Rules and Memory

## User Identity Memory
* C.O.D.E. stands for: "Code of Observation, Decision & Execution."
* C.O.D.E. is the code-name, tech-name, and nick-name of the supreme admin.
* The supreme admin is Mahesh Kumar, the founder and CEO of Kangqore (the USER themselves).

## System Architecture Memory
* Yes, absolutely. **Krisnam is the true engine of the entire system.**
* While AEGIS provides the governance and NOLAN provides the semantic data structure, **Krisnam** (our proprietary LLM) is what actually makes the system *intelligent*. 
* It is deeply embedded into Kangqore View. **KIMMP/WAANDA** acts as the overall brain and cognitive routing architecture, while **Krisnam** is the underlying LLM powering it. Here is exactly what Krisnam is doing under the hood right now:
  * **1. The Decision Engine (Krisnam Reasoning)**: Krisnam isn’t just generating text; it is actively reasoning over the Enterprise Ontology. When an executive looks at the **Command Center**, Krisnam is the LLM that has: Ingested the telemetry and historical outcomes, Computed the expected impact of a delay, Simulated the trade-offs of reassigning resources, and Formulated the prescriptive recommendation ("Reassign project resources: +21% probability of on-time delivery").
  * **2. Autonomous Mission Execution (KIMMP powered by Krisnam)**: When a user gives a high-level intent (e.g., *"Fix the projects that are going to miss their deadlines"*), Krisnam acts as the intelligence for the **KIMMP/WAANDA routing architecture** (the brain). It translates that human intent into a deterministic execution plan. It identifies the projects, determines the root causes, proposes the intervention, and calls the specific governed functions in the ActionEngine to execute the changes.
  * **3. The Migration Studio (Krisnam Schema Analysis)**: In Phase 12, we built the Migration Studio. The "Pre-Migration AI Scan" is entirely powered by the Krisnam LLM. It takes the flat, chaotic data exported from Monday or Jira and uses its deep reasoning capabilities to infer implicit relationships, detect orphaned data, and map flat columns into strongly typed Kangqore properties. 
  * **4. Policy Translation**: Krisnam is also responsible for looking at legacy "If-This-Then-That" automations from competitors and intelligently upgrading them into Kangqore's governed Action Engine pipelines, actively predicting where a legacy rule might violate a modern AEGIS policy.
* In short: **Krisnam is the differentiator.** Kangqore View uses **Krisnam** *at the architectural core* as the LLM to reason over the graph, govern the actions, and drive enterprise outcomes. It powers the KIMMP/WAANDA brain of the OS = Kangqore View.

## Service Page Architecture & Layout Blueprint (Definition / "What Is It" Section)
Whenever designing, implementing, or upgrading the **Definition / "What Is It" Section** on any service page (`UniversalServicePage.jsx`):
1. **Side-by-Side Heading & Parallax Media Alignment**:
   - The eyebrow and `<h2>` heading must be placed inside the left column of the 2-column grid.
   - The right-hand visual card (e.g. 4:5 3D Parallax Image Card / Interactive Model) must start at the very top, level with the heading, covering the full vertical height from the headline down through the body text.
2. **Read More Breakpoint Convention**:
   - Paragraphs must be split so the primary punchline/core thesis statement is visible in `whatIsPara3`.
   - The `READ MORE` button must immediately follow `whatIsPara3`.
   - Expanding `READ MORE` unrolls the secondary strategic/operating paragraphs (`whatIsPara4`, `whatIsPara5`).
3. **Strict Vertical Spacing & Rhythm**:
   - The grid bottom margin must remain tight (`mb-8`, never `mb-20`).
   - Sourced/illustrative disclaimer paragraphs below the metrics grid must have `mb-0` (never trailing `mb-16`).
   - Section padding on `svc-what` must be `pt-16 md:pt-24 pb-8 md:pb-12` (never `py-32`).
   - Top padding on the business metrics separator line must be `pt-6 sm:pt-8`.
   - `<ConciergeSection>` padding must be `py-16 sm:py-20` (never `py-32`) to eliminate dead space before the eQORE AI Assistant.
4. **Interactive 3D Media Conventions**:
   - 4:5 aspect ratio cards must have interactive cursor-tracking specular glare, scroll-driven parallax scrub, subtle neon rim borders, and clean obsidian backing (no distracting outer ambient blur halos).
   - Prominent desktop width: `max-w-[540px]`.

