require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}, ${process.env.NODE_ENV}`);
});

