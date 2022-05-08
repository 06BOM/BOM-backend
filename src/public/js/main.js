const socket = io();

const button_o = document.querySelector('.o');
const button_x = document.querySelector('.x');
const button_ready = document.querySelector('.ready');

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

button_o.addEventListener("click", handleOSubmit);
button_x.addEventListener("click", handleXSubmit);
button_ready.addEventListener("click", handleReadySubmit);

socket.on("ox", (payload) => {
	console.log(payload);
});

socket.on("ready", () => {
	readyToStart();
});