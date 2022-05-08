import app from "./app";
import http from "http"; // 이미 기본 설치되어있음
import WebSocket from "ws"; // 기본설치!
import { Server } from "socket.io"; 
import { doesNotMatch } from "assert";
import { Socket } from "dgram";

const PORT = process.env.PORT || 3000;

const handleListening = () => {
	console.log(`✅ Server is ready. http://localhost:${PORT}`);
}

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", socket => {

	socket["nickname"] = "Anon";
    socket.join("BOM");
	socket["ready"] = 0;

	socket.onAny((event) => {
		console.log(`Socket Event:${event}`);
	});

    socket.on("enter_room", (roomName, nickname, done) => {
        if ( countRoom(roomName) > 10){
            socket.emit("message specific user", socket.id, "정원초과로 입장하실 수 없습니다.");
        } else {
            socket.join(roomName);
            console.log(socket.rooms);
            done();
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
	
	socket.on("ready", () => {
			socket["ready"] = 1;
	}); 
	 
	socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${name}: ${msg}`);
        done();
    });
});

httpServer.listen(PORT, handleListening);