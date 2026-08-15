import { installActionPack } from './ActionPack'
import type { ActionPackManifest } from './ActionPack'
import { JIRA_PACK }        from './packs/jira.pack'
import { SALESFORCE_PACK }  from './packs/salesforce.pack'
import { AWS_PACK }         from './packs/aws.pack'
import { ZENDESK_PACK }     from './packs/zendesk.pack'
import { STRIPE_PACK }      from './packs/stripe.pack'
import { HUBSPOT_PACK }     from './packs/hubspot.pack'
import { LINEAR_PACK }      from './packs/linear.pack'
import { SERVICENOW_PACK }  from './packs/servicenow.pack'
import { WORKDAY_PACK }     from './packs/workday.pack'
import { DATADOG_PACK }     from './packs/datadog.pack'

const ALL_PACKS: ActionPackManifest[] = [
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
