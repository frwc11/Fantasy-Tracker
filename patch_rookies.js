#!/usr/bin/env node
const fs = require('fs');
let html = fs.readFileSync('/home/user/Fantasy-Tracker/index.html', 'utf8');

function replace(old, neo, required=true) {
  if (!html.includes(old)) {
    if (required) { console.error('NOT FOUND:', old.slice(0,100)); process.exit(1); }
    return;
  }
  html = html.replace(old, neo);
}

// ─────────────────────────────────────────────
// 1. Re-embed updated draft_board.csv
// ─────────────────────────────────────────────
const csv = fs.readFileSync('/home/user/Fantasy-Tracker/draft_board.csv', 'utf8');
const startMark = 'const _RAW_BOARD = `';
const endMark = '`;\n\nconst _RAW_IDP';
const startIdx = html.indexOf(startMark);
const endIdx = html.indexOf(endMark);
if (startIdx === -1 || endIdx === -1) { console.error('CSV markers not found'); process.exit(1); }
html = html.slice(0, startIdx) + startMark + csv.trim() + '`;\n\nconst _RAW_IDP' + html.slice(endIdx + endMark.length);
console.log('✅ CSV re-embedded');

// ─────────────────────────────────────────────
// 2. Add Rookies tab to nav
// ─────────────────────────────────────────────
replace(
  `  <div class="nav-tab" onclick="go('draft')">🎯 Live Draft</div>`,
  `  <div class="nav-tab" onclick="go('draft')">🎯 Live Draft</div>
  <div class="nav-tab" onclick="go('rookies')">🌟 Rookies &amp; Taxi</div>`
);

// ─────────────────────────────────────────────
// 3. Add Rookies panel (before closing body)
// ─────────────────────────────────────────────
replace(
  `<!-- ═══════ TAB 1: MASTER BOARD ═══════ -->`,
  `<!-- ═══════ TAB 8: ROOKIES & TAXI ═══════ -->
<div id="panel-rookies" class="panel">
  <div class="stat-row" id="rookieStats"></div>
  <div class="toolbar">
    <span class="pill on" id="rk-ALL" onclick="setRkPill('ALL',this)">ALL</span>
    <span class="pill" id="rk-ELITE" onclick="setRkPill('ELITE_TAXI',this)" style="border-color:var(--qb)">⭐ Elite Taxi</span>
    <span class="pill" id="rk-STRONG" onclick="setRkPill('STRONG_TAXI',this)" style="border-color:var(--gem)">💪 Strong Taxi</span>
    <span class="pill" id="rk-SPEC" onclick="setRkPill('SPECULATIVE',this)" style="border-color:var(--muted)">🎰 Speculative</span>
    <span class="pill qb" id="rk-QB" onclick="setRkPos('QB',this)">QB</span>
    <span class="pill rb" id="rk-RB" onclick="setRkPos('RB',this)">RB</span>
    <span class="pill wr" id="rk-WR" onclick="setRkPos('WR',this)">WR</span>
    <span class="pill te" id="rk-TE" onclick="setRkPos('TE',this)">TE</span>
    <span class="pill idp" id="rk-IDP" onclick="setRkPos('IDP',this)">IDP</span>
  </div>
  <div id="rookieCards" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px;margin-bottom:14px"></div>
  <div class="tbl-wrap">
    <table>
      <thead><tr>
        <th>Pick</th><th>Player</th><th>Pos</th><th>Team</th><th>Age</th>
        <th>Taxi Grade</th><th>My Rank</th><th>Tgt Rd</th>
        <th>Proj</th><th>Ceiling</th><th>Future</th><th>DP Val</th>
      </tr></thead>
      <tbody id="rookieBody"></tbody>
    </table>
  </div>
  <div style="margin-top:14px;padding:12px;background:rgba(255,159,67,.07);border:1px solid rgba(255,159,67,.3);border-radius:6px;font-size:11px;color:var(--idp)">
    ⚠️ <strong>Draft Sharks warning:</strong> "This class might have gotten WORSE after draft. WRs landed in inept offenses. RBs find no clear path to starting." Top 4 picks (Love/Mendoza/Tate/Bailey) are genuine dynasty assets. After that, value drops sharply. De'Zhaun Stribling: ranked lower than market consensus per CBS Sports.
  </div>
</div>

<!-- ═══════ TAB 1: MASTER BOARD ═══════ -->`
);

