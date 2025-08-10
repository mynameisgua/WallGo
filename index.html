// 牆壁圍棋（你指定的規則版）
const SIZE = 7;
const RED = 1, BLUE = 2;
const PHASE_PLACE = "place";
const PHASE_MOVE  = "move";

const PLACE_ORDER = [RED, BLUE, BLUE, RED, RED, BLUE, BLUE, RED];

const elBoard = document.getElementById("board");
const elMsg   = document.getElementById("message");
const elPhase = document.getElementById("phase-text");
const elWho   = document.getElementById("turn-who");
const elScoreR= document.getElementById("score-red");
const elScoreB= document.getElementById("score-blue");
const elPlaceProgress = document.getElementById("place-progress");
const rowPlace = document.getElementById("placement-left");

const btnUndo   = document.getElementById("btn-undo");
const btnRestart= document.getElementById("btn-restart");
const btnScore  = document.getElementById("btn-score");
const btnBuildHere = document.getElementById("btn-build-here");
const btnCancel = document.getElementById("btn-cancel");

let state = null;
let history = [];

function freshState(){
  const board = Array.from({length: SIZE}, ()=>Array(SIZE).fill(0));
  const h = Array.from({length: SIZE+1}, ()=>Array(SIZE).fill(false)); // horizontal walls
  const v = Array.from({length: SIZE}, ()=>Array(SIZE+1).fill(false)); // vertical walls
  return {
    board, h, v,
    phase: PHASE_PLACE,
    placeIndex: 0,           // 0..7
    turn: PLACE_ORDER[0],    // who places now
    // move state
    sel: null,               // [r,c] of selected piece
    movesDone: 0,            // 0..2
    winner: null,
  };
}

function pushHistory(){ history.push(JSON.parse(JSON.stringify(state))); if (history.length>300) history.shift(); }
function popHistory(){ if (!history.length) return; state = history.pop(); render(); }
function opp(p){ return p===RED?BLUE:RED; }
function setMsg(t=""){ elMsg.textContent = t; }

function setTurnUI(){
  if (state.turn===RED){ elWho.classList.remove("blue"); elWho.querySelector(".txt").textContent="Red"; }
  else { elWho.classList.add("blue"); elWho.querySelector(".txt").textContent="Blue"; }
}

function inBounds(r,c){ return r>=0 && r<SIZE && c>=0 && c<SIZE; }

function wallBlocked(r1,c1,r2,c2){
  const dr=r2-r1, dc=c2-c1;
  if (dr===-1) return state.h[r1][c1];
  if (dr=== 1) return state.h[r1+1][c1];
  if (dc===-1) return state.v[r1][c1];
  if (dc=== 1) return state.v[r1][c1+1];
  return true;
}

function canStep(r1,c1,r2,c2){
  if (!inBounds(r2,c2)) return false;
  if (state.board[r2][c2]!==0) return false;     // 不可走到有棋子的格
  if (Math.abs(r2-r1)+Math.abs(c2-c1)!==1) return false; // 直線一步
  return !wallBlocked(r1,c1,r2,c2);
}

function movableFrom(r,c){
  // 一步可達
  const list=[];
  const dirs=[[-1,0],[1,0],[0,-1],[0,1]];
  for (const [dr,dc] of dirs){
    const nr=r+dr, nc=c+dc;
    if (canStep(r,c,nr,nc)) list.push([nr,nc]);
  }
  return list;
}

function anyLegalTurn(player){
  // 是否存在：選某子 → 0~2 步後在終點四周有可放牆的邊
  for (let r=0;r<SIZE;r++) for (let c=0;c<SIZE;c++){
    if (state.board[r][c]!==player) continue;
    // 0 步
    if (hasBuildableEdge(r,c)) return true;
    // 1 步
    for (const [r1,c1] of movableFrom(r,c)){
      if (hasBuildableEdge(r1,c1)) return true;
      // 2 步
      for (const [r2,c2] of movableFrom(r1,c1)){
        if (hasBuildableEdge(r2,c2)) return true;
      }
    }
  }
  return false;
}

