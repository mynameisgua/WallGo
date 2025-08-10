
// Wall Go (牆壁圍棋) — standalone implementation (no online)
const SIZE = 7;
const RED = 1, BLUE = 2;
const PHASE_PLACE = "place";
const PHASE_MOVE  = "move"; // move two steps with same piece, then place wall
const DIRS = [
  [ -1, 0, "U" ],
  [  1, 0, "D" ],
  [  0,-1, "L" ],
  [  0, 1, "R" ],
];

const elBoard = document.getElementById("board");
const elMsg = document.getElementById("message");
const elPhase = document.getElementById("phase-text");
const elWho = document.getElementById("turn-who");
const elScoreR = document.getElementById("score-red");
const elScoreB = document.getElementById("score-blue");
const elLeftR = document.getElementById("left-red");
const elLeftB = document.getElementById("left-blue");
const elPlacementRow = document.getElementById("placement-left");

const btnUndo = document.getElementById("btn-undo");
const btnRestart = document.getElementById("btn-restart");
const btnScore = document.getElementById("btn-score");

let state = null;
let history = [];

function freshState() {
  // board: 0 empty, 1 red, 2 blue
  const board = Array.from({length: SIZE}, () => Array(SIZE).fill(0));
  // walls: include outer border lines; true means wall exists
  // h[r][c] horizontal line between row r-1 and r (0..SIZE); c: 0..SIZE-1
  const h = Array.from({length: SIZE+1}, () => Array(SIZE).fill(false));
  // v[r][c] vertical line between col c-1 and c (0..SIZE); r: 0..SIZE-1
  const v = Array.from({length: SIZE}, () => Array(SIZE+1).fill(false));

  return {
    board, h, v,
    phase: PHASE_PLACE,
    turn: RED,
    placeLeft: { [RED]: 4, [BLUE]: 4 },
    // move state
    moveSel: null, movesDone: 0,
    lastPos: null, // for wall placement
    winner: null,
  };
}

function cloneState(s) {
  return JSON.parse(JSON.stringify(s));
}

function pushHistory() {
  history.push(JSON.parse(JSON.stringify(state)));
  if (history.length > 200) history.shift();
}

function popHistory() {
  if (!history.length) return;
  state = history.pop();
  render();
}

function setMessage(t="") {
  elMsg.textContent = t;
}

function opp(p) { return p === RED ? BLUE : RED; }

function canStep(r1,c1, r2,c2) {
  // in bounds and empty and no wall between
  if (r2 < 0 || r2 >= SIZE || c2 < 0 || c2 >= SIZE) return false;
  if (state.board[r2][c2] !== 0) return false;
  const dr = r2-r1, dc = c2-c1;
  if (Math.abs(dr)+Math.abs(dc) !== 1) return false;
  if (dr === -1) return !state.h[r1][c1];
  if (dr ===  1) return !state.h[r1+1][c1];
  if (dc === -1) return !state.v[r1][c1];
  if (dc ===  1) return !state.v[r1][c1+1];
  return false;
}

function neighbors(r,c) {
  const list = [];
  for (const [dr,dc] of DIRS) {
    const nr=r+dr,nc=c+dc;
    if (nr>=0&&nr<SIZE&&nc>=0&&nc<SIZE) list.push([nr,nc]);
  }
  return list;
}

function movableCellsForPiece(r,c) {
  const out = [];
  for (const [dr,dc] of DIRS) {
    const nr=r+dr, nc=c+dc;
    if (canStep(r,c,nr,nc)) out.push([nr,nc]);
  }
  return out;
}

function anyMovable(player) {
  for (let r=0;r<SIZE;r++) for (let c=0;c<SIZE;c++) {
    if (state.board[r][c]===player && movableCellsForPiece(r,c).length) return true;
  }
  return false;
}

function placeWallAtCellEdge(r,c, side) {
  // side: 'U','D','L','R'
  if (side === "U") { if (state.h[r][c]) return false; state.h[r][c] = true; return true; }
  if (side === "D") { if (state.h[r+1][c]) return false; state.h[r+1][c] = true; return true; }
  if (side === "L") { if (state.v[r][c]) return false; state.v[r][c] = true; return true; }
  if (side === "R") { if (state.v[r][c+1]) return false; state.v[r][c+1] = true; return true; }
  return false;
}

