const hunger = document.getElementById('hungerValue');
const happy = document.getElementById('happyValue');
const clean = document.getElementById('cleanValue');
const energy = document.getElementById('energyValue');
const petMood = document.getElementById('petMood');
const memePet = document.getElementById('memePet');
const logArea = document.getElementById('logArea');
const catcherStage = document.getElementById('catcherStage');
const scoreValue = document.getElementById('scoreValue');
const startGame = document.getElementById('startGame');
const triviaQuestion = document.getElementById('triviaQuestion');
const triviaScoreValue = document.getElementById('triviaScore');
const triviaResult = document.getElementById('triviaResult');
const triviaButtons = [
  document.getElementById('triviaBtn0'),
  document.getElementById('triviaBtn1'),
  document.getElementById('triviaBtn2'),
  document.getElementById('triviaBtn3'),
];
const matchGrid = document.getElementById('matchGrid');
const matchScoreValue = document.getElementById('matchScore');

let score = 0;
let gameInterval = null;
let status = {
  hunger: 70,
  happy: 80,
  clean: 90,
  energy: 85,
};
let triviaScore = 0;
let currentTrivia = 0;
let canAnswerTrivia = true;
let matchScore = 0;
let selectedMatch = [];
let matchTiles = [];

const triviaQuestions = [
  {
    question: '¿Cuál de estos emojis no aparece en el juego?',
    options: ['😂', '🐱', '😎', '🔥'],
    answer: 1,
    explanation: '🐱 no forma parte del set de memes en el juego.',
  },
  {
    question: '¿Qué acción hace subir más la felicidad?',
    options: ['Dormir', 'Jugar', 'Limpiar', 'Comer'],
    answer: 1,
    explanation: 'Jugar eleva directamente la felicidad y baja energía.',
  },
  {
    question: '¿Cuál es el mejor gesto cuando tu meme está sucio?',
    options: ['Comer', 'Limpiar', 'Dormir', 'Ignorar'],
    answer: 1,
    explanation: 'Limpiar es la acción correcta para mejorar su estado.',
  },
  {
    question: '¿Qué emoji indica que el meme está feliz?',
    options: ['😴', '🤢', '😎', '😡'],
    answer: 2,
    explanation: '😎 es el gesto de un meme feliz y confiado.',
  },
];

const matchMemes = ['😂', '🔥', '😎', '💀'];

const memes = ['😂', '🤑', '🤡', '🔥', '💀', '👀', '😎'];
const moods = [
  '¡Genial! Estás al 100% meme.',
  'Se siente viral.',
  'Necesita más memes.',
  '¡Hora de limpiar ese meme!',
  'Dormir un poco le da boost.',
];

function updateStatus() {
  hunger.textContent = status.hunger;
  happy.textContent = status.happy;
  clean.textContent = status.clean;
  energy.textContent = status.energy;

  if (status.hunger < 30 || status.energy < 30) {
    petMood.textContent = '😴 Necesita descanso o comida.';
    memePet.textContent = '😴';
  } else if (status.clean < 40) {
    petMood.textContent = '💩 Está algo sucio, límpialo.';
    memePet.textContent = '🤢';
  } else if (status.happy > 80) {
    petMood.textContent = '🎉 ¡Qué meme más feliz!';
    memePet.textContent = '😎';
  } else {
    petMood.textContent = moods[Math.floor(Math.random() * moods.length)];
    memePet.textContent = memes[Math.floor(Math.random() * memes.length)];
  }
}

