
-- Drop existing policies if they exist (idempotency)
DROP POLICY IF EXISTS "deny_public_access" ON "public"."admin_items";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."content_analytics";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."content_shares";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."content_views";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."email_logs";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."investor_updates";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."jobs";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."meetings";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."messages";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."notifications";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."product_versions";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."reading_history";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."resource_links";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."subscribers";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."ticket_messages";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."tickets";
DROP POLICY IF EXISTS "deny_public_access" ON "public"."visits";

-- Create "Deny All" policies for tables with RLS enabled but no policies
CREATE POLICY "deny_public_access" ON "public"."admin_items" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."content_analytics" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."content_shares" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."content_views" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."email_logs" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."investor_updates" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."jobs" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."meetings" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."messages" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."notifications" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."product_versions" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."reading_history" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."resource_links" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."subscribers" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."ticket_messages" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."tickets" FOR ALL TO public USING (false);
CREATE POLICY "deny_public_access" ON "public"."visits" FOR ALL TO public USING (false);
