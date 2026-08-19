"""
kangqore-view-sdk — Official Python SDK for the Kangqore View developer platform.

Four SDKs over one governed transport::

    client.actions   # invoke governed actions
    client.ontology  # query and mutate ontology objects
    client.agents    # run and inspect agents
    client.ui        # register UI widgets

Every call carries the app's OAuth token and is evaluated by the platform's
governance kernel. A refused call raises :class:`GovernanceError` carrying the
audit id, so a refusal is always traceable to a record.
"""

from __future__ import annotations

import json
import threading
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

__version__ = "1.0.0"

__all__ = [
    "KangqoreClient",
    "KangqoreApiError",
    "GovernanceError",
    "ActionSDK",
    "OntologySDK",
    "AgentSDK",
    "UiSDK",
    "__version__",
]

DEFAULT_BASE_URL = "https://app.kangqoreview.com"


class KangqoreApiError(Exception):
    """Raised when the API returns a non-2xx response."""

    def __init__(self, message: str, status: int, body: Any) -> None:
        super().__init__(message)
        self.status = status
        self.body = body


class GovernanceError(Exception):
    """Raised when the governance kernel refuses a call.

    Attributes:
        outcome: ``DENIED`` or ``PENDING_APPROVAL``.
        audit_id: Id of the ``AppAuditEvent`` explaining the refusal.
        governance: Full governance detail block from the response.
    """

    def __init__(
        self,
        message: str,
        outcome: str,
        audit_id: Optional[str] = None,
        governance: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message)
        self.outcome = outcome
        self.audit_id = audit_id
        self.governance = governance or {}


@dataclass
class _TokenState:
    access_token: str
    expires_at: float


@dataclass
class _Transport:
    base_url: str
    access_token: Optional[str] = None
    client_id: Optional[str] = None
    client_secret: Optional[str] = None
    tenant_id: Optional[str] = None
    timeout: float = 30.0
    _token: Optional[_TokenState] = field(default=None, init=False, repr=False)
    _lock: threading.Lock = field(default_factory=threading.Lock, init=False, repr=False)

    def __post_init__(self) -> None:
        self.base_url = self.base_url.rstrip("/")
        if self.access_token:
            self._token = _TokenState(self.access_token, float("inf"))

    def _ensure_token(self) -> str:
        with self._lock:
            # Refresh 60s before expiry to avoid racing the boundary.
            if self._token and self._token.expires_at > time.time() + 60:
                return self._token.access_token

            if not (self.client_id and self.client_secret):
                if self._token:
                    return self._token.access_token
                raise ValueError("No access_token and no client_id/client_secret provided.")

            payload = {
                "grant_type": "client_credentials",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "tenant_id": self.tenant_id,
            }
            body = self._raw_request(
                "POST", "/api/developer/oauth/token", payload, authenticated=False
            )
            self._token = _TokenState(
                access_token=body["access_token"],
                expires_at=time.time() + float(body.get("expires_in", 3600)),
            )
            return self._token.access_token

    def _raw_request(
        self,
        method: str,
        path: str,
        payload: Optional[Dict[str, Any]] = None,
        authenticated: bool = True,
    ) -> Any:
        headers = {"Content-Type": "application/json", "User-Agent": f"kangqore-view-sdk/{__version__}"}
        if authenticated:
            headers["Authorization"] = f"Bearer {self._ensure_token()}"

        data = json.dumps(payload).encode("utf-8") if payload is not None else None
        req = urllib.request.Request(f"{self.base_url}{path}", data=data, headers=headers, method=method)

        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                raw = resp.read().decode("utf-8")
                return json.loads(raw) if raw else None
        except urllib.error.HTTPError as exc:
            raw = exc.read().decode("utf-8")
            try:
                parsed = json.loads(raw) if raw else {}
            except json.JSONDecodeError:
                parsed = {"error": raw}

            governance = parsed.get("governanceDetails") if isinstance(parsed, dict) else None
            if governance and governance.get("outcome") in ("DENIED", "PENDING_APPROVAL"):
                raise GovernanceError(
                    parsed.get("error", "Refused by governance kernel"),
                    governance["outcome"],
                    parsed.get("auditId"),
                    governance,
                ) from exc

            message = parsed.get("error", f"Request failed ({exc.code})") if isinstance(parsed, dict) else str(parsed)
            raise KangqoreApiError(message, exc.code, parsed) from exc

    def request(self, method: str, path: str, payload: Optional[Dict[str, Any]] = None) -> Any:
        return self._raw_request(method, path, payload, authenticated=True)


