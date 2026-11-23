# CyndiGlobal 网站重构 · 架构讨论稿 — 设计规范

## 全局视觉约定

### ① 画布与安全区
- 画布 1280×720；padding 上下 60 / 左右 60；内容区 1160×600（x 60–1220，y 60–660）
- 页眉 y 60–130（含主标题 + 1px 贯通细线，仅内容页）；正文 y 150–650；页脚固定 y=670
- 封面 / 目录 / 结束页可全出血、无页脚

### ② 配色方案（商务现代 · 冷调理性）
- 主色 accent `#5A7CB7`；深档 `#171F2E`；浅档 `#B5C4DF`
- 底色 bg `#FFFFFF`
- 文字：ink `#253649`（一级）/ secondary `#425C86`（二级）/ body `#3B4A5B`（正文）/ muted `#87909B`（辅助）
- 卡片底 surface `#E8ECEF`；分隔线 line `#E0E3E6`
- 系列色：#5A7CB7 / #507DBC / #A1C6EA / #2E4A70 / #8FB0D6 / #43608C
- 深底 deep_bg `#141E28`，深底文字 `#FFFFFF`
- 语义红（风险/异议）`#C0392B`（配 ▼ 或 △）；语义绿（建议/结论）`#2E8B6F`
- 面积纪律：主色 ≤60% / 辅色 ≤30% / 强调 ≤10%（Hero 页强调可到 15–20%）

### ③ 字体系统
- 中文：`'Microsoft YaHei', sans-serif`（标题 Bold / 正文 Regular）
- 西文数字：`'Inter', sans-serif`，开 tnum
- 字号阶梯：封面主标 76 / 章节大字 56 / 巨型数据 80–96 / 页面主标 34 / 卡片小标 22 / 正文 18 / 注释 14

### ④ 视觉母题
- 内容页主标题下 1px 贯通细线（x 60→1220，颜色 `#D7DEE6`），只落主标题一处
- 页脚：左 "CyndiGlobal · 架构讨论稿" / 右页码 "NN / 14"，14px muted（封面/目录/结束页不出现）

### ⑤ 配图清单
- 无外部位图；全篇用结构化图形（Box / SVG / Table / FAIcon），视觉类型统一，不混摄影插画

---

## 逐页设计

### P01 封面
- title: CyndiGlobal 网站重构 · 架构讨论稿
- type: cover / role: hero / rhythm: peak
- layout: 大字报式（左侧主标 + 右侧竖向色块 + 底部信息层）
- visual: 主色大色块 + 大字标题；无图
- density: 字数约 45 / 图片 0 / 留白约 45%
- anti_pattern: 禁止居中大标题三等分卡片；禁止浅灰底+40px 标题
- description: 主标 "网站重构 架构讨论稿"，副标 "先对齐架构，再谈页面"，底部一行日期 2026-11-16 · 内部讨论用

### P02 讨论议程
- title: 今天要对齐的五件事
- type: catalog / role: supporting / rhythm: valley
- layout: 经典纵排（编号 + 议题 + 一句话）
- visual: 五条纵排清单，1px 行分隔线
- density: 字数约 160 / 图片 0 / 留白约 30%
- anti_pattern: 禁止卡片容器；禁止写每章简述超过一句
- description: 01 现状与对标 / 02 双产品架构 / 03 端到端业务流程 / 04 五项关键判断 / 05 待拍板问题与下一步

### P03 现状诊断
- title: 三个痛点：看不懂、走不通、找不到
- type: content / role: supporting / rhythm: valley
- layout: 三栏非均分（4:3:3 错位）
- visual: 三块错落卡片，各带 FAIcon
- density: 字数约 200 / 图片 0 / 留白约 25%
- anti_pattern: 禁止等宽三卡；禁止纯文字罗列无结论
- description: ① 内容太单薄 —— 现站点只有 Hero + shop 链接 + 表单，读不懂公司做什么 ② 业务流程不清晰 —— 客户不知道从需求到收货怎么走 ③ 客户门户不清晰 —— 没有登录入口与角色说明

### P04 对标 Kotis
- title: 同样做 SWAG，我们卖的不是同一件东西
- type: content / role: hero / rhythm: peak
- layout: 对比式（左右 A vs B，中间竖线）
- visual: 左"Kotis 擅长：开店工具"，右"Cyndi：全球供应链中枢"
- density: 字数约 240 / 图片 0 / 留白约 20%
- anti_pattern: 禁止四维以上对比表；禁止等宽平铺
- description: Kotis 强在无限店铺、SSO、API、报表，国际能力是美仓+FedEx/UPS+印英欧中合作方生产，on-demand 仍在探索；我们的差异是单一全球仓、全球 D2D、员工到当地分发派送

### P05 双产品架构
- title: 第一刀：把网站拆成两个产品、一个入口
- type: content / role: supporting / rhythm: valley
- layout: 三列结构图（公开站 → 身份层 → 客户门户）
- visual: SVG 三区块 + 箭头
- density: 字数约 220 / 图片 0（SVG）/ 留白约 22%
- anti_pattern: 禁止把两者混在一页营销页讲；禁止等宽三卡
- description: 公开站负责获取信任（定位/流程/网络/证据/双 CTA）；身份层 SSO+RBAC+Tenant+审计；客户门户登录后按角色分流

