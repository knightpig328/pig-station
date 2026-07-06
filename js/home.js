// 首页逻辑 — 粒子、光球、动态条、积分、诗词、涟漪、视差
(function(){try{

// ═══ 1. 粒子系统 — 多种形状 + 颜色 ═══
(function(){
var colors=['#a78bfa','#60a5fa','#c084fc','#4ade80','#fbbf24','#f87171','#89b4fa'],
    shapes=['circle','circle','circle','diamond','square','circle','circle','circle'];
var p=document.getElementById('particles');
for(var i=0;i<28;i++){
  var d=document.createElement('div');
  var shape=shapes[Math.floor(Math.random()*shapes.length)];
  d.className='particle'+(shape==='circle'?'':' '+shape);
  d.style.left=Math.random()*100+'%';
  d.style.animationDelay=Math.random()*12+'s';
  d.style.animationDuration=(8+Math.random()*8)+'s';
  var sz=(1.5+Math.random()*3);
  d.style.width=d.style.height=sz+'px';
  d.style.background=colors[Math.floor(Math.random()*colors.length)];
  p.appendChild(d);
}
})();

// ═══ 2. 脉动条 — 40点随机亮灭 ═══
(function(){
var bar=document.getElementById('statsBar');
for(var i=0;i<40;i++){
  var dot=document.createElement('div');
  dot.className='sbar-dot';
  dot.style.animationDelay=Math.random()*2+'s';
  bar.appendChild(dot);
}
var actives=10,dots=bar.querySelectorAll('.sbar-dot');
setInterval(function(){
  dots.forEach(function(d){d.classList.remove('active')});
  var used=new Set();
  for(var j=0;j<actives;j++){
    var idx;do{idx=Math.floor(Math.random()*40)}while(used.has(idx));
    used.add(idx);dots[idx].classList.add('active');
  }
  actives=Math.max(4,actives+(Math.random()>.5?1:-1));
  actives=Math.min(25,actives);
},2000);
})();

// ═══ 3. 积分卡片 — 2048 + 贪吃蛇 ═══
(function(){
var top=document.getElementById('dashTop')||document.createElement('div');
var sb=localStorage.getItem('_snake_best')||'0';
var tb=localStorage.getItem('_2048_best')||'0';
var sh=[];try{sh=JSON.parse(localStorage.getItem('_snake_history')||'[]')}catch(e){}
var th=[];try{th=JSON.parse(localStorage.getItem('_2048_history')||'[]')}catch(e){}
var sl=sh.length>0?(sh[0].score||sh[0].sc||0):0;
var tl=th.length>0?(th[0].sc||0):0;
top.innerHTML='<a class="dc" href="games/2048.html" style="text-decoration:none;color:inherit"><div class="dch">🎮 2048 最佳</div><div class="dcv">'+(+tb).toLocaleString()+'</div><div class="dcsub">最近: '+(+tl).toLocaleString()+'</div><div class="dcbar"><div class="fill" style="width:'+Math.min(100,(+tb/30000)*100)+'%;background:linear-gradient(90deg,var(--r),var(--px))"></div></div></a>'+
'<a class="dc" href="games/snake.html" style="text-decoration:none;color:inherit"><div class="dch">🐍 贪吃蛇 最佳</div><div class="dcv">'+(+sb).toLocaleString()+'</div><div class="dcsub">最近: '+(+sl).toLocaleString()+'</div><div class="dcbar"><div class="fill" style="width:'+Math.min(100,(+sb/2000)*100)+'%;background:linear-gradient(90deg,var(--g),var(--a))"></div></div></a>';
})();

// ═══ 4. 诗词板块 · 芝士雪豹 ═══
(function(){
var poems=[{v:'大鹏一日同风起\n扶摇直上九万里',from:'李白 · 上李邕',note:'大鹏鸟总有一天会乘风而起，直上九万里高空。喻指心怀大志之人，终将一飞冲天。'},{v:'长风破浪会有时\n直挂云帆济沧海',from:'李白 · 行路难',note:'乘长风破万里浪的时机定会到来，届时将高挂云帆横渡沧海。鼓励人在困境中不失信念。'},{v:'千淘万漉虽辛苦\n吹尽狂沙始到金',from:'刘禹锡 · 浪淘沙',note:'千遍淘洗万遍过滤虽辛苦，但吹尽黄沙才能见到真金。好的结果需经反复磨砺。'},{v:'会当凌绝顶\n一览众山小',from:'杜甫 · 望岳',note:'定要登上泰山的顶峰，俯瞰群山都显得渺小。境界高了，困难就小了。'},{v:'不畏浮云遮望眼\n自缘身在最高层',from:'王安石 · 登飞来峰',note:'不怕浮云遮住远望的视线，只因站在最高处。格局决定视野。'},{v:'宝剑锋从磨砺出\n梅花香自苦寒来',from:'警世贤文',note:'宝剑的锋利来自反复磨砺，梅花的清香源于寒冬的考验。成就离不开坚持。'},{v:'沉舟侧畔千帆过\n病树前头万木春',from:'刘禹锡 · 酬乐天',note:'沉船旁边千帆驶过，枯树前面万木逢春。新事物必将取代旧事物，永远向前看。'}];
var d=new Date(),idx=(d.getFullYear()*100+d.getMonth()*10+d.getDate())%poems.length;
var p=poems[idx];
document.getElementById('poemBox').innerHTML='<div class="dch">📜 芝士雪豹</div><div class="verse">'+p.v.replace(/\\n/g,'<br>')+'</div><div class="from">—— '+p.from+'</div><div class="note">'+p.note+'</div>';
})();

// ═══ 5. 鼠标视差 — Header 标题 ═══
(function(){
var hdr=document.querySelector('.hdr h1');
if(!hdr)return;
var maxMove=8;
document.addEventListener('mousemove',function(e){
  var x=(e.clientX/window.innerWidth-.5)*maxMove;
  var y=(e.clientY/window.innerHeight-.5)*maxMove;
  hdr.style.transform='translate('+x+'px,'+y+'px)';
  hdr.style.transition='transform .15s ease-out';
});
})();

// ═══ 6. 点击涟漪效果 ═══
(function(){
document.addEventListener('click',function(e){
  var el=e.target.closest('.ncard,.dc');
  if(!el)return;
  if(el.querySelector('.ripple'))return;
  var rect=el.getBoundingClientRect();
  var size=Math.max(rect.width,rect.height);
  var ripple=document.createElement('span');
  ripple.className='ripple';
  ripple.style.width=ripple.style.height=size+'px';
  ripple.style.left=(e.clientX-rect.left-size/2)+'px';
  ripple.style.top=(e.clientY-rect.top-size/2)+'px';
  el.appendChild(ripple);
  ripple.addEventListener('animationend',function(){ripple.remove()});
});
})();

// ═══ 7. Nav 卡片 hover 光效 ═══
(function(){
document.querySelectorAll('.ncard').forEach(function(card){
  card.addEventListener('mouseenter',function(){
    var icon=card.querySelector('.ni');
    if(icon)icon.style.transform='scale(1.2)';
  });
  card.addEventListener('mouseleave',function(){
    var icon=card.querySelector('.ni');
    if(icon)icon.style.transform='';
  });
});
})();

}catch(e){console.error('js/home.js error:',e)}})();
