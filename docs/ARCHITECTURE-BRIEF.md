# Cyndi Global 官网重构 —— 交付给 Amazon Q 的完整任务简报

> **使用说明**：本文件是给 AI 编程助手（Amazon Q Developer）的自包含任务简报。请完整复制本文件作为对话的第一条消息。文档已包含：项目背景、公司定位、完整业务流程、架构讨论结论、GitHub 与部署现状、需更新的网页清单、待确认事项与分阶段计划。文中所有"待确认/有异议"标记均需在动手前与客户确认，不要擅自假设。

---

## 0. 你的任务（先读这里）

你要协助客户（Cyndi Global Limited）对其官网进行**架构级重构与页面整改**。当前网站只是一个简单的落地页 + 商城 + 物流查询页，无法表达公司定位、业务流程和客户门户。客户已与我们完成一轮架构讨论（产出了 14 页中文 PPT），现在需要你：

1. **理解并承接**下面第 1–6 节的全部业务背景与架构结论；
2. **核对**第 7 节列出的 GitHub / Cloudflare / 代码现状（以实际仓库为准）；
3. 就第 8 节的 **8 个待拍板问题**向客户逐条确认（尤其是 Q1 库存扣减口径，存在需求原文与架构建议的冲突）；
4. 确认后按第 9 节的三阶段路线图推进：先公开站 IA/线框，再客户门户 IA，再关键页面视觉与实现。

**重要原则**：
- **先对齐架构与规则，再写页面代码**。客户明确要求"先讨论清楚架构再进行页面设计整改"。
- **不要覆盖已有代码历史**：远端 `main` 上有其他工程师的历史提交，必须完整保留（详见 7.2）。
- **面向客户的界面不出现第三方承运商名称**（如 Yanwen / 燕文 / YW56），统一显示 `Cyndi Global`（详见 7.5）。

---

## 1. 公司定位与核心服务

### 1.1 一句话定位（客户原文，需作为全站叙事主线）

> **"Treat Cyndi Global as your dedicated product team — Luxury swag for brands, Anywhere in the world."**

中文释义：把 Cyndi Global 当作客户专属的产品团队——为品牌提供高端 SWAG，服务全球任何地点。

### 1.2 我们是谁（差异化能力，站位高于普通 SWAG 电商）

Cyndi Global 不是一家"卖周边商品的网店"，而是**全球 D2D SWAG 供应链中枢**。核心能力：

| 能力 | 说明 |
| --- | --- |
| 全球云仓储选址 | 可作为跨国公司的"全球中央仓"，按客户业务选址布局 |
| 全球 D2D 运输 | 海运 + 空运线路覆盖 30+ 城市（亚洲、欧洲、北美、大洋洲），门到门交付 |
| 税费运费最优解 | 提供最节约税费与运费的方案（tax-optimized） |
| 最优质 SWAG 选品 | 面向品牌的高端选品，而非廉价赠品 |
| 当地分发派送 | 可派员工到当地进行现场分发、派送（last-mile / on-site distribution） |
| 专属产品团队 | 从选品、设计、打样到履约，充当客户的外部产品部门 |

### 1.3 参考站点（用于理解行业形态，但不要照搬）

- **https://kotisdesign.com/swag-platform/** —— 客户指定的核心参考。其页面骨架为：Stores（无限店铺）→ 四步 How it works → 权限 / SSO / API / 报表 → 客户证言 → FAQ → CTA。其国际能力是"美仓 + FedEx/UPS + 印/英/欧/中合作方生产"，on-demand 仍在探索阶段。
- **差异化要求**：Kotis 是"开店工具"，我们是"全球供应链中枢"。我们站位更高——单一全球中央仓、全球 D2D、员工到当地分发派送、税费运费最优。页面叙事要体现这种量级差，不要做成 Kotis 的翻版。

---

## 2. 现状痛点（为什么要重构）

客户原话：网站"太简单无内容，阅读者不知道这是什么公司，业务流程不清晰，客户的门户不清晰"。具体三条：

1. **看不懂**：现有站点只有 Hero + 商城链接 + 联系表单 + 香港地址，读者无法理解 Cyndi 是做什么的、有什么能力。
2. **走不通**：客户看不到从需求到收货的完整业务流程，不知道如何开始、如何推进。
3. **找不到**：没有清晰的客户门户登录入口与角色说明，老客户无法进入系统干活。

