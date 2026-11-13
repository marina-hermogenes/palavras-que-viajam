const cards = [
  { word: "quilombo", clue: "lugar de resistência, onde pessoas escravizadas buscaram liberdade.", origin: "banto · quimbundo", answers: ["iorubá", "quimbundo", "quicongo", "fon · jeje"], indigenous: ["tupi", "guarani"], story: "A palavra veio de povos bantos e chegou ao Brasil com pessoas africanas escravizadas. Hoje ela nomeia comunidades quilombolas que existem e resistem.", question: "Que outras palavras do seu dia a dia vieram de línguas africanas?" },
  { word: "abacaxi", clue: "fruta tropical de casca áspera e sabor doce.", origin: "tupi", answers: ["iorubá", "quimbundo", "quicongo", "fon · jeje"], indigenous: ["tupi", "guarani"], story: "Abacaxi vem do tupi na forma nanákati, associada à ideia de fruta cheirosa. A palavra revela como os conhecimentos indígenas sobre a natureza permanecem em nosso cotidiano.", question: "Quais outros alimentos de origem indígena fazem parte da sua alimentação?" },
  { word: "axé", clue: "força, energia vital e desejo de coisas boas.", origin: "iorubá", answers: ["iorubá", "quimbundo", "quicongo", "fon · jeje"], indigenous: ["tupi", "guarani"], story: "Axé vem do iorubá àṣẹ, uma força sagrada presente nas religiões de matriz africana. No Brasil, também usamos a palavra para desejar energia e coisas boas.", question: "Em que situações você já ouviu alguém dizer axé?" },
  { word: "dengo", clue: "carinho, afeto ou uma manha carinhosa.", origin: "banto · quimbundo", answers: ["iorubá", "quimbundo", "quicongo", "fon · jeje"], indigenous: ["tupi", "guarani"], story: "Dengo é uma palavra de origem banta, ligada ao quimbundo. Ela carrega a ideia de cuidado e afeto, mostrando como línguas africanas também nomeiam sentimentos.", question: "Como o carinho aparece nas palavras que usamos com nossa família?" },
  { word: "mandioca", clue: "raiz que pode virar farinha, beiju e muitos pratos.", origin: "tupi", answers: ["iorubá", "quimbundo", "quicongo", "fon · jeje"], indigenous: ["tupi", "guarani"], story: "Mandioca vem do tupi mandi’oka. Povos indígenas desenvolveram técnicas para preparar essa raiz, que hoje é alimento importante em muitas regiões do Brasil.", question: "Que saberes sobre a mandioca você conhece?" },
  { word: "moleque", clue: "palavra que hoje pode ser usada para falar de uma criança.", origin: "banto · quimbundo", answers: ["iorubá", "quimbundo", "quicongo", "fon · jeje"], indigenous: ["tupi", "guarani"], story: "Moleque vem do quimbundo mu’leke, que significa menino ou rapaz. A palavra atravessou o Atlântico com povos africanos e foi transformada pelos usos no português brasileiro.", question: "As palavras podem mudar de sentido com o tempo? Vamos pensar em exemplos." },
  { word: "jabuticaba", clue: "fruta escura que nasce grudada no tronco da árvore.", origin: "tupi", answers: ["iorubá", "quimbundo", "quicongo", "fon · jeje"], indigenous: ["tupi", "guarani"], story: "Jabuticaba tem origem no tupi. O nome acompanha um conhecimento indígena sobre uma fruta nativa, tão presente no Brasil que também virou símbolo de algo muito particular do país.", question: "Que nomes de plantas e frutas indígenas você conhece?" },
  { word: "acarajé", clue: "bolinho frito de feijão-fradinho, muito presente na Bahia.", origin: "iorubá", answers: ["iorubá", "quimbundo", "quicongo", "fon · jeje"], indigenous: ["tupi", "guarani"], story: "Acarajé vem do iorubá àkàrà + je, associado a um bolo de fogo. A comida e a palavra chegaram com os povos africanos e fazem parte da cultura afro-brasileira, especialmente na Bahia.", question: "Quais comidas também contam histórias de povos e encontros?" }
];

