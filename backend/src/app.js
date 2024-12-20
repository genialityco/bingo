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
server.setTimeout(60000);
const io = new Server(server, {
  cors: {
    origin: "*", // Cambia a tu dominio en producción
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000, // Tiempo máximo para considerar una desconexión
  pingInterval: 25000, // Intervalo para enviar señales de vida
  allowEIO3: true, // Compatibilidad con clientes antiguos
});

// Middlewares
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

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack || err);

  const statusCode = err.statusCode || 500;
  let message = err.message;

  if (process.env.NODE_ENV === "production" && !err.statusCode) {
    message = "Ocurrió un error en el servidor";
  }

  res.status(statusCode).json({ result: "error", message });
});

// Configuración en producción
if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("frontend", "dist", "index.html"));
  });
}

// Eventos personalizados
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

// Conexiones de Socket.IO
io.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  socket.on("setPlayerName", (data) => {
    if (!data || !data.playerName) {
      console.error("PlayerName no definido");
      return;
    }
    console.log(`${data.playerName} se ha conectado`);
    socket.broadcast.emit("userConnected", {
      message: `${data.playerName} se ha conectado`,
    });
  });

  socket.on("disconnect", (reason) => {
    console.log(`Cliente desconectado: ${socket.id}, motivo: ${reason}`);
    if (reason === "ping timeout") {
      console.log("Timeout detectado, posible problema de red.");
    } else if (reason === "transport close") {
      console.log("Conexión cerrada, esperando reconexión...");
    }
  });

  socket.on("error", (err) => {
    console.error(`Error en el socket ${socket.id}:`, err.message);
  });
});


// Monitoreo periódico de actividad
setInterval(() => {
  console.log(`Conexiones activas: ${io.sockets.sockets.size}`);
}, 10000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}, ${process.env.NODE_ENV}`);
});