class ActionSDK:
    """Invoke governed actions."""

    def __init__(self, transport: _Transport, app_id: str) -> None:
        self._t = transport
        self._app_id = app_id

    def invoke(self, action_name: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        return self._t.request(
            "POST",
            f"/api/developer/apps/{self._app_id}/actions/invoke",
            {"actionName": action_name, "params": params or {}},
        )

    def dry_run(self, action_name: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Authorise and audit without mutating — useful in CI."""
        return self._t.request(
            "POST",
            f"/api/developer/apps/{self._app_id}/actions/invoke",
            {"actionName": action_name, "params": params or {}, "dryRun": True},
        )

    def list(self) -> List[Dict[str, Any]]:
        return self._t.request("GET", f"/api/developer/apps/{self._app_id}/actions")


class OntologySDK:
    """Query and mutate ontology objects."""

    def __init__(self, transport: _Transport, app_id: str) -> None:
        self._t = transport
        self._app_id = app_id

    def query(
        self,
        object_type: str,
        where: Optional[Dict[str, Any]] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Dict[str, Any]:
        return self._t.request(
            "POST",
            f"/api/developer/apps/{self._app_id}/ontology/query",
            {"objectType": object_type, "where": where or {}, "limit": limit, "offset": offset},
        )

    def get(self, object_id: str) -> Dict[str, Any]:
        return self._t.request("GET", f"/api/developer/apps/{self._app_id}/ontology/objects/{object_id}")

    def create(self, object_type: str, properties: Dict[str, Any]) -> Dict[str, Any]:
        return self._t.request(
            "POST",
            f"/api/developer/apps/{self._app_id}/ontology/objects",
            {"objectType": object_type, "properties": properties},
        )

    def update(self, object_id: str, properties: Dict[str, Any]) -> Dict[str, Any]:
        return self._t.request(
            "PATCH",
            f"/api/developer/apps/{self._app_id}/ontology/objects/{object_id}",
            {"properties": properties},
        )

    def list_types(self) -> List[str]:
        return self._t.request("GET", f"/api/developer/apps/{self._app_id}/ontology/types")


class AgentSDK:
    """Run agents declared in the app manifest."""

    def __init__(self, transport: _Transport, app_id: str) -> None:
        self._t = transport
        self._app_id = app_id

    def run(self, agent_name: str, prompt: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        return self._t.request(
            "POST",
            f"/api/developer/apps/{self._app_id}/agents/{agent_name}/run",
            {"prompt": prompt, "context": context or {}},
        )

    def list(self) -> List[Dict[str, Any]]:
        return self._t.request("GET", f"/api/developer/apps/{self._app_id}/agents")


class UiSDK:
    """Register UI surfaces."""

    def __init__(self, transport: _Transport, app_id: str) -> None:
        self._t = transport
        self._app_id = app_id

    def register(self, name: str, title: str, widget_type: str, entry_url: str) -> Dict[str, Any]:
        return self._t.request(
            "POST",
            f"/api/developer/apps/{self._app_id}/ui/widgets",
            {"name": name, "title": title, "type": widget_type, "entryUrl": entry_url},
        )

    def list(self) -> List[Dict[str, Any]]:
        return self._t.request("GET", f"/api/developer/apps/{self._app_id}/ui/widgets")


class KangqoreClient:
    """Entry point for the Kangqore View SDK.

    Example::

        from kangqore_view import KangqoreClient, GovernanceError

        kq = KangqoreClient(
            "app-my-app",
            client_id="kqc_...",
            client_secret="kqs_...",
            tenant_id="acme",
        )

        try:
            res = kq.actions.invoke("CREATE_JIRA_ISSUE", {"summary": "Ship it"})
        except GovernanceError as err:
            print(f"Refused ({err.outcome}) — audit {err.audit_id}")
    """

    def __init__(
        self,
        app_id: str,
        base_url: str = DEFAULT_BASE_URL,
        access_token: Optional[str] = None,
        client_id: Optional[str] = None,
        client_secret: Optional[str] = None,
        tenant_id: Optional[str] = None,
        timeout: float = 30.0,
    ) -> None:
        if not app_id:
            raise ValueError("app_id is required")

        self._transport = _Transport(
            base_url=base_url,
            access_token=access_token,
            client_id=client_id,
            client_secret=client_secret,
            tenant_id=tenant_id,
            timeout=timeout,
        )
        self.app_id = app_id
        self.actions = ActionSDK(self._transport, app_id)
        self.ontology = OntologySDK(self._transport, app_id)
        self.agents = AgentSDK(self._transport, app_id)
        self.ui = UiSDK(self._transport, app_id)

    def telemetry(self, since_hours: int = 24) -> Dict[str, Any]:
        """Call counts, denials, and p95 latency for this app."""
        return self._transport.request(
            "GET", f"/api/developer/apps/{self.app_id}/telemetry?sinceHours={since_hours}"
        )
