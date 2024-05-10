import { connect, connection } from "mongoose";
const customEmitter = require("../utils/eventEmitter");
import { config } from "dotenv";

config();

config({ path: `.env.${process.env.NODE_ENV}` });

const { DB_URI } = process.env;

connect(DB_URI)
  .then(() => {
    console.log(`📡 Established connection to the database`);

    const db = connection;
    const changeStream = db.collection("bingos").watch();

    changeStream.on("change", (change) => {
      customEmitter.emit("ballotUpdate", change);
    });
  })
  .catch((err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  });
