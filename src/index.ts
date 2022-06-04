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
let starFlag = new Map<string, Number>();
let answer, explanation;
let scoreListOfRooms = new Map<string, Map<string, Number>>();
let immMap, sortScores;
let questionsOfRooms = new Map<string, {}>();
let whereSocketIdIn = new Map<string, string>();
let chatting = new Map<string, Map<string, string[]>>(); // <방이름, 채팅 배열>

async function createRoom(roomInfo) {
	try{
		let room = await prisma.room.create({
			data: roomInfo
		})
	} catch (error){
		console.log(error);
	}
}

async function increaseParticipants(roomName) {
	try{
		let roomInfo = await prisma.room.findFirst({
			where: { roomName: roomName }
		})

		let room = await prisma.room.updateMany({
			where: { roomName : roomName },
			data: { participantsNum: (roomInfo.participantsNum + 1) }
		})

	} catch (error){
		console.log(error);
	}
}

async function reduceParticipants(roomName) {
	try{
		let roomInfo = await prisma.room.findFirst({
			where: { roomName: roomName }
		})

		let room = await prisma.room.updateMany({
			where: { roomName : roomName },
			data: { participantsNum: (roomInfo.participantsNum - 1) }
		})

	} catch (error){
		console.log(error);
	}
}

async function playing(roomName) {
	try{
		let roomInfo = await prisma.room.findFirst({
			where: { roomName: roomName }
		})

		let room = await prisma.room.updateMany({
			where: { roomName : roomName },
			data: { playingFlag : true }
		})

	} catch (error){
		console.log(error);
	}
}

async function notPlaying(roomName) {
	try{
		let roomInfo = await prisma.room.findFirst({
			where: { roomName: roomName }
		})

		let room = await prisma.room.updateMany({
			where: { roomName : roomName },
			data: { playingFlag : false }
		})

	} catch (error){
		console.log(error);
	}
}

async function deleteRoom(roomName) {
	try{
		let room = await prisma.room.deleteMany({
			where: { roomName : roomName}
		})

	} catch (error){
		console.log(error);
	}
}

async function checkRoomExist(roomName) {
	try{
		let checkExist = await prisma.room.findFirst({
			where: { roomName: roomName }
		})

		console.log("ddd: ", checkExist);
		return checkExist;

	} catch (error){
		console.log(error);
	}
}

async function getRoomInfo(roomName) {
	try{
		let roomInfo = await prisma.room.findFirst({
			where: { roomName: roomName }
		})
		//console.log("roomInfo: ", roomInfo);
		return roomInfo;

	} catch (error){
		console.log(error);
	}
}

async function set10Questions(roomName, subject, grade){
	let allQuestionIds = [];
	let questions = [];

	try{
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
	
	} catch (error){
		console.log(error);
	}
}

async function throwStars(key, stars) {
	try{
		const user = await prisma.user.findFirst({
			where: { userName: key }
		});

		const updateUser = await prisma.user.update({
            where: { userId: user.userId },
            data: { star : user.star + stars }
        });		
	} catch (error){
		console.log(error);
	}	
}

