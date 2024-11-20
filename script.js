// Riferimenti agli elementi HTML
const generateButton = document.getElementById("generateRoomCode");
const roomInfoDiv = document.getElementById("roomInfo");
const roomCodeSpan = document.getElementById("roomCode");
const roomLinkAnchor = document.getElementById("roomLink");
const joinButton = document.getElementById("joinRoom");
const inputRoomCode = document.getElementById("inputRoomCode");
const welcomeMessageDiv = document.getElementById("welcomeMessage");
const welcomeRoomCodeSpan = document.getElementById("welcomeRoomCode");
const questionDiv = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const submitAnswerButton = document.getElementById("submitAnswer");
const answersListDiv = document.getElementById("answersList");

let roomCode; // Variabile per il codice della stanza

// Funzione per generare un codice stanza univoco
function generateRoomCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Funzione per mostrare il messaggio di benvenuto
function showWelcomeMessage(roomCode) {
  welcomeRoomCodeSpan.textContent = roomCode;
  welcomeMessageDiv.style.display = "block";
}

// Funzione per scegliere una domanda casuale
const questions = [
  "Qual è il tuo ricordo più bello di quando eravamo insieme?",
  "Se potessi viaggiare in qualsiasi posto del mondo, dove andresti?",
  "Qual è la cosa che ti rende più felice quando siamo insieme?",
  "Come immagini il nostro futuro tra 5 anni?",
  "Qual è una cosa che ti piacerebbe che facessimo insieme?"
];

function getRandomQuestion() {
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

// Funzione per inviare la risposta e salvarla in Firestore
function submitAnswerToFirestore() {
  if (answerInput.value.trim() !== "") {
    const answer = answerInput.value.trim();
    // Aggiunge la risposta nel Firestore sotto la stanza
    const roomRef = db.collection("rooms").doc(roomCode);
    roomRef.update({
      answers: firebase.firestore.FieldValue.arrayUnion(answer)
    });
    answerInput.value = ""; // Pulisce il campo di input
  }
}

// Quando si crea una stanza
generateButton.addEventListener("click", () => {
  roomCode = generateRoomCode(); // Genera un codice stanza
  const roomLink = `${window.location.origin}?room=${roomCode}`; // Crea il link della stanza

  // Mostra il codice e il link
  roomCodeSpan.textContent = roomCode;
  roomLinkAnchor.textContent = roomLink;
  roomLinkAnchor.href = roomLink;
  roomInfoDiv.style.display = "block";

  // Salva la stanza nel Firestore
  db.collection("rooms").doc(roomCode).set({
    question: getRandomQuestion(),
    answers: [] // Inizializza la lista delle risposte
  });
});

// Quando un giocatore inserisce manualmente il codice della stanza
joinButton.addEventListener("click", () => {
  const inputRoomCodeValue = inputRoomCode.value.trim();
  if (inputRoomCodeValue) {
    roomCode = inputRoomCodeValue;
    showWelcomeMessage(roomCode);

    // Carica la domanda e le risposte della stanza da Firestore
    const roomRef = db.collection("rooms").doc(roomCode);
    roomRef.get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        questionDiv.textContent = data.question;

        // Ascolta le risposte in tempo reale
        roomRef.onSnapshot(snapshot => {
          const answers = snapshot.data().answers;
          answersListDiv.innerHTML = ""; // Pulisce la lista delle risposte
          answers.forEach(answer => {
            const answerDiv = document.createElement("div");
            answerDiv.textContent = answer;
            answersListDiv.appendChild(answerDiv);
          });
        });
      } else {
        alert("Stanza non trovata! Verifica il codice.");
      }
    });
  } else {
    alert("Per favore, inserisci un codice valido!");
  }
});

// Quando l'utente invia la risposta
submitAnswerButton.addEventListener("click", () => {
  submitAnswerToFirestore();
});

// Controlla se il codice della stanza è nell'URL
function getRoomCodeFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("room");
}

// Mostra il messaggio di benvenuto e carica la domanda se il codice della stanza è presente nell'URL
const roomCodeFromURL = getRoomCodeFromURL();
if (roomCodeFromURL) {
  roomCode = roomCodeFromURL;
  showWelcomeMessage(roomCode);

  // Carica la domanda e le risposte della stanza da Firestore
  const roomRef = db.collection("rooms").doc(roomCode);
  roomRef.get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      questionDiv.textContent = data.question;

      // Ascolta le risposte in tempo reale
      roomRef.onSnapshot(snapshot => {
        const answers = snapshot.data().answers;
        answersListDiv.innerHTML = ""; // Pulisce la lista delle risposte
        answers.forEach(answer => {
          const answerDiv = document.createElement("div");
          answerDiv.textContent = answer;
          answersListDiv.appendChild(answerDiv);
        });
      });
    } else {
      alert("Stanza non trovata! Verifica il codice.");
    }
  });
}
