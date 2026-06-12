# 设计 / 内容决定记录（面包屑）

> 约定：用户明确认可的决定记录在这里，带 metadata，便于日后回查。

## 2026-06-12 · 全面 review 后的一轮改版

```yaml
date: 2026-06-12
decided_by: Yucheng（对 Claude 的 review 建议回复 "do all"）
scope: 叙事结构 + UI/UX + 代码修复
```

### 叙事结构

1. **新增「两种角色 + 超级个体」落点页**（第 1 章末尾）
   - 理由：deck 标题承诺的「组织新形态」此前只存在于 speaker-notes，未上屏。
   - 复用了此前闲置的 `.role-triad` 样式；「超级个体 = N=1 的 AI Native 公司」上屏，为第 3 章埋线。
2. **删除原「不是取消头衔，而是两条逻辑同时反转」概览页**
   - 理由：与时间轴页、后续 4 页「以前/现在」对照内容三次重复。
   - 「不是取消头衔」的澄清并入第 1 章 divider 的 lede。
3. **新增 Vogels 金句 dark 页**（第 2 章收口）：复用闲置的 `.quote` 样式，与第 4 章 dark 页形成节奏呼应。
4. **新增「一个新成员入职的第一天」场景页**（第 3 章收口）：把可查询 / 闭环 / Buff 串成一条链。**待办：建议换成出海去 / Lucius 的真实片段。**
5. **公司扁平化证据只保留一处**：`FIG.flatten`（06 页图）里的公司名改为概括性文案，具体公司名单保留在 span 页的黑底 roster。
6. **开场举手互动写进封面 notes**：补上结尾私货「回收那只手」的伏笔（此前 callback 悬空）。

### UI / UX

7. **私货页五条改为 fragment 逐条出现**：保护结尾情绪节奏。
8. **timeline 页（titleline）并入全局版式**：留白、标题字阶与其余页面统一，正文删到一句，高度还给图。
9. **浅色章节 divider 加 surf 底色 + 超大章节数字水印**（`.divider` 类）：强化章节边界信号；第 4 章 divider 保持 dark（语气切换是刻意设计）。
10. **页码改用 reveal `slideNumber: 'c/t'` 自动生成**：删除全部手写 `.foot`，加减页不再需要手改 17 处数字。
11. **达·芬奇简历页角标改为「原图 · 点击看译文」**：让点击切换的彩蛋可被发现。
12. **`FIG.span` 图内大标题删除**：与页面 h1 双标题打架；viewBox 收紧，条形图上移。

### 代码修复

13. `app.js`：fonts.ready 与 1.5s 兜底加 `started` 标志，修复刷新/深链时动画播两遍。
14. `figures.js`：闭环图旋转光点 rAF 加 session token + `FIG.stopLoop()`，换页时取消，不再后台空转。
15. **print-pdf 静态化**：`reduced()` 在 `?print-pdf` 下返回 true，且 `app.js` 在该模式下激活所有带图页面——导出 PDF 不再出现空的柱状图。
16. **移除 Perplexity inline-edit 残留脚本**（~360 行，与 deck 无关）。

## 2026-06-12 · hierarchy 部分深化：层级的生物学根源 + 「协助→取代」递进

```yaml
date: 2026-06-12
decided_by: Yucheng（AskUserQuestion 选「递进：协助→取代」）
scope: 第 1 章「层级」三页叙事
```

17. **「层级逻辑」页挖到生物学根源**：标题改为「层级，是人类生物跨度逼出来的」。核心论点——一个人只能有效带 3–8 人是写在生物性里的硬上限，科层制本质是这条生物跨度的产物；现代公司层级直接继承自军队（罗马军团 contubernium→decanus，80 人→centurion，5000 人→legate），两千年来能做「信息路由」的只有人。
18. **新增「层级终局」dark 页**（接在「层级反转」之后）：把张力做成递进而非矛盾。保留上一页「AI 协助 manager 管几十人」作为**当下现实**，新页用 Block 的赌注收口——*不是用 AI 辅助管理，而是用 AI 取代管理*；AI 是史上第一个不受生物跨度限制的协调媒介，公司变成 Intelligence Layer 后中层**彻底消失**（不是变少）。复用 `.quote` dark 样式，与 Vogels 页、第 4 章 dark 页形成节奏呼应。
    - 张力处理决定：用户在「递进 / 直接升级为取代 / 只补为什么」三选一中明确选**递进**——「协助」=今天，「取代」=去向，是同一条曲线的两段。