function hasBuildableEdge(r,c){
  // U / D / L / R 有沒有牆可放
  if (!state.h[r][c]) return true;             // U
  if (!state.h[r+1][c]) return true;           // D
  if (!state.v[r][c]) return true;             // L
  if (!state.v[r][c+1]) return true;           // R
  return false;
}

function placeWall(r,c,side){
  if (side==='U'){ if (state.h[r][c]) return false; state.h[r][c]=true; return true; }
  if (side==='D'){ if (state.h[r+1][c]) return false; state.h[r+1][c]=true; return true; }
  if (side==='L'){ if (state.v[r][c]) return false; state.v[r][c]=true; return true; }
  if (side==='R'){ if (state.v[r][c+1]) return false; state.v[r][c+1]=true; return true; }
  return false;
}

/* ---------- 放置階段 ---------- */
function onCellClickPlace(r,c){
  if (state.board[r][c]!==0){ setMsg("這格已有棋子"); return; }
  pushHistory();
  state.board[r][c]=state.turn;
  state.placeIndex++;
  if (state.placeIndex>=PLACE_ORDER.length){
    // 放完，進入移動階段，預設紅方先
    state.phase = PHASE_MOVE;
    state.turn  = RED;
    rowPlace.style.display="none";
    elPhase.textContent = "移動 + 築牆";
    setMsg("選擇己方棋子，0~2 步後在終點築牆。");
  }else{
    state.turn = PLACE_ORDER[state.placeIndex];
    setMsg("繼續依序放子。");
  }
  render();
}

/* ---------- 移動階段 ---------- */
function onCellClickMove(r,c){
  if (state.sel==null){
    if (state.board[r][c]!==state.turn){ setMsg("先選擇己方棋子"); return; }
    state.sel=[r,c]; state.movesDone=0;
    setMsg("已選擇棋子：可移動 0~2 步，或按『在原位/此處建牆』。");
    btnBuildHere.style.display="inline-block";
    btnCancel.style.display="inline-block";
    highlightMoves(movableFrom(r,c));
    return;
  }

  // 已選取：點步驟目標
  const [sr,sc]=state.sel;
  if (!canStep(sr,sc,r,c)) return;

  pushHistory();
  state.board[r][c]=state.board[sr][sc];
  state.board[sr][sc]=0;

  state.sel=[r,c];
  state.movesDone++;
  clearHighlights();

  if (state.movesDone<2){
    setMsg("可再走一步，或按『在此處建牆』。");
    highlightMoves(movableFrom(r,c));
  }else{
    setMsg("移動完成，請在此處築牆。");
    showWallTargets(r,c);
  }
  renderWallsOnly();
}

function buildHere(){
  if (!state.sel) return;
  const [r,c]=state.sel;
  setMsg("選擇一條邊築牆。");
  clearHighlights();
  showWallTargets(r,c);
}

function cancelSelect(){
  state.sel=null; state.movesDone=0;
  btnBuildHere.style.display="none";
  btnCancel.style.display="none";
  clearHighlights();
  setMsg("已取消。請重新選擇。");
}

function showWallTargets(r,c){
  removeWallCandidates();
  const mk=(side)=>{
    const w=document.createElement("div");
    w.className="wall candidate clickable " + (side==='L'||side==='R'?'v':'h');
    positionWallDiv(w,r,c,side);
    w.addEventListener("click",()=>{
      pushHistory();
      if (!placeWall(r,c,side)) return;
      removeWallCandidates();
      endTurn();
    });
    elBoard.appendChild(w);
  };
  if (!state.h[r][c]) mk("U");
  if (!state.h[r+1][c]) mk("D");
  if (!state.v[r][c]) mk("L");
  if (!state.v[r][c+1]) mk("R");
}

function endTurn(){
  state.sel=null; state.movesDone=0;
  btnBuildHere.style.display="none";
  btnCancel.style.display="none";
  updateScores();

  // 若對手完全無合法行動，跳過；若雙方皆無則可結算
  const next = opp(state.turn);
  if (!anyLegalTurn(next)){
    if (!anyLegalTurn(state.turn)){
      setMsg("雙方皆無合法行動，可按『結算分數』。");
      render(); return;
    }else{
      setMsg("對手無合法行動，直接跳過。");
      // 保持 turn 不變
      render(); return;
    }
  }
  state.turn = next;
  setTurnUI();
  setMsg("選擇己方棋子，0~2 步後築牆。");
  render();
}

