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
- [关键决策（待拍板）](#关键决策待拍板)
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

Cyndi Global 不是一家「卖周边商品的网店」，而是**全球 D2D SWAG 供应链中枢**。核心能力：

- **全球云仓储选址** —— 可作为跨国公司的「全球中央仓」，按客户业务选址布局
- **全球 D2D 运输** —— 海运 + 空运覆盖 30+ 城市（亚洲、欧洲、北美、大洋洲），门到门交付
- **税费运费最优解** —— 提供最节约税费与运费的方案（tax-optimized）
- **最优质 SWAG 选品** —— 面向品牌的高端选品，而非廉价赠品
- **当地分发派送** —— 可派员工到当地进行现场分发、派送（on-site distribution）
- **专属产品团队** —— 从选品、设计、打样到履约，充当客户的外部产品部门

参考站点 [Kotis Design — Swag Platform](https://kotisdesign.com/swag-platform/) 用于理解行业形态，**但不照搬**：Kotis 是「开店工具」，我们是「全球供应链中枢」，站位更高。

## 目标架构

第一刀：拆成「两个产品 + 一个入口」。

```
[公开站]  ──►  [身份与权限层]  ──►  [客户门户]
 让陌生访客          SSO / SAML         让现有客户登录后干活
 看懂并信任          RBAC 角色
                     Tenant 隔离
                     审计日志
```

- **公开站**：负责获取信任 —— 我们是谁 + 可验证数字、为什么需要全球单仓、六步业务流程、D2D 网络与当地派送、案例证据 + 双 CTA。
- **身份与权限层**：SSO / SAML、RBAC 角色、多租户（Tenant）隔离、审计日志。
- **客户门户**：登录后按角色分流（见下）。
- **一个登录入口，两套体验**：公开站右上角与页脚固定「Portal login」；潜在客户走询价 CTA，现有客户直接进门户。

端到端主链路：

```
A 采购链（单据流）:
  Project 创建 → Showcase → 选品单 → Mockup 确认 → Final Order

B 入库与库存治理（单一库存真相）:
  初始入库 → 最低库存规则 → Movement 报表（双方导出）

C 出库（三种模式）:
  M1 集中活动单 → M2 Personal-link → M3 Open portal

底部贯通：订单确认 → 扣减可用库存 → 全球 D2D 报关 → 当地人员分发 → POD 签收
底部回流：商品池（历史 Showcase 选品回流复用）
```

## 核心业务流程

### 采购链（六步 + 两道硬门禁）

1. 创建 Project，选取品类、表达需求 —— **客户管理员**
2. 创建 Showcase —— **Cyndi Global**
3. 确认 Showcase 选品，下《选品单》—— **客户管理员**
4. 提交 Mock-up 设计 —— **Cyndi Global**
5. 确认 Mock-up —— **客户管理员**
6. Mockup 录入，在《选品单》基础上加 Additional Charges（如 Setup per color、Add'l color/location run charge per unit），生成最终《Order》

> **两道硬门禁**：选品单未确认不得出 Mockup；Mockup 未批准不得生成 Order。单据确认后不可修改，只能发新版本。

### 库存治理

- 最终 Order 作为初始 Inventory 入库
- 客户管理员设置最低库存
- Cyndi Global + 客户管理员导出 Movement 报表
- 系统显示订单状态更新（ready for dispatch / on the way / delivered）

> 库存扣减口径（直接减 on-hand vs. `available = on-hand − allocated`）为**待拍板的关键决策**，见下文 Q1。

### 三种出库模式（统一为一张 OutboundOrder 表，用 `channel` 区分）

| 模式 | 触发方式 | 限额与审批 | 履约 |
| --- | --- | --- | --- |
| **M1 集中活动单** (`BULK`) | 客户管理员一次性下单 | 无逐单审批（可选） | 整批送达活动地，客户现场分发 |
| **M2 Personal-link** (`PERSONAL_LINK`) | 名单 + 邮箱 → 唯一 token 链接，一人一链 | 每人每款 1 件/不限；审批可配置 | Cyndi 或客户发信（需可配置） |
| **M3 Open portal** (`OPEN`) | 一个共享链接 + 指定文案 | **每单强制客户管理员批准** | 批准后履约 |

### 商品池汇总

- 客户管理员可见每次 Project 提交的所有 Showcase，包括未下单的商品
- 所有产品打两类标签：`Ordered` / `Available Options (Not Ordered)`
- 下次 Project 优先从历史 Showcase 选品；**复用必须 Re-quote（重新报价）**
- Global Catalog（含供应商成本/报价/有效期，内部）与 Client Product Pool（客户可见）分离

## 客户门户

一次登录，两组功能：

- **采购链**：Projects / Showcases、选品单 / Mockup、Orders / 附加费、商品池
- **供应链治理**：Inventory / 最低库存、Outbound 三模式、Global Delivery / POD、Reports / Admin / API

## 技术选型（已锁定 · 2026-11-23）

与现有线上站 `cyndi-global-website` 保持一致，便于将来迁移回线上：

- **前端**：React 19 + Vite + Tailwind CSS
- **后端**：Cloudflare Pages Functions（`functions/api/*`）
- **数据库**：Cloudflare D1（迁移文件在 `migrations/`）
- **图片存储**：Cloudflare R2

**理由**：同栈迁移最简单；已有的 D1 表结构、Functions API、R2 桶与 Cloudflare Pages 部署流水线可直接复用，无需重建基础设施。

## 路线图

1. **阶段一 · 确认架构与关键决策** —— 逐条拍板 Q1–Q8，锁定业务流程与数据模型。
2. **阶段二 · 公开站 IA 与线框** —— 六段叙事骨架、首页线框、D2D 网络与双 CTA 的呈现方式。
3. **阶段三 · 门户 IA 与关键页视觉** —— Dashboard、下单六步、库存与出库页，高保真设计与实现。

> 客户原话：**「我们先讨论清楚架构再进行页面设计整改。」**

## 关键决策（已锁定 · 2026-11-23）

Q1–Q8 已经客户全部拍板，完整决定见 [`docs/DECISIONS.md`](docs/DECISIONS.md)。摘要：

| 编号 | 客户决定 |
| --- | --- |
| **Q1** | 下单 allocate、发货减 on-hand；客户可见 `available = on-hand − allocated` |
| **Q2** | 附加费录入后客户须再确认 Order |
| **Q3** | M2 每单客户管理员审批；发件方按活动可配置 |
| **Q4** | Re-quote 30 天有效 |
| **Q5** | DDP，Cyndi 为支付方、关税账单列明；覆盖 214+ 国家地区，本地承运商尾程 |
| **Q6** | 不自动建 Project，仅商品标记低库存 |
| **Q7** | OIDC SSO（PKCE，SAML 后续）；前端英文单语；多币种展示与结算 |
| **Q8** | 只读 API + 发货 webhook；CSV/XLSX 报表；订单/发票/POD 出 PDF |

## 协作约定

- **先对齐架构与规则，再写页面代码。**
- **保留历史提交**：不 force push、不重写历史、不覆盖他人提交。
- **面向客户的界面不出现第三方承运商名称**（如 Yanwen / 燕文 / YW56），统一显示 `Cyndi Global`。内部标识（环境变量、API URL、内部函数名）保持不变。

## 参考资料

- 核心参考站点：<https://kotisdesign.com/swag-platform/>（理解行业形态，不照搬）
- 架构讨论稿：`CyndiGlobal网站重构架构讨论.pptx`（14 页中文，团队讨论的权威参考）
- 设计规范：`DESIGN.md`
- 完整任务简报：`CyndiGlobal网站重构-Amazon-Q交接简报.md`（含 GitHub / Cloudflare / 代码现状、待更新网页清单、技术细节）

---

*最后更新：2026-11-23*
