// socket.io
const socket = io();

//Adds text to on input and output page chat
const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');

// Web speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; //including both prefixed and non-prefixed objects, because Chrome currently supports the API with prefixed properties.
const recognition = new SpeechRecognition();

// web speech API config
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

//Once button is pressed this will start the microphone function
document.querySelector('button').addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('result', (e) => {
  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  outputYou.textContent = text;
  console.log('Confidence: ' + e.results[0][0].confidence);

  socket.emit('chat message', text);
});

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);
}

socket.on('bot reply', function(replyText) {
  synthVoice(replyText);

  if(replyText == '') replyText = '(No answer...)';
  outputBot.textContent = replyText;
});