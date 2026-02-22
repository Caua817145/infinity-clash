const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajustar tamanho do canvas
canvas.width = window.innerWidth > 450 ? 450 : window.innerWidth;
canvas.height = window.innerHeight;

// Estados do Jogo
let energy = 0;
let playerHP = 1000;
let enemyHP = 1000;
let units = [];

const config = {
    warrior: { hp: 100, dmg: 2, speed: 1.5, cost: 3, color: '#00BFFF', range: 20 },
    archer: { hp: 60, dmg: 4, speed: 1.0, cost: 5, color: '#4B0082', range: 100 },
    enemy_bot: { hp: 80, dmg: 2, speed: -1.2, color: '#ff4444', range: 20 }
};

// Gerar energia automaticamente
setInterval(() => {
    if (energy < 10) {
        energy += 1;
        updateHUD();
    }
}, 1500);

// Bot Inimigo spawna tropas
setInterval(() => {
    spawnUnit('enemy_bot', true);
}, 5000);

function updateHUD() {
    document.getElementById('energy-text').innerText = `⚡ ${energy}`;
    document.getElementById('energy-fill').style.width = `${energy * 10}%`;
    document.getElementById('player-hp').innerText = playerHP;
    document.getElementById('enemy-hp').innerText = enemyHP;
}

function spawnUnit(type, isEnemy = false) {
    if (!isEnemy) {
        if (energy < config[type].cost) return;
        energy -= config[type].cost;
        updateHUD();
    }

    units.push({
        ...config[type],
        x: canvas.width / 2,
        y: isEnemy ? 100 : canvas.height - 150,
        isEnemy: isEnemy
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar Torres
    ctx.fillStyle = '#ff4444'; // Torre Inimiga
    ctx.fillRect(canvas.width / 2 - 25, 20, 50, 50);
    
    ctx.fillStyle = '#00BFFF'; // Torre Jogador
    ctx.fillRect(canvas.width / 2 - 25, canvas.height - 70, 50, 50);

    units.forEach((unit, index) => {
        // Movimento
        let targetY = unit.isEnemy ? canvas.height - 70 : 70;
        let distToTarget = Math.abs(unit.y - targetY);

        if (distToTarget > unit.range) {
            unit.y += unit.isEnemy ? -unit.speed : -unit.speed; // O bot vai pra baixo (positivo)
            if(unit.isEnemy) unit.y = unit.y + (unit.speed * -2); // Correção de direção inimiga
        } else {
            // Atacar Torre
            if (unit.isEnemy) playerHP -= unit.dmg;
            else enemyHP -= unit.dmg;
            updateHUD();
        }

        // Desenhar Unidade
        ctx.beginPath();
        ctx.arc(unit.x, unit.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = unit.color;
        ctx.fill();
        ctx.closePath();

        // Checar fim de jogo
        if(playerHP <= 0 || enemyHP <= 0) {
            alert(playerHP <= 0 ? "DERROTA!" : "VITÓRIA!");
            location.reload();
        }
    });

    requestAnimationFrame(gameLoop);
}

gameLoop();
