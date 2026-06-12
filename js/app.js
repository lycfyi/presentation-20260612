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
  slideNumber: false,
  plugins: [RevealNotes]
});

// data-fig 名 -> 容器 id + 构建函数
var FIGDEFS = {
  titleline: { id: 'fig-titleline', build: function(){ return FIG.titleline('fig-titleline'); } },
  query:  { id: 'fig-query',  build: function(){ return FIG.query('fig-query'); } },
  loop:   { id: 'fig-loop',   build: function(){ return FIG.loop('fig-loop'); } },
  buff:   { id: 'fig-buff',   build: function(){ return FIG.buff('fig-buff'); } },
  talent: { id: 'fig-talent', build: function(){ return FIG.talent('fig-talent'); } }
};

// 进入某页：重建该页所有图并播放动画
function activateSlide(slide) {
  if (!slide) return;
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

deck.initialize().then(function () {
  var start = function(){ activateSlide(deck.getCurrentSlide()); };
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
    setTimeout(start, 1500); // 字体加载失败兜底
  } else {
    setTimeout(start, 300);
  }
});

deck.on('slidechanged', function (e) { activateSlide(e.currentSlide); });
