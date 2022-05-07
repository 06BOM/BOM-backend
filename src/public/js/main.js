const socket = io();

const form_test = document.querySelector("#test_form");
const button_o = document.querySelector('.o');
const button_x = document.querySelector('.x');

function handleTestSubmit(event) {
	event.preventDefault();
	socket.emit("test", { payload: "test" });
}

function handleOSubmit(event) {
	event.preventDefault();
	socket.emit("ox", { userId: 1, ox: 'o'});
	console.log("o was clicked");
}

function handleXSubmit(event) {
	event.preventDefault();
	socket.emit("ox", { userId: 1, ox: 'x'});
	console.log("x was clicked");
}

form_test.addEventListener("submit", handleTestSubmit);
button_o.addEventListener("click", handleOSubmit);
button_x.addEventListener("click", handleXSubmit);

socket.on("ox", (payload) => {
	console.log(payload);
});