const grid = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

// マップ定義 (1: 壁, 0: エサ, 2: 空白)
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
let pacmanIndex = 11; // 初期位置
let ghostIndex = 88;  // ゴーストの初期位置
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
            square.textContent = '🟡'; // エサ（ドット）
        }
    }

    // パックマンとゴーストの配置
    squares[pacmanIndex].textContent = '😮'; // パックマン
    squares[ghostIndex].textContent = '👻';  // ゴースト

    // ゴーストを定期的に動かす
    if (ghostTimer) clearInterval(ghostTimer);
    ghostTimer = setInterval(moveGhost, 600);
}

// パックマンの操作（キーボード）
function control(e) {
    if (isGameOver) return;

    squares[pacmanIndex].textContent = ''; // 今の位置を消す

    switch (e.key) {
        case 'ArrowLeft':
            if (pacmanIndex % width !== 0 && !squares[pacmanIndex - 1].classList.contains('wall')) pacmanIndex -= 1;
            break;
        case 'ArrowUp':
            if (pacmanIndex - width >= 0 && !squares[pacmanIndex - width].classList.contains('wall')) pacmanIndex -= width;
            break;
        case 'ArrowRight':
            if (pacmanIndex % width < width - 1 && !squares[pacmanIndex + 1].classList.contains('wall')) pacmanIndex += 1;
            break;
        case 'ArrowDown':
            if (pacmanIndex + width < width * width && !squares[pacmanIndex + width].classList.contains('wall')) pacmanIndex += width;
            break;
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

    // 勝利判定（エサがなくなったらクリア）
    checkWin();

    squares[pacmanIndex].textContent = '😮';
}

// ゴーストの自動移動
function moveGhost() {
    if (isGameOver) return;

    const directions = [-1, +1, -width, +width];
    let direction = directions[Math.floor(Math.random() * directions.length)];

    // 壁でなければ動く
    if (!squares[ghostIndex + direction].classList.contains('wall')) {
        // 元の場所がエサだったか空だったかを戻す
        squares[ghostIndex].textContent = layout[ghostIndex] === 0 ? '🟡' : '';

        ghostIndex += direction;

        // 衝突判定
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

document.addEventListener('keyup', control);
restartBtn.addEventListener('click', createBoard);

// ゲームスタート
createBoard();
