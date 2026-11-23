# Client Portal IA (Stage 3) — draft

Status: draft 2026-11-23. Based on DECISIONS.md and a read-only review of
`Georgiazhu/cyndi-global-website` (main, migrations 0001–0013).

## Confirmed scope
- Roles: **Client Admin** only (one role per client tenant). Employees do not get a back office;
  they order via M2 rewards store / M3 personal link / M4 open portal. **Cyndi Staff** use the internal admin.
- Employee login for M2 rewards store: **company SSO (OIDC)**.
- First page to design: **Dashboard** (to-do centre).

## Existing code we reuse (cyndi-global-website)

| Area | Existing code | Fit with decisions |
| --- | --- | --- |
| Tenant | `clients` table (0011), `customers.client_id`, `showcase_access` | Base for tenant isolation. Need OIDC on top. |
| Inventory | `inventory` (available / reserved / incoming / damaged, low_stock_threshold), `order_stock_lines`, `inventory_movements` (0013); `functions/_lib/inventory.js`; `admin/inventory.html`; `docs/inventory-user-guide.md` | Matches **Q1**: order reserves (available −1, reserved +1), ship deducts reserved, cancel releases. On-hand = available + reserved. Matches **Q6** (threshold flag only). Movements = ledger. Single warehouse (Guangzhou). Opt-in per variant. |
| Orders | `orders` (0005, shared shop + showcase, `SHOWCASE-` prefix), `functions/_lib/orders.js`, `api/showcase/orders.js` (server-side pricing, customer-scoped), `_lib/order-status.js` | Status flow pending → processing → shipped → in_transit → delivered / cancelled. Reuse for Final Order + outbound. |
| Showcase | `showcase_categories`, `showcase_products` (pricing_json tiers, charges_json), `showcase_meta` (single row), `api/showcase.js`, `admin/showcase.html` | Product data reusable. **Gap:** one global showcase, not per client / per project. |
| Shipments | `shipments`, `shipment_events`, `shipment_photos` (0012), `_lib/shipment-status.js` | Covers Deliveries + POD photos. Status incl. customs / exception. `carrier` must be shown as "Cyndi Global" to clients. |

## Gaps to build

1. **Project → Selection → Mockup chain** with the two hard gates (no table today).
2. **Showcase per client and per project** (add `client_id`, `project_id`; keep product data).
3. **Additional charges re-confirmation (Q2)** on the final order (charges_json exists per product; need order-level charge lines + client confirm step).
4. **Approval queue** for M2 / M3 / M4 orders (new status before `processing`, e.g. `awaiting_approval`).
5. **Outbound channel** column on orders: `BULK` / `REWARDS` / `PERSONAL_LINK` / `OPEN`.
6. **Rewards**: points accounts + points ledger (R1–R5), 1:1, no expiry.
7. **Product pool** tags Ordered / Available Options + 30-day re-quote (Q4).
8. **OIDC SSO** for client admin and employees (Q7).
9. **Exports** CSV / XLSX / PDF and read-only API + shipment webhooks (Q8).

## Client Admin navigation

```
Dashboard      To-do centre (see below)
Projects       Project → Showcase → Selection → Mockup → Order
Product Pool   Ordered / Available Options, re-quote
Inventory      Available / Reserved / Low stock, movement history, export
Distribution   M1 Bulk · M2 Rewards · M3 Personal links · M4 Open portal, approval queue
Rewards        Issue points, balances, points ledger
Deliveries     Shipments, daily progress, POD
Billing        Orders, invoices (DDP duties itemized), currencies
Reports        CSV / XLSX, PDF
Settings       Users, SSO, addresses, API key, webhooks
```

## Dashboard (first screen)
- **Needs your action**: selections to confirm, mockups to approve, orders to re-confirm (charges),
  distribution orders awaiting approval (M2 / M3 / M4).
- **Inventory alerts**: variants below threshold, out of stock (from `inventory`).
- **On the way**: active shipments with latest event (from `shipments` / `shipment_events`).
- **Recent activity**: last orders and movements.
