# @kangqore/cli

Developer CLI for the [Kangqore View](https://developers.kangqoreview.com) platform.

```bash
npm install -g @kangqore/cli
```

## Build an app in a day

```bash
kangqore init my-app        # scaffold manifest + entrypoint
cd my-app && npm install

kangqore validate           # schema check + governance score
kangqore test               # run the suite against the governance kernel
kangqore deploy SANDBOX     # promote
kangqore publish            # list on the marketplace
kangqore telemetry          # calls, denials, p95 latency
```

## Environment

Credentials are read from the environment, never passed as flags, so they stay
out of shell history and CI logs.

| Variable | Purpose |
| -------- | ------- |
| `KANGQORE_URL` | Instance URL (default `https://app.kangqoreview.com`) |
| `KANGQORE_CLIENT_ID` | OAuth client id |
| `KANGQORE_CLIENT_SECRET` | OAuth client secret |
| `KANGQORE_TENANT` | Tenant (default `default`) |

## Gates

`kangqore publish` computes a governance score from your manifest; 80+ earns the
certified badge. `kangqore deploy PRODUCTION` refuses unless the most recent
`kangqore test` run passed.

## License

Apache-2.0
