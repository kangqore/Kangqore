CREATE TABLE "custom_domains" (
    "id"           TEXT NOT NULL,
    "userId"       TEXT NOT NULL,
    "domain"       TEXT NOT NULL,
    "verifiedAt"   TIMESTAMP(3),
    "status"       TEXT NOT NULL DEFAULT 'PENDING',
    "verifyToken"  TEXT NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_domains_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "custom_domains_domain_key"      ON "custom_domains"("domain");
CREATE UNIQUE INDEX "custom_domains_verifyToken_key" ON "custom_domains"("verifyToken");
CREATE INDEX        "custom_domains_userId_idx"      ON "custom_domains"("userId");
CREATE INDEX        "custom_domains_domain_idx"      ON "custom_domains"("domain");

ALTER TABLE "custom_domains"
    ADD CONSTRAINT "custom_domains_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
