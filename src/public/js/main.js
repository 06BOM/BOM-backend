const socket = io();

const welcome = document.getElementById("welcome");
const form_welcome = welcome.querySelector("form");
const beforeStart = document.getElementById("beforeStart");
const gameStart = document.getElementById("gameStart");
const ox = document.getElementById("ox");
const button_o = document.querySelector('.o');
const button_x = document.querySelector('.x');
const button_ready = document.querySelector('.ready');

let roomName;
beforeStart.hidden = true;
gameStart.hidden = true;
ox.hidden = true;

function showBeforeStartRoom() {
    welcome.hidden = true;
    beforeStart.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
};

function showGameRoom(event) {
    beforeStart.hidden = true;
    gameStart.hidden = false;
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form_welcome.querySelector("input");
    socket.emit("enter_room", input.value, showBeforeStartRoom);
    roomName = input.value;
    input.value = "";
}

function handleGameStart(event) {
    event.preventDefault();
    socket.emit("gameStart", showGameRoom);
}

function handleOSubmit(event) {
	event.preventDefault();
	socket.emit("ox", { userId: 1, ox: 'o'});
}

function handleXSubmit(event) {
	event.preventDefault();
	socket.emit("ox", { userId: 1, ox: 'x'});
}

function handleReadySubmit(event) {
	event.preventDefault();
	socket.emit("ready");
}

form_welcome.addEventListener("submit", handleRoomSubmit);
beforeStart.addEventListener("click", handleGameStart);
button_o.addEventListener("click", handleOSubmit);
button_x.addEventListener("click", handleXSubmit);
button_ready.addEventListener("click", handleReadySubmit);

socket.on("ox", (payload) => {
	console.log(payload);
});

