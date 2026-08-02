-- AlterTable
ALTER TABLE "pii_scan_configs" ALTER COLUMN "enabledPatterns" SET DEFAULT ARRAY['email', 'phone', 'ni_number', 'ssn', 'nhs_number', 'iban']::TEXT[];

