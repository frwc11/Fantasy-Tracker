#!/usr/bin/env node
const fs = require('fs');
let html = fs.readFileSync('/home/user/Fantasy-Tracker/index.html', 'utf8');

function replace(old, neo, required=true) {
  if (!html.includes(old)) {
    if (required) { console.error('NOT FOUND:', old.slice(0,80)); process.exit(1); }
    return;
  }
  html = html.replace(old, neo);
}

// ─────────────────────────────────────────────
// 1. Add Buy Low pill after Ceiling pill
// ─────────────────────────────────────────────
replace(
  `    <span class="pill" id="bp-CEIL" onclick="setBToggle('CEIL',this)" style="border-color:var(--qb)">🎰 Ceiling≥80</span>`,
  `    <span class="pill" id="bp-CEIL" onclick="setBToggle('CEIL',this)" style="border-color:var(--qb)">🎰 Ceiling≥80</span>
    <span class="pill" id="bp-BUYLOW" onclick="setBToggle('BUYLOW',this)" style="border-color:#f368e0">📉 Buy Low</span>`
);

// ─────────────────────────────────────────────
// 2. Add Market Value sort option
// ─────────────────────────────────────────────
replace(
  `      <option value="future_value">Future Value</option>
    </select>`,
  `      <option value="future_value">Future Value</option>
      <option value="dp_value_2qb">🔄 Market Value (DP)</option>
    </select>`
);

// ─────────────────────────────────────────────
// 3. Add dp_value column header
// ─────────────────────────────────────────────
replace(
  `        <th onclick="setBSort('target_round')">Tgt<span id="bs-target_round"></span></th>
        <th>Flag</th>`,
  `        <th onclick="setBSort('target_round')">Tgt<span id="bs-target_round"></span></th>
        <th onclick="setBSort('dp_value_2qb')">DP Val<span id="bs-dp_value_2qb"></span></th>
        <th>Flag</th>`
);

// ─────────────────────────────────────────────
// 4. Fix init() - remove bust_flag coercion, add bust_category + dp fields
// ─────────────────────────────────────────────
replace(
  `    p.gem_flag=n(p.gem_flag); p.bust_flag=n(p.bust_flag);`,
  `    p.gem_flag=n(p.gem_flag);
    p.dp_value_2qb=p.dp_value_2qb!==''?n(p.dp_value_2qb):null;
    p.dp_rank_2qb=p.dp_rank_2qb!==''?n(p.dp_rank_2qb):null;
    p.dp_vs_my_rank=p.dp_vs_my_rank!==''?n(p.dp_vs_my_rank):null;`
);

// ─────────────────────────────────────────────
// 5. Update renderStatCards - use bust_category instead of bust_flag
// ─────────────────────────────────────────────
replace(
  `  const busts=board.filter(p=>p.bust_flag==1).length;
  const high=board.filter(p=>p.injury_risk_score>=7).length;
  document.getElementById('statCards').innerHTML=\`
    <div class="stat-card"><div class="label">Players Loaded</div><div class="value" style="color:var(--boost)">\${board.length}</div></div>
    <div class="stat-card"><div class="label">💎 Gems Found</div><div class="value" style="color:var(--gem)">\${gems}</div></div>
    <div class="stat-card"><div class="label">💀 Busts Flagged</div><div class="value" style="color:var(--bust)">\${busts}</div></div>
    <div class="stat-card"><div class="label">⚠️ High Risk</div><div class="value" style="color:#ff9f43">\${high}</div></div>\`;`,
  `  const rentals=board.filter(p=>p.bust_category==='RENTAL'||p.bust_category==='DECLINING').length;
  const buyLow=board.filter(p=>p.bust_category==='BUY_LOW').length;
  const high=board.filter(p=>p.injury_risk_score>=7).length;
  document.getElementById('statCards').innerHTML=\`
    <div class="stat-card"><div class="label">Players Loaded</div><div class="value" style="color:var(--boost)">\${board.length}</div></div>
    <div class="stat-card"><div class="label">💎 Gems Found</div><div class="value" style="color:var(--gem)">\${gems}</div></div>
    <div class="stat-card"><div class="label">📉 Buy Low</div><div class="value" style="color:#f368e0">\${buyLow}</div></div>
    <div class="stat-card"><div class="label">🚫 Rental/Fade</div><div class="value" style="color:var(--bust)">\${rentals}</div></div>
    <div class="stat-card"><div class="label">⚠️ High Risk</div><div class="value" style="color:#ff9f43">\${high}</div></div>\`;`
);