现状核实（截至本简报）：线上主站 `https://www.cyndiglobal.com/` 为落地页（Swag / Service / Solution / Brand 四个一级导航），`/shop` 为商城，`/showcase/` 为选品展示站，`/admin/` 为后台，`/catalog/logistics.html` 为物流查询页。缺少：品牌叙事、流程说明、全球网络证据、客户门户入口。

---

## 3. 目标架构总览（架构讨论已达成的核心结论）

### 3.1 第一刀：拆成"两个产品 + 一个入口"

```
[公开站]  ──►  [身份与权限层]  ──►  [客户门户]
 让陌生访客          SSO / SAML         让现有客户登录后干活
 看懂并信任          RBAC 角色
                     Tenant 隔离
                     审计日志
```

- **公开站**：负责获取信任。必备内容：我们是谁 + 可验证数字、为什么需要全球单仓、六步业务流程、D2D 网络与当地派送、案例证据 + 双 CTA。
- **身份与权限层**：SSO / SAML、RBAC 角色、多租户（Tenant）隔离、审计日志。
- **客户门户**：登录后按角色分流，见 3.5。
- **一个登录入口，两套体验**：公开站右上角与页脚固定「Portal login」；潜在客户走询价 CTA，现有客户直接进门户。

### 3.2 端到端全链路（一张图的核心）

```
A 采购链（单据流，蓝=客户管理员 橙=Cyndiglobal 灰=双方协同）:
  Project 创建 → Showcase → 选品单 → Mockup 确认 → Final Order

B 入库与库存治理（单一库存真相）:
  初始入库 → 最低库存规则 → Movement 报表（双方导出）

C 出库（三种模式）:
  M1 集中活动单 → M2 Personal-link → M3 Open portal

底部贯通：订单确认 → 扣减可用库存 → 全球 D2D 报关 → 当地人员分发 → POD 签收
底部回流：商品池（历史 Showcase 选品回流复用）
```

### 3.3 五项必须写进系统的判断（架构讨论结论，重要）

1. **单据驱动、不可变**：Project → Showcase → Selection Sheet（选品单）→ Mockup(v) → Order，设**两道硬门禁**：选品单未确认不得出 Mockup，Mockup 未批准不得生成 Order。单据确认后不可修改，只能发新版本。
2. **Additional Charges 独立 ChargeLine**：绑定 Decoration（印刷/绣花位置），区分 one-time setup（如 Setup per color）与 per-unit run charge（如 Add'l color/location run charge per unit）。计费维度需扩展到包装、运费、关税、本地派送。
3. **库存口径异议（⚠️ 与客户原文冲突，见 Q1）**：客户原文要求"订单确认即扣减 on-hand"。架构建议为 `available = on-hand − allocated`：确认订单时增加 allocated，发货时才减 on-hand；并建 Ledger 五类流水。理由：直接减 on-hand 会导致账实不符、报表解释不通、取消错乱。**此项需客户拍板后再实现。**
4. **三种出库统一为一张 OutboundOrder 表**：用 `channel` 字段区分 `BULK` / `PERSONAL_LINK` / `OPEN`，否则三套逻辑各自维护库存必然对不上账。M3 强制客户管理员逐单审批。
5. **Global Catalog 与 Client Product Pool 分离**：内部目录含供应商成本/报价/有效期；客户只见本公司历史 Showcase。产品打两种标签 `Ordered` / `Available Options (Not Ordered)`。历史 Showcase 复用必须强制 **Re-quote**（重新报价）。

### 3.4 三种出库模式（统一表结构，详见 PPT P10）

| 模式 | 触发方式 | 限额与审批 | 履约 |
| --- | --- | --- | --- |
| **M1 集中活动单** (BULK) | 客户管理员一次性下单 | 无逐单审批（可选） | 整批送达活动地，客户现场分发 |
| **M2 Personal-link** (PERSONAL_LINK) | 名单 + 邮箱 → 唯一 token 链接，一人一链 | 每人每款 1 件/不限；审批可配置 | Cyndi 或客户发信（需可配置） |
| **M3 Open portal** (OPEN) | 一个共享链接 + 指定文案 | **每单强制客户管理员批准** | 批准后履约 |

三种出库在订单确认时统一扣减可用库存，并汇入同一条 Movement 流水。

### 3.5 客户门户信息架构（两组功能，一次登录）

- **采购链**：Projects / Showcases、选品单 / Mockup、Orders / 附加费、商品池（Client Product Pool）
- **供应链治理**：Inventory / 最低库存、Outbound 三模式、Global Delivery / POD、Reports / Admin / API

