require ("dotenv").config();
const express = require(express);
const http = require("http");
const socketIo = require("socket.io");
const mongose = require ("mongose")
const cors = require ("cors")

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*"}});

app.use(cors());
app.use(express.json());

mongose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

//Hnalde socketio connections

io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on("sendMessage", (data) => {
        io.emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
        console.log("Client Disconnected")
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
