/* ============================================================
   动态 SVG 图（浏览器内代码绘制，浅色编辑风）
   每个 FIG.xxx(id) 重建静态结构并返回 play() 播放动画
   —— 配合 app.js 的 slidechanged 在进入该页时触发
   ============================================================ */
'use strict';

(function (global) {
  var NS = 'http://www.w3.org/2000/svg';
  var C = {
    paper:'#FAF7F2', surf:'#F3EDE2', ink:'#1C1B1A', rust:'#B5462F',
    teal:'#2F6B6B', gold:'#C8902A', slate:'#4A5568', grey:'#8A8378', faint:'#D8D0C2'
  };

  function el(tag, attrs){
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  function txt(x, y, s, attrs){
    var t = el('text', Object.assign({x:x, y:y}, attrs || {}));
    t.textContent = s;
    return t;
  }
  function clear(id){
    var host = document.getElementById(id);
    if (host) host.innerHTML = '';
    return host;
  }
  function dist(x1,y1,x2,y2){ return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)); }
  function reduced(){ return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  // 用显式长度做 draw-on 动画，避免未布局时 getTotalLength 抛错
  function grow(line, delay, dur, len){
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
    if (reduced()){ line.style.strokeDashoffset = 0; return; }
    setTimeout(function(){
      line.style.transition = 'stroke-dashoffset ' + (dur||700) + 'ms ease';
      requestAnimationFrame(function(){ line.style.strokeDashoffset = 0; });
    }, delay || 0);
  }
  function fade(node, delay, dur){
    node.style.opacity = 0;
    if (reduced()){ node.style.opacity = 1; return; }
    setTimeout(function(){
      node.style.transition = 'opacity ' + (dur||500) + 'ms ease';
      requestAnimationFrame(function(){ node.style.opacity = 1; });
    }, delay || 0);
  }

  var FIG = {};

  /* ---------- 00 分工史的拐点：title 从无到激增，再被 AI 抹平 ---------- */
  FIG.titleline = function(id){
    var host = clear(id); if (!host) return function(){};
    var svg = el('svg', {viewBox:'0 0 1000 420', width:'100%', role:'img',
      'aria-label':'分工史时间轴：制针厂分工 → 工业革命 title 激增 → 知识工作 title 通胀 → AI 去 title 化'});
    var baseY = 250, x0 = 80, x1 = 920;
    // 主轴
    var axis = el('line', {x1:x0, y1:baseY, x2:x1, y2:baseY, stroke:C.faint, 'stroke-width':2});
    svg.appendChild(axis);
    var head = el('path', {d:'M'+(x1-2)+','+(baseY-6)+' L'+(x1+10)+','+baseY+' L'+(x1-2)+','+(baseY+6)+' Z', fill:C.grey});
    svg.appendChild(head);

    // 节点：x 位置 + title「层数」高度（柱），讲清「激增→通胀→塌缩」
    var nodes = [
      {x:170, yr:0.10, era:'1776', t:'制针厂 · 分工', d:'一人一道工序', layers:1, color:C.slate},
      {x:410, yr:0.92, era:'1900s', t:'工业革命 · 泰勒制', d:'借军队层级：经理 / 总监 / VP', layers:5, color:C.rust},
      {x:620, yr:0.70, era:'1960s+', t:'知识工作', d:'头衔与实际工作脱钩 · title 通胀', layers:4, color:C.gold},
      {x:840, yr:0.16, era:'AI Native', t:'大扁平化', d:'中间层被抽掉 · 去 title 化', layers:1, color:C.teal}
    ];
    var maxH = 150;
    // title「层数」面积曲线（先涨后落）——用 polyline 勾出「金字塔膨胀→塌缩」
    var top = nodes.map(function(n){ return {x:n.x, y:baseY - n.yr*maxH}; });
    var curveLen = 0;
    for (var c=1;c<top.length;c++) curveLen += dist(top[c-1].x,top[c-1].y,top[c].x,top[c].y);
    var curve = el('polyline', {points: top.map(function(p){return p.x+','+p.y;}).join(' '),
      fill:'none', stroke:C.rust, 'stroke-width':2.5, 'stroke-opacity':0.55, 'stroke-linejoin':'round'});
    svg.appendChild(curve);
    // 顶部曲线注解
    var crest = txt(410, baseY - 0.92*maxH - 14, 'title 层数', {fill:C.rust,'font-size':12,'text-anchor':'middle','font-family':'Noto Sans SC','font-weight':700});
    svg.appendChild(crest);

    var groups = [];
    nodes.forEach(function(n){
      var g = el('g', {});
      var ny = baseY - n.yr*maxH;
      // 竖向「层」标记
      g.appendChild(el('line', {x1:n.x, y1:baseY, x2:n.x, y2:ny, stroke:n.color, 'stroke-width':2, 'stroke-opacity':0.5}));
      // 节点圆
      g.appendChild(el('circle', {cx:n.x, cy:baseY, r:7, fill:C.paper, stroke:n.color, 'stroke-width':2.5}));
      // 年代（轴上方小标）
      g.appendChild(txt(n.x, ny-26, n.era, {fill:n.color,'font-size':13,'font-weight':700,'text-anchor':'middle','font-family':'JetBrains Mono','letter-spacing':'0.5'}));
      // 标题 + 描述（轴下方）
      g.appendChild(txt(n.x, baseY+30, n.t, {fill:C.ink,'font-size':16,'font-weight':700,'text-anchor':'middle','font-family':'Noto Sans SC'}));
      g.appendChild(txt(n.x, baseY+52, n.d, {fill:C.slate,'font-size':12.5,'text-anchor':'middle','font-family':'Noto Sans SC'}));
      svg.appendChild(g); groups.push(g);
    });
    // 底部一句话
    var foot = txt(500, baseY+96, 'Title 是「分工」的副产品 —— 分工层级越多，头衔越多；AI 抽掉中间层，头衔随之失重',
      {fill:C.grey,'font-size':13.5,'text-anchor':'middle','font-family':'Noto Sans SC'});
    svg.appendChild(foot);
    host.appendChild(svg);

    return function(){
      fade(axis, 0, 400); fade(head, 200, 300);
      grow(curve, 400, 1500, curveLen);
      groups.forEach(function(g, i){ fade(g, 700 + i*340, 480); });
      fade(crest, 1900, 500);
      fade(foot, 2300, 600);
    };
  };

  /* ---------- 01 让公司可被查询（放射查询图） ---------- */
  FIG.query = function(id){
    var host = clear(id); if (!host) return function(){};
    var svg = el('svg', {viewBox:'0 0 1000 380', width:'100%', role:'img',
      'aria-label':'把公司变得可查询：一次提问，散落各处的知识被即时调出'});
    var cx = 500, cy = 178;
    var coreW = 176, coreH = 58;
    var core = el('rect', {x:cx-coreW/2, y:cy-coreH/2, width:coreW, height:coreH, rx:12, fill:C.ink});
    svg.appendChild(core);
    var coreT1 = txt(cx, cy-4, '一次提问', {fill:'#fff','font-size':18,'font-weight':700,'text-anchor':'middle','font-family':'Noto Sans SC'});
    var coreT2 = txt(cx, cy+17, '人 / agent', {fill:C.gold,'font-size':12.5,'text-anchor':'middle','font-family':'JetBrains Mono'});
    svg.appendChild(coreT1); svg.appendChild(coreT2);

    var nodes = [
      {a:-152, r:255, label:'文档 / Wiki'},
      {a:-96,  r:270, label:'代码库'},
      {a:-30,  r:260, label:'客户对话'},
      {a:30,   r:260, label:'指标 / 数据'},
      {a:96,   r:270, label:'流程 / SOP'},
      {a:152,  r:255, label:'历史决策'}
    ];
    var anim = [];
    nodes.forEach(function(n, i){
      var rad = n.a * Math.PI/180;
      var nx = cx + Math.cos(rad) * n.r;
      var ny = cy + Math.sin(rad) * n.r * 0.6;
      var ln = el('line', {x1:cx, y1:cy, x2:nx, y2:ny, stroke:C.teal, 'stroke-width':1.6, 'stroke-opacity':0.55});
      svg.appendChild(ln);
      var g = el('g', {});
      g.appendChild(el('circle', {cx:nx, cy:ny, r:7, fill:C.paper, stroke:C.teal, 'stroke-width':2}));
      g.appendChild(txt(nx, ny - 16, n.label, {fill:C.slate,'font-size':14,'text-anchor':'middle','font-family':'Noto Sans SC'}));
      svg.appendChild(g);
      anim.push({ln:ln, g:g, len:dist(cx,cy,nx,ny), i:i});
    });
    var foot = txt(cx, 366, '散落各处的知识 → 被即时调出、能被追问', {fill:C.grey,'font-size':14,'text-anchor':'middle','font-family':'Noto Sans SC'});
    svg.appendChild(foot);
    host.appendChild(svg);

    return function(){
      core.style.opacity = 0; fade(core, 0);
      fade(coreT1, 120); fade(coreT2, 120);
      anim.forEach(function(a){
        grow(a.ln, 500 + a.i*110, 600, a.len);
        fade(a.g, 900 + a.i*110, 500);
      });
      fade(foot, 1700);
    };
  };

  /* ---------- 02 把动作连成闭环 ---------- */
  FIG.loop = function(id){
    var host = clear(id); if (!host) return function(){};
    var svg = el('svg', {viewBox:'0 0 1000 380', width:'100%', role:'img',
      'aria-label':'闭环：执行、反馈、学习、改进，循环自我强化'});
    var cx = 500, cy = 185, R = 122;
    svg.appendChild(el('circle', {cx:cx, cy:cy, r:R, fill:'none', stroke:C.faint, 'stroke-width':2}));
    var arc = el('circle', {cx:cx, cy:cy, r:R, fill:'none', stroke:C.teal, 'stroke-width':3, 'stroke-linecap':'round',
      transform:'rotate(-90 '+cx+' '+cy+')'});
    svg.appendChild(arc);

    var steps = [
      {a:-90, label:'执行', sub:'do', color:C.ink},
      {a:0,   label:'反馈', sub:'measure', color:C.teal},
      {a:90,  label:'学习', sub:'learn', color:C.gold},
      {a:180, label:'改进', sub:'improve', color:C.rust}
    ];
    var groups = [];
    steps.forEach(function(s){
      var rad = s.a * Math.PI/180;
      var nx = cx + Math.cos(rad) * R;
      var ny = cy + Math.sin(rad) * R;
      var g = el('g', {});
      g.appendChild(el('circle', {cx:nx, cy:ny, r:32, fill:'#fff', stroke:s.color, 'stroke-width':2.5}));
      g.appendChild(txt(nx, ny+1, s.label, {fill:s.color,'font-size':16,'font-weight':700,'text-anchor':'middle','font-family':'Noto Sans SC'}));
      g.appendChild(txt(nx, ny+19, s.sub, {fill:C.grey,'font-size':10,'text-anchor':'middle','font-family':'JetBrains Mono'}));
      svg.appendChild(g); groups.push(g);
    });
    var cT1 = txt(cx, cy-6, '闭环', {fill:C.ink,'font-size':19,'font-weight':900,'text-anchor':'middle','font-family':'Noto Serif SC'});
    var cT2 = txt(cx, cy+16, 'self-reinforcing', {fill:C.grey,'font-size':11,'text-anchor':'middle','font-family':'JetBrains Mono'});
    svg.appendChild(cT1); svg.appendChild(cT2);
    var dot = el('circle', {r:5, fill:C.rust}); svg.appendChild(dot);
    var foot = txt(cx, 366, '每一圈都让下一圈更快、更准 —— 不是一次性动作', {fill:C.grey,'font-size':14,'text-anchor':'middle','font-family':'Noto Sans SC'});
    svg.appendChild(foot);
    host.appendChild(svg);

    var raf = null;
    return function(){
      if (raf) cancelAnimationFrame(raf);
      grow(arc, 200, 1400, 2*Math.PI*R);
      groups.forEach(function(g, i){ fade(g, 500 + i*260, 450); });
      fade(cT1, 1400); fade(cT2, 1400); fade(foot, 1800);
      if (reduced()){ dot.setAttribute('cx', cx); dot.setAttribute('cy', cy - R); return; }
      var t0 = null;
      function spin(ts){
        if (t0 === null) t0 = ts;
        var ang = ((ts - t0) / 3200) * Math.PI * 2 - Math.PI/2;
        dot.setAttribute('cx', cx + Math.cos(ang) * R);
        dot.setAttribute('cy', cy + Math.sin(ang) * R);
        raf = requestAnimationFrame(spin);
      }
      setTimeout(function(){ raf = requestAnimationFrame(spin); }, 1600);
    };
  };

  /* ---------- 03 增加被动技能 / Buff 层叠加成 ---------- */
  FIG.buff = function(id){
    var host = clear(id); if (!host) return function(){};
    var svg = el('svg', {viewBox:'0 0 1000 360', width:'100%', role:'img',
      'aria-label':'被动技能：每加一个能力，公司基线持续抬高，叠加生效'});
    var baseY = 300, x0 = 130, barW = 100, gap = 56;
    var bars = [
      {label:'基线',     h:72,  fill:C.faint, tc:C.slate, note:'人工 · 一次性'},
      {label:'+ 自动化',  h:124, fill:C.teal,  tc:'#fff',  note:'重复活儿自动跑'},
      {label:'+ Agent',  h:174, fill:C.gold,  tc:C.ink,   note:'7×24 自主执行'},
      {label:'+ 记忆',    h:226, fill:C.rust,  tc:'#fff',  note:'越用越懂你'},
      {label:'+ 闭环',    h:280, fill:C.ink,   tc:'#fff',  note:'持续自我强化'}
    ];
    svg.appendChild(el('line', {x1:80, y1:baseY, x2:920, y2:baseY, stroke:C.faint, 'stroke-width':2}));

    var rects = [];
    bars.forEach(function(b, i){
      var x = x0 + i*(barW+gap);
      var rect = el('rect', {x:x, y:baseY, width:barW, height:0, rx:8, fill:b.fill});
      svg.appendChild(rect);
      svg.appendChild(txt(x+barW/2, baseY+22, b.label, {fill:C.ink,'font-size':14,'font-weight':700,'text-anchor':'middle','font-family':'Noto Sans SC'}));
      svg.appendChild(txt(x+barW/2, baseY+40, b.note, {fill:C.grey,'font-size':11,'text-anchor':'middle','font-family':'Noto Sans SC'}));
      var val = txt(x+barW/2, baseY - b.h + 24, b.label.replace('+ ',''), {fill:b.tc,'font-size':13,'font-weight':700,'text-anchor':'middle','font-family':'Noto Sans SC'});
      val.style.opacity = 0;
      svg.appendChild(val);
      rects.push({rect:rect, b:b, val:val, i:i});
    });

    var pts = bars.map(function(b,i){ return {x:x0 + i*(barW+gap) + barW/2, y:baseY - b.h - 10}; });
    var trendLen = 0;
    for (var p=1;p<pts.length;p++) trendLen += dist(pts[p-1].x,pts[p-1].y,pts[p].x,pts[p].y);
    var trend = el('polyline', {points: pts.map(function(p){return p.x+','+p.y;}).join(' '),
      fill:'none', stroke:C.rust, 'stroke-width':2, 'stroke-opacity':0.7});
    svg.appendChild(trend);
    host.appendChild(svg);

    return function(){
      rects.forEach(function(r){
        r.rect.setAttribute('height', 0); r.rect.setAttribute('y', baseY); r.val.style.opacity = 0;
        if (reduced()){ r.rect.setAttribute('height', r.b.h); r.rect.setAttribute('y', baseY-r.b.h); r.val.style.opacity=1; return; }
        setTimeout(function(){
          r.rect.style.transition = 'height 650ms cubic-bezier(.22,.61,.36,1), y 650ms cubic-bezier(.22,.61,.36,1)';
          r.rect.setAttribute('height', r.b.h);
          r.rect.setAttribute('y', baseY - r.b.h);
          r.val.style.transition = 'opacity 400ms ease 350ms';
          r.val.style.opacity = 1;
        }, 400 + r.i*220);
      });
      grow(trend, 1400, 900, trendLen);
    };
  };

  /* ---------- 04 达·芬奇 ↔ 文艺复兴式 Builder 人才对照 ---------- */
  FIG.talent = function(id){
    var host = clear(id); if (!host) return function(){};
    var svg = el('svg', {viewBox:'0 0 1000 400', width:'100%', role:'img',
      'aria-label':'达·芬奇与 AI Native 人才对照：稀缺的始终是能把一件事整个做成的人'});
    // 两栏
    var cols = [
      {x:250, tag:'文艺复兴 · 1482', name:'达·芬奇', color:C.gold, dark:false,
       rows:[
         {k:'身份', v:'画家 · 工程师 · 解剖 · 水利 · 舞台'},
         {k:'为何稀缺', v:'能在多领域之间架桥，把问题从头做到尾'},
         {k:'他的杠杆', v:'梅迪奇家族、米兰宫廷 —— 资金与「算力」'}
       ]},
      {x:750, tag:'AI NATIVE · 2026', name:'文艺复兴式 Builder', color:C.teal, dark:true,
       rows:[
         {k:'身份', v:'好奇 · 敢试 · 会沟通 · 担责 · T 型'},
         {k:'为何稀缺', v:'执行被 AI 接管，稀缺的是看懂 / 判对 / 担责'},
         {k:'他的杠杆', v:'一群并行的 AI agent —— 今天的「算力」'}
       ]}
    ];
    var groups = [];
    cols.forEach(function(c, ci){
      var g = el('g', {});
      // 顶部标签 + 名字
      g.appendChild(txt(c.x, 56, c.tag, {fill:c.color,'font-size':13,'font-weight':700,'text-anchor':'middle','font-family':'JetBrains Mono','letter-spacing':'1.5'}));
      g.appendChild(txt(c.x, 96, c.name, {fill:C.ink,'font-size':26,'font-weight':900,'text-anchor':'middle','font-family':'Noto Serif SC'}));
      // 三行
      c.rows.forEach(function(r, ri){
        var ry = 150 + ri*78;
        g.appendChild(txt(c.x, ry, r.k, {fill:C.rust,'font-size':12.5,'font-weight':700,'text-anchor':'middle','font-family':'Noto Sans SC'}));
        g.appendChild(txt(c.x, ry+26, r.v, {fill:C.slate,'font-size':14,'text-anchor':'middle','font-family':'Noto Sans SC'}));
      });
      svg.appendChild(g); groups.push(g);
    });
    // 中缝竖线
    var divider = el('line', {x1:500, y1:40, x2:500, y2:330, stroke:C.faint, 'stroke-width':1.5});
    svg.appendChild(divider);
    // 底部「不变的」横贯
    var band = el('g', {});
    band.appendChild(el('rect', {x:120, y:352, width:760, height:36, rx:10, fill:C.surf}));
    band.appendChild(txt(500, 375, '不变的 —— 判断什么值得做、怎么做对，始终是「人」的位置', {fill:C.ink,'font-size':14,'font-weight':700,'text-anchor':'middle','font-family':'Noto Sans SC'}));
    svg.appendChild(band); groups.push(band);
    host.appendChild(svg);

    return function(){
      fade(divider, 100, 500);
      groups.forEach(function(g, i){ fade(g, 250 + i*260, 520); });
    };
  };

  global.FIG = FIG;
})(window);
