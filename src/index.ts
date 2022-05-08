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

let readyStorage = [];
let arr = [];

const question = [
	{ oxQuestion: "이 앱의 이름은 다모여이다.", oxAnswer: "o", explanation: "이 앱의 이름은 다모여가 맞다." },
	{ oxQuestion: "이 앱을 만든 조의 이름은 BOOM이다", oxAnswer: "x", explanation: "이 앱을 만든 조의 이름은 BOM이다." },
	{ oxQuestion: "이 앱을 만든 조는 6조이다.", oxAnswer: "o", explanation: "이 앱을 만든 조는 6조가 맞다." },
	{ oxQuestion: "토마토는 과일이 아니라 채소이다.", oxAnswer: "o", explanation: "토마토는 채소이다." },
	{ oxQuestion: "원숭이에게는 지문이 없다.", oxAnswer: "x", explanation: "원숭이에게도 지문이 있다." },
	{ oxQuestion: "가장 강한 독을 가진 개구리 한마리의 독으로 사람 2000명 이상을 죽일 수 있다.", oxAnswer: "o", explanation: "아프리카에 사는 식인 개구리의 독성으로 2000명의 사람을 죽일 수 있다." },
	{ oxQuestion: "달팽이는 이빨이 있다", oxAnswer: "o", explanation: "달팽이도 이빨이 있다." },
	{ oxQuestion: "고양이는 잠을 잘 때 꿈을 꾼다", oxAnswer: "o", explanation: "고양이도 잠을 잘 때 꿈을 꾼다." },
	{ oxQuestion: "물고기도 색을 구분할 수 있다.", oxAnswer: "o", explanation: "물고기도 색을 구분한다." },
	{ oxQuestion: "낙지의 심장은 3개이다", oxAnswer: "o", explanation: "낙지의 심장은 3개이다." }
];

for (let i = 0; i < question.length; i++)
{
	arr.push(0);
}

wsServer.on("connection", socket => {
	socket["nickname"] = "Anon";

	socket.onAny((event) => {
		console.log(`Socket Event:${event}`);
	});

    socket.on("enter_room", (roomName, nickname, done) => {
        if ( countRoom(roomName) > 9 ){
            socket.emit("message specific user", socket.id, "정원초과로 입장하실 수 없습니다.😥");
        } else {
            socket.join(roomName);
            console.log(socket.rooms);
            done(roomName, countRoom(roomName));
            socket.data.nickname = nickname;
            socket.to(roomName).emit("welcome", socket.data.nickname, roomName, countRoom(roomName));
        }
    });

    socket.on("exit_room", (roomName, done) => {
        socket.leave(roomName);
        console.log(socket.rooms);
        done();
    });

    socket.on("gameStart", (done) => {
        done();
    });
   
	socket.on("ox", (payload) => {
		wsServer.sockets.emit("ox", { answer: payload.ox, userId: payload.userId });
	});
	
	socket.on("ready", (roomName) => {
		if (!readyStorage.includes(socket.id)) {
			readyStorage.push(socket.id);
		} else {
			readyStorage = readyStorage.filter((element) => {
				return element != socket.id
			});
		}

		if (readyStorage.length === wsServer.sockets.adapter.rooms.get(roomName)?.size) {
			wsServer.sockets.emit("ready");
		}
	}); 
	 
	socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.data.nickname}: ${msg}`);
        done();
    });

	socket.on("question", (done) => {
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

		let index = Math.floor(Math.random() * 10);

		while(arr[index]) {
			index = Math.floor(Math.random() * 10);
		}		

		arr[index] = 1;
		done(question[index].oxQuestion);
	});
});

httpServer.listen(PORT, handleListening);