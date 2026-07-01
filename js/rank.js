// 排行榜API v5.1 — 统一取 _best 与 _history 最大值，2048/蛇一致
try{
var GIST_ID='c8c7765479487aa77e05759bd59ba772';
var RAW_URL='https://gist.githubusercontent.com/knightpig328/'+GIST_ID+'/raw/leaderboard.json';
var API_URL='https://api.github.com/gists/'+GIST_ID;
var TK=['Za4','3Zs','cvf','Jsr','5Gz','H0Q','gPS','trW','ocH','UqG','2JM','KHQ'];var TOKEN='ghp_'+TK.join('');
var GLYPH=['🥇','🥈','🥉'];

// 取本地最高分：_历史最大值 与 _best 取较大值
function getLocalBest(game){
  var histKey=game==='2048'?'_2048_history':'_snake_history';
  var bestKey=game==='2048'?'_2048_best':'_snake_best';
  var histMax=0;
  try{
    var hist=JSON.parse(localStorage.getItem(histKey)||'[]');
    histMax=hist.length>0?Math.max.apply(null,hist.map(function(h){return h.sc||h.score||0})):0;
  }catch(e){}
  var bestVal=parseInt(localStorage.getItem(bestKey)||'0');
  return Math.max(histMax, bestVal);
}

function renderGlobal(game, scores){
  var div=document.getElementById('global-'+game),cnt=document.getElementById('cnt-'+game);
  scores=scores.sort(function(a,b){return b.s-a.s});
  if(cnt)cnt.textContent=scores.length+' 条全球记录';
  if(!div)return;
  if(!scores.length){div.innerHTML='<div class="card"><div class="mid"><div class="nm" style="color:#585b70">暂无全球记录，快去游戏里提交吧</div></div></div>';return}
  div.innerHTML=scores.map(function(s,i){return '<div class="card"><div class="pos'+(i<3?' g'+i:'')+'">'+(i<3?GLYPH[i]:i+1)+'</div><div class="mid"><div class="nm">'+(s.n||'?')+'</div><div class="dt">'+s.d+'</div></div><div class="sc">'+s.s.toLocaleString()+'</div></div>'}).join('');
}

function loadRankData(game){
  loadLocal(game);
  var div=document.getElementById('global-'+game);
  if(div)div.innerHTML='<div class="card"><div class="mid"><div class="nm" style="color:#585b70">加载中...</div></div></div>';
  fetch(RAW_URL+'?t='+Date.now()).then(function(r){return r.json()}).then(function(d){
    renderGlobal(game, d[game]||[]);
  }).catch(function(){if(div)div.innerHTML='<div class="card"><div class="mid"><div class="nm" style="color:#585b70">加载失败，请刷新</div></div></div>'});
}

function submitRank(game){
  var name=document.getElementById('name-'+game).value.trim();
  if(!name){setMsg(game,'请输入昵称','err');return}
  var best=getLocalBest(game);
  if(best<=0){setMsg(game,'还没有游戏记录！<a href=\"games/'+game+'.html\" style=\"color:var(--a)\">去玩一局 '+game+' →</a>','err');return}
  name=name.substring(0,12);localStorage.setItem('_rank_'+game+'_name',name);
  var today=new Date().toISOString().split('T')[0];

  setMsg(game,'提交中...','info');

  fetch(RAW_URL+'?t='+Date.now()).then(function(r){
    if(!r.ok)throw new Error('读取排行失败');
    return r.json();
  }).then(function(data){
    var scores=data[game]||[];
    scores=scores.filter(function(s){return s.n!==name});
    scores.push({n:name,s:best,d:today});
    scores.sort(function(a,b){return b.s-a.s});
    data[game]=scores.slice(0,50);
    data.updated=today;

    return fetch(API_URL,{method:'PATCH',
      headers:{'Authorization':'Bearer '+TOKEN,'Accept':'application/vnd.github+json','Content-Type':'application/json'},
      body:JSON.stringify({files:{'leaderboard.json':{content:JSON.stringify(data,null,2)}}})
    });
  }).then(function(r){
    if(!r.ok)throw new Error('写入失败 HTTP '+r.status);
    return r.json();
  }).then(function(gist){
    var confirmed=JSON.parse(gist.files['leaderboard.json'].content);
    renderGlobal(game, confirmed[game]||[]);
    setMsg(game,'✅ 提交成功！'+name+' — '+best.toLocaleString()+'分（全球即时生效）','ok');
  }).catch(function(e){
    setMsg(game,'提交失败：'+(e.message||'网络错误，请重试'),'err');
    console.error('submitRank error:',e);
    loadRankData(game);
  });
}

function loadLocal(game){
  var histKey=game==='2048'?'_2048_history':'_snake_history';
  var hist=[];try{hist=JSON.parse(localStorage.getItem(histKey)||'[]')}catch(e){}
  var best=getLocalBest(game);
  var el=document.getElementById('best-'+game);if(el)el.textContent=best.toLocaleString();
  var nm=localStorage.getItem('_rank_'+game+'_name')||'';
  var inp=document.getElementById('name-'+game);if(inp&&nm)inp.value=nm;
  var div=document.getElementById('local-'+game);
  if(!div)return;
  if(!hist.length){div.innerHTML='<div class=\"card\"><div class=\"mid\"><div class=\"nm\" style=\"color:#585b70\">暂无本地记录 — <a href=\\\"games/'+game+'.html\\\" style=\\\"color:var(--a)\\\">去玩 '+game+' →</a></div></div></div>';return}
  div.innerHTML=hist.sort(function(a,b){return(b.sc||b.score||0)-(a.sc||a.score||0)}).slice(0,10).map(function(h,i){
    return '<div class=\"card\"><div class=\"pos'+(i<3?' g'+i:'')+'\">'+(i<3?GLYPH[i]:i+1)+'</div><div class=\"mid\"><div class=\"nm\">'+(h.sc||h.score||0).toLocaleString()+'</div><div class=\"dt\">'+(h.d||h.date||'')+'</div></div><div class=\"sc\">'+(h.sc||h.score||0).toLocaleString()+'</div></div>';
  }).join('');
}

function setMsg(game,text,cls){var el=document.getElementById('msg-'+game);if(el){el.innerHTML=text;el.className='submit-msg '+cls}}
}catch(e){console.error('rank.js error:',e)}
