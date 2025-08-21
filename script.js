let faseAtual = 1;
let letras = ["0", "3", "0", "6", "2", "3"];
let letrasDesbloqueadas = [];

const faseContainer = document.getElementById("fase-container");
const letrasDiv = document.getElementById("letras-desbloqueadas");
const mensagemFinal = document.getElementById("mensagem-final");

// --- FUNÇÃO DESBLOQUEAR LETRA ---
function desbloquearLetra() {
  letrasDesbloqueadas.push(letras[letrasDesbloqueadas.length]);
  letrasDiv.textContent = letrasDesbloqueadas.join(" ");
}

// --- FASE 1: COBRINHA MOBILE ---
function fase1() {
  faseContainer.innerHTML = `
    <p>Fase 1: Jogo da Cobrinha - alcance 10 pontos</p>
    <canvas id="snakeCanvas" width="400" height="400"></canvas>
    <div id="controles">
      <div class="controle-btn" onclick="changeDirection('UP')">↑</div>
      <div class="controle-btn" onclick="changeDirection('LEFT')">←</div>
      <div class="controle-btn" onclick="changeDirection('DOWN')">↓</div>
      <div class="controle-btn" onclick="changeDirection('RIGHT')">→</div>
    </div>
  `;

  const canvas = document.getElementById("snakeCanvas");
  const ctx = canvas.getContext("2d");
  const box = 20;

  let snake = [{ x: 200, y: 200 }];
  let direction = null;
  let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  };
  let score = 0;

  window.changeDirection = function (dir) {
    if (dir === "UP" && direction !== "DOWN") direction = "UP";
    if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
    if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
  };

  function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? "lime" : "green";
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "UP") snakeY -= box;
    if (direction === "DOWN") snakeY += box;
    if (direction === "LEFT") snakeX -= box;
    if (direction === "RIGHT") snakeX += box;

    if (snakeX === food.x && snakeY === food.y) {
      score++;
      food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box,
      };
    } else {
      snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    // colisão
    if (
      snakeX < 0 ||
      snakeY < 0 ||
      snakeX >= canvas.width ||
      snakeY >= canvas.height ||
      collision(newHead, snake)
    ) {
      clearInterval(game);
      alert("Game Over! Tente novamente.");
      fase1();
      return;
    }

    snake.unshift(newHead);

    if (score >= 10) {
      clearInterval(game);
      desbloquearLetra();
      faseAtual++;
      fase2();
    }
  }

  function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
      if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
  }

  let game = setInterval(draw, 150);
}

// --- FASE 2: MEMÓRIA MOBILE ---
function fase2() {
  faseContainer.innerHTML = `
    <p>Fase 2: Jogo da Memória - complete para desbloquear a próxima letra</p>
    <div id="memory-game" style="display:grid;grid-template-columns:repeat(4,80px);gap:10px;justify-content:center;margin-top:20px;"></div>
  `;

  const memoryGame = document.getElementById("memory-game");
  const cards = ["0", "0", "3", "3", "6", "6", "2", "2"];
  let shuffled = cards.sort(() => 0.5 - Math.random());
  let selected = [];
  let matched = [];

  shuffled.forEach((letter) => {
    let card = document.createElement("div");
    card.textContent = "?";
    card.style.width = "80px";
    card.style.height = "80px";
    card.style.background = "#444";
    card.style.display = "flex";
    card.style.justifyContent = "center";
    card.style.alignItems = "center";
    card.style.fontSize = "32px";
    card.style.cursor = "pointer";
    card.dataset.value = letter;

    card.addEventListener("click", () => {
      if (selected.length < 2 && !matched.includes(card)) {
        card.textContent = letter;
        selected.push(card);
        if (selected.length === 2) {
          setTimeout(() => {
            if (selected[0].dataset.value === selected[1].dataset.value) {
              matched.push(selected[0], selected[1]);
              if (matched.length === shuffled.length) {
                desbloquearLetra();
                faseContainer.style.display = "none";
                mensagemFinal.style.display = "block";
              }
            } else {
              selected[0].textContent = "?";
              selected[1].textContent = "?";
            }
            selected = [];
          }, 500);
        }
      }
    });
    memoryGame.appendChild(card);
  });
}

// --- INICIAR JOGO ---
fase1();
