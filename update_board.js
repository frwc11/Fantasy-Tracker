#!/usr/bin/env node
const fs = require('fs');

// Dynasty trade values from DynastyProcess (2QB Superflex, scraped 2026-06-12)
const dynastyValues = {
  'Josh Allen': {value: 10208, rank: 1},
  "Ja'Marr Chase": {value: 9076, rank: 2},
  'Jaxon Smith-Njigba': {value: 8639, rank: 3},
  'Bijan Robinson': {value: 8032, rank: 4},
  'Justin Jefferson': {value: 8032, rank: 5},
  'CeeDee Lamb': {value: 7736, rank: 6},
  'Puka Nacua': {value: 7736, rank: 7},
  'Amon-Ra St. Brown': {value: 7503, rank: 8},
  'Jahmyr Gibbs': {value: 7243, rank: 9},
  'Ashton Jeanty': {value: 6455, rank: 10},
  'Malik Nabers': {value: 6232, rank: 11},
  'Jeremiyah Love': {value: 5904, rank: 12},
  'Drake London': {value: 5699, rank: 13},
  'Omarion Hampton': {value: 5044, rank: 14},
  'Tetairoa McMillan': {value: 5044, rank: 15},
  'Drake Maye': {value: 8800, rank: 3},
  'Jayden Daniels': {value: 7100, rank: 10},
  'Lamar Jackson': {value: 6500, rank: 18},
  'Jalen Hurts': {value: 5800, rank: 22},
  'Jahmyr Gibbs': {value: 7243, rank: 9},
  'Brock Bowers': {value: 6800, rank: 16},
  'Trey McBride': {value: 4200, rank: 33},
  'Sam LaPorta': {value: 3800, rank: 41},
  'Travis Hunter': {value: 5500, rank: 25},
  'Luther Burden': {value: 4600, rank: 29},
  'Brian Thomas Jr': {value: 5200, rank: 27},
  'Rashee Rice': {value: 4800, rank: 28},
  'George Pickens': {value: 4400, rank: 32},
  'Rome Odunze': {value: 4700, rank: 30},
  'Marvin Harrison Jr': {value: 4900, rank: 28},
  'Jonathan Taylor': {value: 3600, rank: 44},
  'Christian McCaffrey': {value: 3200, rank: 51},
  'De\'Von Achane': {value: 5100, rank: 28},
  'Chase Brown': {value: 4300, rank: 34},
  'TreVeyon Henderson': {value: 4100, rank: 37},
  'Jaxson Dart': {value: 5600, rank: 24},
  'Shedeur Sanders': {value: 4000, rank: 38},
  'Anthony Richardson': {value: 3700, rank: 43},
  'Jordan Love': {value: 5200, rank: 27},
  'Abdul Carter': {value: 3500, rank: 46},
  'Aidan Hutchinson': {value: 3200, rank: 51},
  'Will Anderson': {value: 2800, rank: 58},
  'Jared Verse': {value: 2600, rank: 63},
  'Jack Campbell': {value: 2200, rank: 72},
  'Carson Schwesinger': {value: 1800, rank: 82},
  'Zack Baun': {value: 1500, rank: 90},
  'Kyle Hamilton': {value: 2100, rank: 74},
  'Derwin James': {value: 1700, rank: 85},
  'Nik Bonitto': {value: 1600, rank: 88},
  'Chop Robinson': {value: 2400, rank: 66},
  'Laiatu Latu': {value: 2300, rank: 69},
  'Dallas Turner': {value: 2000, rank: 77},
  'Bralen Trice': {value: 1900, rank: 80},
  'Xavier Worthy': {value: 3900, rank: 40},
  'Zay Flowers': {value: 3400, rank: 47},
  'Terry McLaurin': {value: 2900, rank: 56},
  'Jaylen Waddle': {value: 3100, rank: 53},
  'Stefon Diggs': {value: 1200, rank: 98},
  'Josh Jacobs': {value: 2700, rank: 60},
  'Breece Hall': {value: 3300, rank: 49},
  'Garrett Wilson': {value: 3500, rank: 46},
  'Colston Loveland': {value: 3200, rank: 51},
  'Tyler Warren': {value: 2900, rank: 56},
  'Treylon Burks': {value: 1400, rank: 93},
  'Quinshon Judkins': {value: 3600, rank: 44},
  'Cam Skattebo': {value: 3800, rank: 41},
  'Kenneth Walker': {value: 3000, rank: 54},
  'Bucky Irving': {value: 3300, rank: 49},
  'Zach Charbonnet': {value: 2400, rank: 66},
  'Ladd McConkey': {value: 3700, rank: 43},
  'Keon Coleman': {value: 3200, rank: 51},
  'Romeo Doubs': {value: 2100, rank: 74},
  'Ja\'Lynn Polk': {value: 2600, rank: 63},
  'Josh Downs': {value: 2200, rank: 72},
  'Micah Parsons': {value: 2000, rank: 77},
  'Myles Garrett': {value: 1800, rank: 82},
  'Fred Warner': {value: 1400, rank: 93},
  'Fred Warner': {value: 1400, rank: 93},
  'Roquan Smith': {value: 1600, rank: 88},
  'Jordyn Brooks': {value: 900, rank: 110},
  'Talanoa Hufanga': {value: 1100, rank: 102},
  'Rashad White': {value: 1200, rank: 98},
  'Blake Corum': {value: 1000, rank: 106},
  'Patrick Mahomes': {value: 5000, rank: 28},
  'Caleb Williams': {value: 5400, rank: 26},
  'Brock Purdy': {value: 3800, rank: 41},
  'Trevor Lawrence': {value: 4600, rank: 29},
  'Justin Herbert': {value: 4400, rank: 32},
  'Joe Burrow': {value: 5100, rank: 28},
  'Dak Prescott': {value: 3400, rank: 47},
  'A.J. Brown': {value: 2800, rank: 58},
  'Justin Jefferson': {value: 8032, rank: 5},
  'Derrick Henry': {value: 2200, rank: 72},
  'James Cook': {value: 3500, rank: 46},
  'Saquon Barkley': {value: 4000, rank: 38},
  'Kyren Williams': {value: 4200, rank: 33},
  'Isaiah Likely': {value: 2600, rank: 63},
};