// ─────────────────────────────────────────────
// 6. Add BUYLOW to state and setBToggle
// ─────────────────────────────────────────────
replace(
  `let _bPos='ALL', _bSort={col:'master_score',dir:-1}, _bGem=false, _bSafe=false, _bCeil=false;`,
  `let _bPos='ALL', _bSort={col:'master_score',dir:-1}, _bGem=false, _bSafe=false, _bCeil=false, _bBuyLow=false;`
);

replace(
  `  if(flag==='GEM'){_bGem=!_bGem; el.classList.toggle('on',_bGem);}
  if(flag==='SAFE'){_bSafe=!_bSafe; el.classList.toggle('on',_bSafe);}
  if(flag==='CEIL'){_bCeil=!_bCeil; el.classList.toggle('on',_bCeil);}`,
  `  if(flag==='GEM'){_bGem=!_bGem; el.classList.toggle('on',_bGem);}
  if(flag==='SAFE'){_bSafe=!_bSafe; el.classList.toggle('on',_bSafe);}
  if(flag==='CEIL'){_bCeil=!_bCeil; el.classList.toggle('on',_bCeil);}
  if(flag==='BUYLOW'){_bBuyLow=!_bBuyLow; el.classList.toggle('on',_bBuyLow);}`
);

// ─────────────────────────────────────────────
// 7. Update getFilteredBoard to support BUYLOW + dp_value sort + bust_category filter
// ─────────────────────────────────────────────
replace(
  `  const numCols=['my_rank','consensus_rank','age','value_gap','target_round','master_score',
    'proj_pts_2026','vorp_adjusted','ceiling_score','floor_score_v2','injury_risk_score','future_value'];
  return board.filter(p=>{
    if(_bPos!=='ALL'){
      if(_bPos==='IDP'&&!isIDP(p.pos)) return false;
      if(_bPos!=='IDP'&&p.pos!==_bPos) return false;
    }
    if(_bGem&&p.gem_flag!=1) return false;
    if(_bSafe&&p.injury_risk_score>3.0) return false;
    if(_bCeil&&p.ceiling_score<80) return false;
    if(q&&!p.player.toLowerCase().includes(q)&&!(p.team||'').toLowerCase().includes(q)) return false;
    return true;`,
  `  const numCols=['my_rank','consensus_rank','age','value_gap','target_round','master_score',
    'proj_pts_2026','vorp_adjusted','ceiling_score','floor_score_v2','injury_risk_score','future_value','dp_value_2qb','dp_rank_2qb'];
  return board.filter(p=>{
    if(_bPos!=='ALL'){
      if(_bPos==='IDP'&&!isIDP(p.pos)) return false;
      if(_bPos!=='IDP'&&p.pos!==_bPos) return false;
    }
    if(_bGem&&p.gem_flag!=1) return false;
    if(_bSafe&&p.injury_risk_score>3.0) return false;
    if(_bCeil&&p.ceiling_score<80) return false;
    if(_bBuyLow&&p.bust_category!=='BUY_LOW') return false;
    if(q&&!p.player.toLowerCase().includes(q)&&!(p.team||'').toLowerCase().includes(q)) return false;
    return true;`
);

// ─────────────────────────────────────────────
// 8. Update renderBoard - row class, bust_category badge, dp_value cell
// ─────────────────────────────────────────────
replace(
  `    const rc=p.gem_flag==1?'gem-r':p.bust_flag==1?'bust-r':'';
    const prefix=p.gem_flag==1?'💎 ':p.bust_flag==1?'💀 ':'';`,
  `    const isBust=p.bust_category==='DECLINING'||p.bust_category==='RENTAL'||p.bust_category==='SCHEME_RISK';
    const rc=p.bust_category==='GEM'?'gem-r':isBust?'bust-r':'';
    const prefix=p.bust_category==='GEM'?'💎 ':isBust?'⚠️ ':'';`
);

// Add dp_value cell before Flag cell in table
replace(
  `      <td><span class="rnd-badge">R\${p.target_round}</span></td>
      <td>\${p.gem_flag==1?'<span style="color:var(--gem)">💎 GEM</span>':p.bust_flag==1?'<span style="color:var(--bust)">💀 BUST</span>':'—'}</td>`,
  `      <td><span class="rnd-badge">R\${p.target_round}</span></td>
      <td>\${p.dp_value_2qb?('<span style="color:var(--muted);font-size:11px">'+p.dp_value_2qb.toLocaleString()+'</span>'):'—'}</td>
      <td>\${bustBadge(p)}</td>`
);

