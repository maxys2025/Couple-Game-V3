// Inizializza Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB587rfkIlh5PiQH1oF0IO3sj-m4SAww6k",  // Sostituisci con la tua chiave
  authDomain: "couple-game-v3.firebaseapp.com",  // Sostituisci con il tuo dominio
  projectId: "couple-game-v3",  // Sostituisci con il tuo ID progetto
  storageBucket: "couple-game-v3.firebasestorage.app",  // Sostituisci con il tuo bucket
  messagingSenderId: "200523668060",  // Sostituisci con il tuo sender ID
  appId: "1:200523668060:web:3e4c835679af19a67ae499"  // Sostituisci con il tuo App ID
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);

// Riferimento alla collezione "questions" su Firestore
const db = firebase.firestore();
const questionsRef = db.collection("questions");

// Funzione per ottenere una domanda casuale da Firestore
async function getRandomQuestion() {
  try {
    // Recupera tutte le domande dalla collezione "questions"
    const snapshot = await questionsRef.get();
    
    // Estrai tutte le domande
    const questions = snapshot.docs.map(doc => doc.data().question);

    // Seleziona una domanda casuale
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    // Mostra la domanda sulla pagina
    document.getElementById("question").textContent = randomQuestion;
  } catch (error) {
    console.error("Errore nel recupero delle domande: ", error);
  }
}

// Quando la pagina viene caricata, carica una domanda casuale
window.onload = getRandomQuestion;