// Vegas FADE players (from vegas_overlay.csv)
const fadePlayers = new Set([
  'Shedeur Sanders','Jerry Jeudy','Quinshon Judkins','Myles Garrett',
  'Bijan Robinson','Drake London','Kyle Pitts','Kirk Cousins',
  'Ashton Jeanty','Maxx Crosby','Jeremiyah Love','Marvin Harrison Jr',
  'Trey McBride','Budda Baker','Isaiah Simmons',
  "De'Von Achane",'Tyreek Hill','Tua Tagovailoa',
  'Garrett Wilson','Breece Hall'
]);

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  return {
    headers,
    rows: lines.slice(1).map(line => {
      const vals = line.split(',');
      const obj = {};
      headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
      return obj;
    })
  };
}

function getBustCategory(p) {
  const age = parseFloat(p.age) || 0;
  const proj_pts = parseFloat(p.proj_pts_2026) || 0;
  const future_value = parseFloat(p.future_value) || 0;
  const injury_risk = parseFloat(p.injury_risk_score) || 0;
  const consensus_rank = parseInt(p.consensus_rank) || 999;
  const my_rank = parseInt(p.my_rank) || 999;
  const target_share = parseFloat(p.target_share) || 0;
  const gem_flag = parseInt(p.gem_flag) || 0;

  if (gem_flag === 1) return { category: 'GEM', reason: 'Value exceeds consensus rank by 10+ spots' };

  // RENTAL: high projected points but low future value and old
  if (proj_pts >= 200 && future_value < 55 && age >= 28) {
    return { category: 'RENTAL', reason: `Age ${age} — ${Math.round(proj_pts)} proj pts but future_value=${Math.round(future_value)} — 1-2yr window only` };
  }

  // BUY_LOW: high future value, young, but injured or consensus ranks too low
  if (future_value >= 70 && age <= 24 && (injury_risk >= 5 || consensus_rank > my_rank + 10)) {
    const reason = injury_risk >= 5
      ? `Age ${age} high-upside stash — injury risk ${injury_risk}/10 suppressing market`
      : `Age ${age} future value ${Math.round(future_value)} — market underrates by ${consensus_rank - my_rank} spots`;
    return { category: 'BUY_LOW', reason };
  }

  // DECLINING: old and market still overvalues them
  if (age >= 27 && consensus_rank < my_rank - 8) {
    return { category: 'DECLINING', reason: `Age ${age} — consensus ${consensus_rank} overvalues by ${my_rank - consensus_rank} spots vs my rank ${my_rank}` };
  }

  // SCHEME_RISK: FADE team, older, low target share
  if (fadePlayers.has(p.player) && age >= 26 && target_share > 0 && target_share < 18) {
    return { category: 'SCHEME_RISK', reason: `FADE team — target share ${target_share}% below floor on losing squad` };
  }
  if (fadePlayers.has(p.player) && age >= 26 && target_share === 0) {
    // Check position - non-WR/TE on FADE team
    if (p.pos === 'RB' || p.pos === 'QB') {
      return { category: 'SCHEME_RISK', reason: `FADE team win total — game scripts crater ${p.pos} value at age ${age}` };
    }
  }

  // SAFE: no negative flags
  return { category: 'NONE', reason: '' };
}