/* ---------- 版面渲染 ---------- */
function render(){
  elPlaceProgress.textContent = `${state.placeIndex} / 8`;
  setTurnUI();

  elBoard.innerHTML='<div class="grid"></div>';
  const grid=elBoard.querySelector(".grid");
  for (let r=0;r<SIZE;r++) for (let c=0;c<SIZE;c++){
    const cell=document.createElement("div");
    cell.className="cell";
    cell.dataset.r=r; cell.dataset.c=c;
    cell.addEventListener("click", ()=> {
      if (state.phase===PHASE_PLACE) onCellClickPlace(r,c);
      else onCellClickMove(r,c);
    });
    if (state.board[r][c]===RED){
      const p=document.createElement("div"); p.className="piece red"; cell.appendChild(p);
    }else if (state.board[r][c]===BLUE){
      const p=document.createElement("div"); p.className="piece blue"; cell.appendChild(p);
    }
    grid.appendChild(cell);
  }
  renderWallsOnly();

  // Phase text
  elPhase.textContent = (state.phase===PHASE_PLACE? "棋子放置階段" : "移動＋築牆");
  rowPlace.style.display = (state.phase===PHASE_PLACE ? "flex" : "none");
}

function renderWallsOnly(){
  // 先清掉既有牆候選
  removeWallCandidates();
  // 畫固定牆
  for (let r=0;r<=SIZE;r++) for (let c=0;c<SIZE;c++){
    if (state.h[r][c]){
      const w=document.createElement("div"); w.className="wall h";
      positionWallDiv(w, Math.max(0,Math.min(SIZE-1,r)), c, r===0?'U':'D');
      elBoard.appendChild(w);
    }
  }
  for (let r=0;r<SIZE;r++) for (let c=0;c<=SIZE;c++){
    if (state.v[r][c]){
      const w=document.createElement("div"); w.className="wall v";
      positionWallDiv(w, r, Math.max(0,Math.min(SIZE-1,c)), c===0?'L':'R');
      elBoard.appendChild(w);
    }
  }
}

function positionWallDiv(div, r,c, side){
  const grid=elBoard.querySelector(".grid");
  const grect=grid.getBoundingClientRect();
  const cell=document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
  const crect=cell.getBoundingClientRect();
  const x=crect.left-grect.left, y=crect.top-grect.top;
  const w=crect.width, h=crect.height, t=6;
  if (side==='U'){ div.style.left=x+'px'; div.style.top=(y - t/2)+'px'; div.style.width=w+'px'; div.style.height=t+'px'; }
  if (side==='D'){ div.style.left=x+'px'; div.style.top=(y + h - t/2)+'px'; div.style.width=w+'px'; div.style.height=t+'px'; }
  if (side==='L'){ div.style.left=(x - t/2)+'px'; div.style.top=y+'px'; div.style.width=t+'px'; div.style.height=h+'px'; }
  if (side==='R'){ div.style.left=(x + w - t/2)+'px'; div.style.top=y+'px'; div.style.width=t+'px'; div.style.height=h+'px'; }
}

function removeWallCandidates(){ document.querySelectorAll(".wall.candidate").forEach(n=>n.remove()); }

function highlightMoves(list){
  clearHighlights();
  for (const [r,c] of list){
    const cell=document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
    const m=document.createElement("div"); m.className="marker";
    cell.appendChild(m);
  }
}

function clearHighlights(){
  document.querySelectorAll(".marker").forEach(x=>x.remove());
}

/* ---------- 計分（獨占領土 + 活動空間） ---------- */
function neighborsThroughWalls(r,c){
  const ns=[];
  if (r>0   && !state.h[r][c])   ns.push([r-1,c]);
  if (r<SIZE-1 && !state.h[r+1][c]) ns.push([r+1,c]);
  if (c>0   && !state.v[r][c])   ns.push([r,c-1]);
  if (c<SIZE-1 && !state.v[r][c+1]) ns.push([r,c+1]);
  return ns;
}

