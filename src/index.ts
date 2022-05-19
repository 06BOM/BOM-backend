import app from "./app";
import http from "http"; // 이미 기본 설치되어있음
import { Server } from "socket.io"; 

const PORT = process.env.PORT || 3000;

const handleListening = () => {
	console.log(`✅ Server is ready. http://localhost:${PORT}`);
}

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

let readyStorage = new Map<string, string[]>();
let checkQuestionsUsage = new Map<string, Number[]>();
let firstQflag = new Map<string, Number>();
let playingFlag = new Map<string, Number>();
let answer, explanation;
let scoreListOfRooms = new Map<string, Map<string, Number>>();
let immMap, sortScores;
let questionsOfRooms = new Map<string, {}>();

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

wsServer.on("connection", socket => {
	socket.data.nickname = "Anon";

	socket.onAny((event) => {
		console.log(`Socket Event:${event}`);
	});

	socket.on("nickname", (nickname) => {
		socket.data.nickname = nickname;
		console.log("socket.data.nickname: ", socket.data.nickname);
	});
    
    socket.on("enter_room", (roomName, done) => {
		//countRoom(roomName) > 9
		let playingF = 0;
        if (playingFlag.get(roomName) === 1){	
			console.log("여기 들어옴");
            playingF = 1;
		} else {
            socket.join(roomName);
            console.log(socket.rooms);
            done(roomName, countRoom(roomName), playingF);

			readyStorage.set(roomName, []);
			checkQuestionsUsage.set(roomName, [0,0,0,0,0,0,0,0,0,0]); 

			let immScoreMap = new Map();
			if (scoreListOfRooms.has(roomName)) {
				immScoreMap = scoreListOfRooms.get(roomName);
			}

			immScoreMap.set(socket.data.nickname, 0);
			scoreListOfRooms.set(roomName, immScoreMap);
			console.log("1. scoreListOfRooms: ", scoreListOfRooms)

            socket.to(roomName).emit("welcome", socket.data.nickname, roomName, countRoom(roomName));
        }
    });

	socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.data.nickname}: ${msg}`);
        done();
    });

	socket.on("ready", (roomName) => {
		let roomReadyArr = readyStorage.get(roomName);
		console.log(roomReadyArr);
		if (!roomReadyArr.includes(socket.id)) {
			roomReadyArr.push(socket.id);
			readyStorage.set(roomName, roomReadyArr);
			console.log(readyStorage.get(roomName));
		} else {
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

    socket.on("gameStart", (roomName) => {
		firstQflag.set(roomName, 0);
		playingFlag.set(roomName, 1);
		immMap = new Map(scoreListOfRooms.get(roomName));
        wsServer.sockets.in(roomName).emit("scoreboard display", JSON.stringify(Array.from(immMap)));
		wsServer.sockets.in(roomName).emit("showGameRoom");
    });

	socket.on("question", (roomName) => {
		let cnt = 0;
		console.log("checkQuestionsUsage: ", checkQuestionsUsage);
		console.log("firstQflag: ", firstQflag);
		for (let i = 0; i < 10; i++){
			if (checkQuestionsUsage.get(roomName)[i] === 1) { 
				cnt++;
			}
			if (cnt >= 10) {
				return; 
			}
		}

		if (firstQflag.get(roomName) === 0) {	//flag 0: 가장 첫번째 실행한 사람만 아래 코드 실행
			firstQflag.set(roomName, 1);	
		} else {
			return;
		}

		let index = Math.floor(Math.random() * 10);
		while(checkQuestionsUsage.get(roomName)[index]) {
			console.log("in here");
			index = Math.floor(Math.random() * 10);
		}		

		checkQuestionsUsage.get(roomName)[index] = 1;
        answer = question[index].oxAnswer;
        explanation = question[index].explanation;
        
        console.log(question[index].oxQuestion);
		wsServer.sockets.in(roomName).emit("round", question[index].oxQuestion, index);
		wsServer.sockets.in(roomName).emit("timer");
	});

	socket.on("ox", (payload) => {
		socket.data.ox = payload.ox;
		wsServer.sockets.emit("ox", { answer: payload.ox, userId: payload.userId });
	});

	socket.on("answer", (roomName, done) => {
		done(answer, explanation);
		firstQflag.set(roomName, 0);
	});

	socket.on("score", payload => {
		if (question[payload.index].oxAnswer === socket.data.ox) {	//정답
			immMap = scoreListOfRooms.get(payload.roomName);
			immMap.forEach((value, key) => {
				if (key === socket.data.nickname) {
					immMap.set(key, Number(value) + 10);
					socket.data.ox = "";
				}
			});
			sortScores = new Map([...immMap.entries()].sort((a, b) => b[1] - a[1]));
			console.log("1.sortScores: ", sortScores);
            wsServer.sockets.in(payload.roomName).emit("score change", JSON.stringify(Array.from(sortScores)));
		}
	});

	socket.on("all finish", (roomName, done) => {
		sortScores = new Map([...immMap.entries()].sort((a, b) => b[1] - a[1]));
		console.log("2.sortScores: ", sortScores);

		done(JSON.stringify(Array.from(sortScores)));

		playingFlag.set(roomName, 0);
		checkQuestionsUsage.set(roomName, [0,0,0,0,0,0,0,0,0,0]);	
		immMap = new Map(scoreListOfRooms.get(roomName));
		immMap.forEach((value, key) => {
			immMap.set(key, 0); 
		})	
		scoreListOfRooms.set(roomName, immMap);
	 })

	 socket.on("exit_room", (roomName, done) => {
		//let roomReadyArr = readyStorage.get(roomName);
		let removeIdArr = readyStorage.get(roomName).filter((element) => element !== socket.id);
		readyStorage.set(roomName, removeIdArr);
		console.log("before checkQuestionsUsage: ", checkQuestionsUsage);
		console.log("before firstQflag: ", firstQflag);
		checkQuestionsUsage.delete(roomName);
		firstQflag.delete(roomName);
		console.log("delete checkQuestionsUsage: ", checkQuestionsUsage);
		console.log("delete firstQflag: ", firstQflag);
		socket.leave(roomName);
		socket.to(roomName).emit("bye", socket.data.nickname, roomName, countRoom(roomName));
        done();
    });
});

httpServer.listen(PORT, handleListening);