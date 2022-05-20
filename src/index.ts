import app from "./app";
import http from "http"; // 이미 기본 설치되어있음
import { Server } from "socket.io"; 
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

async function createRoom(roomInfo) {
	let room = await prisma.room.create({
		data: roomInfo
	})
}

async function deleteRoom(roomName) {
	let room = await prisma.room.deleteMany({
		where: { roomName : roomName}
	})
}

async function checkRoomExist(roomName) {
	let checkExist = await prisma.room.findFirst({
		where: { roomName: roomName }
	})
	console.log("ddd: ", checkExist);
	return checkExist;
}

async function getRoomInfo(roomName) {
	let roomInfo = await prisma.room.findFirst({
		where: { roomName: roomName }
	})
	//console.log("roomInfo: ", roomInfo);
	return roomInfo;
}

async function set10Questions(roomName, subject, grade){
	let allQuestionIds = [];
	let questions = [];

	let questionIds = await prisma.oXDB.findMany({
		where: {
			subject: subject,
			grade: grade
		},
		select: { oxquestionId: true }
	})

	questionIds.map(question => {
		allQuestionIds.push(question.oxquestionId);
	});

	for(let i=0; i < 10; i++){
		let moveId = allQuestionIds.splice(Math.floor(Math.random() * allQuestionIds.length),1)[0]
		let question = await prisma.oXDB.findUnique({
			where: { oxquestionId: moveId }
		});
		questions.push(question);
	}
	console.log("10개의 question id: ", questions);
	questionsOfRooms.set(roomName, questions);
	//let difference = allQuestionIds.filter(x => !questionIds.includes(x)); 추후 차집합 필요 시 사용
}


