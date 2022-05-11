const socket = io();

const welcome = document.getElementById("welcome");
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
const roomForm = welcome.querySelector("#room");
const nameForm = welcome.querySelector("#name");
roomForm.addEventListener("submit", handleRoomSubmit);
nameForm.addEventListener("submit", handleNicknameSubmit);

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

function showQuestion(question, id) {
    roundStart.hidden = false;
    roundFinished.hidden = true;
    ox.hidden = false;

	question2.innerText = question;
	question2.setAttribute("data-id", id);
	console.log(question2);
    //startClock;
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
	var index = question2.getAttribute('data-id');
	socket.emit("score", { index: index, roomName: roomName });
    socket.emit("question", roomName, showQuestion);
}

function allFinish(users){
    const resultList = gameFinish.querySelector("ul");
    newMap = new Map(JSON.parse(users));
    i = 0;
    newMap.forEach((value, key) => {
        i++;
        const li = document.createElement("li");
        li.innerText = `🎲 ${i}위  ${key}  ${value}점`;
        resultList.append(li);
    })
}

function allRoundFinish(){
   gameStart.hidden = true;
   roundStart.hidden = true;
   roundFinished.hidden = true;
   ox.hidden = true;
   socket.emit("all finish", roomName, allFinish);
   gameFinish.hidden = false;
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = welcome.querySelector("#room input");
    socket.emit("enter_room", input.value, showBeforeStartRoom);
    roomName = input.value;
    input.value = "";
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const nickinput = welcome.querySelector("#name input");
    socket.emit("nickname", nickinput.value);
    nickname = nickinput.value;
    nickinput.value = "";
};

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
    	socket.emit("gameStart", roomName);
		socket.emit("question", roomName, showQuestion);
	}
}

function readyToStart() {
	// 모든 ready가 끝났을 때 호출된다.
	console.log("completely ready!!!!!");
	flag = 1;
}

function handleOSubmit(event) {
	event.preventDefault();
	socket.emit("ox", { userId: 1, ox: 'o' });
}

function handleXSubmit(event) {
	event.preventDefault();
	socket.emit("ox", { userId: 1, ox: 'x' });
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

socket.on("bye", (user, roomName, newCount) => {
    const h4 = beforeStart.querySelector("h4");
    h4.innerText = `방이름: ${roomName} ( 참여인원: ${newCount}/10 )`;
    const ul = beforeStart.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = `${user}님 퇴장!`;
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

let newMap, i;
socket.on("scoreboard display", (users) => {
    const scoreList = gameStart.querySelector("ul");
    //scoreList.innerHTML = "";
    newMap = new Map(JSON.parse(users));
    newMap.forEach((value, key) => {
        const li = document.createElement("li");
        li.innerText = `${key}: ${value}`;
        scoreList.append(li);
    });
});

socket.on("score change", (users, count) => {
	const scoreList = gameStart.querySelector("ul");
    //scoreList.innerHTML = "";
    newMap = new Map(JSON.parse(users));
    const items = scoreList.getElementsByTagName('li');
    while(items.length != 0){
        items[0].remove();
    }
    newMap.forEach((value, key) => {
        const li = document.createElement("li");
        li.innerText = `${key}: ${value}`;
        scoreList.append(li);
    });
});

socket.on("ready", () => {
	readyToStart();
});

socket.on("round",( question, id)=>{
    roundStart.hidden = false;
    roundFinished.hidden = true;
    ox.hidden = false;

	question2.innerText = question;
	question2.setAttribute("data-id", id);
	console.log(question2);
});

socket.on("showGameRoom", () => {
    beforeStart.hidden = true;
    gameReady.hidden = true;
    gameStart.hidden = false;
    ox.hidden = true;
});

socket.on("timer", ()=>{
    startClock();
});

button_start.addEventListener("click", handleGameStart);
button_exit.addEventListener("click", handleRoomExit);
button_exitWhilePlaying.addEventListener("click", handlePlayingRoomExit);
button_o.addEventListener("click", handleOSubmit);
button_x.addEventListener("click", handleXSubmit);
button_ready.addEventListener("click", handleReadySubmit);