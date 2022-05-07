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

wsServer.on("connection", socket => {
	socket.join("BOM");
	socket["ready"] = 0;

	socket.onAny((event) => {
		console.log(`Socket Event:${event}`);
	});

    socket.on("enter_room", (roomName, done) => {
        console.log(roomName);
        setTimeout(()=>{
            done("hello from the backend"); // 여기 있는 done 함수는 여기서 실행하지 않는다 - 사용자로부터 함수를 받아서 사용하면 보안문제가 생길 수 있기 때문에
        }, 15000);
    });

	socket.on("ox", (payload) => {
		wsServer.sockets.emit("ox", { answer: payload.ox, userId: payload.userId });
	});

	socket.on("ready", () => {
		socket["ready"] = 1;
		
	}); 
});

httpServer.listen(PORT, handleListening);