import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV}` });

import "./config/db.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import bingo from "./routes/bingo.js";
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
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use(bingo);
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

io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");

  socket.on("clientConnected", (data) => {
    console.log(`${data.playerName} se ha conectado`);
    socket.broadcast.emit("userConnected", {
      message: `${data.playerName} se ha conectado`,
    });
  });

  // Escuchar los eventos emitidos por el EventEmitter personalizado
  customEmitter.on("ballotUpdate", (data) => {
    socket.emit("ballotUpdate", data); // Emitir eventos a los clientes conectados con los cambios de datos
  });

  customEmitter.on("sangBingo", (isWinner) => {
    if (isWinner.status) {
      console.log("Tenemos un ganador en sangBingo!");
    } else {
      console.log("No hay ganador esta vez en sangBingo.");
    }
    socket.emit("sangBingo", isWinner);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});