// ─────────────────────────────────────────────
// 4. Add 🌟 Rookies filter pill to master board
// ─────────────────────────────────────────────
replace(
  `    <span class="pill" id="bp-BUYLOW" onclick="setBToggle('BUYLOW',this)" style="border-color:#f368e0">📉 Buy Low</span>`,
  `    <span class="pill" id="bp-BUYLOW" onclick="setBToggle('BUYLOW',this)" style="border-color:#f368e0">📉 Buy Low</span>
    <span class="pill" id="bp-ROOKIE" onclick="setBToggle('ROOKIE',this)" style="border-color:var(--qb)">🌟 Rookies</span>`
);

// ─────────────────────────────────────────────
// 5. CSS for taxi grade badges
// ─────────────────────────────────────────────
replace(
  `/* ── Misc ── */`,
  `/* ── Taxi grade badges ── */
.taxi-elite{background:rgba(255,215,0,.15);color:var(--qb);padding:2px 7px;border-radius:3px;font-size:10px;font-weight:700}
.taxi-strong{background:rgba(76,175,80,.15);color:var(--gem);padding:2px 7px;border-radius:3px;font-size:10px;font-weight:700}
.taxi-spec{background:rgba(107,127,163,.15);color:var(--muted);padding:2px 7px;border-radius:3px;font-size:10px;font-weight:700}
.rookie-card{background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:12px 14px}
.rookie-card.elite{border-color:rgba(255,215,0,.4);background:rgba(255,215,0,.04)}
.rookie-card.strong{border-color:rgba(76,175,80,.3);background:rgba(76,175,80,.03)}
.rookie-card.spec{border-color:rgba(107,127,163,.2)}

/* ── Misc ── */`
);

// ─────────────────────────────────────────────
// 6. JS: add ROOKIE toggle state + update setBToggle + getFilteredBoard
// ─────────────────────────────────────────────
replace(
  `let _bPos='ALL', _bSort={col:'master_score',dir:-1}, _bGem=false, _bSafe=false, _bCeil=false, _bBuyLow=false;`,
  `let _bPos='ALL', _bSort={col:'master_score',dir:-1}, _bGem=false, _bSafe=false, _bCeil=false, _bBuyLow=false, _bRookie=false;`
);

replace(
  `  if(flag==='BUYLOW'){_bBuyLow=!_bBuyLow; el.classList.toggle('on',_bBuyLow);}`,
  `  if(flag==='BUYLOW'){_bBuyLow=!_bBuyLow; el.classList.toggle('on',_bBuyLow);}
  if(flag==='ROOKIE'){_bRookie=!_bRookie; el.classList.toggle('on',_bRookie);}`
);

replace(
  `    if(_bBuyLow&&p.bust_category!=='BUY_LOW') return false;`,
  `    if(_bBuyLow&&p.bust_category!=='BUY_LOW') return false;
    if(_bRookie&&(!p.is_rookie||p.is_rookie==0||p.is_rookie==='0')) return false;`
);

// ─────────────────────────────────────────────
// 7. JS: update init() to coerce new columns
// ─────────────────────────────────────────────
replace(
  `    p.dp_value_2qb=p.dp_value_2qb!==''?n(p.dp_value_2qb):null;
    p.dp_rank_2qb=p.dp_rank_2qb!==''?n(p.dp_rank_2qb):null;
    p.dp_vs_my_rank=p.dp_vs_my_rank!==''?n(p.dp_vs_my_rank):null;`,
  `    p.dp_value_2qb=p.dp_value_2qb!==''?n(p.dp_value_2qb):null;
    p.dp_rank_2qb=p.dp_rank_2qb!==''?n(p.dp_rank_2qb):null;
    p.dp_vs_my_rank=p.dp_vs_my_rank!==''?n(p.dp_vs_my_rank):null;
    p.is_rookie=n(p.is_rookie)||0;
    p.future_value=n(p.future_value);`
);

// 8: rookie badge applied directly to index.html separately