---

## 4. 客户原始业务流程需求（逐条原文，作为需求唯一来源）

> 以下为客户口述的流程，执行方在括号中标注。**注意**：其中"库存扣减"一条与 3.3-③ 的架构建议冲突，以 Q1 确认为准。

### 4.1 下单流程（客户管理员 = 有管理权限的客户员工）

1. 创建 project，选取品类、表达需求（**客户管理员**）
2. 创建 showcase（**Cyndiglobal**）
3. 客户确认 showcase 选品，下《选品单》（**客户管理员**）
4. mock-up 提交设计（**Cyndiglobal**）
5. mock-up 确认（**客户管理员**）
6. mockup 录入，在《选品单》基础上加上 Additional Charges（例如 Setup per color、Add'l color/location run charge per unit 等金额），生成最终的《order》

### 4.2 存货管理模块（不含出库）

1. 最终 order 作为初始 inventory 入库（**Cyndiglobal**）
2. 设置最低库存（**客户管理员**）
3. 导出存货 movement 报表（**Cyndiglobal + 客户管理员**）
4. 系统应显示订单状态更新（如 ready for dispatch / on the way / delivered）

### 4.3 存货管理模块（出库，三种模式）

1. **集中下单**：客户管理员一次性下单多个，用于客户活动一次性交付，客户管理员现场分发
2. **Personal-link portal**：客户管理员向 Cyndiglobal 提供姓名与邮箱名单；Cyndiglobal 或客户管理员向每人发送唯一链接；客户管理员选择哪些商品可订及每件限额（例如每款 1 件或不限）
3. **Open portal**：一个可分享链接，按需配置，由客户管理员选定商品与文案；每笔订单必须经客户管理员审核批准后才履约

**库存扣减逻辑（⚠️ 待 Q1 确认）**：客户原文要求"以上出库在订单确认时就进行仓库库存数量扣减"，并实时显示每件商品库存数——例：下单 T-shirt 时显示 "100 in stock"，下单后自动变为 "99"。架构建议见 3.3-③（allocated 三数口径），请勿在确认前直接实现原文逻辑。

### 4.4 商品池汇总

客户管理员能看到每次 project 提交的所有 showcase；之前 showcase 中未下单的商品也进入选品池。所有产品打标签，分两类：`Ordered` 与 `Available Options (Not Ordered)`。下次 project 优先从历史 showcase 中选品（复用须 Re-quote，见 3.3-⑤）。

---

## 5. 待拍板问题（动手前必须逐条确认）

| 编号 | 问题 | 说明 |
| --- | --- | --- |
| **Q1** | 库存扣减口径 | 订单确认即减 on-hand（客户原文） vs available = on-hand − allocated（架构建议）。**最高优先级，直接影响数据模型** |
| **Q2** | 附加费是否需要客户二次确认 | Mockup 录入附加费生成 Order 时，是否需客户再次确认金额 |
| **Q3** | M2 Personal-link 的审批与发件方 | 是否需逐单审批？邮件由 Cyndi 还是客户发出（可配置？） |
| **Q4** | Re-quote 有效期 | 历史 Showcase 复用的报价有效期多久（如 30/60/90 天） |
| **Q5** | DDP / DDU 与派送覆盖范围 | 贸易条款、关税承担方、当地派送可覆盖的国家/城市清单 |
| **Q6** | 低库存是否自动建 Project | 库存低于最低值时是否自动生成补货 Project |
| **Q7** | SSO / 双语 / 多币种 | 是否需要 SSO（哪种协议）、中英双语站点、多币种展示与结算 |
| **Q8** | API 与导出格式 | 对外 API 范围、报表导出格式（CSV / XLSX / PDF） |

---

## 6. 已有架构讨论稿（PPT）

已产出 14 页中文 PPT：`CyndiGlobal网站重构架构讨论/CyndiGlobal网站重构架构讨论.pptx`（1280×720，商务冷调风格，设计规范在同目录 `DESIGN.md`）。14 页结构：

1. 封面　2. 议程　3. 三痛点　4. 对标 Kotis　5. 双产品架构　6. 端到端主链路图　7. 下单六步 + 两道门禁　8. 五项判断(1/2)　9. 库存口径异议　10. 三种出库表　11. 商品池隔离　12. 门户 IA　13. 8 个待拍板问题　14. 下一步路线图

**这份 PPT 是团队讨论稿，可作为你理解业务与叙事结构的权威参考。**

---