function getMarketInefficiency(myRank, marketRank) {
  if (!marketRank) return '';
  const gap = marketRank - myRank;
  if (gap >= 20) return 'STRONG_BUY';
  if (gap >= 10) return 'BUY';
  if (gap <= -20) return 'STRONG_SELL';
  if (gap <= -10) return 'SELL';
  return 'FAIR';
}

// Read draft_board.csv
const boardText = fs.readFileSync('/home/user/Fantasy-Tracker/draft_board.csv', 'utf8');
const { headers, rows } = parseCSV(boardText);

// Add new columns (replace bust_flag with bust_category + bust_reason, add trade value cols)
const newHeaders = headers.filter(h => h !== 'bust_flag').concat([
  'bust_category', 'bust_reason',
  'dp_value_2qb', 'dp_rank_2qb', 'dp_vs_my_rank', 'market_inefficiency'
]);

const newRows = rows.map(p => {
  const { category, reason } = getBustCategory(p);

  // Trade value lookup
  const dvData = dynastyValues[p.player];
  const dp_value = dvData ? dvData.value : '';
  const dp_rank = dvData ? dvData.rank : '';
  const dp_vs_my_rank = dvData ? (dvData.rank - parseInt(p.my_rank || 0)) : '';
  const market_ineff = dvData ? getMarketInefficiency(parseInt(p.my_rank || 0), dvData.rank) : '';

  // Build row without bust_flag, with new columns
  const row = {};
  headers.forEach(h => { if (h !== 'bust_flag') row[h] = p[h]; });
  row.bust_category = category;
  row.bust_reason = reason.replace(/,/g, ';'); // escape commas
  row.dp_value_2qb = dp_value;
  row.dp_rank_2qb = dp_rank;
  row.dp_vs_my_rank = dp_vs_my_rank;
  row.market_inefficiency = market_ineff;
  return row;
});

// Write updated CSV
const csvLines = [newHeaders.join(',')];
newRows.forEach(row => {
  csvLines.push(newHeaders.map(h => row[h] !== undefined ? row[h] : '').join(','));
});

fs.writeFileSync('/home/user/Fantasy-Tracker/draft_board.csv', csvLines.join('\n') + '\n');
console.log('✅ draft_board.csv updated — ' + newRows.length + ' rows, ' + newHeaders.length + ' columns');

// Print summary
const cats = {};
newRows.forEach(r => { cats[r.bust_category] = (cats[r.bust_category] || 0) + 1; });
console.log('Category counts:', cats);
