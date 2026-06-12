/* ============================================================
   动态 SVG 图（浏览器内代码绘制，浅色编辑风）
   每个 FIG.xxx(id) 重建静态结构并返回 play() 播放动画
   —— 配合 app.js 的 slidechanged 在进入该页时触发
   ============================================================ */
"use strict";

(function (global) {
  var NS = "http://www.w3.org/2000/svg";
  var C = {
    paper: "#FAF7F2",
    surf: "#F3EDE2",
    ink: "#1C1B1A",
    rust: "#B5462F",
    teal: "#2F6B6B",
    gold: "#C8902A",
    slate: "#4A5568",
    grey: "#8A8378",
    faint: "#D8D0C2",
  };

  function el(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  function txt(x, y, s, attrs) {
    var t = el("text", Object.assign({ x: x, y: y }, attrs || {}));
    t.textContent = s;
    return t;
  }
  function clear(id) {
    var host = document.getElementById(id);
    if (host) host.innerHTML = "";
    return host;
  }
  function dist(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }
  function reduced() {
    // print-pdf 导出时没有逐帧动画，直接渲染最终态
    return (
      /print-pdf/gi.test(window.location.search) ||
      (window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    );
  }

  // 用显式长度做 draw-on 动画，避免未布局时 getTotalLength 抛错
  function grow(line, delay, dur, len) {
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
    if (reduced()) {
      line.style.strokeDashoffset = 0;
      return;
    }
    setTimeout(function () {
      line.style.transition = "stroke-dashoffset " + (dur || 700) + "ms ease";
      requestAnimationFrame(function () {
        line.style.strokeDashoffset = 0;
      });
    }, delay || 0);
  }
  function fade(node, delay, dur) {
    node.style.opacity = 0;
    if (reduced()) {
      node.style.opacity = 1;
      return;
    }
    setTimeout(function () {
      node.style.transition = "opacity " + (dur || 500) + "ms ease";
      requestAnimationFrame(function () {
        node.style.opacity = 1;
      });
    }, delay || 0);
  }

  var FIG = {};

  // 闭环图旋转光点的 rAF 句柄：换页 / 重建时必须取消，避免在后台永远空转
  var loopRaf = null,
    loopSession = 0;
  FIG.stopLoop = function () {
    loopSession++;
    if (loopRaf) {
      cancelAnimationFrame(loopRaf);
      loopRaf = null;
    }
  };

  /* ---------- 00 分工史的拐点：title 从无到激增，再被 AI 抹平 ---------- */
  FIG.titleline = function (id) {
    var host = clear(id);
    if (!host) return function () {};
    var svg = el("svg", {
      viewBox: "0 0 1000 330",
      width: "100%",
      role: "img",
      "aria-label":
        "分工史拐点曲线：工业革命 title 激增到 1980s 顶点，AI 时代掉头向下去 title 化",
    });
    host.appendChild(svg);

    var x0 = 85,
      x1 = 938,
      yB = 266,
      yT = 46;
    var sx = function (v) {
      return x0 + (x1 - x0) * v;
    };
    var sy = function (v) {
      return yB - (yB - yT) * v;
    };

    svg.appendChild(
      el("line", {
        x1: x0,
        y1: yB,
        x2: x1,
        y2: yB,
        stroke: C.faint,
        "stroke-width": 2,
      }),
    );
    svg.appendChild(
      el("line", {
        x1: x0,
        y1: yB,
        x2: x0,
        y2: yT - 10,
        stroke: C.faint,
        "stroke-width": 2,
      }),
    );
    var yLab = txt(x0 - 16, (yB + yT) / 2, "岗位 / title 数量", {
      "text-anchor": "middle",
      "font-size": 15,
      fill: C.grey,
      "font-family": "Noto Sans SC",
    });
    yLab.setAttribute(
      "transform",
      "rotate(-90 " + (x0 - 16) + " " + (yB + yT) / 2 + ")",
    );
    svg.appendChild(yLab);

    var pts = [
      { t: 0.06, y: 0.1, era: "~1750", cap: "工业革命前\n师徒一人多艺" },
      { t: 0.22, y: 0.3, era: "1776", cap: "制针厂\n1→18 道工序" },
      { t: 0.42, y: 0.55, era: "1911", cap: "泰勒制\n规划/执行分离" },
      { t: 0.66, y: 0.92, era: "1980s", cap: "分工顶点\n职业数 ×3(324→~1000)" },
      { t: 0.82, y: 0.86, era: "2023", cap: "AI 拐点\n中层=人肉中间件" },
      { t: 0.98, y: 0.42, era: "今天→", cap: "去 title 化\n一人多岗 + agents" },
    ];
    var peakIdx = 3,
      turnIdx = 4;

    var dUp = "M " + sx(pts[0].t) + " " + sy(pts[0].y);
    for (var i = 1; i <= peakIdx; i++) {
      var p0 = pts[i - 1],
        p1 = pts[i];
      var cx = (sx(p0.t) + sx(p1.t)) / 2;
      dUp +=
        " C " +
        cx +
        " " +
        sy(p0.y) +
        ", " +
        cx +
        " " +
        sy(p1.y) +
        ", " +
        sx(p1.t) +
        " " +
        sy(p1.y);
    }
    var pathUp = el("path", {
      d: dUp,
      fill: "none",
      stroke: C.slate,
      "stroke-width": 4.5,
      "stroke-linecap": "round",
    });
    svg.appendChild(pathUp);

    var dDn = "M " + sx(pts[peakIdx].t) + " " + sy(pts[peakIdx].y);
    for (var j = peakIdx + 1; j < pts.length; j++) {
      var pp0 = pts[j - 1],
        pp1 = pts[j];
      var ccx = (sx(pp0.t) + sx(pp1.t)) / 2;
      dDn +=
        " C " +
        ccx +
        " " +
        sy(pp0.y) +
        ", " +
        ccx +
        " " +
        sy(pp1.y) +
        ", " +
        sx(pp1.t) +
        " " +
        sy(pp1.y);
    }
    var pathDn = el("path", {
      d: dDn,
      fill: "none",
      stroke: C.rust,
      "stroke-width": 5,
      "stroke-linecap": "round",
    });
    svg.appendChild(pathDn);

    var turnX = sx(pts[turnIdx].t);
    var vline = el("line", {
      x1: turnX,
      y1: yT - 6,
      x2: turnX,
      y2: yB,
      stroke: C.rust,
      "stroke-width": 1.5,
      "stroke-dasharray": "5 5",
      opacity: 0.5,
    });
    svg.appendChild(vline);

    var groups = [];
    pts.forEach(function (p, idx) {
      var g = el("g", {});
      var isTurn = idx === turnIdx,
        isPeak = idx === peakIdx,
        isDown = idx > peakIdx;
      var col = isDown ? C.rust : isPeak ? C.gold : C.slate;
      g.appendChild(
        el("circle", {
          cx: sx(p.t),
          cy: sy(p.y),
          r: isTurn || isPeak ? 8.5 : 6.5,
          fill: col,
        }),
      );
      g.appendChild(
        txt(sx(p.t), yB + 28, p.era, {
          "text-anchor": "middle",
          "font-size": 16,
          fill: C.grey,
          "font-family": "JetBrains Mono",
        }),
      );
      var lines = p.cap.split("\n");
      var baseY = isPeak
        ? sy(p.y) - 23 - (lines.length - 1) * 18
        : isDown
          ? sy(p.y) + 30
          : sy(p.y) - 23 - (lines.length - 1) * 18;
      lines.forEach(function (ln, k) {
        var anchor = idx === pts.length - 1 ? "end" : "middle";
        var lx = idx === pts.length - 1 ? sx(p.t) + 6 : sx(p.t);
        g.appendChild(
          txt(lx, baseY + k * 18, ln, {
            "text-anchor": anchor,
            "font-size": k === 0 ? 16 : 14,
            fill: k === 0 ? (isDown ? C.rust : C.ink) : C.slate,
            "font-family": "Noto Sans SC",
            "font-weight": k === 0 ? 700 : 400,
          }),
        );
      });
      svg.appendChild(g);
      groups.push(g);
    });

    var labUp = txt(sx(0.3), yT - 18, "工业革命 · 分工越分越细 → title 激增", {
      "text-anchor": "middle",
      "font-size": 16,
      fill: C.slate,
      "font-family": "Noto Serif SC",
      "font-weight": 700,
    });
    var labDn = txt(sx(0.9), yT - 18, "AI 时代 · 去 title 化", {
      "text-anchor": "middle",
      "font-size": 16,
      fill: C.rust,
      "font-family": "Noto Serif SC",
      "font-weight": 700,
    });
    svg.appendChild(labUp);
    svg.appendChild(labDn);

    var pathLen = function (path) {
      try {
        return path.getTotalLength();
      } catch (_error) {
        return 1000;
      }
    };

    return function () {
      grow(pathUp, 0, 1500, pathLen(pathUp));
      fade(labUp, 200, 500);
      groups.slice(0, peakIdx + 1).forEach(function (g, idx) {
        fade(g, 300 + idx * 360, 500);
      });
      fade(vline, 1600, 500);
      grow(pathDn, 1700, 1200, pathLen(pathDn));
      fade(labDn, 1900, 500);
      groups.slice(peakIdx + 1).forEach(function (g, idx) {
        fade(g, 2000 + idx * 420, 500);
      });
    };
  };

  /* ---------- 00b 大扁平化：削层从管理学趋势变成 AI 加速趋势 ---------- */
  FIG.flatten = function (id) {
    var host = clear(id);
    if (!host) return function () {};
    var svg = el("svg", {
      viewBox: "0 0 1000 360",
      width: "100%",
      role: "img",
      "aria-label": "大扁平化趋势：从 span of control 到 AI 加速削层",
    });
    var x0 = 82,
      x1 = 918,
      yLine = 130;
    var axis = el("line", {
      x1: x0,
      y1: yLine,
      x2: x1,
      y2: yLine,
      stroke: C.faint,
      "stroke-width": 3,
    });
    svg.appendChild(axis);

    var ms = [
      {
        t: 0.04,
        yr: "1920s",
        head: "span of control",
        sub: "管理跨度成为组织设计指标",
        col: C.slate,
        up: true,
      },
      {
        t: 0.42,
        yr: "1980-90s",
        head: "delayering",
        sub: "重组 / 流程再造削掉一波层级",
        col: C.slate,
        up: false,
      },
      {
        t: 0.7,
        yr: "2023",
        head: "效率之年",
        sub: "硅谷转向：少层级、快决策",
        col: C.gold,
        up: true,
      },
      {
        t: 0.96,
        yr: "2024-26",
        head: "AI 加速",
        sub: "削层从趋势变成默认动作",
        col: C.rust,
        up: false,
      },
    ];
    var groups = [];
    ms.forEach(function (m, i) {
      var g = el("g", {});
      var cx = x0 + (x1 - x0) * m.t;
      g.appendChild(
        el("circle", { cx: cx, cy: yLine, r: i >= 2 ? 9 : 7, fill: m.col }),
      );
      g.appendChild(
        txt(cx, m.up ? yLine + 28 : yLine - 18, m.yr, {
          "text-anchor": "middle",
          "font-size": 14,
          fill: C.grey,
          "font-family": "JetBrains Mono",
        }),
      );
      var baseY = m.up ? yLine - 46 : yLine + 50;
      var anchor = i === ms.length - 1 ? "end" : i === 0 ? "start" : "middle";
      var tx = i === ms.length - 1 ? cx + 8 : i === 0 ? cx - 6 : cx;
      g.appendChild(
        txt(tx, baseY, m.head, {
          "text-anchor": anchor,
          "font-size": 16,
          "font-weight": 700,
          fill: i >= 3 ? C.rust : C.ink,
          "font-family": "Noto Serif SC",
        }),
      );
      g.appendChild(
        txt(tx, baseY + (m.up ? -21 : 21), m.sub, {
          "text-anchor": anchor,
          "font-size": 12.5,
          fill: C.slate,
          "font-family": "Noto Sans SC",
        }),
      );
      svg.appendChild(g);
      groups.push(g);
    });

    var stats = [
      { x: 190, n: "5 → 15", l: "单个经理管理跨度变宽" },
      { x: 415, n: "+50%", l: "Gallup: 每位经理下属数上升" },
      { x: 640, n: "20% / 50%+", l: "Gartner: 组织用 AI 削掉过半中层" },
      { x: 835, n: "98 次", l: "财报会反复提到削管理层级" },
    ];
    var statGs = [];
    stats.forEach(function (s) {
      var g = el("g", {});
      g.appendChild(
        el("rect", {
          x: s.x - 88,
          y: 238,
          width: 176,
          height: 74,
          rx: 10,
          fill: "#fff",
          stroke: C.faint,
          "stroke-width": 1.3,
        }),
      );
      g.appendChild(
        txt(s.x, 266, s.n, {
          "text-anchor": "middle",
          "font-size": 21,
          "font-weight": 900,
          fill: C.rust,
          "font-family": "Noto Serif SC",
        }),
      );
      g.appendChild(
        txt(s.x, 292, s.l, {
          "text-anchor": "middle",
          "font-size": 11.5,
          fill: C.slate,
          "font-family": "Noto Sans SC",
        }),
      );
      svg.appendChild(g);
      statGs.push(g);
    });
    var claim = txt(
      500,
      342,
      "AI 没有发明扁平化，但第一次让“少几层、管更多人”具备技术可行性",
      {
        "text-anchor": "middle",
        "font-size": 14,
        "font-weight": 700,
        fill: C.ink,
        "font-family": "Noto Sans SC",
      },
    );
    svg.appendChild(claim);
    host.appendChild(svg);

    return function () {
      fade(axis, 0, 400);
      groups.forEach(function (g, i) {
        fade(g, 240 + i * 260, 480);
      });
      statGs.forEach(function (g, i) {
        fade(g, 1200 + i * 120, 420);
      });
      fade(claim, 1750, 500);
    };
  };

  /* ---------- 00c 管理跨度的百年拉宽：4.4 → 7.2 → 12.1 → 60 ---------- */
  FIG.span = function (id) {
    var host = clear(id);
    if (!host) return function () {};
    var svg = el("svg", {
      viewBox: "0 0 1000 200",
      width: "100%",
      role: "img",
      "aria-label":
        "管理跨度的百年趋势：1986 年 4.4，1999 年 7.2，2025 年 12.1，黄仁勋约 60 名直接下属",
    });
    host.appendChild(svg);

    var data = [
      { label: "1986", v: 4.4, note: "CEO 平均直接下属", color: C.slate },
      { label: "1999", v: 7.2, note: "+64%", color: C.teal },
      { label: "2025", v: 12.1, note: "Gallup 管理者均值", color: C.gold },
      { label: "黄仁勋", v: 60, note: "Nvidia CEO · 约 55–60", color: C.rust },
    ];
    var x0 = 118,
      x1 = 918,
      y0 = 180,
      max = 60;
    var rowGap = 42;
    svg.appendChild(
      el("line", {
        x1: x0,
        y1: y0 + 12,
        x2: x1,
        y2: y0 + 12,
        stroke: C.faint,
        "stroke-width": 1.4,
      }),
    );

    var groups = [];
    data.forEach(function (d, i) {
      var y = 26 + i * rowGap;
      var w = ((x1 - x0) * d.v) / max;
      var g = el("g", {});
      g.appendChild(
        txt(x0 - 20, y + 22, d.label, {
          "text-anchor": "end",
          "font-size": 15,
          fill: C.grey,
          "font-family": "JetBrains Mono",
        }),
      );
      g.appendChild(
        el("rect", {
          x: x0,
          y: y,
          width: x1 - x0,
          height: 28,
          rx: 5,
          fill: C.surf,
        }),
      );
      var bar = el("rect", {
        x: x0,
        y: y,
        width: 0,
        height: 28,
        rx: 5,
        fill: d.color,
      });
      g.appendChild(bar);
      g.appendChild(
        txt(x0 + Math.max(w, 54) + 14, y + 21, d.v + " 人", {
          "text-anchor": "start",
          "font-size": 20,
          "font-weight": 900,
          fill: d.color,
          "font-family": "Noto Serif SC",
        }),
      );
      g.appendChild(
        txt(x0 + Math.max(w, 54) + 86, y + 20, d.note, {
          "text-anchor": "start",
          "font-size": 13,
          fill: C.slate,
          "font-family": "Noto Sans SC",
        }),
      );
      svg.appendChild(g);
      groups.push({ g: g, bar: bar, w: w, i: i });
    });

    var callout = el("g", {});
    callout.appendChild(
      el("rect", {
        x: 596,
        y: 100,
        width: 316,
        height: 42,
        rx: 10,
        fill: "#F7EAE5",
        stroke: C.rust,
        "stroke-width": 1.2,
      }),
    );
    callout.appendChild(
      txt(614, 126, "60 个直接下属 ≈ 砍掉约 7 层管理", {
        "text-anchor": "start",
        "font-size": 15.5,
        "font-weight": 700,
        fill: C.rust,
        "font-family": "Noto Sans SC",
      }),
    );
    svg.appendChild(callout);

    return function () {
      groups.forEach(function (item) {
        item.g.style.opacity = 0;
        fade(item.g, 220 + item.i * 180, 360);
        if (reduced()) {
          item.bar.setAttribute("width", item.w);
        } else {
          setTimeout(
            function () {
              item.bar.style.transition =
                "width 720ms cubic-bezier(.22,.61,.36,1)";
              item.bar.setAttribute("width", item.w);
            },
            360 + item.i * 180,
          );
        }
      });
      fade(callout, 1200, 420);
    };
  };

  /* ---------- 00c 执行者 → 编排者：人从做环节变成管闭环 ---------- */
  FIG.orch = function (id) {
    var host = clear(id);
    if (!host) return function () {};
    var svg = el("svg", {
      viewBox: "0 0 1000 320",
      width: "100%",
      role: "img",
      "aria-label": "人的角色从执行者转为编排者",
    });
    var defs = el("defs", {});
    var mk = el("marker", {
      id: "orch-arrow",
      viewBox: "0 0 10 10",
      refX: 8,
      refY: 5,
      markerWidth: 7,
      markerHeight: 7,
      orient: "auto-start-reverse",
    });
    mk.appendChild(el("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: C.rust }));
    defs.appendChild(mk);
    svg.appendChild(defs);

    var lx = 180,
      ly = 162;
    var gL = el("g", {});
    gL.appendChild(
      txt(lx, 46, "过去 · 执行者", {
        "text-anchor": "middle",
        "font-size": 17,
        "font-weight": 700,
        fill: C.slate,
        "font-family": "Noto Serif SC",
      }),
    );
    gL.appendChild(
      txt(lx, 69, "一个人亲自完成多个环节", {
        "text-anchor": "middle",
        "font-size": 12.5,
        fill: C.grey,
        "font-family": "Noto Sans SC",
      }),
    );
    gL.appendChild(
      el("circle", {
        cx: lx,
        cy: ly,
        r: 31,
        fill: "none",
        stroke: C.slate,
        "stroke-width": 3,
      }),
    );
    gL.appendChild(
      txt(lx, ly + 6, "人", {
        "text-anchor": "middle",
        "font-size": 18,
        "font-weight": 700,
        fill: C.slate,
        "font-family": "Noto Serif SC",
      }),
    );
    [100, 140, 180, 220].forEach(function (ty) {
      gL.appendChild(
        el("line", {
          x1: lx + 30,
          y1: ly,
          x2: lx + 84,
          y2: ty,
          stroke: C.faint,
          "stroke-width": 2,
        }),
      );
      gL.appendChild(
        el("rect", {
          x: lx + 84,
          y: ty - 14,
          width: 68,
          height: 28,
          rx: 6,
          fill: C.surf,
          stroke: C.faint,
          "stroke-width": 1.4,
        }),
      );
      gL.appendChild(
        txt(lx + 118, ty + 5, "环节", {
          "text-anchor": "middle",
          "font-size": 12.5,
          fill: C.slate,
          "font-family": "Noto Sans SC",
        }),
      );
    });

    var arrow = el("path", {
      d: "M 435 162 L 562 162",
      fill: "none",
      stroke: C.rust,
      "stroke-width": 3,
      "marker-end": "url(#orch-arrow)",
    });
    svg.appendChild(arrow);
    var arrLab = txt(500, 146, "AI 接走执行", {
      "text-anchor": "middle",
      "font-size": 13,
      fill: C.rust,
      "font-family": "JetBrains Mono",
    });

    var rx = 760,
      ry = 162;
    var gR = el("g", {});
    gR.appendChild(
      txt(rx, 46, "现在 · 编排者", {
        "text-anchor": "middle",
        "font-size": 17,
        "font-weight": 700,
        fill: C.teal,
        "font-family": "Noto Serif SC",
      }),
    );
    gR.appendChild(
      txt(rx, 69, "定目标 · 审产出 · 闭环纠偏", {
        "text-anchor": "middle",
        "font-size": 12.5,
        fill: C.grey,
        "font-family": "Noto Sans SC",
      }),
    );
    gR.appendChild(
      el("circle", {
        cx: rx - 136,
        cy: ry,
        r: 31,
        fill: "none",
        stroke: C.teal,
        "stroke-width": 3,
      }),
    );
    gR.appendChild(
      txt(rx - 136, ry + 6, "人", {
        "text-anchor": "middle",
        "font-size": 18,
        "font-weight": 700,
        fill: C.teal,
        "font-family": "Noto Serif SC",
      }),
    );
    [100, 140, 180, 220].forEach(function (ay, i) {
      var ax = rx - 42;
      gR.appendChild(
        el("line", {
          x1: rx - 106,
          y1: ry,
          x2: ax,
          y2: ay,
          stroke: C.teal,
          "stroke-width": 2,
          opacity: 0.55,
        }),
      );
      gR.appendChild(
        el("rect", {
          x: ax,
          y: ay - 14,
          width: 94,
          height: 28,
          rx: 14,
          fill: "#fff",
          stroke: C.teal,
          "stroke-width": 1.6,
        }),
      );
      gR.appendChild(
        txt(ax + 47, ay + 5, "agent " + (i + 1), {
          "text-anchor": "middle",
          "font-size": 12.5,
          fill: C.teal,
          "font-family": "JetBrains Mono",
        }),
      );
    });
    gR.appendChild(el("circle", { cx: rx - 48, cy: 100, r: 6, fill: C.gold }));
    gR.appendChild(
      txt(rx + 58, 105, "HITL 关键点人工审批", {
        "text-anchor": "start",
        "font-size": 12.5,
        fill: C.gold,
        "font-family": "Noto Sans SC",
      }),
    );
    var claim = txt(
      500,
      302,
      "去 title 化的结果：人不再被固定在某一环，而是围绕结果临时组织环节",
      {
        "text-anchor": "middle",
        "font-size": 14,
        "font-weight": 700,
        fill: C.ink,
        "font-family": "Noto Sans SC",
      },
    );
    svg.appendChild(gL);
    svg.appendChild(arrLab);
    svg.appendChild(gR);
    svg.appendChild(claim);
    host.appendChild(svg);

    return function () {
      fade(gL, 120, 520);
      grow(arrow, 650, 700, 127);
      fade(arrLab, 760, 420);
      fade(gR, 1050, 560);
      fade(claim, 1550, 520);
    };
  };

  /* ---------- 01 让公司可被查询（放射查询图） ---------- */
  FIG.query = function (id) {
    var host = clear(id);
    if (!host) return function () {};
    var svg = el("svg", {
      viewBox: "0 0 1000 380",
      width: "100%",
      role: "img",
      "aria-label": "把公司变得可查询：一次提问，散落各处的知识被即时调出",
    });
    var cx = 500,
      cy = 178;
    var coreW = 176,
      coreH = 58;
    var core = el("rect", {
      x: cx - coreW / 2,
      y: cy - coreH / 2,
      width: coreW,
      height: coreH,
      rx: 12,
      fill: C.ink,
    });
    svg.appendChild(core);
    var coreT1 = txt(cx, cy - 4, "一次提问", {
      fill: "#fff",
      "font-size": 18,
      "font-weight": 700,
      "text-anchor": "middle",
      "font-family": "Noto Sans SC",
    });
    var coreT2 = txt(cx, cy + 17, "人 / agent", {
      fill: C.gold,
      "font-size": 12.5,
      "text-anchor": "middle",
      "font-family": "JetBrains Mono",
    });
    svg.appendChild(coreT1);
    svg.appendChild(coreT2);

    var nodes = [
      { a: -152, r: 255, label: "文档 / Wiki" },
      { a: -96, r: 270, label: "代码库" },
      { a: -30, r: 260, label: "客户对话" },
      { a: 30, r: 260, label: "指标 / 数据" },
      { a: 96, r: 270, label: "流程 / SOP" },
      { a: 152, r: 255, label: "历史决策" },
    ];
    var anim = [];
    nodes.forEach(function (n, i) {
      var rad = (n.a * Math.PI) / 180;
      var nx = cx + Math.cos(rad) * n.r;
      var ny = cy + Math.sin(rad) * n.r * 0.6;
      var ln = el("line", {
        x1: cx,
        y1: cy,
        x2: nx,
        y2: ny,
        stroke: C.teal,
        "stroke-width": 1.6,
        "stroke-opacity": 0.55,
      });
      svg.appendChild(ln);
      var g = el("g", {});
      g.appendChild(
        el("circle", {
          cx: nx,
          cy: ny,
          r: 7,
          fill: C.paper,
          stroke: C.teal,
          "stroke-width": 2,
        }),
      );
      g.appendChild(
        txt(nx, ny - 16, n.label, {
          fill: C.slate,
          "font-size": 14,
          "text-anchor": "middle",
          "font-family": "Noto Sans SC",
        }),
      );
      svg.appendChild(g);
      anim.push({ ln: ln, g: g, len: dist(cx, cy, nx, ny), i: i });
    });
    var foot = txt(cx, 366, "散落各处的知识 → 被即时调出、能被追问", {
      fill: C.grey,
      "font-size": 14,
      "text-anchor": "middle",
      "font-family": "Noto Sans SC",
    });
    svg.appendChild(foot);
    host.appendChild(svg);

    return function () {
      core.style.opacity = 0;
      fade(core, 0);
      fade(coreT1, 120);
      fade(coreT2, 120);
      anim.forEach(function (a) {
        grow(a.ln, 500 + a.i * 110, 600, a.len);
        fade(a.g, 900 + a.i * 110, 500);
      });
      fade(foot, 1700);
    };
  };

  /* ---------- 02 把动作连成闭环 ---------- */
  FIG.loop = function (id) {
    var host = clear(id);
    if (!host) return function () {};
    var svg = el("svg", {
      viewBox: "0 0 1000 380",
      width: "100%",
      role: "img",
      "aria-label": "闭环：执行、反馈、学习、改进，循环自我强化",
    });
    var cx = 500,
      cy = 185,
      R = 122;
    svg.appendChild(
      el("circle", {
        cx: cx,
        cy: cy,
        r: R,
        fill: "none",
        stroke: C.faint,
        "stroke-width": 2,
      }),
    );
    var arc = el("circle", {
      cx: cx,
      cy: cy,
      r: R,
      fill: "none",
      stroke: C.teal,
      "stroke-width": 3,
      "stroke-linecap": "round",
      transform: "rotate(-90 " + cx + " " + cy + ")",
    });
    svg.appendChild(arc);

    var steps = [
      { a: -90, label: "执行", sub: "do", color: C.ink },
      { a: 0, label: "反馈", sub: "measure", color: C.teal },
      { a: 90, label: "学习", sub: "learn", color: C.gold },
      { a: 180, label: "改进", sub: "improve", color: C.rust },
    ];
    var groups = [];
    steps.forEach(function (s) {
      var rad = (s.a * Math.PI) / 180;
      var nx = cx + Math.cos(rad) * R;
      var ny = cy + Math.sin(rad) * R;
      var g = el("g", {});
      g.appendChild(
        el("circle", {
          cx: nx,
          cy: ny,
          r: 32,
          fill: "#fff",
          stroke: s.color,
          "stroke-width": 2.5,
        }),
      );
      g.appendChild(
        txt(nx, ny + 1, s.label, {
          fill: s.color,
          "font-size": 16,
          "font-weight": 700,
          "text-anchor": "middle",
          "font-family": "Noto Sans SC",
        }),
      );
      g.appendChild(
        txt(nx, ny + 19, s.sub, {
          fill: C.grey,
          "font-size": 10,
          "text-anchor": "middle",
          "font-family": "JetBrains Mono",
        }),
      );
      svg.appendChild(g);
      groups.push(g);
    });
    var cT1 = txt(cx, cy - 6, "闭环", {
      fill: C.ink,
      "font-size": 19,
      "font-weight": 900,
      "text-anchor": "middle",
      "font-family": "Noto Serif SC",
    });
    var cT2 = txt(cx, cy + 16, "self-reinforcing", {
      fill: C.grey,
      "font-size": 11,
      "text-anchor": "middle",
      "font-family": "JetBrains Mono",
    });
    svg.appendChild(cT1);
    svg.appendChild(cT2);
    var dot = el("circle", { r: 5, fill: C.rust });
    svg.appendChild(dot);
    var foot = txt(cx, 366, "每一圈都让下一圈更快、更准 —— 不是一次性动作", {
      fill: C.grey,
      "font-size": 14,
      "text-anchor": "middle",
      "font-family": "Noto Sans SC",
    });
    svg.appendChild(foot);
    host.appendChild(svg);

    return function () {
      FIG.stopLoop();
      var session = loopSession;
      grow(arc, 200, 1400, 2 * Math.PI * R);
      groups.forEach(function (g, i) {
        fade(g, 500 + i * 260, 450);
      });
      fade(cT1, 1400);
      fade(cT2, 1400);
      fade(foot, 1800);
      if (reduced()) {
        dot.setAttribute("cx", cx);
        dot.setAttribute("cy", cy - R);
        return;
      }
      var t0 = null;
      function spin(ts) {
        if (session !== loopSession) return;
        if (t0 === null) t0 = ts;
        var ang = ((ts - t0) / 3200) * Math.PI * 2 - Math.PI / 2;
        dot.setAttribute("cx", cx + Math.cos(ang) * R);
        dot.setAttribute("cy", cy + Math.sin(ang) * R);
        loopRaf = requestAnimationFrame(spin);
      }
      setTimeout(function () {
        if (session !== loopSession) return;
        loopRaf = requestAnimationFrame(spin);
      }, 1600);
    };
  };

  /* ---------- 03 增加被动技能 / Buff 层叠加成 ---------- */
  FIG.buff = function (id) {
    var host = clear(id);
    if (!host) return function () {};
    var svg = el("svg", {
      viewBox: "0 0 1000 360",
      width: "100%",
      role: "img",
      "aria-label": "被动技能：每加一个能力，公司基线持续抬高，叠加生效",
    });
    var baseY = 300,
      x0 = 130,
      barW = 100,
      gap = 56;
    var bars = [
      {
        label: "基线",
        h: 72,
        fill: C.faint,
        tc: C.slate,
        note: "人工 · 一次性",
      },
      {
        label: "+ 自动化",
        h: 124,
        fill: C.teal,
        tc: "#fff",
        note: "重复活儿自动跑",
      },
      {
        label: "+ Agent",
        h: 174,
        fill: C.gold,
        tc: C.ink,
        note: "7×24 自主执行",
      },
      { label: "+ 记忆", h: 226, fill: C.rust, tc: "#fff", note: "越用越懂你" },
      {
        label: "+ 闭环",
        h: 280,
        fill: C.ink,
        tc: "#fff",
        note: "持续自我强化",
      },
    ];
    svg.appendChild(
      el("line", {
        x1: 80,
        y1: baseY,
        x2: 920,
        y2: baseY,
        stroke: C.faint,
        "stroke-width": 2,
      }),
    );

    var rects = [];
    bars.forEach(function (b, i) {
      var x = x0 + i * (barW + gap);
      var rect = el("rect", {
        x: x,
        y: baseY,
        width: barW,
        height: 0,
        rx: 8,
        fill: b.fill,
      });
      svg.appendChild(rect);
      svg.appendChild(
        txt(x + barW / 2, baseY + 22, b.label, {
          fill: C.ink,
          "font-size": 14,
          "font-weight": 700,
          "text-anchor": "middle",
          "font-family": "Noto Sans SC",
        }),
      );
      svg.appendChild(
        txt(x + barW / 2, baseY + 40, b.note, {
          fill: C.grey,
          "font-size": 11,
          "text-anchor": "middle",
          "font-family": "Noto Sans SC",
        }),
      );
      var val = txt(x + barW / 2, baseY - b.h + 24, b.label.replace("+ ", ""), {
        fill: b.tc,
        "font-size": 13,
        "font-weight": 700,
        "text-anchor": "middle",
        "font-family": "Noto Sans SC",
      });
      val.style.opacity = 0;
      svg.appendChild(val);
      rects.push({ rect: rect, b: b, val: val, i: i });
    });

    var pts = bars.map(function (b, i) {
      return { x: x0 + i * (barW + gap) + barW / 2, y: baseY - b.h - 10 };
    });
    var trendLen = 0;
    for (var p = 1; p < pts.length; p++)
      trendLen += dist(pts[p - 1].x, pts[p - 1].y, pts[p].x, pts[p].y);
    var trend = el("polyline", {
      points: pts
        .map(function (p) {
          return p.x + "," + p.y;
        })
        .join(" "),
      fill: "none",
      stroke: C.rust,
      "stroke-width": 2,
      "stroke-opacity": 0.7,
    });
    svg.appendChild(trend);
    host.appendChild(svg);

    return function () {
      rects.forEach(function (r) {
        r.rect.setAttribute("height", 0);
        r.rect.setAttribute("y", baseY);
        r.val.style.opacity = 0;
        if (reduced()) {
          r.rect.setAttribute("height", r.b.h);
          r.rect.setAttribute("y", baseY - r.b.h);
          r.val.style.opacity = 1;
          return;
        }
        setTimeout(
          function () {
            r.rect.style.transition =
              "height 650ms cubic-bezier(.22,.61,.36,1), y 650ms cubic-bezier(.22,.61,.36,1)";
            r.rect.setAttribute("height", r.b.h);
            r.rect.setAttribute("y", baseY - r.b.h);
            r.val.style.transition = "opacity 400ms ease 350ms";
            r.val.style.opacity = 1;
          },
          400 + r.i * 220,
        );
      });
      grow(trend, 1400, 900, trendLen);
    };
  };

  /* ---------- 04 达·芬奇 ↔ 文艺复兴式 Builder 人才对照 ---------- */
  FIG.talent = function (id) {
    var host = clear(id);
    if (!host) return function () {};
    var svg = el("svg", {
      viewBox: "0 0 1000 400",
      width: "100%",
      role: "img",
      "aria-label":
        "达·芬奇与 AI Native 人才对照：稀缺的始终是能把一件事整个做成的人",
    });
    // 两栏
    var cols = [
      {
        x: 250,
        tag: "文艺复兴 · 1482",
        name: "达·芬奇",
        color: C.gold,
        dark: false,
        rows: [
          { k: "身份", v: "画家 · 工程师 · 解剖 · 水利 · 舞台" },
          { k: "为何稀缺", v: "能在多领域之间架桥，把问题从头做到尾" },
          { k: "他的杠杆", v: "梅迪奇家族、米兰宫廷 —— 资金与「算力」" },
        ],
      },
      {
        x: 750,
        tag: "AI NATIVE · 2026",
        name: "超级个体：文艺复兴式 Builder",
        color: C.teal,
        dark: true,
        rows: [
          { k: "身份", v: "好奇 · 敢试 · 会沟通 · 担责 · T 型" },
          { k: "为何稀缺", v: "执行被 AI 接管，稀缺的是看懂 / 判对 / 担责" },
          { k: "他的杠杆", v: "一群并行的 AI agent —— 今天的「算力」" },
        ],
      },
    ];
    var groups = [];
    cols.forEach(function (c, ci) {
      var g = el("g", {});
      // 顶部标签 + 名字
      g.appendChild(
        txt(c.x, 56, c.tag, {
          fill: c.color,
          "font-size": 13,
          "font-weight": 700,
          "text-anchor": "middle",
          "font-family": "JetBrains Mono",
          "letter-spacing": "1.5",
        }),
      );
      g.appendChild(
        txt(c.x, 96, c.name, {
          fill: C.ink,
          "font-size": 26,
          "font-weight": 900,
          "text-anchor": "middle",
          "font-family": "Noto Serif SC",
        }),
      );
      // 三行
      c.rows.forEach(function (r, ri) {
        var ry = 150 + ri * 78;
        g.appendChild(
          txt(c.x, ry, r.k, {
            fill: C.rust,
            "font-size": 12.5,
            "font-weight": 700,
            "text-anchor": "middle",
            "font-family": "Noto Sans SC",
          }),
        );
        g.appendChild(
          txt(c.x, ry + 26, r.v, {
            fill: C.slate,
            "font-size": 14,
            "text-anchor": "middle",
            "font-family": "Noto Sans SC",
          }),
        );
      });
      svg.appendChild(g);
      groups.push(g);
    });
    // 中缝竖线
    var divider = el("line", {
      x1: 500,
      y1: 40,
      x2: 500,
      y2: 330,
      stroke: C.faint,
      "stroke-width": 1.5,
    });
    svg.appendChild(divider);
    // 底部「不变的」横贯
    var band = el("g", {});
    band.appendChild(
      el("rect", {
        x: 120,
        y: 352,
        width: 760,
        height: 36,
        rx: 10,
        fill: C.surf,
      }),
    );
    band.appendChild(
      txt(500, 375, "不变的 —— 判断什么值得做、怎么做对，始终是「人」的位置", {
        fill: C.ink,
        "font-size": 14,
        "font-weight": 700,
        "text-anchor": "middle",
        "font-family": "Noto Sans SC",
      }),
    );
    svg.appendChild(band);
    groups.push(band);
    host.appendChild(svg);

    return function () {
      fade(divider, 100, 500);
      groups.forEach(function (g, i) {
        fade(g, 250 + i * 260, 520);
      });
    };
  };

  global.FIG = FIG;
})(window);