## 2026-06-13 · 第 2 章新增「为什么是文艺复兴」论证页

```yaml
date: 2026-06-13
decided_by: Yucheng（明确要求：先讲 Vogels 的「文艺复兴 Builder」概念 + 为什么我们处在文艺复兴时代，再讲特质）
scope: 第 2 章，插在「隔五百年对照图」(talent) 与「文艺复兴式 Builder 特质」之间
source: Werner Vogels · AWS re:Invent 2025 告别演讲 "Echoes of Evolution and Innovation"（youtube 3Y1G9najGiI, t≈2511s）
```

19. **新增「为什么是『文艺复兴』」页**（现 `#/12`，把原特质页顺延到 `#/13`）：补上此前缺失的**结构性论证**——Vogels 不是蹭「文艺复兴」这个词，而是说当年催生文艺复兴的**三个引擎今天被同时点亮**。用闲置度高、最贴合的 `.role-triad`（三列 + 当年/今天两条 li）承载「当年 → 今天」的映射：
    - **赞助人 → 算力**（rust/dn）：美第奇家族 = 那个时代的风投 → 云 + 并行 AI agent，算力即赞助。
    - **工具普及**（teal/up）：古登堡印刷术把知识民主化 → AI 把「软件创造」民主化，门槛从「会编程」降到「会把意图讲清楚」。
    - **通才**（gold/ch）：达·芬奇「艺术与科学是同一场对话」→ 文艺复兴式 Builder，跨栈跨学科把事做成。
    - 收口 lede 引 Vogels 的更大框架：太空 / AI / 机器人**多个黄金时代同时到来**，互相加速；问题从「AI 会取代我吗」换成「**我会不会进化**」——与下一页特质、第 2 章金句 dark 页（"…Absolutely not. If you evolve."）形成同一条线。
    - 内容已据 keynote 多篇一手 recap 核对（Vogels 官方五特质：Curious / Systems thinker / Communicator / Owner / Polymath；三引擎 = Medici 赞助 / Gutenberg 印刷术 / da Vinci 通才）。speaker-notes.md 同步加「为什么是文艺复兴」口播段。

## 2026-06-13 · 第 2 章页序调整 + 特质页暂时下线

```yaml
date: 2026-06-13
decided_by: Yucheng（两条明确指令）
scope: 第 2 章页序
```

20. **「为什么是文艺复兴」页前移**：从「对照图之后」挪到**简历页之后、对照图之前**。新页序：简历 →「为什么是文艺复兴」→「隔五百年对照图」→ 金句收口。理由——先用结构性论证说明「为什么这种人又稀缺」，再用对照图做视觉收束，逻辑更顺；对照图的「杠杆换了、人没换」正好接在三引擎之后当一句话总结。
21. **「文艺复兴式 Builder 特质」六卡片页暂时下线**：Yucheng 指令「先去掉」（「先」=暂时，非永久删除）。HTML 中整段 `<section>` 移除；speaker-notes.md 对应段落**保留口播稿**并标注「⚠️ 此页暂时从 deck 下线」，需要时可快速复原。当前 deck 在对照图后直接进金句页。

## 2026-06-13 · 章节 1 / 2 对调 + 改名「超级个体与文艺复兴」

```yaml
date: 2026-06-13
decided_by: Yucheng（明确指令：原第 2 章改名后挪到第 1 章，原第 1 章顺为第 2 章）
scope: 顶层章节顺序
```