// ─────────────────────────────────────────────
// 9. JS: update go() to include rookies tab
// ─────────────────────────────────────────────
replace(
  `  const tabs=['master','vorp','injury','idp','vegas','rounds','draft'];`,
  `  const tabs=['master','vorp','injury','idp','vegas','rounds','draft','rookies'];`
);

replace(
  `    else if(tab==='draft'){renderDraftPanel();}`,
  `    else if(tab==='draft'){renderDraftPanel();}
    else if(tab==='rookies'){renderRookiesTab();}`
);

// ─────────────────────────────────────────────
// 10. JS: Rookies tab functions (before BOOT section)
// ─────────────────────────────────────────────
replace(
  `// ═══════════════════════════════════════════════════════════
// BOOT`,
  `// ═══════════════════════════════════════════════════════════
// TAB 8 — ROOKIES & TAXI
// ═══════════════════════════════════════════════════════════
let _rkGrade='ALL', _rkPos='ALL';

function setRkPill(grade, el){
  _rkGrade=grade;
  document.querySelectorAll('[id^="rk-"]').forEach(e=>{
    if(['ALL','ELITE_TAXI','STRONG_TAXI','SPECULATIVE'].some(g=>e.id.endsWith(g.replace('_','-'))||e.id==='rk-ALL')) e.classList.remove('on');
  });
  el.classList.add('on');
  renderRookiesTab();
}
function setRkPos(pos, el){
  _rkPos=_rkPos===pos?'ALL':pos;
  document.querySelectorAll('[id^="rk-"]').forEach(e=>{
    if(['QB','RB','WR','TE','IDP'].some(p=>e.id==='rk-'+p)) e.classList.remove('on');
  });
  if(_rkPos!=='ALL') el.classList.add('on');
  renderRookiesTab();
}

function taxiBadgeHtml(grade){
  if(grade==='ELITE_TAXI')  return '<span class="taxi-elite">⭐ ELITE TAXI</span>';
  if(grade==='STRONG_TAXI') return '<span class="taxi-strong">💪 STRONG</span>';
  if(grade==='SPECULATIVE') return '<span class="taxi-spec">🎰 SPEC</span>';
  return '<span class="taxi-spec">—</span>';
}

function renderRookiesTab(){
  const rookies = board.filter(p => p.is_rookie==1).filter(p=>{
    if(_rkGrade!=='ALL' && p.taxi_grade!==_rkGrade) return false;
    if(_rkPos!=='ALL'){
      if(_rkPos==='IDP' && !isIDP(p.pos)) return false;
      if(_rkPos!=='IDP' && p.pos!==_rkPos) return false;
    }
    return true;
  }).sort((a,b)=>(a.my_rank||999)-(b.my_rank||999));

  // Stat cards
  const elite=board.filter(p=>p.is_rookie==1&&p.taxi_grade==='ELITE_TAXI').length;
  const strong=board.filter(p=>p.is_rookie==1&&p.taxi_grade==='STRONG_TAXI').length;
  const spec=board.filter(p=>p.is_rookie==1&&p.taxi_grade==='SPECULATIVE').length;
  document.getElementById('rookieStats').innerHTML=\`
    <div class="stat-card"><div class="label">2026 Rookies</div><div class="value" style="color:var(--qb)">\${board.filter(p=>p.is_rookie==1).length}</div></div>
    <div class="stat-card"><div class="label">⭐ Elite Taxi</div><div class="value" style="color:var(--qb)">\${elite}</div></div>
    <div class="stat-card"><div class="label">💪 Strong Taxi</div><div class="value" style="color:var(--gem)">\${strong}</div></div>
    <div class="stat-card"><div class="label">🎰 Speculative</div><div class="value" style="color:var(--muted)">\${spec}</div></div>
  \`;

  // Cards view
  document.getElementById('rookieCards').innerHTML=rookies.filter(p=>p.taxi_grade==='ELITE_TAXI'||p.taxi_grade==='STRONG_TAXI').map(p=>{
    const gradeClass=p.taxi_grade==='ELITE_TAXI'?'elite':'strong';
    const vd=window._vegasMap?.[p.player.toLowerCase()];
    const vegasLine=vd?\`<span style="color:\${vd.vegas_flag==='BOOST'?'var(--boost)':vd.vegas_flag==='FADE'?'var(--bust)':'var(--muted)'};font-size:10px">🎰 \${vd.vegas_flag} \${vd.win_total}W</span>\`:'';
    return \`<div class="rookie-card \${gradeClass}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
        <div>
          <strong>\${p.player}</strong> \${posBadge(p.pos)} <span style="color:var(--muted);font-size:11px">\${p.team} · Age \${p.age}</span>
        </div>
        \${taxiBadgeHtml(p.taxi_grade)}
      </div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:6px">\${p.rookie_context||p.notes||''}</div>
      <div style="display:flex;gap:12px;font-size:11px">
        <span>Rank <strong style="color:var(--text)">#\${p.my_rank}</strong></span>
        <span>R\${p.target_round}</span>
        <span>Future <strong style="color:var(--idp)">\${p.future_value||'?'}</strong></span>
        \${p.dp_value_2qb?\`<span>DP <strong>\${p.dp_value_2qb.toLocaleString()}</strong></span>\`:''}
        \${vegasLine}
      </div>
    </div>\`;
  }).join('');

  // Table view
  document.getElementById('rookieBody').innerHTML=rookies.map(p=>\`
    <tr>
      <td><span class="rnd-badge">\${p.adp_round?'R'+p.adp_round:'?'}</span></td>
      <td><strong>\${p.player}</strong></td>
      <td>\${posBadge(p.pos)}</td>
      <td>\${p.team}</td>
      <td>\${p.age}</td>
      <td>\${taxiBadgeHtml(p.taxi_grade)}</td>
      <td>\${p.my_rank||'—'}</td>
      <td><span class="rnd-badge">R\${p.target_round}</span></td>
      <td>\${p.proj_pts_2026||'—'}</td>
      <td>\${p.ceiling_score||'—'}</td>
      <td>\${p.future_value||'—'}</td>
      <td style="color:var(--muted);font-size:11px">\${p.dp_value_2qb?p.dp_value_2qb.toLocaleString():'—'}</td>
    </tr>
  \`).join('');
}

// ═══════════════════════════════════════════════════════════
// BOOT`
);

