CREATE TABLE "crm_integrations" (
    "id"           TEXT NOT NULL,
    "userId"       TEXT NOT NULL,
    "provider"     TEXT NOT NULL,
    "accountId"    TEXT NOT NULL,
    "accessToken"  TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt"    TIMESTAMP(3) NOT NULL,
    "syncStatus"   TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_integrations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "crm_integrations_userId_provider_key" ON "crm_integrations"("userId", "provider");
CREATE INDEX "crm_integrations_userId_idx" ON "crm_integrations"("userId");

ALTER TABLE "crm_integrations"
    ADD CONSTRAINT "crm_integrations_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
