-- Add videoProvider to event_types
ALTER TABLE "event_types" ADD COLUMN "videoProvider" TEXT NOT NULL DEFAULT 'JITSI';

-- Create zoom_integrations table
CREATE TABLE "zoom_integrations" (
    "id"           TEXT NOT NULL,
    "userId"       TEXT NOT NULL,
    "accountId"    TEXT NOT NULL,
    "accessToken"  TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt"    TIMESTAMP(3) NOT NULL,
    "syncStatus"   TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zoom_integrations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "zoom_integrations_userId_key" ON "zoom_integrations"("userId");
CREATE INDEX "zoom_integrations_userId_idx" ON "zoom_integrations"("userId");

ALTER TABLE "zoom_integrations"
    ADD CONSTRAINT "zoom_integrations_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