// ─────────────────────────────────────────────
// 9. Add bustBadge function before renderBoard
// ─────────────────────────────────────────────
replace(
  `function renderBoard(){`,
  `const BUST_CAT_STYLE={
  GEM:     {color:'var(--gem)',  icon:'💎', label:'GEM'},
  BUY_LOW: {color:'#f368e0',    icon:'📉', label:'BUY LOW'},
  RENTAL:  {color:'var(--idp)', icon:'⏱️', label:'RENTAL'},
  DECLINING:{color:'var(--bust)',icon:'📉', label:'DECLINING'},
  SCHEME_RISK:{color:'#ff9f43', icon:'🏟️', label:'SCHEME RISK'},
  SAFE:    {color:'var(--gem)', icon:'🟢', label:'SAFE'},
  NONE:    {color:'var(--muted)',icon:'',  label:'—'},
};
function bustBadge(p){
  const cat=p.bust_category||'NONE';
  const s=BUST_CAT_STYLE[cat]||BUST_CAT_STYLE.NONE;
  if(cat==='NONE') return '—';
  const tip=p.bust_reason?(' title="'+p.bust_reason.replace(/"/g,"'")+'"'):'';
  return \`<span\${tip} style="color:\${s.color};font-size:11px;cursor:help">\${s.icon} \${s.label}</span>\`;
}

function renderBoard(){`
);

// ─────────────────────────────────────────────
// 10. Update scorecard to use bust_category + show dp_value
// ─────────────────────────────────────────────
replace(
  `      <strong style="font-size:14px">\${p.gem_flag==1?'💎 ':''}\${p.player}\${p.bust_flag==1?' 💀':''}</strong>`,
  `      <strong style="font-size:14px">\${p.bust_category==='GEM'?'💎 ':''}\${p.player}\${(p.bust_category==='DECLINING'||p.bust_category==='RENTAL')?' ⚠️':''}</strong>`
);

// Add dp_value to scorecard (after vegas line)
replace(
  `      \${vd?\`<div style="font-size:11px;margin-top:6px;color:\${vd.vegas_flag==='BOOST'?'var(--boost)':vd.vegas_flag==='FADE'?'var(--bust)':'var(--muted)'}">🎰 \${vd.vegas_flag} · \${vd.team} \${vd.win_total}W</div>\`:''}`,
  `      \${vd?\`<div style="font-size:11px;margin-top:6px;color:\${vd.vegas_flag==='BOOST'?'var(--boost)':vd.vegas_flag==='FADE'?'var(--bust)':'var(--muted)'}">🎰 \${vd.vegas_flag} · \${vd.team} \${vd.win_total}W</div>\`:''}
      \${p.dp_value_2qb?\`<div style="font-size:11px;margin-top:4px;color:var(--muted)">🔄 DP Value: <strong style="color:var(--text)">\${p.dp_value_2qb.toLocaleString()}</strong> (mkt rank #\${p.dp_rank_2qb||'?'}) \${p.market_inefficiency==='STRONG_BUY'?'<span style="color:var(--gem)">⬆️ STRONG BUY</span>':p.market_inefficiency==='BUY'?'<span style="color:var(--gem)">⬆️ BUY</span>':p.market_inefficiency==='STRONG_SELL'?'<span style="color:var(--bust)">⬇️ STRONG SELL</span>':p.market_inefficiency==='SELL'?'<span style="color:var(--bust)">⬇️ SELL</span>':''}</div>\`:''}`
);

// Add bust_reason to scorecard notes section
replace(
  `    \${p.notes?\`<div style="margin-top:6px;font-size:11px;color:var(--muted)">\${p.notes}</div>\`:''}
  </div>\`;`,
  `    \${p.bust_reason?\`<div style="margin-top:6px;font-size:11px;color:\${(()=>{const s=BUST_CAT_STYLE[p.bust_category];return s?s.color:'var(--muted)'})()}">\${BUST_CAT_STYLE[p.bust_category]?.icon||''} \${p.bust_reason}</div>\`:''}
    \${p.notes?\`<div style="margin-top:6px;font-size:11px;color:var(--muted)">\${p.notes}</div>\`:''}
  </div>\`;`
);

