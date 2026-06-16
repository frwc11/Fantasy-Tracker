#!/usr/bin/env node
/**
 * build_data.js — regenerates data/*.js from all CSV source files
 * Run: node build_data.js
 * Output: data/players.js, data/idp.js, data/vorp.js, data/vegas.js, data/rounds.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// ─── Helpers ───────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  return lines.slice(1).map(line => {
    const vals = [];
    let cur = '', inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === ',' && !inQ) { vals.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    vals.push(cur.trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
    return obj;
  });
}

function n(v) { const x = parseFloat(v); return isNaN(x) ? null : x; }
function ni(v) { const x = parseInt(v); return isNaN(x) ? null : x; }

// Position injury baselines
const INJ_BASELINE = { QB: 2.5, RB: 4.5, WR: 3.0, TE: 3.2, EDGE: 3.8, LB: 3.5, DB: 3.0, S: 3.0, CB: 3.2, DL: 3.5 };
function injBaseline(pos) { return INJ_BASELINE[pos] || 3.5; }

// Position proj_pts baselines for rookies (conservative)
const PROJ_BASELINE = { QB: 280, RB: 140, WR: 120, TE: 85, EDGE: 160, LB: 200, DB: 170, S: 170, CB: 140 };
function projBaseline(pos) { return PROJ_BASELINE[pos] || 120; }

// ─── Missing 2026 rookies not yet in board ───────────────────────────────
const EXTRA_ROOKIES = [
  { player:'Mansoor Delane', pos:'CB', team:'KC', age:21, consensus_rank:19, my_rank:19, adp_round:2, target_round:2,
    taxi_grade:'STRONG_TAXI', gem_flag:0, future_value:74,
    rookie_context:'Pick 6 overall — KC traded up — elite CB in Mahomes defense — DAY 1 starter — INT upside',
    notes:'R1 pick 6 — KC traded up — elite CB prospect — ballhawk in premier defense — INT-heavy scoring format',
    dp_value_2qb:3300, dp_rank_2qb:49 },
  { player:'Emmett Johnson', pos:'RB', team:'KC', age:21, consensus_rank:80, my_rank:82, adp_round:8, target_round:9,
    taxi_grade:'SPECULATIVE', gem_flag:0, future_value:60,
    rookie_context:'Later-round KC RB — Mahomes offense — handcuff opportunity behind Pacheco',
    notes:'Later-round RB — KC system upside — SPECULATIVE stash only — Pacheco ahead on depth chart',
    dp_value_2qb:900, dp_rank_2qb:110 },
  { player:'Jonah Coleman', pos:'RB', team:'DEN', age:21, consensus_rank:78, my_rank:80, adp_round:8, target_round:9,
    taxi_grade:'SPECULATIVE', gem_flag:0, future_value:58,
    rookie_context:'DEN later-round RB — Nix connection — speculative taxi stash',
    notes:'DEN RB stash — Nix offense upside — developmental only — SPECULATIVE',
    dp_value_2qb:800, dp_rank_2qb:115 },
  { player:'Mike Washington Jr.', pos:'RB', team:'LV', age:21, consensus_rank:82, my_rank:85, adp_round:8, target_round:10,
    taxi_grade:'SPECULATIVE', gem_flag:0, future_value:55,
    rookie_context:'LV later-round RB — Mendoza connection — LV 6.5 win FADE limits near-term value',
    notes:'LV RB — pairs with Mendoza long-term — LV 6.5 FADE kills year 1 value — pure taxi',
    dp_value_2qb:700, dp_rank_2qb:120 },
  { player:'Malachi Fields', pos:'WR', team:'NYG', age:21, consensus_rank:72, my_rank:75, adp_round:7, target_round:8,
    taxi_grade:'SPECULATIVE', gem_flag:0, future_value:60,
    rookie_context:'NYG WR stash — pairs with Nabers — developmental pick — NYG 7.5 wins NEUTRAL context',
    notes:'NYG WR stash — Nabers already occupies WR1 role — developmental taxi target',
    dp_value_2qb:1000, dp_rank_2qb:106 },
  { player:'Zachariah Branch', pos:'WR', team:'ATL', age:21, consensus_rank:68, my_rank:72, adp_round:7, target_round:8,
    taxi_grade:'SPECULATIVE', gem_flag:0, future_value:58,
    rookie_context:'ATL WR stash — ATL 6.5 win FADE kills near-term value — pure upside dart throw',
    notes:'ATL 6.5 WIN TOTAL FADE — even good WR talent gets buried in bad offense — speculative only',
    dp_value_2qb:1100, dp_rank_2qb:102 },
  { player:'Eli Stowers', pos:'TE', team:'PHI', age:22, consensus_rank:60, my_rank:65, adp_round:6, target_round:8,
    taxi_grade:'SPECULATIVE', gem_flag:0, future_value:55,
    rookie_context:'PHI R2 TE — blocking profile limits dynasty value — Goedert still WS1 — limited upside',
    notes:'PHI TE — blocking-first profile — limited dynasty upside behind Goedert — SPECULATIVE at best',
    dp_value_2qb:800, dp_rank_2qb:115 },
  { player:'Antonio Williams', pos:'WR', team:'WAS', age:22, consensus_rank:62, my_rank:65, adp_round:6, target_round:7,
    taxi_grade:'SPECULATIVE', gem_flag:0, future_value:60,
    rookie_context:'WAS R2 WR — crowded with McLaurin — Daniels connection gives upside but target share unclear',
    notes:'WAS WR — crowded room behind McLaurin — Daniels offense upside — developmental',
    dp_value_2qb:1300, dp_rank_2qb:95 },
  { player:'Chris Bell', pos:'WR', team:'MIA', age:22, consensus_rank:65, my_rank:68, adp_round:7, target_round:9,
    taxi_grade:'SPECULATIVE', gem_flag:0, future_value:55,
    rookie_context:'MIA R3 WR — ACL recovery concern — MIA 4.5 win FADE — limited near-term value',
    notes:'MIA WR — ACL recovery adds risk — MIA 4.5 WIN TOTAL FADE — pure depth stash',
    dp_value_2qb:900, dp_rank_2qb:110 },
];

// ─── Load existing board ──────────────────────────────────────────────────
let boardRows = parseCSV(fs.readFileSync(path.join(ROOT, 'draft_board.csv'), 'utf8'));
const existingPlayers = new Set(boardRows.map(r => r.player.toLowerCase().trim()));

// Add extra rookies not yet on board
EXTRA_ROOKIES.forEach(r => {
  if (existingPlayers.has(r.player.toLowerCase())) {
    // Update is_rookie flag if missing
    const row = boardRows.find(x => x.player.toLowerCase() === r.player.toLowerCase());
    if (row && (!row.is_rookie || row.is_rookie === '0')) {
      row.is_rookie = '1';
      row.taxi_grade = r.taxi_grade;
      row.rookie_context = r.rookie_context;
    }
    return;
  }

  const pos = r.pos;
  const ms = r.master_score || Math.round(r.future_value * 0.75);
  const proj = r.proj_pts || projBaseline(pos);
  const ceil = r.ceiling_score || Math.min(100, Math.round(ms * 1.15));
  const fl   = r.floor_score_v2 || Math.round(ms * 0.85);
  const inj  = r.injury_risk_score || injBaseline(pos);

  boardRows.push({
    player: r.player, pos, team: r.team, age: r.age,
    consensus_rank: r.consensus_rank, my_rank: r.my_rank,
    adp_round: r.adp_round, target_round: r.target_round,
    tier: 'R' + r.target_round, value_gap: r.value_gap || 0,
    gem_flag: r.gem_flag || 0, notes: r.notes || '',
    vorp_raw: '', vorp_adjusted: '', vorp_2qb_adjusted: '', te_premium_pts: '',
    vorp_rank: '', positional_drop: '', cliff: '',
    snap_pct: '', target_share: '', air_yards_share: '', yprt: '', separation: '',
    cpoe: '', air_yards_per_att: '', pressure_rate_faced: '', time_to_throw: '',
    opportunity_share: '', yac_per_carry: '', broken_tackle_rate: '', route_pct: '',
    snap_pct_def: '', pressure_rate_pass_rush: '', pass_rush_win_rate: '', tackle_rate: '',
    proj_pts_2026: proj, ceiling_score: ceil, floor_score: fl, floor_score_v2: fl,
    future_value: r.future_value, games_missed_2025: 0, games_missed_2024: 0, games_missed_2023: 0,
    injury_type_history: 'None noted', games_played_pct_career: 100,
    injury_risk_score: inj, injury_risk_tier: inj <= 2.5 ? '🟢 LOW RISK' : '🟡 MODERATE',
    master_score: ms,
    bust_category: r.gem_flag ? 'GEM' : 'NONE', bust_reason: '',
    dp_value_2qb: r.dp_value_2qb || '', dp_rank_2qb: r.dp_rank_2qb || '',
    dp_vs_my_rank: r.dp_rank_2qb && r.my_rank ? r.dp_rank_2qb - r.my_rank : '',
    market_inefficiency: '',
    is_rookie: 1, taxi_grade: r.taxi_grade, rookie_context: r.rookie_context || '',
    depth_position: '', depth_role: '', is_handcuff: 0, handcuff_of: '',
  });
  existingPlayers.add(r.player.toLowerCase());
});

// Sort by my_rank
boardRows.sort((a, b) => (parseInt(a.my_rank) || 999) - (parseInt(b.my_rank) || 999));

// ─── Fill missing defaults ────────────────────────────────────────────────
boardRows.forEach(p => {
  if (!p.master_score || p.master_score === '') {
    // Derive from ceiling/floor if available
    const ceil = n(p.ceiling_score) || 70;
    const fl = n(p.floor_score_v2) || 50;
    const fv = n(p.future_value) || 60;
    p.master_score = Math.round((ceil * 0.3 + fl * 0.25 + fv * 0.25 + 50 * 0.2));
  }
  if (!p.proj_pts_2026 || p.proj_pts_2026 === '') {
    p.proj_pts_2026 = projBaseline(p.pos);
  }
  if (!p.ceiling_score || p.ceiling_score === '') {
    p.ceiling_score = Math.min(100, Math.round(n(p.master_score) * 1.15));
  }
  if (!p.floor_score_v2 || p.floor_score_v2 === '') {
    p.floor_score_v2 = Math.round(n(p.master_score) * 0.85);
  }
  if (!p.injury_risk_score || p.injury_risk_score === '') {
    p.injury_risk_score = injBaseline(p.pos);
  }
  if (!p.bust_category || p.bust_category === '') {
    p.bust_category = 'NONE';
  }
  if (!p.is_rookie) p.is_rookie = 0;
  if (!p.taxi_grade) p.taxi_grade = 'NONE';
});

// ─── Build typed player objects (trimmed columns) ─────────────────────────
const KEEP_COLS = [
  'player','pos','team','age','consensus_rank','my_rank','target_round',
  'gem_flag','notes','cliff',
  'vorp_adjusted','vorp_2qb_adjusted','te_premium_pts',
  'snap_pct','target_share','cpoe','air_yards_per_att','pressure_rate_faced',
  'time_to_throw','opportunity_share','yac_per_carry','broken_tackle_rate',
  'snap_pct_def','pressure_rate_pass_rush','pass_rush_win_rate','tackle_rate',
  'separation','yprt',
  'proj_pts_2026','ceiling_score','floor_score_v2','future_value',
  'games_missed_2025','games_missed_2024','injury_type_history',
  'injury_risk_score','injury_risk_tier','master_score',
  'bust_category','bust_reason',
  'dp_value_2qb','dp_rank_2qb','market_inefficiency',
  'is_rookie','taxi_grade','rookie_context',
  'depth_role','is_handcuff','handcuff_of',
];

const NUM_COLS = new Set([
  'age','consensus_rank','my_rank','target_round','gem_flag',
  'vorp_adjusted','vorp_2qb_adjusted','te_premium_pts',
  'snap_pct','target_share','cpoe','air_yards_per_att','pressure_rate_faced',
  'time_to_throw','opportunity_share','yac_per_carry','broken_tackle_rate',
  'snap_pct_def','pressure_rate_pass_rush','pass_rush_win_rate','tackle_rate',
  'separation','yprt','proj_pts_2026','ceiling_score','floor_score_v2',
  'future_value','games_missed_2025','games_missed_2024',
  'injury_risk_score','master_score','dp_value_2qb','dp_rank_2qb',
  'is_rookie','is_handcuff',
]);

function typedPlayer(p) {
  const out = {};
  KEEP_COLS.forEach(col => {
    let v = p[col];
    if (v === undefined || v === null) v = '';
    if (NUM_COLS.has(col)) {
      const x = parseFloat(v);
      out[col] = isNaN(x) ? (col === 'gem_flag' || col === 'is_rookie' || col === 'is_handcuff' ? 0 : null) : x;
    } else {
      out[col] = String(v).trim();
    }
  });
  return out;
}

const players = boardRows.map(typedPlayer);

// ─── Write data/players.js ────────────────────────────────────────────────
const playersJs = `// auto-generated by build_data.js — ${new Date().toISOString().slice(0,10)}
// ${players.length} players — run 'node build_data.js' to regenerate
window.BOARD_DATA = ${JSON.stringify(players, null, 0)};
`;
fs.writeFileSync(path.join(ROOT, 'data/players.js'), playersJs);
console.log(`✅ data/players.js — ${players.length} players, ${Math.round(playersJs.length/1024)}KB`);

// ─── Write data/idp.js ───────────────────────────────────────────────────
const idpRaw = parseCSV(fs.readFileSync(path.join(ROOT, 'idp_model.csv'), 'utf8'));
const idpTyped = idpRaw.map(p => ({
  player: p.player, pos: p.pos, team: p.team,
  age: n(p.age), proj_sacks: n(p.proj_sacks),
  proj_solo_tackles: n(p.proj_solo_tackles), proj_ints: n(p.proj_ints),
  proj_tfl: n(p.proj_tfl), proj_fppg: n(p.proj_fppg),
  idp_tier: p.idp_tier, draft_round_target: p.draft_round_target,
}));
const idpJs = `// auto-generated by build_data.js
window.IDP_DATA = ${JSON.stringify(idpTyped, null, 0)};
`;
fs.writeFileSync(path.join(ROOT, 'data/idp.js'), idpJs);
console.log(`✅ data/idp.js — ${idpTyped.length} IDPs, ${Math.round(idpJs.length/1024)}KB`);

// ─── Write data/vorp.js ──────────────────────────────────────────────────
const vorpRaw = parseCSV(fs.readFileSync(path.join(ROOT, 'vorp_data.csv'), 'utf8'));
const vorpTyped = vorpRaw.map(p => ({
  player: p.player, pos: p.pos, team: p.team,
  vorp_rank: n(p.vorp_rank), vorp_raw: n(p.vorp_raw),
  vorp_adjusted: n(p.vorp_adjusted),
  vorp_2qb_adjusted: p.vorp_2qb_adjusted !== '' ? n(p.vorp_2qb_adjusted) : null,
  te_premium_pts: n(p.te_premium_pts),
  drop_to_next: n(p.drop_to_next), drop_pct: n(p.drop_pct),
  cliff: p.cliff, cliff_2qb: p.cliff_2qb, next_player: p.next_player,
}));
const vorpJs = `// auto-generated by build_data.js
window.VORP_DATA = ${JSON.stringify(vorpTyped, null, 0)};
`;
fs.writeFileSync(path.join(ROOT, 'data/vorp.js'), vorpJs);
console.log(`✅ data/vorp.js — ${vorpTyped.length} rows, ${Math.round(vorpJs.length/1024)}KB`);

// ─── Write data/vegas.js ─────────────────────────────────────────────────
const vegasRaw = parseCSV(fs.readFileSync(path.join(ROOT, 'vegas_overlay.csv'), 'utf8'));
const vegasTyped = vegasRaw.map(p => ({
  player: p.player, team: p.team,
  win_total: n(p.win_total), team_ou: p.team_ou,
  vegas_flag: p.vegas_flag, context_note: p.context_note,
}));
const vegasJs = `// auto-generated by build_data.js
window.VEGAS_DATA = ${JSON.stringify(vegasTyped, null, 0)};
`;
fs.writeFileSync(path.join(ROOT, 'data/vegas.js'), vegasJs);
console.log(`✅ data/vegas.js — ${vegasTyped.length} rows, ${Math.round(vegasJs.length/1024)}KB`);

// ─── Write data/rounds.js ────────────────────────────────────────────────
const roundsMd = fs.readFileSync(path.join(ROOT, 'round_report.md'), 'utf8');
const roundsJs = `// auto-generated by build_data.js
window.ROUNDS_MD = ${JSON.stringify(roundsMd)};
`;
fs.writeFileSync(path.join(ROOT, 'data/rounds.js'), roundsJs);
console.log(`✅ data/rounds.js — ${Math.round(roundsJs.length/1024)}KB`);

// ─── Also update draft_board.csv with new extra rookies ─────────────────
const allHeaders = [
  'player','pos','team','age','consensus_rank','my_rank','adp_round','target_round',
  'tier','value_gap','gem_flag','notes','vorp_raw','vorp_adjusted','vorp_2qb_adjusted',
  'te_premium_pts','vorp_rank','positional_drop','cliff',
  'snap_pct','target_share','air_yards_share','yprt','separation','cpoe',
  'air_yards_per_att','pressure_rate_faced','time_to_throw','opportunity_share',
  'yac_per_carry','broken_tackle_rate','route_pct','snap_pct_def',
  'pressure_rate_pass_rush','pass_rush_win_rate','tackle_rate',
  'proj_pts_2026','ceiling_score','floor_score','floor_score_v2','future_value',
  'games_missed_2025','games_missed_2024','games_missed_2023','injury_type_history',
  'games_played_pct_career','injury_risk_score','injury_risk_tier','master_score',
  'bust_category','bust_reason','dp_value_2qb','dp_rank_2qb','dp_vs_my_rank',
  'market_inefficiency','is_rookie','taxi_grade','rookie_context',
  'depth_position','depth_role','is_handcuff','handcuff_of',
];
const csvOut = [
  allHeaders.join(','),
  ...boardRows.map(p => allHeaders.map(h => {
    const v = String(p[h] !== undefined ? p[h] : '');
    return v.includes(',') ? `"${v}"` : v;
  }).join(','))
].join('\n') + '\n';
fs.writeFileSync(path.join(ROOT, 'draft_board.csv'), csvOut);
console.log(`✅ draft_board.csv — ${boardRows.length} total players`);

console.log(`\nFile sizes:`);
['data/players.js','data/idp.js','data/vorp.js','data/vegas.js','data/rounds.js'].forEach(f => {
  const sz = fs.statSync(path.join(ROOT, f)).size;
  console.log(`  ${f}: ${Math.round(sz/1024)}KB`);
});