function scoreRegions() {
  // Flood-fill regions separated by walls. Each cell belongs to one region.
  const seen = Array.from({length: SIZE}, () => Array(SIZE).fill(false));
  let scoreR=0, scoreB=0;
  const getNeighbors = (r,c) => {
    const out=[];
    if (r>0   && !state.h[r][c]) out.push([r-1,c]);
    if (r<SIZE-1 && !state.h[r+1][c]) out.push([r+1,c]);
    if (c>0   && !state.v[r][c]) out.push([r,c-1]);
    if (c<SIZE-1 && !state.v[r][c+1]) out.push([r,c+1]);
    return out;
  };
  for (let r=0;r<SIZE;r++) for (let c=0;c<SIZE;c++) {
    if (seen[r][c]) continue;
    const queue=[[r,c]]; seen[r][c]=true;
    let cells=0; let hasR=false, hasB=false;
    while(queue.length){
      const [cr,cc]=queue.shift();
      cells++;
      if (state.board[cr][cc]===RED) hasR=true;
      if (state.board[cr][cc]===BLUE) hasB=true;
      for(const [nr,nc] of getNeighbors(cr,cc)){
        if(!seen[nr][nc]){ seen[nr][nc]=true; queue.push([nr,nc]); }
      }
    }
    if (hasR && !hasB) scoreR += cells;
    else if (hasB && !hasR) scoreB += cells;
  }
  return { red: scoreR, blue: scoreB };
}

function updateScores() {
  const s = scoreRegions();
  elScoreR.textContent = s.red;
  elScoreB.textContent = s.blue;
}

function setTurnVisual() {
  if (state.turn === RED) {
    elWho.classList.remove("blue");
    elWho.querySelector(".txt").textContent = "Red";
  } else {
    elWho.classList.add("blue");
    elWho.querySelector(".txt").textContent = "Blue";
  }
}

function switchTurn() {
  state.turn = opp(state.turn);
  setTurnVisual();
}

function enterMovePhaseIfReady() {
  if (state.placeLeft[RED]===0 && state.placeLeft[BLUE]===0) {
    state.phase = PHASE_MOVE;
    elPlacementRow.style.display = "none";
    elPhase.textContent = "移動 + 築牆";
    setMessage("選擇己方棋子，移動 2 步（可轉彎），再在終點的四邊之一築牆。");
  }
}

function onCellClick(r,c) {
  if (state.winner) return;

  if (state.phase === PHASE_PLACE) {
    if (state.board[r][c] !== 0) { setMessage("該格已有棋子"); return; }
    if (state.placeLeft[state.turn] <= 0) { setMessage("你已放滿 4 枚棋子"); return; }
    pushHistory();
    state.board[r][c] = state.turn;
    state.placeLeft[state.turn]--;
    elLeftR.textContent = state.placeLeft[RED];
    elLeftB.textContent = state.placeLeft[BLUE];
    updateScores();
    enterMovePhaseIfReady();
    switchTurn();
    return;
  }

  // Move phase
  if (state.phase === PHASE_MOVE) {
    // Selecting a piece to move
    if (state.movesDone === 0) {
      if (state.board[r][c] !== state.turn) { setMessage("先選擇己方棋子"); return; }
      const moves = movableCellsForPiece(r,c);
      if (!moves.length) { setMessage("該子無法移動，換別顆"); return; }
      state.moveSel = [r,c];
      highlightMoves(moves);
      setMessage("第一步：選擇鄰近空格");
      return;
    }
  }
}

function onCellClickMoveTarget(r,c) {
  // After selection: execute step 1 or 2
  const [sr,sc] = state.moveSel;
  if (!canStep(sr,sc,r,c)) return;
  // Move piece
  state.board[r][c] = state.board[sr][sc];
  state.board[sr][sc] = 0;
  state.moveSel = [r,c];
  state.lastPos = [r,c];
  state.movesDone += 1;
  clearHighlights();
  updateScores();

  if (state.movesDone === 1) {
    const nexts = movableCellsForPiece(r,c);
    if (nexts.length) {
      highlightMoves(nexts);
      setMessage("第二步：繼續移動同一枚棋子");
    } else {
      setMessage("無法再移動，請在此格周圍築牆");
      showWallTargets(r,c);
    }
  } else {
    // 2nd move done
    setMessage("移動完成，請在此格周圍築牆");
    showWallTargets(r,c);
  }
}

function showWallTargets(r,c) {
  // Show 4 clickable wall candidates around (r,c)
  removeWallCandidates();
  const mk = (side)=>{
    const w = document.createElement("div");
    w.className = "wall candidate clickable " + (side==='L'||side==='R' ? 'v':'h');
    positionWallDiv(w, r,c, side);
    w.addEventListener('click', ()=>{
      pushHistory();
      if (placeWallAtCellEdge(r,c, side)) {
        removeWallCandidates();
        endTurn();
      }
    });
    elBoard.appendChild(w);
  };
  mk("U"); mk("R"); mk("D"); mk("L");
}

function removeWallCandidates() {
  document.querySelectorAll(".wall.candidate").forEach(n=>n.remove());
}

function endTurn() {
  state.movesDone = 0;
  state.moveSel = null;
  state.lastPos = null;
  updateScores();
  // check if both cannot move -> end scoring (optional)
  const meCan = anyMovable(opp(state.turn)); // next player after switch
  switchTurn();
  if (!meCan && !anyMovable(state.turn)) {
    setMessage("雙方皆無路可走，已自動結算。");
    doScore();
  } else if (!anyMovable(state.turn)) {
    setMessage("對手無法移動，回合跳過。");
    switchTurn();
  } else {
    setMessage("選擇己方棋子，移動 2 步，然後築牆。");
  }
  render(); // to hide highlights if any
}

