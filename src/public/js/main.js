const socket = io();

const welcome = document.getElementById("welcome");
const beforeStart = document.getElementById("beforeStart");
const gameStart = document.getElementById("gameStart");
const gameReady = document.getElementById("gameReady");
const gameFinish = document.getElementById("gameFinish");
const roundStart = document.getElementById("roundStart");
const roundFinished = document.getElementById("roundFinish");
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
const createRoomForm = welcome.querySelector("#createroom");


roomForm.addEventListener("submit", handleRoomSubmit);
// nameForm.addEventListener("submit", handleNicknameSubmit);
createRoomForm.addEventListener("submit", handleMakeRoom);
button_start.addEventListener("click", handleGameStart);
button_exit.addEventListener("click", handleRoomExit);
button_exitWhilePlaying.addEventListener("click", handlePlayingRoomExit);
button_o.addEventListener("click", handleOSubmit);
button_x.addEventListener("click", handleXSubmit);
button_ready.addEventListener("click", handleReadySubmit);


beforeStart.hidden = true;
gameStart.hidden = true;
roundStart.hidden = true;
gameFinish.hidden = true;
gameReady.hidden = true;
roundFinished.hidden = true;

let roomName, timeRemaining, nickname;
let clockInterval = null;
let roundCnt = 10;
let readyFlag = 0;
let exitFlag = 0;
let playingFlag = 0;
let userCount = 0;

function countBack() {
  clock.innerText = `00:${
    timeRemaining < 3 ? `0${timeRemaining}` : timeRemaining
  }`;
  timeRemaining--;
  if(timeRemaining<0){
      stopClock();
  }
}

function startClock() {
  if (clockInterval === null) {
    timeRemaining = 3;
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
        socket.emit("answer", roomName, showAnswer);
        setTimeout(()=>{
            allRoundFinish();
        },3000);
    } else if (exitFlag === 1){
        gameStart.hidden = true;
        roundStart.hidden = true;
        roundFinished.hidden = true;
        exitFlag = 0;
    } 
    else {
        socket.emit("answer", roomName, showAnswer);
        setTimeout(()=>{//????????? ????????? ???, 3?????? ??????
            roundFinish();
        },3000);
        
    }
}

function showMainPage(){
    welcome.hidden = false;
    beforeStart.hidden = true;
    gameStart.hidden = true;
    gameReady.hidden = true;
   //ox.hidden = true;
    roundStart.hidden = true;
    roundFinished.hidden = true;
}

function showBeforeStartRoom(roomName, newCount, playingFlag) {
    if (playingFlag === 0) {
		const beforeStartul = beforeStart.querySelector("ul");
    	const items = beforeStartul.getElementsByTagName('li');
    	while(items.length != 0){
        	items[0].remove();
    	}
		
        welcome.hidden = true;
        beforeStart.hidden = false;
        gameReady.hidden = false;
        userCount = newCount;
        const h4 = beforeStart.querySelector("h4");
        h4.innerText = `?????????: ${roomName} ( ????????????: ${newCount}/10 )`;
        const form = beforeStart.querySelector("form");
        form.addEventListener("submit", handleMessageSubmit);
    } else {
        console.log("???????????? ????????? ????????????");
    }
};

function showQuestion(question, id) {
    roundStart.hidden = false;
    roundFinished.hidden = true;
    //ox.hidden = false;

	question2.innerText = question;
	question2.setAttribute("data-id", id);
	console.log(question2);
    //startClock;
}

function showAnswer(answer, explanation) {
    //event.preventDefault();
    roundStart.hidden = true;
    roundFinished.hidden = false;

    console.log(answer, explanation);
    answer2.innerText = answer;
    explanation2.innerText = explanation;
}

function roundFinish(){
	var index = question2.getAttribute('data-id');
	socket.emit("score", { index: index, roomName: roomName });
    socket.emit("question", roomName);
}

let n;
function allFinish(users){
    const resultList = gameFinish.querySelector("ul");
    let rankList = [];
    userss = JSON.parse(users);
    newMap = new Map(userss);
    rankList[0] = 1;
    for(i=1; i < newMap.size; i++) {
        if (userss[i-1][1] === userss[i][1]) {
            rankList[i] = rankList[i-1]
        } else {
            rankList[i] = rankList[i-1] + 1;
        }
    }

    i = 0;
    newMap.forEach((value, key) => {
        const li = document.createElement("li");
        li.innerText = `???? ${rankList[i]}???  ${key}  ${value}???`;
        resultList.append(li);
        i++;
    }) 
}

function allRoundFinish(){
    var index = question2.getAttribute('data-id');
   gameStart.hidden = true;
   roundStart.hidden = true;
   roundFinished.hidden = true;
   socket.emit("score", { index: index, roomName: roomName });
   socket.emit("all finish", roomName, allFinish);
   gameFinish.hidden = false;
   setTimeout(()=>{
       gameFinish.hidden = true;
       beforeStart.hidden = false;
       gameReady.hidden = false;
       playingFlag = 0;
       roundCnt = 10;
    },5000);
    //showBeforeStartRoom(roomName, userCount, 0)    
}