function addLog(message) {
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.textContent = `${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} — ${message}`;
  logArea.prepend(entry);
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function feedMeme(type) {
  status.hunger = clamp(status.hunger + 20);
  status.clean = clamp(status.clean - 10);
  status.happy = clamp(status.happy + 15);
  addLog('Le diste de comer un meme delicioso. 😋');
  updateStatus();
}

function playMeme() {
  status.happy = clamp(status.happy + 20);
  status.energy = clamp(status.energy - 15);
  status.clean = clamp(status.clean - 5);
  addLog('Jugaste con memes y mejoró su humor. 🎮');
  updateStatus();
}

function cleanMeme() {
  status.clean = clamp(status.clean + 30);
  status.happy = clamp(status.happy + 5);
  addLog('Lo limpiaste. Ahora está listo para memes. 🧼');
  updateStatus();
}

function restMeme() {
  status.energy = clamp(status.energy + 40);
  status.hunger = clamp(status.hunger - 15);
  addLog('Descansó y recuperó energía. 💤');
  updateStatus();
}

function createMemeBubble() {
  const bubble = document.createElement('div');
  bubble.className = 'meme-bubble';
  bubble.textContent = memes[Math.floor(Math.random() * memes.length)];

  const x = Math.random() * (catcherStage.clientWidth - 70);
  const y = Math.random() * (catcherStage.clientHeight - 70);
  bubble.style.left = `${x}px`;
  bubble.style.top = `${y}px`;

  bubble.addEventListener('click', () => {
    score += 5;
    scoreValue.textContent = score;
    status.happy = clamp(status.happy + 8);
    addLog('¡Atrapaste un meme! +5 puntos. 🏆');
    bubble.remove();
  });

  catcherStage.appendChild(bubble);

  setTimeout(() => {
    if (bubble.parentElement) bubble.remove();
  }, 2200);
}

function startCatcher() {
  if (gameInterval) {
    clearInterval(gameInterval);
    catcherStage.innerHTML = '';
    startGame.textContent = 'Iniciar juego';
    gameInterval = null;
    return;
  }

  score = 0;
  scoreValue.textContent = score;
  startGame.textContent = 'Detener juego';
  addLog('Juego Meme Catcher iniciado. ¡Atrapalos!');

  createMemeBubble();
  gameInterval = setInterval(createMemeBubble, 1200);
}

function loadTrivia() {
  const question = triviaQuestions[currentTrivia];
  triviaQuestion.textContent = question.question;
  triviaButtons.forEach((button, index) => {
    button.textContent = question.options[index];
    button.disabled = false;
  });
  triviaResult.textContent = '';
  canAnswerTrivia = true;
}

function answerTrivia(index) {
  if (!canAnswerTrivia) return;
  canAnswerTrivia = false;
  const question = triviaQuestions[currentTrivia];

  if (index === question.answer) {
    triviaScore += 10;
    triviaResult.textContent = '✅ ¡Correcto!';
    status.happy = clamp(status.happy + 12);
    addLog('Trivia correcta. +10 puntos. 💡');
  } else {
    triviaResult.textContent = `❌ Incorrecto. ${question.explanation}`;
    status.happy = clamp(status.happy - 8);
    addLog('Trivia fallida. Intenta de nuevo. 🤔');
  }

  triviaScoreValue.textContent = triviaScore;
  triviaButtons.forEach((button) => (button.disabled = true));
  updateStatus();
}

function nextTrivia() {
  currentTrivia = Math.floor(Math.random() * triviaQuestions.length);
  loadTrivia();
}

function renderMatch() {
  matchGrid.innerHTML = '';
  matchTiles.forEach((tile, index) => {
    const tileEl = document.createElement('button');
    tileEl.className = `match-tile${tile.matched ? ' matched' : ''}`;
    tileEl.textContent = tile.flipped || tile.matched ? tile.emoji : '❓';
    tileEl.disabled = tile.matched;
    tileEl.addEventListener('click', () => chooseTile(index));
    matchGrid.appendChild(tileEl);
  });
}

function initMatch() {
  const pairs = [...matchMemes, ...matchMemes].sort(() => Math.random() - 0.5);
  matchTiles = pairs.map((emoji, index) => ({ emoji, index, flipped: false, matched: false }));
  matchScore = 0;
  matchScoreValue.textContent = matchScore;
  selectedMatch = [];
  renderMatch();
}

function chooseTile(index) {
  const tile = matchTiles[index];
  if (tile.flipped || tile.matched || selectedMatch.length === 2) return;

  tile.flipped = true;
  selectedMatch.push(tile);
  renderMatch();

  if (selectedMatch.length === 2) {
    if (selectedMatch[0].emoji === selectedMatch[1].emoji) {
      selectedMatch.forEach((match) => (match.matched = true));
      matchScore += 10;
      matchScoreValue.textContent = matchScore;
      status.happy = clamp(status.happy + 10);
      addLog('¡Par encontrado en Meme Match! +10 puntos. 🧠');
      selectedMatch = [];
      if (matchTiles.every((tile) => tile.matched)) {
        addLog('¡Completaste Meme Match! Reinicia para jugar otra vez. 🎉');
      }
    } else {
      setTimeout(() => {
        selectedMatch.forEach((match) => (match.flipped = false));
        selectedMatch = [];
        renderMatch();
      }, 800);
    }
  }
}

function resetMatch() {
  initMatch();
  addLog('Meme Match reiniciado. Busca nuevos pares. 🔄');
}

setInterval(() => {
  status.hunger = clamp(status.hunger - 1);
  status.energy = clamp(status.energy - 1);
  status.clean = clamp(status.clean - 0.3);
  if (status.hunger < 40) status.happy = clamp(status.happy - 0.5);
  updateStatus();
}, 5000);

updateStatus();
addLog('Tu meme está listo para jugar. ¡Hazlo viral!');
loadTrivia();
initMatch();
