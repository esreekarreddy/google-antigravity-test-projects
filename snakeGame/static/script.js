const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const overlay = document.getElementById('game-overlay');
const overlayTitle = document.getElementById('overlay-title');
const gameWrapper = document.getElementById('game-wrapper');

// Game Settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;
const gameSpeed = 90;

// Game State
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let velocity = { x: 0, y: 0 };
let snake = [];
let food = { x: 15, y: 15 };
let gameInterval;
let isGameRunning = false;
let particles = [];

// Initialize skin (validate it's unlocked)
let savedSkin = localStorage.getItem('snakeSkin') || 'neon-green';
let currentSkin = savedSkin;

// Skin Definitions
const skins = {
    'neon-green': { head: '#22c55e', body: '#4ade80', glow: '#22c55e' },
    'cyber-pink': { head: '#db2777', body: '#f472b6', glow: '#db2777' },
    'gold': { head: '#b45309', body: '#fbbf24', glow: '#fbbf24' },
    'glitch': { head: '#fff', body: '#0ff', glow: '#f0f' } // Dynamic handling in draw
};

// Sound Manager
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const SoundManager = {
    playTone: (freq, type, duration) => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    },
    move: () => SoundManager.playTone(200, 'triangle', 0.05),
    eat: () => {
        SoundManager.playTone(600, 'sine', 0.1);
        setTimeout(() => SoundManager.playTone(900, 'square', 0.1), 50);
    },
    die: () => {
        SoundManager.playTone(150, 'sawtooth', 0.4);
        SoundManager.playTone(100, 'sawtooth', 0.4);
    }
};

// Initialize High Score & Skins
highScoreElement.textContent = highScore;
updateSkinButtons();

// Input Handling
document.addEventListener('keydown', keyDownEvent);

function keyDownEvent(e) {
    if (e.code === 'Space') {
        if (!isGameRunning) {
            startGame();
        }
        return;
    }

    // Prevent reversing direction
    const oldVelocity = { ...velocity };
    switch (e.key) {
        case 'ArrowLeft':
            if (velocity.x !== 1) velocity = { x: -1, y: 0 };
            break;
        case 'ArrowUp':
            if (velocity.y !== 1) velocity = { x: 0, y: -1 };
            break;
        case 'ArrowRight':
            if (velocity.x !== -1) velocity = { x: 1, y: 0 };
            break;
        case 'ArrowDown':
            if (velocity.y !== -1) velocity = { x: 0, y: 1 };
            break;
    }
    
    // Play sound if direction changed
    if (oldVelocity.x !== velocity.x || oldVelocity.y !== velocity.y) {
        SoundManager.move();
    }
}

function startGame() {
    isGameRunning = true;
    score = 0;
    scoreElement.textContent = score;
    snake = [{ x: 10, y: 10 }];
    velocity = { x: 0, y: 0 };
    particles = [];
    placeFood();
    overlay.classList.add('hidden');
    gameWrapper.classList.remove('shake');
    
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
}

function gameOver() {
    isGameRunning = false;
    clearInterval(gameInterval);
    SoundManager.die();
    gameWrapper.classList.add('shake');
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreElement.textContent = highScore;
        updateSkinButtons(); // Check for unlocks
    }
    
    overlayTitle.textContent = 'SYSTEM FAILURE';
    overlay.classList.remove('hidden');
}

function gameLoop() {
    update();
    draw();
}

function update() {
    // Move Snake
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

    // Wait for initial input
    if (velocity.x === 0 && velocity.y === 0) return;

    // Wall Collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Self Collision
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Eat Food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        SoundManager.eat();
        createParticles(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, '#f0f');
        placeFood();
    } else {
        snake.pop();
    }

    // Update Particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }
}

function draw() {
    // Clear Screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0,
        2 * Math.PI
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Snake
    const skin = skins[currentSkin];
    snake.forEach((part, index) => {
        if (index === 0) {
            ctx.fillStyle = skin.head;
            ctx.shadowBlur = 15;
            ctx.shadowColor = skin.glow;
        } else {
            ctx.fillStyle = skin.body;
            ctx.shadowBlur = 0;
        }

        // Glitch Skin Effect
        if (currentSkin === 'glitch') {
            ctx.fillStyle = Math.random() > 0.5 ? '#f00' : '#00f';
            ctx.shadowColor = Math.random() > 0.5 ? '#0ff' : '#ff0';
            ctx.shadowBlur = 10;
        }

        roundRect(
            ctx,
            part.x * gridSize + 1,
            part.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2,
            4
        );
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    // Draw Particles
    particles.forEach(particle => particle.draw(ctx));
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };

    for (let part of snake) {
        if (part.x === food.x && part.y === food.y) {
            placeFood();
            break;
        }
    }
}

// Skin System
window.selectSkin = function(skinName) {
    const btn = document.querySelector(`.skin-btn[data-skin="${skinName}"]`);
    if (btn.classList.contains('locked')) return;

    currentSkin = skinName;
    localStorage.setItem('snakeSkin', skinName);
    
    // Update UI
    document.querySelectorAll('.skin-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
};

function updateSkinButtons() {
    // Validate current skin is unlocked, otherwise reset to default
    const currentBtn = document.querySelector(`.skin-btn[data-skin="${currentSkin}"]`);
    if (currentBtn) {
        const unlockScore = parseInt(currentBtn.dataset.unlock || 0);
        if (highScore < unlockScore) {
            // Current skin is locked, reset to default
            currentSkin = 'neon-green';
            localStorage.setItem('snakeSkin', currentSkin);
        }
    }
    
    document.querySelectorAll('.skin-btn').forEach(btn => {
        const unlockScore = parseInt(btn.dataset.unlock || 0);
        if (highScore >= unlockScore) {
            btn.classList.remove('locked');
            // Don't overwrite the text - keep original HTML text
        }
    });
    
    // Highlight current
    document.querySelectorAll('.skin-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.skin-btn[data-skin="${currentSkin}"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

// Particle System
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.radius = Math.random() * 4;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.04;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createParticles(x, y, color) {
    for (let i = 0; i < 12; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// UI Functions
window.openWindow = function(id) {
    document.getElementById(id).classList.remove('hidden');
};

window.closeWindow = function(id) {
    document.getElementById(id).classList.add('hidden');
};

window.confirmReset = function() {
    localStorage.removeItem('snakeHighScore');
    highScore = 0;
    highScoreElement.textContent = '0';
    updateSkinButtons(); // Re-lock skins
    closeWindow('reset-window');
    
    // Optional: Show success feedback
    const btn = document.querySelector('.cyber-btn.danger');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="btn-text">WIPED</span>';
    setTimeout(() => {
        btn.innerHTML = originalText;
    }, 1000);
};

// Close windows when clicking outside
document.querySelectorAll('.window-modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
});
