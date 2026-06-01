ALTER TABLE "webhooks"
  ADD COLUMN "userId"      TEXT,
  ADD COLUMN "events"      JSONB,
  ADD COLUMN "description" TEXT;

CREATE INDEX "webhooks_userId_idx" ON "webhooks"("userId");
