# Cyndi Global Platform

> **Treat Cyndi Global as your dedicated product team — Luxury swag for brands, Anywhere in the world.**
>
> 把 Cyndi Global 当作你的专属产品团队 —— 为品牌提供高端 SWAG，服务全球任何地点。

本项目是 Cyndi Global 官网与全球 SWAG 供应链平台的**架构级重构**。我们要把现有的简单展示站，重建为「公开站 + 客户门户 + 身份权限层」三位一体的平台，让访客看得懂、让客户走得通流程、让老客户找得到门户。

---

## 目录

- [为什么重构](#为什么重构)
- [我们是谁](#我们是谁)
- [目标架构](#目标架构)
- [核心业务流程](#核心业务流程)
- [客户门户](#客户门户)
- [技术选型](#技术选型)
- [路线图](#路线图)
- [关键决策（已锁定）](#关键决策已锁定)
- [协作约定](#协作约定)
- [参考资料](#参考资料)

---

## 为什么重构

现有站点只是一个落地页 + 商城 + 物流查询页，存在三个核心痛点：

| 痛点 | 表现 |
| --- | --- |
| **看不懂** | 只有 Hero + 导航 + 联系表单，读者无法理解 Cyndi 是做什么的、有什么能力 |
| **走不通** | 看不到从需求到收货的完整业务流程，不知道如何开始、如何推进 |
| **找不到** | 没有清晰的客户门户登录入口与角色说明，老客户无法进入系统干活 |

重构目标：用清晰的公司叙事、可验证的业务流程和一个统一的客户门户，解决以上三点。

## 我们是谁

Cyndi Global 不是一家「卖周边商品的网店」，而是**全球 D2D SWAG 供应链中枢**。对外六项核心能力（与首页 `src/content.js` 一致）：

| 能力 | 说明 |
| --- | --- |
| **Luxury, custom swag** | 天然材质与更精致的刺绣工艺，让每件单品提升品牌形象 |
| **Fast sampling** | 3 天内出实体样品，下单前即可感受品质 |
| **Global cloud warehouse** | 一个中央库存池，可按客户业务需要选址 |
| **Tax & freight optimized** | 为客户规划最经济的税费与运费路线 |
| **Door-to-door transport** | 海运 + 空运线路覆盖亚洲、欧洲、北美、大洋洲 |
| **On-site distribution** | 可派员工到客户活动现场进行分发、派送 |

覆盖范围对外统一口径为 **200+ 国家与地区**（详见[数据点来源](#关键决策已锁定)）；门到门线路为 30+ city lanes，两者是不同维度、不冲突。

参考站点 [Kotis Design — Swag Platform](https://kotisdesign.com/swag-platform/) 用于理解行业形态，**但不照搬**：Kotis 是「开店工具」，我们是「全球供应链中枢」，站位更高。

## 目标架构

第一刀：拆成「两个产品 + 一个入口」。

```
[公开站]  ──►  [身份与权限层]  ──►  [客户门户]
 让陌生访客         OIDC SSO (PKCE)      让现有客户登录后干活
 看懂并信任         RBAC 角色            （仅 Client Admin 有后台）
 看懂并信任         Tenant 隔离           员工通过 M2/M3/M4 下单，无后台
                   审计日志               SAML 后续支持
```

- **公开站**：负责获取信任 —— 我们是谁 + 六项能力、为什么需要全球单仓、六步业务流程、四种出库方式、门户特性、FAQ 与双 CTA。
- **身份与权限层**：OIDC SSO（Authorization Code + PKCE）、RBAC 角色、多租户（Tenant）隔离、审计日志；SAML 后续。
- **客户门户**：登录后按角色分流（见下）；后端只有 **Client Admin** 一个客户角色，**Cyndi Staff** 使用内部管理后台。
- **一个登录入口，两套体验**：公开站右上角与页脚固定「Portal login」；潜在客户走询价 CTA，现有客户直接进门户。

端到端主链路：

```
A 采购链（单据流）:
  Project 创建 → Showcase → 选品单 → Mockup 确认 → Final Order

B 入库与库存治理（单一库存真相）:
  初始入库 → 最低库存标记 → Movement 流水报表（双方导出）

C 出库（四种模式，统一 OutboundOrder 表，以 channel 区分）:
  M1 Bulk 集中活动单 → M2 Employee rewards store 积分兑换
  → M3 Personal links → M4 Open portal

底部贯通：订单确认 → 增加 allocated / 发货减 on-hand → 全球 D2D 报关 → 当地人员分发 → POD 签收
底部回流：商品池（历史 Showcase 选品回流复用，30 天内 Re-quote）
```

## 核心业务流程

### 采购链（六步 + 两道硬门禁）

1. 创建 Project，选取品类、表达需求 —— **客户管理员**
2. 创建 Showcase —— **Cyndi Global**
3. 确认 Showcase 选品，下《选品单》—— **客户管理员**（Gate 1）
4. 提交 Mock-up 设计 —— **Cyndi Global**
5. 确认 Mock-up —— **客户管理员**（Gate 2）
6. Mockup 录入，在《选品单》基础上加 Additional Charges（如 Setup per color、Add'l color/location run charge per unit），生成最终《Order》并由客户再次确认

> **两道硬门禁**：Gate 1 选品单未确认不得出 Mockup；Gate 2 Mockup 未批准不得生成 Order。单据确认后不可修改，只能发新版本。

### 库存治理

- 最终 Order 作为初始 Inventory 入库
- 客户管理员设置最低库存阈值；系统仅在商品上**标记**低库存，不自动建补货 Project（Q6）
- Cyndi Global + 客户管理员导出 Movement 流水报表
- 系统显示订单状态更新（ready for dispatch / on the way / delivered）

> 库存扣减口径已按 **Q1** 锁定：下单时增加 allocated、发货时才减 on-hand；面向客户显示 `available = on-hand − allocated`。

### 四种出库模式（统一为一张 OutboundOrder 表，用 `channel` 区分）

> 2026-11-23 客户要求由三种扩展为四种：新增 **M2 员工积分兑换平台**，原 M2/M3 顺延为 M3/M4。编号以 [`docs/DECISIONS.md`](docs/DECISIONS.md) 变更记录为准。

| 模式 | 名称 | `channel` | 触发与审批 | 履约 |
| --- | --- | --- | --- | --- |
| **M1** | Bulk shipment 集中活动单 | `BULK` | 客户管理员一次性下单 | 整批送达活动地，客户现场分发 |
| **M2** | Employee rewards store 员工积分兑换平台（新增） | `REWARDS`（暂定） | 客户发积分给员工；每笔兑换需客户管理员审批 | 员工填收货地址，逐单寄送 |
| **M3** | Personal links（原 M2） | `PERSONAL_LINK` | 名单 + 邮箱 → 一人一链；**逐单客户管理员审批**；发件方按活动可配置 | 批准后履约 |
| **M4** | Open portal（原 M3） | `OPEN` | 一个共享链接 + 指定文案；**每单客户管理员批准** | 批准后履约 |

四种模式共用同一库存，遵循 Q1 的 allocated 口径（审批通过时增加 allocated）。

**M2 积分兑换规则（已确认）：**

| # | 规则 | 决定 |
| --- | --- | --- |
| R1 | 积分发放方 | 客户管理员发放给员工 |
| R2 | 兑换审批 | 每笔兑换需客户管理员审批后才履约 |
| R3 | 积分有效期 | 无有效期，长期有效 |
| R4 | 寄送方式 | 员工下单填地址，逐单寄送（适用 DDP 与 200+ 覆盖） |
| R5 | 积分与币种换算 | 暂按 1 积分 = 1 单位货币（1:1），后续可调整 |

### 商品池汇总

- 客户管理员可见每次 Project 提交的所有 Showcase，包括未下单的商品
- 所有产品打两类标签：`Ordered` / `Available Options (Not Ordered)`
- 下次 Project 优先从历史 Showcase 选品；**复用必须 Re-quote（重新报价），报价 30 天有效**
- Global Catalog（含供应商成本/报价/有效期，内部）与 Client Product Pool（客户可见）分离

## 客户门户

一次登录，按角色分流（详细 IA 见 [`docs/PORTAL-IA.md`](docs/PORTAL-IA.md)）：

- **Client Admin 导航**：Dashboard（待办中心，首个设计页面）/ Projects / Product Pool / Inventory / Distribution（M1–M4 + 审批队列）/ Rewards（积分发放与流水）/ Deliveries（进度 + POD）/ Billing / Reports / Settings
- **员工**：无后台，通过 M2 积分商城（公司 OIDC 登录）、M3 个人链接、M4 开放门户下单

## 技术选型（已锁定 · 2026-11-23）

与现有线上站 `cyndi-global-website` 保持一致，便于将来迁移回线上：

- **前端**：React 19 + Vite + Tailwind CSS
- **后端**：Cloudflare Pages Functions（`functions/api/*`）
- **数据库**：Cloudflare D1（迁移文件在 `migrations/`）
- **图片存储**：Cloudflare R2

**理由**：同栈迁移最简单；已有的 D1 表结构、Functions API、R2 桶与 Cloudflare Pages 部署流水线可直接复用，无需重建基础设施。

## 路线图

1. **阶段一 · 架构与关键决策** ✅ —— Q1–Q8 及 M2 积分规则已全部拍板，锁定于 `docs/DECISIONS.md`。
2. **阶段二 · 公开站首页** ✅ —— 六段叙事骨架已搭建完成（Hero / Why Cyndi / Why one warehouse / 六步流程 / 四种出库 / Portal 特性 / FAQ / CTA），已推送到本仓库，可在本地 `npm run dev` 预览。
3. **阶段三 · 门户 IA 与关键页视觉** 🔄 —— `docs/PORTAL-IA.md` 草案已完成，首个设计页面为 Dashboard 待办中心；后续实现下单六步、库存与四种出库页。

> 客户原话：**「我们先讨论清楚架构再进行页面设计整改。」**

## 关键决策（已锁定）

Q1–Q8 已经客户全部拍板，完整决定见 [`docs/DECISIONS.md`](docs/DECISIONS.md)。摘要：

| 编号 | 客户决定 |
| --- | --- |
| **Q1** | 下单 allocate、发货减 on-hand；客户可见 `available = on-hand − allocated`；库存变动记录 Ledger |
| **Q2** | 附加费录入生成 Order 后客户须再次确认 |
| **Q3** | M3 Personal-link（原 M2）每单客户管理员审批；发件方按活动可配置 |
| **Q4** | Re-quote 30 天有效 |
| **Q5** | DDP，Cyndi 为支付方、关税账单列明；覆盖 **200+ 国家地区**，本地承运商尾程 |
| **Q6** | 不自动建 Project，仅商品标记低库存 |
| **Q7** | OIDC SSO（Authorization Code + PKCE，SAML 后续）；前端英文单语；多币种展示与结算 |
| **Q8** | 只读 API + 发货 webhook；CSV/XLSX 报表；订单/发票/POD 出 PDF |

**数据点来源**：对外覆盖数字于 2026-11-23 由 214+ 统一改为 **200+**，全站（Hero / FAQ / meta）一致；30+ city lanes 是 D2D 线路数，属不同维度。

## 协作约定

- **先对齐架构与规则，再写页面代码。**
- **保留历史提交**：不 force push、不重写历史、不覆盖他人提交。
- **面向客户的界面不出现第三方承运商名称**（如 Yanwen / 燕文 / YW56），统一显示 `Cyndi Global`。内部标识（环境变量、API URL、内部函数名）保持不变。
- **权威基准**：本仓库 Desktop 工作副本的现有代码与 `docs/DECISIONS.md` 为准；架构简报与 PPT 中的旧编号（M2 Personal-link / M3 Open portal）已被 DECISIONS.md 变更记录取代。

## 参考资料

- 核心参考站点：<https://kotisdesign.com/swag-platform/>（理解行业形态，不照搬）
- **权威决策**：[`docs/DECISIONS.md`](docs/DECISIONS.md)（含出库四模式与积分规则变更记录）
- **门户 IA**：[`docs/PORTAL-IA.md`](docs/PORTAL-IA.md)
- 架构讨论稿：`docs/CyndiGlobal-Architecture-Deck.pptx`（14 页中文，团队讨论背景参考；出库编号以 DECISIONS.md 为准）
- 设计规范：`docs/DESIGN.md`
- 完整任务简报：`docs/ARCHITECTURE-BRIEF.md`（含 GitHub / Cloudflare / 代码现状、待更新网页清单、技术细节）

---

*最后更新：2026-11-23*