const teamColors = ["blue-team", "pink-team", "purple-team", "red-team", "teal-team", "orange-team"];
const defaultTeams = ["Time Azul", "Time Rosa", "Time Verde", "Time Roxo", "Time Laranja", "Time Vermelho"];
const state = { screen: "home-screen", teams: defaultTeams.slice(0, 2), scores: [0, 0], rounds: 8, round: 0, turn: 0, card: null, selected: null };
const $ = (id) => document.getElementById(id);
function showScreen(id) { document.querySelectorAll(".screen").forEach((screen) => screen.classList.toggle("active", screen.id === id)); state.screen = id; window.scrollTo({ top: 0, behavior: "smooth" }); }
function updateRounds(value) { state.rounds = Math.max(3, Math.min(8, value)); $("round-count").value = state.rounds; $("round-count").textContent = state.rounds; }
function renderTeamInputs() {
  $("team-form-grid").innerHTML = state.teams.map((team, index) => `<label class="team-input ${teamColors[index]}">TIME ${index + 1}<input id="team-${index}" value="${team}" maxlength="24" /><button type="button" class="remove-team" data-action="remove-team" data-team-index="${index}" aria-label="Remover time ${index + 1}">Remover</button></label>`).join("");
  $("team-form-grid").querySelectorAll(".remove-team").forEach((button, index) => { button.hidden = index < 2; });
  const addButton = document.querySelector("[data-action='add-team']");
  addButton.disabled = state.teams.length >= 6;
  addButton.textContent = state.teams.length >= 6 ? "LIMITE DE 6 TIMES" : "+ ADICIONAR TIME";
}
function setupGame() {
  state.teams = state.teams.map((team, index) => $(`team-${index}`).value.trim() || defaultTeams[index]);
  state.scores = state.teams.map(() => 0); state.round = 0; state.turn = 0; state.card = cards[0]; state.selected = null;
  loadQuestion(); showScreen("question-screen");
}
function loadQuestion() {
  state.card = cards[state.round % cards.length]; state.selected = null;
  $("round-label").textContent = `RODADA ${state.round + 1} DE ${state.rounds}`;
  $("turn-label").textContent = `Vez do ${state.teams[state.turn]}`;
  $("question-title").textContent = state.card.word.toUpperCase();
  $("question-title").nextElementSibling.nextElementSibling.innerHTML = `<b>Pista:</b> ${state.card.clue}`;
  $("reveal-button").disabled = true;
  $("answer-options").innerHTML = state.card.answers.map((answer) => optionButton(answer, false)).join("");
  $("indigenous-options").innerHTML = state.card.indigenous.map((answer) => optionButton(answer, true)).join("");
  $("scoreboard").innerHTML = state.teams.map((team, index) => `<span class="score ${teamColors[index]}">${team} · ${state.scores[index]}</span>`).join("");
}
function optionButton(answer, indigenous) { return `<button type="button" class="answer-option${indigenous ? " indigenous-answer" : ""}" data-answer="${answer}">${answer.toUpperCase()}</button>`; }
function reveal() {
  const correct = state.card.origin.split(" · ").some((originPart) => state.selected === originPart);
  if (correct) state.scores[state.turn] += 1;
  $("result-badge").textContent = correct ? `${state.teams[state.turn]} acertou! +1 ponto` : `${state.teams[state.turn]} não acertou desta vez`;
  $("reveal-round-label").textContent = `RODADA ${state.round + 1} DE ${state.rounds}`;
  $("reveal-title").textContent = state.card.word.toUpperCase();
  $("origin-tag").textContent = `Origem: ${state.card.origin}`;
  $("story-text").textContent = state.card.story;
  $("conversation-text").textContent = state.card.question.toUpperCase();
  showScreen("reveal-screen");
}
function nextRound() {
  if (state.round + 1 >= state.rounds) { showEnd(); return; }
  state.round += 1; state.turn = (state.turn + 1) % state.teams.length; loadQuestion(); showScreen("question-screen");
}
function showEnd() {
  const highestScore = Math.max(...state.scores); const winners = state.teams.filter((team, index) => state.scores[index] === highestScore);
  const winner = winners.length > 1 ? "Deu empate!" : `${winners[0]} venceu!`;
  $("winner-text").textContent = winner; $("final-scores").innerHTML = state.teams.map((team, index) => `<span class="${teamColors[index]}">${team} · ${state.scores[index]}</span>`).join(""); showScreen("end-screen");
}
renderTeamInputs();
function openQuitDialog() {
  $("quit-dialog").hidden = false;
  $("quit-dialog").querySelector("[data-action='cancel-quit']").focus();
}
function closeQuitDialog() {
  $("quit-dialog").hidden = true;
}
function quitGame() {
  closeQuitDialog();
  state.scores = [0, 0];
  state.round = 0;
  state.turn = 0;
  showScreen("home-screen");
}
document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "start") showScreen("teams-screen");
  if (action === "instructions") showScreen("instructions-screen");
  if (action === "home") showScreen("home-screen");
  if (action === "teams") showScreen("teams-screen");
  if (action === "question") showScreen("question-screen");
  if (action === "quit") openQuitDialog();
  if (action === "cancel-quit") closeQuitDialog();
  if (action === "confirm-quit") quitGame();
  if (action === "round-minus") updateRounds(state.rounds - 1);
  if (action === "round-plus") updateRounds(state.rounds + 1);
  if (action === "add-team" && state.teams.length < 6) { state.teams.push(defaultTeams[state.teams.length]); renderTeamInputs(); }
  if (action === "remove-team") { const index = Number(event.target.closest("[data-team-index]").dataset.teamIndex); if (index >= 2) { state.teams.splice(index, 1); renderTeamInputs(); } }
  if (action === "reveal") reveal();
  if (action === "next") nextRound();
  if (action === "restart") showScreen("teams-screen");
  const answer = event.target.closest("[data-answer]");
  if (answer) { document.querySelectorAll(".answer-option").forEach((button) => button.classList.remove("selected")); answer.classList.add("selected"); state.selected = answer.dataset.answer; $("reveal-button").disabled = false; }
});
$("teams-form").addEventListener("submit", (event) => { event.preventDefault(); setupGame(); });