function addMessage(messages) {
	const items = beforeStart.getElementsByTagName('li');

	while(items.length != 0){
        items[0].remove();
    }

	let nMap = new Map(JSON.parse(messages));

	nMap.forEach((value, key) => {
		if (key === nickname) {
			value.map(message => {
				const ul = beforeStart.querySelector("ul");
				const li = document.createElement("li");
				li.innerText = message;
				ul.appendChild(li);
			});
		}
	});
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const roominput = welcome.querySelector("#room input");
    const nickinput = welcome.querySelector("#name");
    socket.emit("join_room", roominput.value, nickinput.value, showBeforeStartRoom);
    const nick = nickinput.value;
	nickname = nick;
    roomName = roominput.value;
    roominput.value = "";
    // nickname = "";
}

// function handleNicknameSubmit(event) {
//     event.preventDefault();
//     const nickinput = welcome.querySelector("#name input");
//     socket.emit("nickname", nickinput.value);
//     nickname = nickinput.value;
//     nickinput.value = "";
// };

function handleMakeRoom(event){
    event.preventDefault();
    const roominput = welcome.querySelector("#createroom #roomName");
    const gradeinput = welcome.querySelector("#createroom #grade");
    const subjectinput = welcome.querySelector("#createroom #subject");
    const nickinput = welcome.querySelector("#name");
	const nick = nickinput.value;
	nickname = nick;

    console.log(roominput.value, gradeinput.value, subjectinput.value, nickinput.value);
    socket.emit("create_room", { roomName: roominput.value, kind: 0, userId: 1, grade: parseInt(gradeinput.value), subject: subjectinput.value, secretMode: false, password: null, participantsNum: 0}, nickinput.value);
    roomName = roominput.value;
    roominput.value = "";
}

function checkReady(){
    readyFlag = 0;
    socket.emit("ready check", roomName);
}

function handleRoomExit(event) {
    event.preventDefault();
    checkReady();
    socket.emit("exit_room", roomName, showMainPage);
}

function handlePlayingRoomExit(event) {//?????? ????????? ?????? ????????? ??????, ????????? ?????? ?????? ?????? ??????
    event.preventDefault();
    exitFlag = 1;
    socket.emit("exit_room", roomName, showMainPage);
}

function handleGameStart(event) {   //???????????? ???????????? ?????? ?????????????????? ??????????????????
    event.preventDefault();
	if (readyFlag) {
    	socket.emit("gameStartFunction", roomName); 
		socket.emit("question", roomName, showQuestion);
	}
}

function readyToStart() {
	// ?????? ready??? ????????? ??? ????????????.
	console.log("completely ready!!!!!");
	readyFlag = 1;
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

function handleMessageSubmit(event) {
	event.preventDefault();
	const input = beforeStart.querySelector("input");
	const value = input.value;
	socket.emit("new_message", value, roomName);
	input.value = "";
}

socket.on("ox", (payload) => {
	console.log(payload);
});

socket.on("welcome", (user, roomName, newCount) => {
    const h4 = beforeStart.querySelector("h4");
    userCount = newCount;
    h4.innerText = `?????????: ${roomName} ( ????????????: ${newCount}/10 )`;
    const ul = beforeStart.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = `${user}??? ??????!`;
    ul.appendChild(li);
});

socket.on("create_room", (roomName, newCount) => {
    showBeforeStartRoom(roomName, newCount, 0);
})

socket.on("already exist", ()=>{
    console.log("?????? ?????? ????????? ?????? ??????! ?????? ??????????????? ???????????????!");
})

socket.on("bye", (user, roomName, newCount) => {
    const h4 = beforeStart.querySelector("h4");
    userCount = newCount;
    h4.innerText = `?????????: ${roomName} ( ????????????: ${newCount}/10 )`;
    const ul = beforeStart.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = `${user}??? ??????!`;
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
    const items = scoreList.getElementsByTagName('li');
    while(items.length != 0){
        items[0].remove();
    }   //?????? ?????? ?????? ??? ????????????
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

socket.on("clear", () => {
    const beforeStartul = beforeStart.querySelector("ul");
    const items = beforeStartul.getElementsByTagName('li');
    while(items.length != 0){
        items[0].remove();
    }
})

socket.on("ready", () => {
	readyToStart();
});

socket.on("ready check", () => {
    checkReady();
});

socket.on("round",( question, id)=>{
    console.log(`${question}, ${id} / socket on round`);
    roundStart.hidden = false;
    roundFinished.hidden = true;
    //ox.hidden = false;

	question2.innerText = question;
	question2.setAttribute("data-id", id);
	console.log(question2);
});

socket.on("showGameRoom", () => {
    beforeStart.hidden = true;
    gameReady.hidden = true;
    gameStart.hidden = false;
});

socket.on("timer", ()=>{
    startClock();
});

socket.on("new_message", addMessage);
