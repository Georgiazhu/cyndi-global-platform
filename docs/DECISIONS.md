# Q1–Q8 决策记录（已锁定）

> **状态：客户已确认（2026-11-23）。** 本文件由 WorkBuddy 维护，是实现数据模型与页面文案的权威依据。
> 客户已对 Q1–Q8 全部拍板，下表即客户最终决定，不再标记"待确认"。

| # | 主题 | 客户决定（Confirmed） |
| --- | --- | --- |
| **Q1** | 库存扣减口径 | **Allocate at order confirmation, reduce on-hand at shipment.** 下单时增加 allocated、发货时才减 on-hand；面向客户显示 `available = on-hand − allocated`；每次库存变动记录 Ledger 流水。 |
| **Q2** | 附加费二次确认 | **The client must re-confirm after Additional Charges are added.** Mockup 录入附加费生成 Order 后，客户须再次确认金额。 |
| **Q3** | M3 Personal-link（原 M2） | **The client admin approves each M3 (Personal-link) order. The email sender is configurable per campaign.** 每笔 M3（Personal-link）订单需客户管理员逐单批准；发件方（Cyndi 或客户）按活动可配置。 |
| **Q4** | Re-quote 有效期 | **Re-quote valid for 30 days.** 历史 Showcase 复用须重新报价，报价 30 天有效。 |
| **Q5** | 贸易条款与覆盖 | **DDP, with Cyndi as the paying party and duties itemized on the client's bill. 200+ countries and regions, last-mile by local carriers.** Cyndi 作为关税支付方、账单逐项列明关税；覆盖 200+ 国家与地区，尾程由本地承运商派送。 |
| **Q6** | 低库存处理 | **No automatic Project, but low stock is flagged on the product.** 不自动创建补货 Project，仅在商品上标记低库存警示。 |
| **Q7** | SSO / 语言 / 币种 | **OIDC SSO (Authorization Code + PKCE, SAML later), English-only frontend, multi-currency display and settlement.** 采用 OIDC SSO（Authorization Code + PKCE，SAML 后续）；前端仅英文；支持多币种展示与结算。 |
| **Q8** | API / 导出 | **Read-only API plus shipment webhooks, CSV and XLSX reports, PDF for Orders, Invoices and POD.** 只读 API + 发货 webhook；CSV/XLSX 报表；订单、发票、POD 出 PDF。 |

## 数据点来源说明

- **200+ countries and regions**：客户于 2026-11-23 将对外口径由 214+ 统一改为 200+，全站（Hero、Global network、FAQ、meta）使用 200+。
- **30+ city lanes**：客户原始需求中的 D2D 门到门线路数，与 200+ 覆盖范围是两个不同维度，不冲突。

## 备注

- 本文件取代早前的 `DECISIONS-Q-DRAFT.md`（内容与本文件基本一致的草案，仅为追溯保留）。
- 客户已确认数据来源。2026-11-23 客户明确要求对外统一使用 **200+**，替代此前的 214+。
- 前端语言为 **English-only**（客户 Q7 明确决定），不开发中英双语切换。

## 变更记录

### 2026-11-23 · 出库模式由三种扩展为四种（客户要求）

| 新编号 | 模式 | channel | 说明 |
| --- | --- | --- | --- |
| M1 | Bulk shipment 集中活动单 | `BULK` | 不变 |
| **M2** | **Employee rewards store 员工积分兑换平台（新增）** | `REWARDS`（暂定） | 员工用积分在客户指定的礼品库中兑换礼品 |
| M3 | Personal links（原 M2） | `PERSONAL_LINK` | Q3 决定适用于此项：逐单客户管理员审批，发件方按活动可配置 |
| M4 | Open portal（原 M3） | `OPEN` | 逐单客户管理员审批后履约 |

- 四种模式仍统一为一张 OutboundOrder 表，以 `channel` 区分，共用同一库存（遵循 Q1 allocated 口径）。
- 架构简报与 PPT 中的 "M2 Personal-link / M3 Open portal" 编号以本表为准。

**M2 积分兑换 · 规则（客户已确认 2026-11-23）：**

| # | 规则 | 决定 |
| --- | --- | --- |
| R1 | 积分发放方 | 由客户（客户管理员）发放给员工 |
| R2 | 兑换审批 | 每笔兑换需客户管理员审批后才履约（与 M3/M4 一致） |
| R3 | 积分有效期 | 无有效期，积分长期有效 |
| R4 | 寄送方式 | 员工下单时填写收货地址，逐单寄送（适用 DDP 与 Q5 覆盖范围） |
| R5 | 积分与币种换算 | 暂按 1 积分 = 1 单位货币（1:1），后续可调整 |

- 待细化：R5 中"1 单位货币"指哪一种货币（客户结算币种 / 统一 USD），需在多币种结算方案中一并确认。
- 数据模型提示：需新增员工积分账户与积分流水（发放 / 兑换扣减 / 审批驳回退回），兑换单写入 OutboundOrder（`channel = REWARDS`），审批通过时按 Q1 增加 allocated。