## 7. GitHub / Cloudflare / 代码现状（务必按实际情况核对）

### 7.1 仓库与账号

| 项 | 值 |
| --- | --- |
| 远端仓库 | `https://github.com/Georgiazhu/cyndi-global-website.git` |
| GitHub 账号 | `Georgiazhu` |
| Git 提交作者（新提交起） | `Cyndi Global <georgiazhuyeah@gmail.com>`（不得改历史提交归因） |
| 部署分支 | `main` |
| 线上地址 | `https://www.cyndiglobal.com` |
| 托管平台 | Cloudflare Pages，项目名 `cyndiglobal`，连接 GitHub `main` 自动构建部署 |
| 独立选品站仓库 | `HRT/showcase`（构建时合入主站 `dist/showcase`） |

### 7.2 分支与提交纪律（⚠️ 高风险，必须遵守）

- 远端 `main` 上有**其他工程师的历史提交（约 137 个）必须完整保留**。绝不要 force push 覆盖、不要 reset 远端、不要重写历史。
- 本地主仓库（`cyndi-global-website`）的 `main` 与 `origin/main` **严重分叉**（本地落后很多），不要直接用本地 main 推送。
- 已验证的安全上线方式：用独立 **git worktree**（`cyndi-tracking-worktree`，分支 `trigger-redeploy`）作为部署工作区；每次操作先 `git fetch origin main`，再把改动以补丁/stash 方式叠加到最新 `origin/main` 之上，提交后 `push origin trigger-redeploy:main`。
- 网络经验：GitHub git 协议出口偶发中断；可切换直连 / 代理端口 7897 + `http.sslBackend=openssl`；极端情况用 GitHub REST API 推送（token 取自 `git credential fill`）。
- Pages 重建有延迟，验证上线要以**线上实际 bundle hash 变化 + 内容命中**为准，不要只看提交成功。

### 7.3 技术栈

- **前端**：React 19 + Vite + Tailwind CSS，位于 `product-showcase/`。多入口：`index.html`（落地页，源码 `src/cyndi/`）、`shop.html`（商城，源码 `src/main.jsx` → `App.jsx`）。服务页：`Shipping.jsx` / `Warehousing.jsx` / `OfficeFurniture.jsx` / `ExhibitFabrication.jsx`。
- **后端**：Cloudflare Pages Functions，`functions/api/*.js`。
- **数据库**：Cloudflare D1，库名 `cyndi-logistics`，绑定名 `DB`，database_id `016ad95b-a8eb-4ea3-afdc-b1573b906e7a`。迁移文件 `migrations/0001…0010_*.sql`。
- **图片存储**：Cloudflare R2 bucket `cyndi-products`，绑定名 `MEDIA`，公开域名 `https://img.cyndiglobal.com`。
- **本地开发**：`cd product-showcase && npm install && npm run build && cd .. && npx wrangler pages dev --port 8788`。

### 7.4 现有数据表（D1）

| 表 | 用途 |
| --- | --- |
| `products` / `product_colors` / `product_skus` | 商品三级模型：SPU（款，`CY-{品类}-{序号}`，= 物流 productNo）→ 颜色 → SKU。SKU 无库存字段（当前按订单生产） |
| `orders` / `customers` | 商城订单（含 SKU 快照）/ 客户账户。**注意：这是商城的轻量订单，不是重构后的 Project→Order 单据体系** |
| `admin_users` | 后台管理员 |
| `logistics_records` / `logistics_media` / `logistics_record_versions` | 物流记录 / 图片 / 历史版本 |
| `showcase_categories` / `showcase_products` / `showcase_meta` / `showcase_media` | 选品展示站数据（分类 / 商品 / 全局设置 / 图片回退） |

迁移记录：`0001` 物流记录、`0002` 物流图片、`0003` 物流版本、`0004` 物流后台鉴权、`0005` 订单、`0006` 客户、`0007` 管理员、`0008` 商品、`0009` 阶梯定价、`0010` showcase。

### 7.5 现有 API（functions/api/）

- 商品：`products.js`、`products/[spu].js`（含边缘缓存）
- 账户：`register.js`、`login.js`、`me.js`、`logout.js`
- 订单：`orders.js`、`orders/mine.js`
- 物流：`logistics.js`、`media.js`、`tracking.js`（统一物流查询入口 `/api/tracking?q=`，运单号走燕文实时 API，产品编号查 D1）
- Showcase：`showcase.js`、`showcase/auth.js`、`showcase/auth-lib.js`、`showcase/media.js`
- 后台：`admin/login.js`、`admin/logout.js`、`admin/products.js`、`admin/product-upload.js`、`admin/upload.js`、`admin/record.js`、`admin/showcase.js`、`admin/showcase/upload.js`
- 工具库：`_lib/auth.js`、`_lib/customer-auth.js`、`_lib/showcaseSeed.js`、`_lib/yanwen.js`

