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
    ghostTimer = setInterval(moveGhost, 650);
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
function control(e) {
    switch (e.key) {
        case 'ArrowLeft': movePacman('left'); break;
        case 'ArrowUp': movePacman('up'); break;
        case 'ArrowRight': movePacman('right'); break;
        case 'ArrowDown': movePacman('down'); break;
    }
}

// 画面内のボタンタップ操作の連携
document.getElementById('btn-left').addEventListener('click', () => movePacman('left'));
document.getElementById('btn-up').addEventListener('click', () => movePacman('up'));
document.getElementById('btn-right').addEventListener('click', () => movePacman('right'));
document.getElementById('btn-down').addEventListener('click', () => movePacman('down'));

// ゴーストの自動移動
function moveGhost() {
    if (isGameOver) return;

    const directions = [-1, +1, -width, +width];
    let direction = directions[Math.floor(Math.random() * directions.length)];

    if (!squares[ghostIndex + direction].classList.contains('wall')) {
        squares[ghostIndex].textContent = layout[ghostIndex] === 0 ? '🟡' : '';
        ghostIndex += direction;

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

document.addEventListener('keydown', control);
restartBtn.addEventListener('click', createBoard);

createBoard();
