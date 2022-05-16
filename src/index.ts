import app from "./app";
import http from "http"; // 이미 기본 설치되어있음
import WebSocket from "ws"; // 기본설치!
import { Server } from "socket.io"; 
import { doesNotMatch } from "assert";
import { Socket } from "dgram";
import { clearInterval } from "timers";
import { Console } from "console";

const PORT = process.env.PORT || 3000;

const handleListening = () => {
	console.log(`✅ Server is ready. http://localhost:${PORT}`);
}

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

//let readyStorage = [];	// readyStorage.push([])
let readyStorage = new Map<string, string[]>();
let arr = [];
let sockets = [];
let answer, explanation;
let users = new Map();
let sortUsers, usersList;
let flag = 0;

const question = [
	{ id: 1, oxQuestion: "이 앱의 이름은 다모여이다.", oxAnswer: "o", explanation: "이 앱의 이름은 다모여가 맞다." },
	{ id: 2, oxQuestion: "이 앱을 만든 조의 이름은 BOOM이다", oxAnswer: "x", explanation: "이 앱을 만든 조의 이름은 BOM이다." },
	{ id: 3, oxQuestion: "이 앱을 만든 조는 6조이다.", oxAnswer: "o", explanation: "이 앱을 만든 조는 6조가 맞다." },
	{ id: 4, oxQuestion: "토마토는 과일이 아니라 채소이다.", oxAnswer: "o", explanation: "토마토는 채소이다." },
	{ id: 5, oxQuestion: "원숭이에게는 지문이 없다.", oxAnswer: "x", explanation: "원숭이에게도 지문이 있다." },
	{ id: 6, oxQuestion: "가장 강한 독을 가진 개구리 한마리의 독으로 사람 2000명 이상을 죽일 수 있다.", oxAnswer: "o", explanation: "아프리카에 사는 식인 개구리의 독성으로 2000명의 사람을 죽일 수 있다." },
	{ id: 7, oxQuestion: "달팽이는 이빨이 있다", oxAnswer: "o", explanation: "달팽이도 이빨이 있다." },
	{ id: 8, oxQuestion: "고양이는 잠을 잘 때 꿈을 꾼다", oxAnswer: "o", explanation: "고양이도 잠을 잘 때 꿈을 꾼다." },
	{ id: 9, oxQuestion: "물고기도 색을 구분할 수 있다.", oxAnswer: "o", explanation: "물고기도 색을 구분한다." },
	{ id: 10, oxQuestion: "낙지의 심장은 3개이다", oxAnswer: "o", explanation: "낙지의 심장은 3개이다." }
];

for (let i = 0; i < question.length; i++)
{
	arr.push(0);
}