wsServer.on("connection", socket => {
	socket.data.nickname = "Anon";

	socket.onAny((event) => {
		console.log(`Socket Event:${event}`);
	});

	socket.on("nickname", (nickname) => {
		socket.data.nickname = nickname;
		//console.log("socket.data.nickname: ", socket.data.nickname);
	});
    
    socket.on("enter_room", (roomName, done) => {
		let playingF = 0;
        if (playingFlag.get(roomName) === 1){	
			console.log("게임중이어서 방 입장 불가😖");
            playingF = 1;
		} else {
            socket.join(roomName);
            console.log("현재 존재하는 방들: ", socket.rooms);
            done(roomName, countRoom(roomName), playingF); 

			let immScoreMap = new Map();
			if (scoreListOfRooms.has(roomName)) {
				immScoreMap = scoreListOfRooms.get(roomName);
			}
			immScoreMap.set(socket.data.nickname, 0);
			scoreListOfRooms.set(roomName, immScoreMap);
			console.log("enter room - scoreListOfRooms: ", scoreListOfRooms)

            let users = [];
			scoreListOfRooms.forEach((value, key, map) => value.forEach((value, key, map) => users.push(key)));
			wsServer.to(roomName).emit("welcome", socket.data.nickname, roomName, countRoom(roomName));
        }
    });

	socket.on("create room", ( payload, nickname ) => {
		
		checkRoomExist(payload.roomName).then( checkExist => {
			console.log("here checkExist: ", checkExist);
			
			if (checkExist === null){
				console.log("in here 1")
				createRoom(payload).then( a => {
					socket.join(payload.roomName);
            		console.log("현재 존재하는 방들: ", socket.rooms);
					socket.emit("create room", payload.roomName, countRoom(payload.roomName)); 
					
					if (readyStorage.get(payload.roomName) === undefined) {
						readyStorage.set(payload.roomName, []);
					}
					let immScoreMap = new Map();
					immScoreMap.set(nickname, 0);
					scoreListOfRooms.set(payload.roomName, immScoreMap);
					console.log("create room - scoreListOfRooms: ", scoreListOfRooms);

					getRoomInfo(payload.roomName).then(roomInfo => {
						set10Questions(payload.roomName, roomInfo.subject, roomInfo.grade);
					})
				});

			} else {
				console.log("in here 2");
				socket.emit("already exist");
			}
		});
	});

	socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.data.nickname}: ${msg}`);
        done();
    });

	socket.on("ready", (roomName) => {
		let roomReadyArr = readyStorage.get(roomName);
		if (!roomReadyArr.includes(socket.id)) {
			roomReadyArr.push(socket.id);
			readyStorage.set(roomName, roomReadyArr);
		} else {
			let removeIdArr = roomReadyArr.filter((element) => element !== socket.id);
			readyStorage.set(roomName, removeIdArr);
		}

		console.log("ready한 socket id들: ", readyStorage.get(roomName));
		roomReadyArr = readyStorage.get(roomName);

		if (roomReadyArr.length === wsServer.sockets.adapter.rooms.get(roomName)?.size) {
			wsServer.sockets.in(roomName).emit("ready");
		} else {
			wsServer.sockets.in(roomName).emit("ready check");
		}
	}); 

	socket.on("ready check", (roomName) => {
		if ((readyStorage.get(roomName)).length === wsServer.sockets.adapter.rooms.get(roomName)?.size) {
			wsServer.sockets.emit("ready");
		}
	});

    socket.on("gameStart", (roomName) => {
		checkQuestionsUsage.set(roomName, [0,0,0,0,0,0,0,0,0,0]);
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
			if (checkQuestionsUsage.get(roomName)[i] === 1) cnt++;
			if (cnt >= 10) return; 
		}

		if (firstQflag.get(roomName) === 0) {	//flag 0: 가장 첫번째 실행한 사람만 아래 코드 실행
			firstQflag.set(roomName, 1);	
		} else {
			return;
		}

		let index = 0;
		while(checkQuestionsUsage.get(roomName)[index]){
			index++;
		}	

		checkQuestionsUsage.get(roomName)[index] = 1;
        answer = questionsOfRooms.get(roomName)[index].oxanswer;
        explanation = questionsOfRooms.get(roomName)[index].explanation;
        
        //console.log("문제정보: ", answer, explanation, questionsOfRooms.get(roomName)[index].oxquestion);
		wsServer.sockets.in(roomName).emit("round", questionsOfRooms.get(roomName)[index].oxquestion, index);
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
		console.log("[payload.index].oxanswer: ", questionsOfRooms.get(payload.roomName)[payload.index].oxAnswer)
		console.log("socket.data.ox: ", socket.data.ox);
		if (questionsOfRooms.get(payload.roomName)[payload.index].oxanswer === socket.data.ox) {	//정답
			immMap = scoreListOfRooms.get(payload.roomName);
			immMap.forEach((value, key) => {
				if (key === socket.data.nickname) {
					immMap.set(key, Number(value) + 10);
					socket.data.ox = "";
				}
			});
			sortScores = new Map([...immMap.entries()].sort((a, b) => b[1] - a[1]));
			scoreListOfRooms.set(payload.roomName, sortScores);
			console.log("sortScores: ", sortScores);
            wsServer.sockets.in(payload.roomName).emit("score change", JSON.stringify(Array.from(sortScores)));
		}
	});

	socket.on("all finish", (roomName, done) => {
		sortScores = new Map([...immMap.entries()].sort((a, b) => b[1] - a[1]));
		done(JSON.stringify(Array.from(sortScores)));

		playingFlag.set(roomName, 0);
		checkQuestionsUsage.set(roomName, [0,0,0,0,0,0,0,0,0,0]);	
		immMap = new Map(scoreListOfRooms.get(roomName));
		immMap.forEach((value, key) => {
			immMap.set(key, 0); 
		})	
		scoreListOfRooms.set(roomName, immMap);
		getRoomInfo(roomName).then(roomInfo => {
			set10Questions(roomName, roomInfo.subject, roomInfo.grade);
		})
	 })

	 socket.on("exit_room", (roomName, done) => {
		let removeIdArr = readyStorage.get(roomName).filter((element) => element !== socket.id);
		readyStorage.set(roomName, removeIdArr);
		if (readyStorage.get(roomName).length === 0){
			checkQuestionsUsage.delete(roomName);
			firstQflag.delete(roomName);
			console.log("delete checkQuestionsUsage, firstQflag ", checkQuestionsUsage, firstQflag);
			deleteRoom(roomName);
			wsServer.sockets.in(roomName).emit("clear");
		}
		socket.leave(roomName);
		console.log("exit-현재 존재하는 방들: ", socket.rooms);
		console.log("scoreListOfRooms: ")
		socket.to(roomName).emit("bye", socket.data.nickname, roomName, countRoom(roomName));
        done();
    });
});

httpServer.listen(PORT, handleListening);