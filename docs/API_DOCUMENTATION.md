# API Documentation

All server logic currently lives as Next.js Route Handlers under
`apps/web/src/app/api/` — see `ARCHITECTURE.md` for why, and for the
extraction path to a dedicated service. Every endpoint below is documented
as its own stable contract so that extraction is a non-breaking move.

## `GET /api/search?q=<string>`

Cross-entity search over governorates, destinations, heritage sites,
museums, rulers, country gateways, guides, hotels, events, investment
opportunities, research programmes, products and worldwide objects.

```json
{ "hits": [ { "id": "...", "slug": "...", "name": "...", "kind": "heritage", "href": "/heritage/...", "summary": "...", "sourceStatus": "DEMO" } ] }
```

## `POST /api/trip/build`

Thin wrapper around the `planEgyptTrip()` skill.

Request:
```json
{ "days": 10, "interests": ["History", "Beach"], "budgetUsd": 1800, "partyType": "Couple", "languages": ["French"], "accessibility": [], "nationality": "France", "startGovernorate": "cairo" }
```

Response: `{ data: TripDayPlan[], citations: Citation[], note: string }` —
`note` always states plainly that nothing is booked, priced or confirmed by
this call.

## `POST /api/ai/concierge`

The AI Concierge's server-side brain.

Request:
```json
{ "message": "string", "locale": "en", "history": [{ "role": "user" | "assistant", "content": "string" }] }
```

Response:
```json
{
  "agent": "TRIP_PLANNER",
  "agentLabel": "Trip Planner",
  "content": "string",
  "cards": [ { "title": "string", "rows": [["label", "value"]], "cta": { "label": "string", "href": "/..." } } ],
  "citations": [ { "label": "AI_ANALYSIS", "text": "string" } ]
}
```

Processing order: resolve a demo `Principal` → `route(message, {roles,
consents})` → audit the routing decision → if denied, return an explicit
refusal turn (never a silent fallback) → run the matched specialist's
handler (calling into `packages/skills`) → `composeGuard()` → attach the
final source-label citation.

## Error and refusal shapes

A denial from `route()` (missing role/consent) and a refusal from the MCP
gateway (`UNKNOWN_TOOL` / `NOT_CONNECTED` / `PERMISSION` / `RATE_LIMIT` /
`BAD_INPUT` / `AGENT_NOT_ALLOWED`) both surface as ordinary `200` responses
with an explanatory `content` string and no `cards` — the UI is expected to
render these as a plain assistant message, not as a broken request.
