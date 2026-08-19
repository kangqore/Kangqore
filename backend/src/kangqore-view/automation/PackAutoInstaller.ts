import { installActionPack } from './ActionPack'
import type { ActionPackManifest } from './ActionPack'

// ─── Original 10 packs ───────────────────────────────────────────────────────
import { JIRA_PACK }             from './packs/jira.pack'
import { SALESFORCE_PACK }       from './packs/salesforce.pack'
import { AWS_PACK }              from './packs/aws.pack'
import { ZENDESK_PACK }          from './packs/zendesk.pack'
import { STRIPE_PACK }           from './packs/stripe.pack'
import { HUBSPOT_PACK }          from './packs/hubspot.pack'
import { LINEAR_PACK }           from './packs/linear.pack'
import { SERVICENOW_PACK }       from './packs/servicenow.pack'
import { WORKDAY_PACK }          from './packs/workday.pack'
import { DATADOG_PACK }          from './packs/datadog.pack'

// ─── Productivity & Collaboration ─────────────────────────────────────────────
import { MICROSOFT365_PACK }     from './packs/microsoft365.pack'
import { GOOGLEWORKSPACE_PACK }  from './packs/googleworkspace.pack'
import { CONFLUENCE_PACK }       from './packs/confluence.pack'
import { NOTION_PACK }           from './packs/notion.pack'
import { ZOOM_PACK }             from './packs/zoom.pack'
import { FIGMA_PACK }            from './packs/figma.pack'

// ─── Project & Work Management ────────────────────────────────────────────────
import { ASANA_PACK }            from './packs/asana.pack'
import { MONDAY_PACK }           from './packs/monday.pack'
import { CLICKUP_PACK }          from './packs/clickup.pack'

// ─── Infrastructure & DevOps ──────────────────────────────────────────────────
import { KUBERNETES_PACK }       from './packs/kubernetes.pack'
import { TERRAFORM_PACK }        from './packs/terraform.pack'
import { JENKINS_PACK }          from './packs/jenkins.pack'
import { GITHUBACTIONS_PACK }    from './packs/githubactions.pack'
import { VERCEL_PACK }           from './packs/vercel.pack'

// ─── Monitoring & Observability ───────────────────────────────────────────────
import { PAGERDUTY_PACK }        from './packs/pagerduty.pack'
import { SPLUNK_PACK }           from './packs/splunk.pack'
import { ELASTIC_PACK }          from './packs/elastic.pack'
import { DYNATRACE_PACK }        from './packs/dynatrace.pack'

// ─── Security & Identity ──────────────────────────────────────────────────────
import { OKTA_PACK }             from './packs/okta.pack'
import { AUTH0_PACK }            from './packs/auth0.pack'
import { CROWDSTRIKE_PACK }      from './packs/crowdstrike.pack'
import { VAULT_PACK }            from './packs/vault.pack'
import { CLOUDFLARE_PACK }       from './packs/cloudflare.pack'

// ─── Data & Analytics ─────────────────────────────────────────────────────────
import { SNOWFLAKE_PACK }        from './packs/snowflake.pack'
import { MONGODB_PACK }          from './packs/mongodb.pack'
import { DATABRICKS_PACK }       from './packs/databricks.pack'
import { DBT_PACK }              from './packs/dbt.pack'

// ─── Communications & Support ─────────────────────────────────────────────────
import { TWILIO_PACK }           from './packs/twilio.pack'
import { INTERCOM_PACK }         from './packs/intercom.pack'

// ─── Finance & Accounting ─────────────────────────────────────────────────────
import { QUICKBOOKS_PACK }       from './packs/quickbooks.pack'
import { XERO_PACK }             from './packs/xero.pack'
import { NETSUITE_PACK }         from './packs/netsuite.pack'
import { SAP_PACK }              from './packs/sap.pack'

// ─── Documents & Signing ──────────────────────────────────────────────────────
import { DOCUSIGN_PACK }         from './packs/docusign.pack'

const ALL_PACKS: ActionPackManifest[] = [
  // Original 10
  JIRA_PACK,
  SALESFORCE_PACK,
  AWS_PACK,
  ZENDESK_PACK,
  STRIPE_PACK,
  HUBSPOT_PACK,
  LINEAR_PACK,
  SERVICENOW_PACK,
  WORKDAY_PACK,
  DATADOG_PACK,

  // Productivity & Collaboration (6)
  MICROSOFT365_PACK,
  GOOGLEWORKSPACE_PACK,
  CONFLUENCE_PACK,
  NOTION_PACK,
  ZOOM_PACK,
  FIGMA_PACK,

  // Project & Work Management (3)
  ASANA_PACK,
  MONDAY_PACK,
  CLICKUP_PACK,

  // Infrastructure & DevOps (5)
  KUBERNETES_PACK,
  TERRAFORM_PACK,
  JENKINS_PACK,
  GITHUBACTIONS_PACK,
  VERCEL_PACK,

  // Monitoring & Observability (4)
  PAGERDUTY_PACK,
  SPLUNK_PACK,
  ELASTIC_PACK,
  DYNATRACE_PACK,

  // Security & Identity (5)
  OKTA_PACK,
  AUTH0_PACK,
  CROWDSTRIKE_PACK,
  VAULT_PACK,
  CLOUDFLARE_PACK,

  // Data & Analytics (4)
  SNOWFLAKE_PACK,
  MONGODB_PACK,
  DATABRICKS_PACK,
  DBT_PACK,

  // Communications & Support (2)
  TWILIO_PACK,
  INTERCOM_PACK,

  // Finance & Accounting (4)
  QUICKBOOKS_PACK,
  XERO_PACK,
  NETSUITE_PACK,
  SAP_PACK,

  // Documents & Signing (1)
  DOCUSIGN_PACK,
]

export async function installAllPacks(): Promise<void> {
  let totalCreated = 0
  let totalSkipped = 0

  for (const pack of ALL_PACKS) {
    try {
      const result = await installActionPack(pack)
      totalCreated += result.created
      totalSkipped += result.skipped
    } catch (e: any) {
      console.warn(`[PackAutoInstaller] Failed to install ${pack.pack}: ${e.message}`)
    }
  }

  console.log(`[PackAutoInstaller] Done — ${totalCreated} actions created, ${totalSkipped} synced across ${ALL_PACKS.length} packs`)
}

export { ALL_PACKS }