### P06 端到端业务主链路
- title: 从需求到签收：一张图看懂全链路
- type: content / role: hero / rhythm: peak
- layout: 全宽流程图（三段：采购链 / 库存 / 出库+交付）
- visual: 三段流程链 SVG，蓝色=客户、橙色=Cyndi
- density: 字数约 200 / 图片 0（SVG）/ 留白约 18%
- anti_pattern: 禁止把六步拆成六张卡；禁止无箭头的并列
- description: Project→Showcase→选品单→Mockup→Order→入库→最低库存+报表→三种出库→D2D报关→当地派送POD；底部商品池回流

### P07 下单六步
- title: 六步下单：单据驱动，两道硬门禁
- type: content / role: supporting / rhythm: valley
- layout: 流程链 g（横向 6 步 + 底部输出条）
- visual: 六节点流程 + 两处门禁标记
- density: 字数约 260 / 图片 0 / 留白约 18%
- anti_pattern: 禁止六张等宽卡；禁止省略执行方
- description: 每步标注执行方（客户管理员/Cyndi）；硬门禁：选品单未确认不得出 Mockup，Mockup 未批准不得生成 Order；单据确认后不可变只能发新版本

### P08 五项关键判断（上）
- title: 五个必须写进系统的判断（1/2）
- type: content / role: supporting / rhythm: valley
- layout: 左标题色块 + 右内容 m（判断 1、2）
- visual: 左侧深色大编号块，右侧两条详述
- density: 字数约 260 / 图片 0 / 留白约 22%
- anti_pattern: 禁止五条一次平铺；禁止空泛标题
- description: 判断①单据驱动不可变 ②Additional Charges 独立 ChargeLine（one-time setup vs per-unit run charge，绑定 Decoration）

### P09 库存口径异议
- title: 一个必须拍板的异议：库存到底什么时候扣
- type: content / role: hero / rhythm: peak
- layout: 对比式 h（左"直接减 on-hand" vs 右"三数口径"）+ 底部结论条
- visual: 左右对比 + 强调色结论条
- density: 字数约 280 / 图片 0 / 留白约 15%
- anti_pattern: 禁止把异议藏在正文；禁止无结论条
- description: 直接减 on-hand 会导致账实不符、报表解释不通、取消错乱；建议 available = on-hand − allocated，确认增 allocated、发货减 on-hand，Ledger 五类流水

### P10 三种出库模式
- title: 三种出库，统一成一个 OutboundOrder
- type: content / role: supporting / rhythm: valley
- layout: 表格（4 列 × 4 行）+ 顶部结论
- visual: 描边包裹表格，表头深色
- density: 字数约 300 / 图片 0 / 留白约 15%
- anti_pattern: 禁止裸行列文字；禁止超过 5 列
- description: M1 集中活动单 / M2 Personal-link（一人一链、限额）/ M3 Open portal（逐单强制审批）；channel 字段区分，否则三套库存对不上账

### P11 商品池与数据隔离
- title: 商品池 ≠ 全球选品库
- type: content / role: supporting / rhythm: valley
- layout: 对比式 h（左 Global Catalog / 右 Client Product Pool）+ 底部结论
- visual: 左右两区块 + 底部标签说明
- density: 字数约 240 / 图片 0 / 留白约 20%
- anti_pattern: 禁止等宽平铺；禁止省略 Re-quote
- description: 内部 Catalog 含供应商成本报价有效期，客户只见本公司历史 Showcase；标签 Ordered / Available Options (Not Ordered)；复用必须强制 Re-quote

### P12 客户门户信息架构
- title: 客户门户：两组功能，一次登录
- type: content / role: supporting / rhythm: valley
- layout: 左标题色块 + 右分组清单 m
- visual: 左侧深色块，右侧两列分组
- density: 字数约 260 / 图片 0 / 留白约 20%
- anti_pattern: 禁止八项等宽网格；禁止无角色说明
- description: 采购链（Projects/Showcases、选品单/Mockup、Orders/附加费、商品池）+ 供应链治理（Inventory/最低库存、Outbound 三模式、Global Delivery/POD、Reports/Admin/API）

### P13 待拍板问题
- title: 需要大家拍板的 8 个问题
- type: content / role: supporting / rhythm: valley
- layout: 两列清单（4+4），编号大字
- visual: 8 个编号条目，聚焦色
- density: 字数约 320 / 图片 0 / 留白约 12%
- anti_pattern: 禁止 8 张卡；禁止问题无编号
- description: Q1 库存口径 / Q2 附加费二次确认 / Q3 M2 审批与发件方 / Q4 Re-quote 有效期 / Q5 DDP-DDU 与覆盖 / Q6 低库存自动建单 / Q7 SSO-双语-多币种 / Q8 API 与导出

### P14 下一步与结束
- title: 确认之后，我们这样往下走
- type: ending / role: hero / rhythm: peak
- layout: 三阶段路线图 + 落款
- visual: 横向三阶段箭头 + 大字落款
- density: 字数约 140 / 图片 0 / 留白约 40%
- anti_pattern: 禁止只写谢谢占整页；禁止四卡预览
- description: ①确认架构与 8 问题 ②公开站 IA/线框 ③门户 IA → 关键页视觉；落款：请组内反馈 · 2026-11-16
