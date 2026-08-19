# kangqore-view-sdk

Official Python SDK for the [Kangqore View](https://developers.kangqoreview.com) developer platform.

```bash
pip install kangqore-view-sdk
```

## Quickstart

```python
from kangqore_view import KangqoreClient, GovernanceError

kq = KangqoreClient(
    "app-my-app",
    base_url="https://app.kangqoreview.com",
    client_id="kqc_...",
    client_secret="kqs_...",
    tenant_id="acme",
)

try:
    res = kq.actions.invoke("CREATE_JIRA_ISSUE", {"summary": "Ship it"})
    print(res["result"], "credits left:", res["governanceDetails"]["creditsRemaining"])
except GovernanceError as err:
    # Refusals are always traceable to an audit record.
    print(f"Refused ({err.outcome}) — audit {err.audit_id}")
```

## The four SDKs

| Namespace | Purpose |
| --------- | ------- |
| `kq.actions` | Invoke governed actions; `dry_run` for CI |
| `kq.ontology` | Query, create, and update ontology objects |
| `kq.agents` | Run agents declared in your manifest |
| `kq.ui` | Register dashboard panels, board widgets, nav tabs |

## Governance

Your app writes no security code. Installing it derives a permission envelope
from `kangqore.manifest.json`, and every call is evaluated against that envelope
by the platform: identity, permissions, policy, budget, audit, telemetry.

A refused call raises `GovernanceError` with `outcome` (`DENIED` or
`PENDING_APPROVAL`) and the `audit_id` of the record explaining why.

## Zero dependencies

Built on the standard library only — no `requests`, no transitive supply chain.

## License

Apache-2.0
