const socket = io();

const welcome = document.getElementById("welcome");
const form_welcome = welcome.querySelector("form");
const beforeStart = document.getElementById("beforeStart");
const gameStart = document.getElementById("gameStart");
const gameReady = document.getElementById("gameReady");
const gameFinish = document.getElementById("gameFinish");
const roundStart = document.getElementById("roundStart");
const roundFinished = document.getElementById("roundFinish");
const ox = document.getElementById("ox");
const button_o = document.querySelector('.o');
const button_x = document.querySelector('.x');
const button_start = document.querySelector('.start');
const button_exit = document.querySelector('.exit');
const button_ready = document.querySelector('.ready');
const button_exitWhilePlaying = document.querySelector('.exitWhilePlaying');
const clock = document.querySelector('.clock');
const question2 = document.querySelector('.question');
const answer2 = document.querySelector('.answer');
const explanation2 = document.querySelector('.explanation');

let roomName;
beforeStart.hidden = true;
gameStart.hidden = true;
roundStart.hidden = true;
gameFinish.hidden = true;
ox.hidden = true;
gameReady.hidden = true;
roundFinished.hidden = true;

let timeRemaining;
let clockInterval = null;
let roundCnt = 10;
let flag = 0;

function countBack() {
  clock.innerText = `00:${
    timeRemaining < 10 ? `0${timeRemaining}` : timeRemaining
  }`;
  timeRemaining--;
  if(timeRemaining<0){
      stopClock();
  }
}

function startClock() {
  if (clockInterval === null) {
    timeRemaining = 10;
    countBack();
    clockInterval = setInterval(countBack, 1000);
  }
}

function stopClock() {
    roundCnt--;
    clearInterval(clockInterval);
    clockInterval = null;
    clock.innerText = "";

    if (roundCnt === 0){
        socket.emit("answer", showAnswer);
        setTimeout(()=>{
            allRoundFinish();
        },3000);
    } else {
        socket.emit("answer", showAnswer);
        setTimeout(()=>{//답안을 보여준 뒤, 3초간 대기
            roundFinish();
        },3000);
        
    }
}


function showMainPage(){
    welcome.hidden = false;
    beforeStart.hidden = true;
    gameStart.hidden = true;
    gameReady.hidden = true;
    ox.hidden = true;
    roundStart.hidden = true;
    roundFinished.hidden = true;
}

function showBeforeStartRoom(roomName, newCount) {
    welcome.hidden = true;
    beforeStart.hidden = false;
    gameReady.hidden = false;
    const h4 = beforeStart.querySelector("h4");
    h4.innerText = `방이름: ${roomName} ( 참여인원: ${newCount}/10 )`;
};

function showQuestion(question) {
    roundStart.hidden = false;
    roundFinished.hidden = true;
    ox.hidden = false;

	question2.innerText = question;
}

function showAnswer(answer, explanation) {
    roundStart.hidden = true;
    roundFinished.hidden = false;
    ox.hidden = true;

    console.log(answer, explanation);
    answer2.innerText = answer;
    explanation2.innerText = explanation;
}

function roundFinish(){
    socket.emit("question", showQuestion);
    startClock();
}

function allRoundFinish(){
   gameStart.hidden = true;
   gameFinish.hidden = false;
   ox.hidden = true;
}

function showGameRoom(event) {
    beforeStart.hidden = true;
    gameReady.hidden = true;
    gameStart.hidden = false;
    ox.hidden =true;
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
    socket.emit("exit_room", roomName, showMainPage);
}

function handlePlayingRoomExit(event) {//게임 진행중 방을 나가는 경우, 패널티 제공 로직 생성 필요
    event.preventDefault();
    socket.emit("exit_room", roomName, showMainPage);
}

function handleGameStart(event) {
    event.preventDefault();
	if (flag) {
    	socket.emit("gameStart", roomName, showGameRoom);
		socket.emit("question", showQuestion);
    	socket.emit("score", roomName);
		startClock();
	}
}

function readyToStart() {
	// 모든 ready가 끝났을 때 호출된다.
	console.log("completely ready!!!!!");
	flag = 1;
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
	socket.emit("ready", roomName);
}

socket.on("ox", (payload) => {
	console.log(payload);
});

socket.on("welcome", (user, roomName, newCount) => {
    const h4 = beforeStart.querySelector("h4");
    h4.innerText = `방이름: ${roomName} ( 참여인원: ${newCount}/10 )`;
    const ul = beforeStart.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = `${user}님 입장!`;
    ul.appendChild(li);
});

socket.on("message specific user", (uid, msg)  => {
    const h5 = welcome.querySelector("h5");
    h5.innerText = `${msg}`;
});

socket.on("message ready", (uid, msg)  => {
    const h5 = beforeStart.querySelector("h5");
    h5.innerText = `${msg}`;
});

socket.on("remove message", () => {
    const h5 = beforeStart.querySelector("h5");
    h5.innerText = ``;
})

socket.on("score change", (sockets, roomCount) => {
	const scoreList = gameStart.querySelector("ul");
    scoreList.innerHTML = "";
    for(i = 0; i < roomCount; i++) {
        const li = document.createElement("li");
        li.innerText = `${sockets[i].nickname}: ${sockets[i].data.score}`;
        scoreList.append(li);
    }
});

socket.on("ready", () => {
	readyToStart();
});

form_welcome.addEventListener("submit", handleRoomSubmit);
button_start.addEventListener("click", handleGameStart);
button_exit.addEventListener("click", handleRoomExit);
button_exitWhilePlaying.addEventListener("click", handlePlayingRoomExit);
button_o.addEventListener("click", handleOSubmit);
button_x.addEventListener("click", handleXSubmit);
button_ready.addEventListener("click", handleReadySubmit);