wsServer.on("connection", socket => {
	socket.data.nickname = "Anon";

	socket.onAny((event) => {
		console.log(`Socket Event:${event}`);
	});
    
    socket.on("enter_room", (roomName, done) => {
        if ( countRoom(roomName) > 9 ){
            socket.emit("message specific user", socket.id, "정원초과로 입장하실 수 없습니다.😥");
        } else {
            socket.join(roomName);
            console.log(socket.rooms);
            done(roomName, countRoom(roomName));
            sockets.push(socket);
			readyStorage.set(roomName, []);
			users.set(socket.data.nickname, 0);	//여기로 옮겼엉
            socket.to(roomName).emit("welcome", socket.data.nickname, roomName, countRoom(roomName));
        }
    });
    socket.on("nickname", (nickname) => {
		socket.data.nickname = nickname;
		console.log("socket.data.nickname: ", socket.data.nickname);
	});
    
    socket.on("exit_room", (roomName, done) => {
		//let leaveNickname = socket.data.nickname;
		let roomReadyArr = readyStorage.get(roomName);
		console.log("1: ", roomReadyArr);
		let removeIdArr = roomReadyArr.filter((element) => element !== socket.id);
		console.log("2: ", removeIdArr);
		readyStorage.set(roomName, removeIdArr);
		console.log(readyStorage.get(roomName));
		socket.leave(roomName);
		console.log(socket.rooms);
		socket.to(roomName).emit("bye", socket.data.nickname, roomName, countRoom(roomName));
        done();
    });//

    socket.on("gameStart", (roomName) => {
        usersList = JSON.stringify(Array.from(users));
        wsServer.sockets.in(roomName).emit("scoreboard display", usersList);
		wsServer.sockets.in(roomName).emit("showGameRoom");
    });
   
	socket.on("ox", (payload) => {
		socket.data.ox = payload.ox;
		wsServer.sockets.emit("ox", { answer: payload.ox, userId: payload.userId });
	});
	
	socket.on("ready", (roomName) => {
		let roomReadyArr = readyStorage.get(roomName);
		console.log(roomReadyArr);
		if (!roomReadyArr.includes(socket.id)) {
			roomReadyArr.push(socket.id);
			readyStorage.set(roomName, roomReadyArr);
			console.log(readyStorage.get(roomName));
		} else {
			/*readyStorage = readyStorage.filter((element) => {
				return element != socket.id	
			});*/
			let removeIdArr = roomReadyArr.filter((element) => element !== socket.id);
			console.log(removeIdArr);
			readyStorage.set(roomName, removeIdArr);
			console.log(readyStorage.get(roomName));
		}

		roomReadyArr = readyStorage.get(roomName);

		if (roomReadyArr.length === wsServer.sockets.adapter.rooms.get(roomName)?.size) {
			wsServer.sockets.in(roomName).emit("ready");
		} else {
			wsServer.sockets.in(roomName).emit("ready check");
		}
	}); 

	socket.on("ready check", (roomName) => {
		if ((readyStorage.get(roomName)).length === wsServer.sockets.adapter.rooms.get(roomName)?.size) {
			console.log("h");
			wsServer.sockets.emit("ready");
		}
	});
	 
	socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.data.nickname}: ${msg}`);
        done();
    });

	socket.on("question", (roomName, done) => {
		let cnt = 0;

		for (let i = 0; i < question.length; i++) // Question 문제를 다 전송했는지 확인
		{
			if (arr[i] === 1) {
				cnt++;
			}
			if (cnt >= question.length) {
				return; 
			}
		}

		if (flag === 0) {
			flag = 1;	
		} else {
			return;
		}

		let index = Math.floor(Math.random() * 10);

		while(arr[index]) {
			index = Math.floor(Math.random() * 10);
		}		

		arr[index] = 1;

        answer = question[index].oxAnswer;
        explanation = question[index].explanation;
        
        console.log(question[index].oxQuestion);
        
		wsServer.sockets.in(roomName).emit("round", question[index].oxQuestion, index);
		wsServer.sockets.in(roomName).emit("timer");
	});

 
	socket.on("score", payload => {
		if (question[payload.index].oxAnswer === socket.data.ox) // 정답이면
		{
			users.forEach((value, key) => {
				if (key === socket.data.nickname)
				{
					users.set(key, Number(value) + 10);
					socket.data.ox = "";
				}
			});
			sortUsers = new Map([...users.entries()].sort((a, b) => b[1] - a[1]));
			console.log("dd", sortUsers);
            usersList = JSON.stringify(Array.from(sortUsers));
            wsServer.sockets.in(payload.roomName).emit("score change", usersList);
		}
	});

	socket.on("answer", (done) => {
        flag = 0;
		done(answer, explanation);
	});

	socket.on("all finish", (roomName, done) => {
		sortUsers = new Map([...users.entries()].sort((a, b) => b[1] - a[1]));
		console.log("cc", sortUsers);
		usersList = JSON.stringify(Array.from(sortUsers));
		done(usersList);		
	 })
});

httpServer.listen(PORT, handleListening);