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

let readyStorage = [];

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
	
	socket.on("ready", () => {
		if (!readyStorage.includes(socket.id)) {
			readyStorage.push(socket.id);
		}

		if (readyStorage.length === wsServer.sockets.adapter.rooms.get("BOM")?.size) {
			wsServer.sockets.emit("ready");
		}
	}); 
	 
	socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${name}: ${msg}`);
        done();
    });
});

httpServer.listen(PORT, handleListening);