22. **章节对调**：原「第 2 章 · 需要什么样的人」（达·芬奇简历 / 文艺复兴论证 / 对照图 / Vogels 金句）→ 改名 **「超级个体与文艺复兴」** 并前移为**第 1 章**；原「第 1 章 · 去 Title 化」顺延为**第 2 章**。第 3 / 4 章不变。HTML 中两个章节 `<section>` 块整体对调，所有 `sec-num` / `data-num` / `kicker` 编号与封面 notes 的议程顺序同步从 01↔02 互换。
    - **⚠️ 待办（narrative seam，未自动改）**：① 新第 1 章（文艺复兴）末尾 Vogels 金句页的过渡 notes 仍写「需要一家什么样的公司来承载？进第 3 章」——现在它后面接的是第 2 章「去 Title 化」，过渡语与章节号都需重写。② 原第 1 章末尾的「两种角色 + 超级个体」落点页现在落在第 2 章末，与新章序的衔接需 Yucheng 确认。这两处叙事桥接保持原样，等 Yucheng 定调后再调。

## 2026-06-13 · 「隔五百年对照图」改为九维对照表（#/10）

```yaml
date: 2026-06-13
decided_by: Yucheng（提供九行对照表，指令「page 10 use this to replace」+「做一下必要的简化」）
scope: 第 2 章「隔五百年，我们需要一样的品质」页（#/10）
```

22. **#/10 页从 SVG 人才对照图（`FIG.talent`）换成显式九维对照表**：用户给了一张「维度 / 达·芬奇 / 当代文艺复兴式 Builder」九行表（核心驱动力、主要媒介、工具、研究对象、知识结构、工作方式、影响路径、时间尺度、与时代工具的关系）。
    - **必要的简化**：剥掉原文每格尾部的 `youtube` 引用残留；每格压成短句（多为一行），加小标题「同一种稀缺，换了一套杠杆」。
    - **实现**：`css/theme.css` 新增 `.cmp` 三列网格表（header 深底、`维度`列 surf 底加粗、Builder 列 `.b` rust 微底 + `<strong>` 关键词高亮）；`index.html` 该 `<section>` 的 `data-fig` 从 `talent` 改 `none`，移除 `#fig-talent` 与 steipete「Fun Fact」配图（fun-fact 改进 notes 口播保留）。
    - `FIG.talent`（figures.js/app.js）不再被引用但保留注册，无副作用。
    - **后续（同日）**：Yucheng 把表收到 **6 行**、改用引言句开场，并要求**把 @steipete 配图放回来**。最终版改成 `.talent-layout` 两栏（左对照表 1fr / 右 `.fun-fact` 配图卡 322px）：右卡放 steipete 那条「the Leonardo da Vinci of the AI Renaissance」X 截图 + 一句 Fun Fact 文案。README / notes 同步「六维 + 配图」。

## 2026-06-13 · 第 1 章「层级」两页合并为一页（page 5+6）

```yaml
date: 2026-06-13
decided_by: Yucheng（指令「合并 page 4 5 并简化」，经确认实为 Reveal c/t 计数的 page 5+6）
scope: 第 1 章「层级」以前/现在对照
```

23. **「以前·层级是生物跨度逼出来的」（`fig=flatten`）与「现在·AI 协助 manager 管几十人」（`fig=span`）合并为一页**：原本是一组「以前/现在」对照双页，合并成单页 `data-fig="span"`。
    - **简化**：以前侧的 `definition-band`（span of control 3–8 人 / 科层制是生物跨度产物）与现在侧的 AI 自动化论点折进**同一段** definition-band；标题改为「层级曾是生物跨度逼出来的，AI 第一次把它压平」。
    - **保留**：`fig-span`（管理跨度 4.4→60 可视化）、`company-roster`（Meta/Amazon/Google/MS 扁平化清单）、「去 title 化第二层来源」收口句。
    - **下线**：`fig-flatten`（span→delayering→AI 加速时间线 + 四宫格统计图）整段移除；两页 source/notes 合并去重（军团 decanus 类比并入 notes 口播）。
    - `FIG.flatten`（figures.js/app.js）不再被引用但保留注册，无副作用。