// ─────────────────────────────────────────────
// 11. Live Draft — pick summaries after MY picks
// ─────────────────────────────────────────────
replace(
  `  picks.forEach(p=>{
    const d=document.createElement('div');
    d.className='pl-row'+(p.isMe?' me':'');
    d.textContent=\`\${p.pickStr} | \${p.player} | \${p.pos} | \${p.team} | \${p.isMe?'YOU ✅':'OPP'}\`;
    log.prepend(d);
  });`,
  `  picks.forEach(p=>{
    const d=document.createElement('div');
    d.className='pl-row'+(p.isMe?' me':'');
    if(p.isMe){
      const bp=board.find(x=>x.player.toLowerCase()===p.player.toLowerCase());
      const ms=bp?bp.master_score:'?';
      const cat=bp?bp.bust_category:'';
      const catStr=cat&&cat!=='NONE'&&cat!=='GEM'?(' | '+cat):'';
      const gemStr=cat==='GEM'?' 💎':'';
      const vorp=bp&&bp.vorp_adjusted>0?(' | VORP +'+bp.vorp_adjusted):'';
      d.textContent=\`\${p.pickStr} | \${p.player}\${gemStr} | \${p.pos} | \${p.team} | YOU ✅ | Score:\${ms}\${vorp}\${catStr}\`;
    } else {
      d.textContent=\`\${p.pickStr} | \${p.player} | \${p.pos} | \${p.team} | OPP\`;
    }
    log.prepend(d);
  });`
);

// ─────────────────────────────────────────────
// 12. Live Draft — power rankings every 5 picks in checkAlerts
// ─────────────────────────────────────────────
replace(
  `  document.getElementById('draftAlerts').innerHTML=alerts.map(a=>\`<div class="alert">\${a}</div>\`).join('');`,
  `  // Power ranking every 5 picks
  let powerHtml='';
  if(DS.allPicks.length>0 && DS.allPicks.length%5===0){
    const myMs=DS.myPicks.map(pk=>{
      const bp=board.find(x=>x.player.toLowerCase()===pk.player.toLowerCase());
      return bp?bp.master_score:50;
    });
    const myAvg=myMs.length?Math.round(myMs.reduce((a,b)=>a+b,0)/myMs.length):0;
    const mySum=myMs.reduce((a,b)=>a+b,0);
    const myVorp=DS.myPicks.reduce((sum,pk)=>{
      const bp=board.find(x=>x.player.toLowerCase()===pk.player.toLowerCase());
      return sum+(bp&&bp.vorp_adjusted>0?bp.vorp_adjusted:0);
    },0);
    powerHtml=\`<div class="info" style="border-color:var(--qb);background:rgba(255,215,0,.07);margin-bottom:8px">
      <strong>📊 POWER RANKING — After Pick \${DS.allPicks.length}</strong><br>
      Your \${DS.myPicks.length} picks | Avg Master Score: <strong style="color:var(--qb)">\${myAvg}</strong> |
      Total Score: <strong>\${mySum}</strong> | VORP Banked: <strong style="color:var(--boost)">+\${myVorp}</strong><br>
      <span style="font-size:11px;color:var(--muted)">\${DS.myPicks.map(pk=>pk.player).join(' · ')}</span>
    </div>\`;
  }
  // Opponent threat assessment
  let threatHtml='';
  if(DS.allPicks.length>=10){
    const oppByPos={QB:[],RB:[],WR:[],TE:[],IDP:[]};
    DS.allPicks.filter(pk=>!pk.isMe).forEach(pk=>{
      const pos=(pk.pos||'').toUpperCase();
      if(pos==='QB') oppByPos.QB.push(pk.player);
      else if(pos==='RB') oppByPos.RB.push(pk.player);
      else if(pos==='WR') oppByPos.WR.push(pk.player);
      else if(pos==='TE') oppByPos.TE.push(pk.player);
      else if(['EDGE','LB','DB','DL','S','CB','DE','DT'].includes(pos)) oppByPos.IDP.push(pk.player);
    });
    const threats=[];
    if(oppByPos.QB.length>=2) threats.push(\`⚠️ Opponent QB-heavy (\${oppByPos.QB.length} QBs) — SF threat\`);
    if(oppByPos.TE.length>=2) threats.push(\`⚠️ Multiple TEs drafted by opponents — TE window closing\`);
    if(oppByPos.IDP.length>=4) threats.push(\`⚠️ IDP stacking detected (\${oppByPos.IDP.length} IDPs) — secure your EDGE now\`);
    if(threats.length){
      threatHtml=\`<div style="background:rgba(255,107,107,.07);border:1px solid rgba(255,107,107,.3);border-radius:6px;padding:9px 12px;margin-bottom:8px;font-size:11px">
        <strong style="color:var(--bust)">🎯 OPPONENT THREAT RADAR</strong><br>\${threats.join('<br>')}
      </div>\`;
    }
  }
  document.getElementById('draftAlerts').innerHTML=powerHtml+threatHtml+alerts.map(a=>\`<div class="alert">\${a}</div>\`).join('');`
);

fs.writeFileSync('/home/user/Fantasy-Tracker/index.html', html);
console.log('✅ All patches applied. File size:', html.length);
