# 超级个体时代的公司组织新形态 · reveal.js 演示

一份**纯静态、零构建**的 reveal.js 演示。reveal.js 已打包进 `vendor/`，**双击 `index.html` 即可在浏览器里播放，离线也能用**。

## 本地运行

**方式一（最简单）：** 直接双击 `index.html`，用浏览器打开。

**方式二（推荐，避免极少数浏览器对本地文件的限制）：** 在本目录起一个静态服务器：

```bash
# 任选其一
python3 -m http.server 8000
# 或
npx serve .
```

然后打开 <http://localhost:8000>。

## 操作

- `→ / Space`：下一页 · `←`：上一页 · `Esc`：总览 · `F`：全屏
- **`S`：演讲者视图**（同时看到当前页的精简口播 notes + 计时 + 下一页预览）
- 完整演讲稿见 [`speaker-notes.md`](./speaker-notes.md)

## 结构

```
superhuman-org-deck/
├── index.html          # 幻灯片内容（每页含精简要点 + <aside class="notes"> 口播）
├── speaker-notes.md     # 完整演讲稿（约 12–15 分钟）
├── css/theme.css        # 浅色编辑风设计系统（与系列页面一致）
├── js/
│   ├── figures.js       # 4 张动态 SVG（浏览器内代码绘制）
│   └── app.js           # reveal 初始化 + 进入页面时播放对应动态图
└── vendor/reveal/       # reveal.js 5.1.0 本地副本（离线可用）
```

## 内容大纲

1. **封面**（开场举手：谁有一份自己的事业）
2. **去「Title」化** —— 分工史时间轴 → 分工 / 层级两条逻辑分别「以前 / 现在」对照 → 落点：组织里只剩两种角色（唯一负责人 / 只做一环的执行者），超级个体 = N=1 的 AI Native 公司
3. **需要什么样的人** —— 五百年前的简历 → 为什么是「文艺复兴」（三引擎）→ 达·芬奇 ↔ 文艺复兴式 Builder 六维对照表（右侧 @steipete Fun Fact 配图） → Vogels 金句收口（dark 页）
4. **搭建 AI Native 公司** —— 让公司可被查询 / 把动作连成闭环 / 增加被动技能（每页一张真实案例卡）
5. **写在最后的私货** —— 五条，fragment 逐条出现，回收开场那只手

## 动态图说明

`js/figures.js` 里的图全部由浏览器内 JS 代码实时绘制 SVG，无图片依赖：

- `FIG.titleline` —— 分工史拐点曲线（title 激增 → AI 拐点掉头）
- `FIG.flatten` —— 大扁平化时间轴 + 统计卡
- `FIG.span` —— 管理跨度百年趋势条形图（4.4 → 60）
- `FIG.talent` —— 达·芬奇 ↔ Builder 人才对照
- `FIG.query` —— 放射查询图（make it queryable）
- `FIG.loop` —— 闭环（含旋转光点）
- `FIG.buff` —— 被动技能层叠加成柱状图 + 上扬趋势线
- `FIG.orch` —— 执行者 → 编排者（备用，当前未上场）

每次进入对应幻灯片时，`app.js` 会重建并重新播放该页动画（翻回来也会重播）。已尊重 `prefers-reduced-motion`。页码由 reveal 的 `slideNumber` 自动生成，加减页无需手改。

## 字体

幻灯片优先用 Google Fonts 的 Noto Serif SC / Noto Sans SC / JetBrains Mono；**离线时自动回退**到系统中文字体（macOS 的苹方 / 宋体，Windows 的微软雅黑），排版不受影响。

## 想换成 PDF？

```bash
# 浏览器打开 index.html?print-pdf 后用「打印 → 另存为 PDF」（A4 横向、无边距、开启背景图形）
```

print-pdf 模式下所有动态图会直接渲染为最终状态（不播动画），导出的 PDF 不会出现空图。

## 内容决定（面包屑）

> 影响观感/叙事的内容决定记在这里备查；每条带 metadata。

- **2026-06-12 · 用真案例替换「空调」类比，并对齐三件事**（已认可）
  - **决定**：第 4 章三件事一律改用作者本人的真实案例，且每个案例对应它最贴切的那件事：
    - 「**让公司可被查询**」→ 案例①：问 **Lucius**（agent）社区最近的需求动态 → 让 **Claude Code** 查数据库现有字段能否接住。体现「社区对话 × 数据库 schema 一次问通」的跨表面查询。
    - 「**把动作连成闭环**」→ 案例②（**Tutti 自动审核**）：内容/账号审核 prompt 先上线跑真实审核，**给用户留申诉/抱怨口子**；申诉一回流就成闭环（类推荐算法），据此**迭代 prompt 并实测 false positive / false negative rate**。＋ 案例②b（**「让用户骂你」**）：Anthropic 在 Claude Code 埋 regex 检测「wtf / piece of shit」等词、静默记 `is_negative:true`——愤怒是最诚实的信号，早上线早被骂早知道真问题，也是一条负向反馈闭环。
    - 「**增加被动技能（Buff）**」→ 案例③：**Hermes**（bot）常驻读 Railway / Sentry 日志，遇 error log **直接开 PR**——一次装上、永久在背景生效，正是「被动技能」。
  - **为什么**：泛泛类比说服力弱。Hermes 的 log→PR 起初放在「闭环」，但它的卖点是「常驻、自动在背景生效」，更适合作「被动技能」；「闭环」改用 Tutti 审核——有用户申诉回流这条真实反馈环，更能讲清「反馈回流→自我修正」。
  - **落点**：`index.html`（query 页 lede + loop/buff 两页 `<aside class="notes">`）与 `speaker-notes.md` 同步；`FIG.query` 放射图通用，无需改动。

- **2026-06-13 · 真实案例「上墙」成卡片 + 删收口页**（已认可）
  - **决定**：把三件事的真实案例从口播 notes 显式提到幻灯片可见层，统一用 `.case-card` 卡片（mono 小标签「真实案例 · XXX」+ 标题 + 一句说明，贴在 lede 与动态图之间）。query 页 1 张、loop 页 2 张（Tutti ＋「让用户骂你」，后者用 `.hot` 红色变体）、buff 页 1 张（Hermes）。
  - **同时**：删掉原「03 · 三件事连起来 / 一个新成员入职的第一天」收口页（`speaker-notes.md` 对应段一并移除）；第三件事「被动技能（buff）」页之前被误删，已恢复。deck 顺序回到 query → loop → buff → 私货。
  - **为什么**：案例只躺在 notes 里、台下看不到；卡片让现场观众直接看到真实落地，比抽象图更有说服力。收口页是框架性总结、信息与三页重复，删掉更紧凑。
  - **落点**：`css/theme.css` 新增 `.case-row / .case-card`（含 `.c2` 双列与 `.hot` 变体）；`index.html` 三页插卡 + 收口页替换为 buff 页；`FIG.buff` 仍由 `app.js` 注册，无需改动。

---

资料来源（英文一手）：Werner Vogels · AWS re:Invent 2025；Leonardo's Cover Letter (Google Arts & Culture / Britannica)；Tomer Cohen · Full-Stack Builder。详见 `speaker-notes.md` 末尾链接。
