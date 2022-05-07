import app from "./app";
import http from "http"; // 이미 기본 설치되어있음
import WebSocket from "ws"; // 기본설치!
import { Server } from "socket.io"; 
import { doesNotMatch } from "assert";

const PORT = process.env.PORT || 3000;

const handleListening = () => {
	console.log(`✅ Server is ready. http://localhost:${PORT}`);
}

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

let name;

wsServer.on("connection", socket => {
	socket.join("BOM");

	socket.onAny((event) => {
		console.log(`Socket Event:${event}`);
	});

	socket.on("test", (payload) => { // 테스트 용도! 나중에 삭제 필요!
		console.log(payload);
	});

    socket.on("enter_room", (roomName, done) => {
        name = "가히";
        console.log(socket.rooms);
        console.log(roomName);
        socket.join(roomName);
        console.log(socket.rooms);
        done();
        socket.to(roomName).emit("welcome", name);
    });

	socket.on("ox", (payload) => {
		wsServer.sockets.emit("ox", { answer: payload.ox, userId: payload.userId });
	});

    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${name}: ${msg}`);
        done();
    });

});

httpServer.listen(PORT, handleListening);