# @kangqore/view-sdk

Official TypeScript SDK for the [Kangqore View](https://developers.kangqoreview.com) developer platform.

```bash
npm install @kangqore/view-sdk
```

## Quickstart

```ts
import { KangqoreClient, GovernanceError } from '@kangqore/view-sdk'

const kq = new KangqoreClient('app-my-app', {
  baseUrl: 'https://app.kangqoreview.com',
  clientId: process.env.KANGQORE_CLIENT_ID,
  clientSecret: process.env.KANGQORE_CLIENT_SECRET,
  tenantId: 'acme',
})

try {
  const res = await kq.actions.invoke('CREATE_JIRA_ISSUE', { summary: 'Ship it' })
  console.log(res.result, 'credits left:', res.governanceDetails.creditsRemaining)
} catch (err) {
  if (err instanceof GovernanceError) {
    // Refusals are always traceable to an audit record.
    console.error(`Refused (${err.outcome}) — audit ${err.auditId}`)
  } else {
    throw err
  }
}
```

## The four SDKs

| Namespace | Purpose |
| --------- | ------- |
| `kq.actions` | Invoke governed actions; `dryRun` for CI |
| `kq.ontology` | Query, create, and update ontology objects |
| `kq.agents` | Run agents declared in your manifest |
| `kq.ui` | Register dashboard panels, board widgets, nav tabs |

## Governance

Your app writes no security code. Installing it derives a permission envelope
from `kangqore.manifest.json`, and every call is evaluated against that envelope
by the platform: identity, permissions, policy, budget, audit, telemetry.

A refused call throws `GovernanceError` with `outcome` (`DENIED` or
`PENDING_APPROVAL`) and the `auditId` of the record explaining why.

## Auth

Pass either a short-lived `accessToken`, or `clientId` + `clientSecret` and the
SDK will obtain and refresh tokens for you via the `client_credentials` grant.

## License

Apache-2.0
