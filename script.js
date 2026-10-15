const grid = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

// マップ定義 (1: 壁, 0: エサ)
const layout = [
    1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,1,0,0,0,0,1,
    1,0,1,0,1,0,1,1,0,1,
    1,0,1,0,0,0,0,1,0,1,
    1,0,1,1,1,1,0,1,0,1,
    1,0,0,0,0,0,0,0,0,1,
    1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,1,0,1,
    1,0,1,1,1,1,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1
];

const width = 10;
let squares = [];
let pacmanIndex = 11;
let ghostIndex = 88;
let score = 0;
let ghostTimer = null;
let isGameOver = false;

// マップの描画と初期化
function createBoard() {
    grid.innerHTML = '';
    squares = [];
    score = 0;
    scoreDisplay.textContent = score;
    pacmanIndex = 11;
    ghostIndex = 88;
    isGameOver = false;

    for (let i = 0; i < layout.length; i++) {
        const square = document.createElement('div');
        square.classList.add('cell');
        grid.appendChild(square);
        squares.push(square);

        if (layout[i] === 1) {
            square.classList.add('wall');
        } else if (layout[i] === 0) {
            square.textContent = '🟡';
        }
    }

    squares[pacmanIndex].textContent = '😮';
    squares[ghostIndex].textContent = '👻';

    if (ghostTimer) clearInterval(ghostTimer);
    // スピードを少し早め（550ミリ秒ごと）にするとスリリングになります
    ghostTimer = setInterval(moveGhost, 550);
}

// パックマンを動かす共通の関数
function movePacman(direction) {
    if (isGameOver) return;

    squares[pacmanIndex].textContent = '';

    if (direction === 'left' && pacmanIndex % width !== 0 && !squares[pacmanIndex - 1].classList.contains('wall')) {
        pacmanIndex -= 1;
    } else if (direction === 'up' && pacmanIndex - width >= 0 && !squares[pacmanIndex - width].classList.contains('wall')) {
        pacmanIndex -= width;
    } else if (direction === 'right' && pacmanIndex % width < width - 1 && !squares[pacmanIndex + 1].classList.contains('wall')) {
        pacmanIndex += 1;
    } else if (direction === 'down' && pacmanIndex + width < width * width && !squares[pacmanIndex + width].classList.contains('wall')) {
        pacmanIndex += width;
    }

    // エサを食べる判定
    if (squares[pacmanIndex].textContent === '🟡') {
        score += 10;
        scoreDisplay.textContent = score;
    }

    // ゲームオーバー判定
    if (pacmanIndex === ghostIndex) {
        gameOver(false);
        return;
    }

    checkWin();
    squares[pacmanIndex].textContent = '😮';
}

// キーボード操作の連携
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft': movePacman('left'); break;
        case 'ArrowUp': movePacman('up'); break;
        case 'ArrowRight': movePacman('right'); break;
        case 'ArrowDown': movePacman('down'); break;
    }
});

// スマホ用ボタンのタッチ・クリックイベント
document.getElementById('btn-left').addEventListener('pointerdown', (e) => { e.preventDefault(); movePacman('left'); });
document.getElementById('btn-up').addEventListener('pointerdown', (e) => { e.preventDefault(); movePacman('up'); });
document.getElementById('btn-right').addEventListener('pointerdown', (e) => { e.preventDefault(); movePacman('right'); });
document.getElementById('btn-down').addEventListener('pointerdown', (e) => { e.preventDefault(); movePacman('down'); });

// 🔥 ゴーストがパックマンを「追いかける」ロジック
function moveGhost() {
    if (isGameOver) return;

    // ゴーストから見て移動できる方向（上下左右）の候補を探す
    const directions = [-1, +1, -width, +width];
    let validMoves = [];

    directions.forEach(dir => {
        let nextPos = ghostIndex + dir;
        // マップの端や壁でない場所を候補にする
        if (nextPos >= 0 && nextPos < squares.length) {
            // 左右の端をまたぐワープを防ぐための簡易チェック
            if (dir === -1 && ghostIndex % width === 0) return;
            if (dir === 1 && ghostIndex % width === width - 1) return;

            if (!squares[nextPos].classList.contains('wall')) {
                validMoves.push(nextPos);
            }
        }
    });

    if (validMoves.length > 0) {
        // パックマンの位置（pacmanIndex）に一番近くなるような次のマスを選ぶ
        let bestMove = validMoves[0];
        let minDistance = 999;

        validMoves.forEach(pos => {
            // 2点間の簡易的な距離（マンハッタン距離）を計算
            let pRow = Math.floor(pacmanIndex / width);
            let pCol = pacmanIndex % width;
            let gRow = Math.floor(pos / width);
            let gCol = pos % width;
            let distance = Math.abs(pRow - gRow) + Math.abs(pCol - gCol);

            if (distance < minDistance) {
                minDistance = distance;
                bestMove = pos;
            }
        });

        // ゴーストの移動実行
        squares[ghostIndex].textContent = layout[ghostIndex] === 0 ? '🟡' : '';
        ghostIndex = bestMove;

        // 捕まったか判定
        if (ghostIndex === pacmanIndex) {
            gameOver(false);
            return;
        }

        squares[ghostIndex].textContent = '👻';
    }
}

// ゲームオーバー処理
function gameOver(isWin) {
    isGameOver = true;
    clearInterval(ghostTimer);
    setTimeout(() => {
        if (isWin) {
            alert(`🎉 クリア！ スコア: ${score}点`);
        } else {
            alert(`💀 ゲームオーバー！ ゴーストに捕まりました。 スコア: ${score}点`);
        }
    }, 100);
}

// クリア判定
function checkWin() {
    const hasFood = squares.some((square, index) => square.textContent === '🟡' && index !== ghostIndex);
    if (!hasFood) {
        gameOver(true);
    }
}

restartBtn.addEventListener('click', createBoard);

createBoard();
