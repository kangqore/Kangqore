
-- Drop existing policies if they exist (idempotency)
DROP POLICY IF EXISTS "deny_public_access" ON "public"."_prisma_migrations";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."projects";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."deliverables";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."tasks";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."insights";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."media_files";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."contents";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."users";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."conversations";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."sessions";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."oauth_providers";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."audit_logs";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."consultations";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."contacts";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."job_applications";

-- Create "Deny All" policies
CREATE POLICY "deny_public_access" ON "public"."_prisma_migrations" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."projects" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."deliverables" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."tasks" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."insights" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."media_files" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."contents" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."users" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."conversations" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."sessions" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."oauth_providers" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."audit_logs" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."consultations" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."contacts" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."job_applications" FOR ALL TO public USING (false);
