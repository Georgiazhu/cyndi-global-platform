# 仓库脚手架说明（给 AI 协作者）

> 本文件说明当前仓库中**已就位的文件**与**分工边界**，避免多人/多 AI 协作时互相覆盖。

## 已就位（由 WorkBuddy 写入，请勿覆盖）

| 文件 | 用途 |
| --- | --- |
| `README.md` | 仓库门面：项目定位、架构、业务流程、路线图、待拍板问题 |
| `.gitignore` | 通用前端项目忽略规则（含 secrets、wrangler 本地状态） |
| `docs/ARCHITECTURE-BRIEF.md` | **权威任务简报**（原 Amazon-Q 交接简报），含 GitHub/Cloudflare 现状、需更新网页清单、Q1–Q8 待拍板问题。动手前必读 |
| `docs/DESIGN.md` | 架构讨论 PPT 的视觉设计规范 |
| `docs/CyndiGlobal-Architecture-Deck.pptx` | 14 页架构讨论稿（团队讨论权威参考） |

## 分工边界

- **本仓库是全新重构项目**，与现有线上站仓库 `Georgiazhu/cyndi-global-website` 分开。旧仓库有约 137 个工程师历史提交，**不得 force push / 重写 / 覆盖**。
- **技术栈已锁定（2026-11-23）**：React 19 + Vite + Tailwind CSS / Cloudflare Pages Functions / Cloudflare D1 / Cloudflare R2，与现有线上站同栈，便于迁移回线上。`README.md` 已同步更新。
- **Q1–Q8 已由客户全部拍板（2026-11-23）**：权威决定见 `docs/DECISIONS.md`（含 214+ 国家地区、英文单语、OIDC SSO 等最终答案）。`docs/ARCHITECTURE-BRIEF.md` 第 5 节的问题列表仅为背景，以 DECISIONS.md 为准。数据模型可按 Q1（下单 allocate、发货减 on-hand）实现。
- **品牌脱敏**：面向客户的界面统一显示 `Cyndi Global`，不出现第三方承运商名称。

## 推送方式（重要）

本仓库的 git 操作由**客户本人在终端手动执行**，AI 助手不直接推送。每次需要提交时，由 WorkBuddy 给出确切的 commit message 与命令，客户粘贴执行。

首次推送命令见 WorkBuddy 在对话中提供的内容；仓库当前为**空仓库**（size=0，无 README），无需 `--allow-unrelated-histories`。
