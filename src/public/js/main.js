const socket = io();

const button_o = document.querySelector('.o');
const button_x = document.querySelector('.x');

function handleOSubmit(event) {
	event.preventDefault();
	socket.emit("ox", { userId: 1, ox: 'o'});
}

function handleXSubmit(event) {
	event.preventDefault();
	socket.emit("ox", { userId: 1, ox: 'x'});
}

button_o.addEventListener("click", handleOSubmit);
button_x.addEventListener("click", handleXSubmit);

socket.on("ox", (payload) => {
	console.log(payload);
});