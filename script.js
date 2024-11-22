// Seleziona tutte le tessere
const cards = document.querySelectorAll('.card');

// Aggiungi l'evento click a ogni tessera
cards.forEach(card => {
  card.addEventListener('click', () => {
    const inner = card.querySelector('.inner');
    inner.classList.toggle('flipped'); // Gira la tessera
  });
});