**品牌脱敏约束**：`_lib/yanwen.js` 已有 `scrubCarrierName()` 清洗上游承运商名；面向客户字段 `carrier` 一律固定为 `Cyndi Global`；`carrierWebsite` / `carrierPhone` 不下发；错误码/错误文案用中性值（如 `LIVE_TRACKING_NOT_CONFIGURED`）。内部标识（`YANWEN_AUTH_CODE` 环境变量、API URL、`normalizeYanwen` 等函数名、`yanwen.js` 文件名）保留不改——改了会坏。

### 7.6 环境变量 / Secrets（Cloudflare Pages，只列名称，勿写入仓库）

- `YANWEN_AUTH_CODE`：燕文轨迹查询 API 授权码
- `LOGISTICS_ADMIN_PASSWORD`：物流后台密码
- `R2_PUBLIC_BASE=https://img.cyndiglobal.com`：图片公开域名
- D1 绑定 `DB`、R2 绑定 `MEDIA`（在 Pages 控制台配置）

### 7.7 需要更新 / 新增的网页清单

**现有（需改造叙事与结构）**：

| 页面 | 路径 | 现状与改造方向 |
| --- | --- | --- |
| 落地页 | `/`（`index.html` + `src/cyndi/`） | 现为简单 Hero + 导航 + 服务页；需补齐"我们是谁 / 全球单仓 / 六步流程 / D2D 网络 / 案例证据 / 双 CTA"叙事 |
| 商城 | `/shop`（`shop.html`） | 商品列表 + PDP + 购物车 + 下单；需与新的商品池 / 单据体系对齐 |
| 选品站 | `/showcase/`（独立仓库合入） | 分类选品提案，需纳入 Project→Showcase 单据流 |
| 服务页 | `/services/shipping`、`/services/warehousing`、`/services/office-furniture`、`/services/exhibit-fabrication` | 内容页，需与公开站新叙事统一 |
| 后台 | `/admin/` | 商品 + 物流管理，需扩展为门户管理端 |
| 物流查询 | `/catalog/logistics.html` | 公开查询页，已接入实时轨迹 |

**新增（核心缺口）**：

| 页面 | 说明 |
| --- | --- |
| 客户门户登录入口 | 公开站右上角 + 页脚固定「Portal login」；潜在客户走询价 CTA，老客户进门户 |
| 客户门户 Dashboard | 登录后按角色分流的待办中心 |
| 采购链页面组 | Projects / Showcases、选品单 / Mockup、Orders / 附加费、商品池 |
| 供应链治理页面组 | Inventory / 最低库存、Outbound 三模式、Global Delivery / POD、Reports / Admin / API |

---

## 8. 分阶段交付路线图（PPT P14）

1. **阶段一 · 确认架构与 8 个问题**：逐条拍板 Q1–Q8，锁定业务流程与数据模型（尤其库存口径、出库审批、Re-quote 规则）。
2. **阶段二 · 公开站 IA 与线框**：六段叙事骨架、首页线框、D2D 网络与双 CTA 的呈现方式。
3. **阶段三 · 门户 IA 与关键页视觉**：Dashboard、下单六步、库存与出库页，做高保真设计与实现。

客户原话："我们先讨论清楚架构再进行页面设计整改。"

---

## 9. 给 Amazon Q 的具体行动要求（第一步）

在你开始任何设计或编码前，请先完成以下动作并向客户回复确认：

1. 复述你对公司定位与"两个产品 + 一个入口"架构的理解（第 1、3 节）。
2. 列出第 5 节的 8 个待拍板问题，请客户逐条确认；**特别标出 Q1 库存口径的两种方案及影响**。
3. 核对第 7 节的仓库 / 分支 / 部署现状是否符合实际（可读取仓库确认）；明确你会用 worktree + 保留全部历史提交的方式上线。
4. 给出阶段二（公开站 IA + 首页线框）的初步方案框架供客户评审。**在客户确认架构问题前，不要直接修改线上页面代码。**

---

*简报生成日期：2026-11-23　｜　来源：架构讨论 PPT + 工作日志 + 仓库现状核对*