// 回傳 {red, blue, redMaxArea, blueMaxArea}
function scoreGame(){
  const seen=Array.from({length:SIZE},()=>Array(SIZE).fill(false));
  let totalR=0,totalB=0,maxR=0,maxB=0;

  for (let r=0;r<SIZE;r++) for (let c=0;c<SIZE;c++){
    if (seen[r][c]) continue;
    // 先做區域（由牆/邊界切分）
    const q=[[r,c]]; seen[r][c]=true;
    const cells=[];
    let hasR=false, hasB=false;
    while(q.length){
      const [cr,cc]=q.shift();
      cells.push([cr,cc]);
      if (state.board[cr][cc]===RED) hasR=true;
      if (state.board[cr][cc]===BLUE) hasB=true;
      for (const [nr,nc] of neighborsThroughWalls(cr,cc)){
        if (!seen[nr][nc]){ seen[nr][nc]=true; q.push([nr,nc]); }
      }
    }
    if (hasR && hasB) continue;        // 非獨占
    if (!hasR && !hasB) continue;      // 無子不計

    const owner = hasR?RED:BLUE;

    // 活動空間：從該區域內所有 owner 的棋子出發，走到所有可達空格（空格）
    const blocked = new Set(cells.filter(([x,y])=>state.board[x][y]!==0).map(([x,y])=>`${x},${y}`));
    const inRegion = new Set(cells.map(([x,y])=>`${x},${y}`));
    const visited = new Set();

    // 以所有棋子的鄰近空格作為起點
    for (const [x,y] of cells){
      if (state.board[x][y]!==owner) continue;
      for (const [nx,ny] of neighborsThroughWalls(x,y)){
        const key = `${nx},${ny}`;
        if (!inRegion.has(key)) continue;
        if (blocked.has(key)) continue;
        if (visited.has(key)) continue;
        // BFS 空格
        const qq=[[nx,ny]]; visited.add(key);
        while(qq.length){
          const [xr,xc]=qq.shift();
          for (const [ur,uc] of neighborsThroughWalls(xr,xc)){
            const k=`${ur},${uc}`;
            if (!inRegion.has(k)) continue;
            if (blocked.has(k)) continue;
            if (visited.has(k)) continue;
            visited.add(k); qq.push([ur,uc]);
          }
        }
      }
    }

    if (owner===RED){ totalR += visited.size; if (visited.size>maxR) maxR=visited.size; }
    else { totalB += visited.size; if (visited.size>maxB) maxB=visited.size; }
  }
  return { red: totalR, blue: totalB, redMaxArea:maxR, blueMaxArea:maxB };
}

function updateScores(){
  const s=scoreGame();
  elScoreR.textContent = s.red;
  elScoreB.textContent = s.blue;
  return s;
}

function doScore(){
  const s=updateScores();
  if (s.red>s.blue) setMsg(`紅方勝利！（${s.red} : ${s.blue}）`);
  else if (s.blue>s.red) setMsg(`藍方勝利！（${s.blue} : ${s.red}）`);
  else {
    if (s.redMaxArea>s.blueMaxArea) setMsg(`同分，比最大單區：紅方勝（${s.redMaxArea}）`);
    else if (s.blueMaxArea>s.redMaxArea) setMsg(`同分，比最大單區：藍方勝（${s.blueMaxArea}）`);
    else setMsg("平手！");
  }
}

/* ---------- 綁定 ---------- */
btnUndo.addEventListener("click", ()=>{ popHistory(); setMsg("已悔棋"); });
btnRestart.addEventListener("click", ()=>{ state=freshState(); history=[]; setMsg("新的對局開始：依序放子。"); render(); });
btnScore.addEventListener("click", ()=>{ doScore(); });
btnBuildHere.addEventListener("click", buildHere);
btnCancel.addEventListener("click", cancelSelect);

/* ---------- 啟動 ---------- */
state=freshState();
render();
setMsg("依序放子：🔴→🔵→🔵→🔴→🔴→🔵→🔵→🔴");
