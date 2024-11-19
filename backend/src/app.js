import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV}` });

import "./config/db.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import firebaseRoutes from "./routes/firebase.js";
import bingoRoutes from "./routes/bingo.js";
import bingoTemplateRoutes from "./routes/bingoTemplate.js";
import bingoFigureRoutes from "./routes/bingoFigure.js";
import bingoCardboardRoutes from "./routes/bingoCardboard.js";

const customEmitter = require("./utils/eventEmitter.js");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use(firebaseRoutes);
app.use(bingoRoutes);
app.use(bingoTemplateRoutes);
app.use(bingoFigureRoutes);
app.use(bingoCardboardRoutes);

app.get("/", (req, res) => {
  res.send("API bingo");
});

app.use((err, req, res, next) => {
  console.error(err.stack || err);

  const statusCode = err.statusCode || 500;
  let message = err.message;

  if (process.env.NODE_ENV === "production" && !err.statusCode) {
    message = "Ocurrió un error en el servidor";
  }

  res.status(statusCode).json({ result: "error", message: message });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}, ${process.env.NODE_ENV}`);
});

customEmitter.on("ballotUpdate", (data) => {
  io.emit("ballotUpdate", data);
});

customEmitter.on("sangBingo", (isWinner) => {
  if (isWinner.status) {
    console.log("Tenemos un ganador en sangBingo!");
  } else if (!isWinner.status) {
    console.log("No hay ganador esta vez en sangBingo.");
  } else {
    console.log("Validando.");
  }
  io.emit("sangBingo", isWinner);
});

io.on("connection", (socket) => {
  // Nuevo evento para recibir el nombre del usuario
  socket.on("setPlayerName", (data) => {
    console.log(`${data.playerName} se ha conectado`);
    // Emitir a todos los clientes excepto al remitente
    socket.broadcast.emit("userConnected", {
      message: `${data.playerName} se ha conectado`,
    });
  });

  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});
