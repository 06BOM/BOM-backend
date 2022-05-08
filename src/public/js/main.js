const socket = io();

const welcome = document.getElementById("welcome");
const form_welcome = welcome.querySelector("form");
const beforeStart = document.getElementById("beforeStart");
const gameStart = document.getElementById("gameStart");
const gameReady = document.getElementById("gameReady");
const ox = document.getElementById("ox");
const button_o = document.querySelector('.o');
const button_x = document.querySelector('.x');
const button_start = document.querySelector('.start');
const button_exit = document.querySelector('.exit');
const button_ready = document.querySelector('.ready');

let roomName;
beforeStart.hidden = true;
gameStart.hidden = true;
gameReady.hidden = true;
ox.hidden = true;

function showMainPage(){
    welcome.hidden = false;
    beforeStart.hidden = true;
    gameStart.hidden = true;
    gameReady.hidden = true;
    ox.hidden = true;
}

function showBeforeStartRoom(roomName, newCount) {
    welcome.hidden = true;
    beforeStart.hidden = false;
    gameReady.hidden = false;
    const h5 = beforeStart.querySelector("h5");
    h5.innerText = `방이름: ${roomName} ( 참여인원: ${newCount}/10 )`;
};

function showGameRoom(event) {
    beforeStart.hidden = true;
    gameStart.hidden = false;
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form_welcome.querySelector("input");
    const nickname = "가히"; // 추후 db접근해서 닉넴가져오거나
    socket.emit("enter_room", input.value, nickname, showBeforeStartRoom);
    roomName = input.value;
    input.value = "";
}

function handleRoomExit(event) {
    event.preventDefault();
    roomName = socket.roomName;
    socket.emit("exit_room", roomName, showMainPage);
}

function handleGameStart(event) {
    event.preventDefault();
    socket.emit("gameStart", showGameRoom);
}

function readyToStart() {
	// 모든 ready가 끝났을 때 호출된다.
	console.log("completely ready!!!!!");
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
button_start.addEventListener("click", handleGameStart);
button_exit.addEventListener("click", handleRoomExit);
button_o.addEventListener("click", handleOSubmit);
button_x.addEventListener("click", handleXSubmit);
button_ready.addEventListener("click", handleReadySubmit);

socket.on("ox", (payload) => {
	console.log(payload);
});

socket.on("welcome", (user, roomName, newCount) => {
    const h5 = beforeStart.querySelector("h5");
    h5.innerText = `방이름: ${roomName} ( 참여인원: ${newCount}/10 )`;
    const ul = beforeStart.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = `${user}님 입장!`;
    ul.appendChild(li);
});

socket.on("message specific user", (uid, msg)  => {
    const h5 = welcome.querySelector("h5");
    h5.innerText = `${msg}😥`;
});

socket.on("ready", () => {
	readyToStart();
});
