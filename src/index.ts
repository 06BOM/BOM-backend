import app from "./app";
import http from "http"; // 이미 기본 설치되어있음
import WebSocket from "ws"; // 기본설치!
import { Server } from "socket.io"; 
import { doesNotMatch } from "assert";
import { Socket } from "dgram";
import { clearInterval } from "timers";

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
const question = [
	{ oxQuestion: "이 앱의 이름은 다모여이다.", oxAnswer: "o" },
	{ oxQuestion: "이 앱을 만든 조의 이름은 BOOM이다", oxAnswer: "x" },
	{ oxQuestion: "이 앱을 만든 조는 6조이다.", oxAnswer: "o" },
	{ oxQuestion: "토마토는 과일이 아니라 채소이다.", oxAnswer: "x" },
	{ oxQuestion: "원숭이에게도 지문이 있다.", oxAnswer: "x" },
	{ oxQuestion: "가장 강한 독을 가진 개구리 한마리의 독으로 사람 2000명 이상을 죽일 수 있다.", oxAnswer: "o" },
	{ oxQuestion: "달팽이는 이빨이 있다", oxAnswer: "o" },
	{ oxQuestion: "고양이는 잠을 잘 때 꿈을 꾼다", oxAnswer: "o" },
	{ oxQuestion: "물고기도 색을 구분할 수 있다.", oxAnswer: "o" },
	{ oxQuestion: "낙지의 심장은 3개이다", oxAnswer: "o" },
];

wsServer.on("connection", socket => {
	socket["nickname"] = "Anon";
	// socket.join("BOM");

	socket.onAny((event) => {
		console.log(`Socket Event:${event}`);
	});

    socket.on("enter_room", (roomName, nickname, done) => {
        if ( countRoom(roomName) > 9 ){
            socket.emit("message specific user", socket.id, "정원초과로 입장하실 수 없습니다.");
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
        socket.to(room).emit("new_message", `${name}: ${msg}`);
        done();
    });

	socket.on("question", (done) => {
		done(question[0].oxQuestion);
	});
});

httpServer.listen(PORT, handleListening);