wsServer.on("connection", socket => {
	socket.data.nickname = "Anon";

	socket.onAny((event) => {
		console.log(`Socket Event:${event}`);
	});
    
    socket.on("join_room", (roomName, nickname, done) => {
		if (nickname === "") {
			console.log("nickname이 빈 문자열이어서 방 입장 불가😖");
			return;
		}
		socket.data.nickname = nickname;
		console.log("socket.data.nickname: ", socket.data.nickname);
		let playingF = 0;
        if (playingFlag.get(roomName) === 1){	
			console.log("게임중이어서 방 입장 불가😖");
            playingF = 1;
		} else {
			checkRoomExist(roomName).then(checkExist => {
				if (checkExist !== null) {
					socket.join(roomName);
					console.log("현재 존재하는 방들: ", socket.rooms);
					whereSocketIdIn.set(socket.id, roomName);
					increaseParticipants(roomName);
					console.log("wherSocketIdIn: ", whereSocketIdIn);
					done(roomName, countRoom(roomName), playingF); 

					let immScoreMap = new Map();
					if (scoreListOfRooms.has(roomName)) {
						immScoreMap = scoreListOfRooms.get(roomName);
					}
					immScoreMap.set(socket.data.nickname, 0);
					scoreListOfRooms.set(roomName, immScoreMap);
					console.log("enter room - scoreListOfRooms: ", scoreListOfRooms)

					let msgArray = [];
					let immChattingMap = new Map<string, string[]>();

					if (immChattingMap.has(roomName)) {
						immChattingMap = chatting.get(roomName);
					}
					immChattingMap.set(socket.data.nickname, []);
					chatting.set(roomName, immChattingMap);
					console.log("chatting: ", chatting);

					immChattingMap = new Map<string, string[]>();

					if(chatting.has(roomName)) {
						immChattingMap = chatting.get(roomName);
						immChattingMap.forEach((value, key) => {
							msgArray = immChattingMap.get(key);
							msgArray.push(`${socket.data.nickname}님 입장!`);
							immChattingMap.set(key, msgArray);
							chatting.set(roomName, immChattingMap);
						});
					} else {
						msgArray.push(`${socket.data.nickname}님 입장!`);
						immChattingMap.set(socket.data.nickname, msgArray);
						chatting.set(roomName, immChattingMap);
					}

					let users = [];
					scoreListOfRooms.forEach((value, key, map) => value.forEach((value, key, map) => users.push(key)));
					wsServer.to(roomName).emit("welcome", socket.data.nickname, roomName, countRoom(roomName));
				} else {
					console.log("방이 존재하지 않아서 방 입장 불가😖");
				}
			});
        }
    });

	socket.on("create_room", ( payload, nickname ) => {
		if (nickname === "") {
			console.log("nickname이 빈 문자열이어서 방 입장 불가😖");
			return;
		}
		socket.data.nickname = nickname;	
		checkRoomExist(payload.roomName).then( checkExist => {
			console.log("here checkExist: ", checkExist);
			
			if (checkExist === null){
				console.log("in here 1")
				createRoom(payload).then( a => {
					socket.join(payload.roomName);
					increaseParticipants(payload.roomName);
            		console.log("현재 존재하는 방들: ", socket.rooms);
					
					let immChattingMap = new Map<string, string[]>();
		
					immChattingMap.set(socket.data.nickname, []);
					chatting.set(payload.roomName, immChattingMap);

					socket.emit("create_room", payload.roomName, countRoom(payload.roomName));
					
					if (readyStorage.get(payload.roomName) === undefined) {
						readyStorage.set(payload.roomName, []);
					}
					whereSocketIdIn.set(socket.id, payload.roomName);
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

	socket.on("new_message", (msg, room) => {
		let msgArray = [];
		let immChattingMap = new Map<string, string[]>();

		if (chatting.has(room)) {
			immChattingMap = chatting.get(room);
			immChattingMap.forEach((value, key) => {
				msgArray = immChattingMap.get(key);
				msgArray.push(`${socket.data.nickname}: ${msg}`);
				immChattingMap.set(key, msgArray);		
				chatting.set(room, immChattingMap);
			});
		} else {
			msgArray.push(`${socket.data.nickname}: ${msg}`);
			immChattingMap.set(socket.data.nickname, msgArray);
			chatting.set(room, immChattingMap);
		}
		console.log("chatting: ", chatting);

		wsServer.to(room).emit("new_message", JSON.stringify(Array.from(chatting.get(room))));
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

    socket.on("gameStartFunction", (roomName) => {
		checkQuestionsUsage.set(roomName, [0,0,0,0,0,0,0,0,0,0]);
		firstQflag.set(roomName, 0);
		playingFlag.set(roomName, 1);
		playing(roomName);
		starFlag.set(roomName, 0);
		immMap = new Map(scoreListOfRooms.get(roomName));
		immMap.forEach((value, key) => {
			immMap.set(key, 0); 
		})	
		scoreListOfRooms.set(roomName, immMap);
		wsServer.sockets.in(roomName).emit("scoreboard display", JSON.stringify(Array.from(immMap)));
		wsServer.sockets.in(roomName).emit("showGameRoom");
		chatting.delete(roomName);
    });

	socket.on("question", (roomName) => {
		let cnt = 0;
		console.log("checkQuestionsUsage: ", checkQuestionsUsage);
		console.log("firstQflag: ", firstQflag);

		for (let i = 0; i < 10; i++){
			if (checkQuestionsUsage.has(roomName) === false ) return;
			if (checkQuestionsUsage.get(roomName)[i] === 1) cnt++;
			if (cnt >= 10) return; 
		}
		if (checkQuestionsUsage.has(roomName) === false ) return;

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
		console.log(`payload : ${payload.index}`);
		console.log("[payload.index].oxanswer: ", questionsOfRooms.get(payload.roomName)[payload.index].oxanswer);
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

	socket.on("all finish", async (roomName, done) => {
		immMap = new Map(scoreListOfRooms.get(roomName));
		sortScores = new Map([...immMap.entries()].sort((a, b) => b[1] - a[1]));
		done(JSON.stringify(Array.from(sortScores)));

		if (starFlag.get(roomName) === 0) {	//flag 0: 가장 첫번째 실행한 사람만 아래 코드 실행
			starFlag.set(roomName, 1);	
		} else {
			return;
		}

		let cnt = 3;
		let checkTie = [];
		const sortScoresArray = Array.from(sortScores);

		for (let i = 0; i < sortScoresArray.length; i++) // 동점처리 <- 이 부분 수정필요
		{
			if (i === sortScoresArray.length - 1)
			{
				if (i === 0){
					checkTie.push(1);
					break;
				}

				if (cnt > 0 && sortScoresArray[i - 1][1] === sortScoresArray[i][1])
				{
					checkTie.push(checkTie[checkTie.length - 1]);
				} else if (cnt === 2) {
					checkTie.push(2);
				} else if (cnt === 3) {
					checkTie.push(3);
				} else {
					checkTie.push(0);
				}
				break;
			}

			if (cnt === 3 && sortScoresArray[i][1] !== sortScoresArray[i + 1][1])
			{
				checkTie.push(1);
				cnt--;
			} else if (cnt === 3 && sortScoresArray[i][1] === sortScoresArray[i + 1][1])
			{
				checkTie.push(1);
			} else if (cnt === 2 && sortScoresArray[i][1] !== sortScoresArray[i + 1][1])
			{
				checkTie.push(2);
				cnt--;
			} else if (cnt === 2 && sortScoresArray[i][1] === sortScoresArray[i + 1][1])
			{
				checkTie.push(2);
			} else if (cnt === 1 && sortScoresArray[i][1] !== sortScoresArray[i + 1][1])
			{
				checkTie.push(3);
				cnt--;
			} else if (cnt === 1 && sortScoresArray[i][1] === sortScoresArray[i + 1][1])
			{
				checkTie.push(3);
			} else {
				checkTie.push(0);
			}
		}
		console.log("checkTie", checkTie);

		for (let i = 0; i < sortScoresArray.length; i++) // 동점처리
		{
			if (checkTie[i] === 1) {
				await throwStars(sortScoresArray[i][0], 5);
			} else if (checkTie[i] === 2) {
				await throwStars(sortScoresArray[i][0], 3);
			} else if (checkTie[i] === 3) {
				await throwStars(sortScoresArray[i][0], 1);
			}
			await throwStars(sortScoresArray[i][0], sortScoresArray[i][1] / 10);			
		}

		playingFlag.set(roomName, 0);
		notPlaying(roomName);
		//checkQuestionsUsage.set(roomName, [0,0,0,0,0,0,0,0,0,0]);	
		readyStorage.set(roomName, []);
		wsServer.sockets.in(roomName).emit("ready check");
		getRoomInfo(roomName).then(roomInfo => {
			set10Questions(roomName, roomInfo.subject, roomInfo.grade);
		})
	 })

	 socket.on("exit_room", (roomName, done) => {
		if (readyStorage.get(roomName) != undefined){
			let removeIdArr = readyStorage.get(roomName).filter((element) => element !== socket.id);
			readyStorage.set(roomName, removeIdArr);
		}
		immMap = scoreListOfRooms.get(roomName);
		immMap.delete(socket.data.nickname);
		scoreListOfRooms.set(roomName, immMap);
		whereSocketIdIn.delete(socket.id);

		if (scoreListOfRooms.get(roomName).size === 0){
			checkQuestionsUsage.delete(roomName);
			firstQflag.delete(roomName);
			starFlag.delete(roomName);
			playingFlag.delete(roomName);
			chatting.delete(roomName);
			scoreListOfRooms.delete(roomName);
			console.log("delete checkQuestionsUsage, firstQflag ", checkQuestionsUsage, firstQflag);
			deleteRoom(roomName);
			wsServer.sockets.in(roomName).emit("clear");
		}
		reduceParticipants(roomName);
		socket.leave(roomName);
		console.log("exit-현재 존재하는 방들: ", socket.rooms);
		console.log("scoreListOfRooms: ", scoreListOfRooms)
		socket.to(roomName).emit("bye", socket.data.nickname, roomName, countRoom(roomName));
        done();
    });

    socket.on("disconnecting", () => {
		console.log(scoreListOfRooms.size);
		
		let roomNamee = whereSocketIdIn.get(socket.id);
		console.log("roomNameee", roomNamee);
		if (readyStorage.get(roomNamee) != undefined){
			let removeIdArr = readyStorage.get(roomNamee).filter((element) => element !== socket.id);
			readyStorage.set(roomNamee, removeIdArr);
		}
		immMap = scoreListOfRooms.get(roomNamee);
		console.log("immMap: ", immMap);

		if(immMap){
			immMap.delete(socket.data.nickname);
			scoreListOfRooms.set(roomNamee, immMap);

			if (scoreListOfRooms.get(roomNamee).size === 0){
				checkQuestionsUsage.delete(roomNamee);
				firstQflag.delete(roomNamee);
				starFlag.delete(roomNamee);
				playingFlag.delete(roomNamee);
				scoreListOfRooms.delete(roomNamee);
				console.log("delete checkQuestionsUsage, firstQflag ", checkQuestionsUsage, firstQflag);
				deleteRoom(roomNamee);
				wsServer.sockets.in(roomNamee).emit("clear");
			}
			reduceParticipants(roomNamee);
			console.log("exit-현재 존재하는 방들: ", socket.rooms);
			console.log("scoreListOfRooms: ", scoreListOfRooms)
			socket.to(roomNamee).emit("bye", socket.data.nickname, roomNamee, countRoom(roomNamee));
		}
	
    });

	socket.on("disconnect", () => {
    });
});

httpServer.listen(PORT, handleListening);