-- Backfill onboardingStage from the lifecycle status clients already carry.
--
-- Adding the column with DEFAULT 'PROSPECT' put every existing client into the
-- Prospect group, including ones that have been live for months. The board then
-- showed six prospects and five empty columns, which is not what the data says.
--
-- `status` and `onboardingStage` answer different questions:
--   status          — where are they in the relationship (active/paused/churned)
--   onboardingStage — did they get through onboarding, and how far
--
-- Anything not currently in `onboarding` status has, by definition, already
-- come through onboarding — so it belongs in ACTIVE, whatever its lifecycle
-- state is today. A paused or churned client was still onboarded once.

UPDATE "client_crm"
   SET "onboardingStage"       = 'ACTIVE',
       "onboardingCompletedAt" = COALESCE("onboardingCompletedAt", "contractStart", "createdAt")
 WHERE "status" IN ('active', 'paused', 'churned')
   AND "onboardingStage" = 'PROSPECT';

-- Genuinely mid-flight. KICKOFF is the honest floor: we know they started, and
-- nothing in the data says how far they got.
UPDATE "client_crm"
   SET "onboardingStage"     = 'KICKOFF',
       "onboardingStartedAt" = COALESCE("onboardingStartedAt", "createdAt")
 WHERE "status" = 'onboarding'
   AND "onboardingStage" = 'PROSPECT';