// ─────────────────────────────────────────────
// 11. Also update renderStatCards to show rookie count
// ─────────────────────────────────────────────
replace(
  `  document.getElementById('statCards').innerHTML=\`
    <div class="stat-card"><div class="label">Players Loaded</div><div class="value" style="color:var(--boost)">\${board.length}</div></div>
    <div class="stat-card"><div class="label">💎 Gems Found</div><div class="value" style="color:var(--gem)">\${gems}</div></div>
    <div class="stat-card"><div class="label">📉 Buy Low</div><div class="value" style="color:#f368e0">\${buyLow}</div></div>
    <div class="stat-card"><div class="label">🚫 Rental/Fade</div><div class="value" style="color:var(--bust)">\${rentals}</div></div>
    <div class="stat-card"><div class="label">⚠️ High Risk</div><div class="value" style="color:#ff9f43">\${high}</div></div>\`;`,
  `  const rookieCount=board.filter(p=>p.is_rookie==1).length;
  document.getElementById('statCards').innerHTML=\`
    <div class="stat-card"><div class="label">Players Loaded</div><div class="value" style="color:var(--boost)">\${board.length}</div></div>
    <div class="stat-card"><div class="label">💎 Gems Found</div><div class="value" style="color:var(--gem)">\${gems}</div></div>
    <div class="stat-card"><div class="label">🌟 2026 Rookies</div><div class="value" style="color:var(--qb)">\${rookieCount}</div></div>
    <div class="stat-card"><div class="label">📉 Buy Low</div><div class="value" style="color:#f368e0">\${buyLow}</div></div>
    <div class="stat-card"><div class="label">⚠️ High Risk</div><div class="value" style="color:#ff9f43">\${high}</div></div>\`;`
);

// ─────────────────────────────────────────────
// Write
// ─────────────────────────────────────────────
fs.writeFileSync('/home/user/Fantasy-Tracker/index.html', html);
console.log('✅ All patches applied. File size:', html.length);