function gridRect() {
  const grid = elBoard.querySelector(".grid");
  return grid.getBoundingClientRect();
}
function cellRectAt(r,c) {
  const cell = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
  return cell.getBoundingClientRect();
}
function positionWallDiv(div, r,c, side) {
  const grid = elBoard.querySelector(".grid");
  const grect = grid.getBoundingClientRect();
  const crect = cellRectAt(r,c);
  const x = crect.left - grect.left;
  const y = crect.top - grect.top;
  const w = crect.width, h = crect.height;
  const thickness = 6;
  if (side==='U') { div.style.left = (x) + 'px'; div.style.top = (y - thickness/2) + 'px'; div.style.width = w+'px'; div.style.height = thickness+'px'; }
  if (side==='D') { div.style.left = (x) + 'px'; div.style.top = (y + h - thickness/2) + 'px'; div.style.width = w+'px'; div.style.height = thickness+'px'; }
  if (side==='L') { div.style.left = (x - thickness/2) + 'px'; div.style.top = (y) + 'px'; div.style.width = thickness+'px'; div.style.height = h+'px'; }
  if (side==='R') { div.style.left = (x + w - thickness/2) + 'px'; div.style.top = (y) + 'px'; div.style.width = thickness+'px'; div.style.height = h+'px'; }
}

function highlightMoves(list) {
  clearHighlights();
  list.forEach(([r,c])=>{
    const cell = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
    if (!cell) return;
    const m = document.createElement("div"); m.className="marker";
    cell.appendChild(m);
    cell.classList.add("move-target");
    cell.addEventListener("click", onMoveTargetClickOnce);
  });
}
function onMoveTargetClickOnce(e) {
  const cell = e.currentTarget;
  cell.removeEventListener("click", onMoveTargetClickOnce);
  const r = +cell.dataset.r, c = +cell.dataset.c;
  onCellClickMoveTarget(r,c);
}
function clearHighlights() {
  document.querySelectorAll(".marker").forEach(x=>x.remove());
  document.querySelectorAll(".cell.move-target").forEach(cell=>{
    cell.classList.remove("move-target");
    cell.replaceWith(cell.cloneNode(true)); // remove old listeners quickly
  });
  removeWallCandidates();
}

function doScore() {
  const s = scoreRegions();
  elScoreR.textContent = s.red;
  elScoreB.textContent = s.blue;
  if (s.red > s.blue) setMessage("紅方勝利！");
  else if (s.blue > s.red) setMessage("藍方勝利！");
  else setMessage("平局！");
  state.winner = true;
}

function render() {
  // Board base grid
  elBoard.innerHTML = '<div class="grid"></div>';
  const grid = elBoard.querySelector(".grid");
  // cells
  for (let r=0;r<SIZE;r++) for (let c=0;c<SIZE;c++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.r = r; cell.dataset.c = c;
    cell.addEventListener("click", ()=>onCellClick(r,c));
    if (state.board[r][c]===RED) {
      const p = document.createElement("div"); p.className="piece red"; cell.appendChild(p);
    } else if (state.board[r][c]===BLUE) {
      const p = document.createElement("div"); p.className="piece blue"; cell.appendChild(p);
    }
    grid.appendChild(cell);
  }
  // draw walls
  for (let r=0;r<=SIZE;r++) for (let c=0;c<SIZE;c++) {
    if (state.h[r][c]) {
      const w = document.createElement("div"); w.className="wall h";
      positionWallDiv(w, Math.max(0, Math.min(SIZE-1,r)), c, r===0?'U':'D');
      elBoard.appendChild(w);
    }
  }
  for (let r=0;r<SIZE;r++) for (let c=0;c<=SIZE;c++) {
    if (state.v[r][c]) {
      const w = document.createElement("div"); w.className="wall v";
      positionWallDiv(w, r, Math.max(0, Math.min(SIZE-1,c)), c===0?'L':'R');
      elBoard.appendChild(w);
    }
  }

  setTurnVisual();
  updateScores();
  elLeftR.textContent = state.placeLeft[RED];
  elLeftB.textContent = state.placeLeft[BLUE];
  elPhase.textContent = (state.phase===PHASE_PLACE) ? "棋子放置階段" : "移動 + 築牆";
}

btnUndo.addEventListener("click", ()=>{ popHistory(); setMessage("已悔棋"); });
btnRestart.addEventListener("click", ()=>{ state=freshState(); history=[]; setMessage("新的對局開始"); render(); });
btnScore.addEventListener("click", ()=>{ doScore(); });

// Init
state = freshState();
render();
setMessage("每人先放 4 枚棋子，完成後開始移動與築牆。");
