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

1. **封面**
2. **去「Title」化** —— 组织里只剩两种角色：唯一负责人 / 只做一环的执行者
3. **需要什么样的人** —— 五百年前的简历 → 达·芬奇 ↔ 文艺复兴式 Builder 对照 → 六项特质
4. **搭建 AI Native 公司** —— 让公司可被查询 / 把动作连成闭环 / 增加被动技能（三张动态图）
5. **写在最后的私货** —— 私货 1 / 2 / 3 / 5 / 6

## 动态图说明

`js/figures.js` 里 4 张图全部由浏览器内 JS 代码实时绘制 SVG，无图片依赖：

- `FIG.talent` —— 达·芬奇 ↔ Builder 人才对照
- `FIG.query` —— 放射查询图（make it queryable）
- `FIG.loop` —— 闭环（含旋转光点）
- `FIG.buff` —— 被动技能层叠加成柱状图 + 上扬趋势线

每次进入对应幻灯片时，`app.js` 会重建并重新播放该页动画（翻回来也会重播）。已尊重 `prefers-reduced-motion`。

## 字体

幻灯片优先用 Google Fonts 的 Noto Serif SC / Noto Sans SC / JetBrains Mono；**离线时自动回退**到系统中文字体（macOS 的苹方 / 宋体，Windows 的微软雅黑），排版不受影响。

## 想换成 PDF？

```bash
# 浏览器打开 index.html?print-pdf 后用「打印 → 另存为 PDF」（A4 横向、无边距、开启背景图形）
```

---

资料来源（英文一手）：Werner Vogels · AWS re:Invent 2025；Leonardo's Cover Letter (Google Arts & Culture / Britannica)；Tomer Cohen · Full-Stack Builder。详见 `speaker-notes.md` 末尾链接。
