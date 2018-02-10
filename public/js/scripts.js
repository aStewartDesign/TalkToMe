const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const elTalk = document.getElementById('talk');
const elDialog = document.getElementById('dialog');
const socket = io();
const saySomething = (something) => {
    const sudo = window.speechSynthesis;
    const woof = new SpeechSynthesisUtterance();
    woof.text = something;
    sudo.speak(woof);
};
const logSomething = (text = '', person = 'client') => {
    const elDiv = document.createElement('div');
    elDiv.classList.add('dialog__bubble');
    elDiv.classList.add(`dialog__bubble--${person}`);
    elDiv.textContent = text;
    elDialog.appendChild(elDiv);
};

elTalk.addEventListener('click', () => {
    recognition.start();
});
recognition.addEventListener('result', (e) => {
    const result = e.results[e.results.length - 1][0];
    const text = result.transcript;
    logSomething(text);
    socket.emit('chat-in', text);
    console.log(`I am ${Math.round(result.confidence * 100)}% confident you said: ${text}`);
});
socket.on('chat-out', (text) => {
    saySomething(text);
    logSomething(text, 'bot');
});
