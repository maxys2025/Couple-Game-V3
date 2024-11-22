// Lista delle domande
const questions = [
  "Domanda 1?",
  "Domanda 2?",
  "Domanda 3?",
  "Domanda 4?",
  "Domanda 5?",
  "Domanda 6?",
];

// Funzione per mescolare l'array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Mescola le domande
const shuffledQuestions = shuffle(questions);

// Applica le domande alle tessere
const cards = document.querySelectorAll('.card');
cards.forEach((card, index) => {
  const back = card.querySelector('.back');
  if (shuffledQuestions[index]) {
    back.textContent = shuffledQuestions[index];
  }
});

// Gestione del click per girare le tessere
cards.forEach(card => {
  card.addEventListener('click', () => {
    const inner = card.querySelector('.inner');
    inner.classList.toggle('flipped'); // Gira la tessera

    // Aggiungi una classe "permanent" al primo clic
    if (!inner.classList.contains('permanent')) {
      setTimeout(() => {
        inner.classList.add('permanent'); // Segna la tessera come girata
      }, 600); // Aspetta che finisca l'animazione del flip
    }
  });
});
