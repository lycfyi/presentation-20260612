/* 初始化 reveal.js（本地 vendor）+ 进入某页时重建并播放该页动态图 */
'use strict';

var deck = new Reveal({
  width: 1280,
  height: 720,
  margin: 0,
  hash: true,
  transition: 'fade',
  transitionSpeed: 'default',
  controls: true,
  progress: true,
  slideNumber: 'c/t',
  plugins: [RevealNotes]
});

// data-fig 名 -> 容器 id + 构建函数
var FIGDEFS = {
  titleline: { id: 'fig-titleline', build: function(){ return FIG.titleline('fig-titleline'); } },
  flatten: { id: 'fig-flatten', build: function(){ return FIG.flatten('fig-flatten'); } },
  span: { id: 'fig-span', build: function(){ return FIG.span('fig-span'); } },
  orch: { id: 'fig-orch', build: function(){ return FIG.orch('fig-orch'); } },
  query:  { id: 'fig-query',  build: function(){ return FIG.query('fig-query'); } },
  loop:   { id: 'fig-loop',   build: function(){ return FIG.loop('fig-loop'); } },
  buff:   { id: 'fig-buff',   build: function(){ return FIG.buff('fig-buff'); } },
  talent: { id: 'fig-talent', build: function(){ return FIG.talent('fig-talent'); } }
};

// 进入某页：重建该页所有图并播放动画
function activateSlide(slide) {
  if (!slide) return;
  if (window.FIG && FIG.stopLoop) FIG.stopLoop(); // 停掉上一页闭环图的旋转光点
  resetResumeToggle(slide);
  var fig = slide.getAttribute('data-fig');
  if (!fig || fig === 'none') return;
  fig.split(',').map(function(s){ return s.trim(); }).forEach(function(name){
    var def = FIGDEFS[name];
    if (!def || !document.getElementById(def.id)) return;
    var play = def.build();   // 重建静态结构（重置动画状态）
    requestAnimationFrame(function(){ requestAnimationFrame(function(){
      try { play && play(); } catch (e) {}
    }); });
  });
}

function setResumeTranslated(toggle, translated) {
  if (!toggle) return;
  var original = toggle.querySelector('.resume-original');
  var translation = toggle.querySelector('.resume-translation');
  toggle.classList.toggle('is-translated', translated);
  toggle.setAttribute('aria-pressed', translated ? 'true' : 'false');
  if (original) original.setAttribute('aria-hidden', translated ? 'true' : 'false');
  if (translation) translation.setAttribute('aria-hidden', translated ? 'false' : 'true');
}

function resetResumeToggle(slide) {
  var toggle = slide && slide.querySelector('.resume-toggle');
  if (toggle) setResumeTranslated(toggle, false);
}

function initResumeToggle() {
  document.querySelectorAll('.resume-toggle').forEach(function(toggle){
    toggle.addEventListener('click', function(){
      setResumeTranslated(toggle, !toggle.classList.contains('is-translated'));
    });
    toggle.addEventListener('keydown', function(event){
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      setResumeTranslated(toggle, !toggle.classList.contains('is-translated'));
    });
  });
}

initResumeToggle();

deck.initialize().then(function () {
  // print-pdf 导出：所有页同时铺开，逐页激活让动态图直接渲染为最终态
  if (/print-pdf/gi.test(window.location.search)) {
    document
      .querySelectorAll('.reveal .slides section[data-fig]')
      .forEach(activateSlide);
    return;
  }
  var started = false;
  var start = function () {
    if (started) return; // fonts.ready 和超时兜底只能启动一次，否则动画播两遍
    started = true;
    activateSlide(deck.getCurrentSlide());
  };
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
    setTimeout(start, 1500); // 字体加载失败兜底
  } else {
    setTimeout(start, 300);
  }
});

deck.on('slidechanged', function (e) { activateSlide(e.currentSlide); });
