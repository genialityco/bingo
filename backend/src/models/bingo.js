import mongoose from "mongoose";

const { Schema } = mongoose;

const bingoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  bingoId: {
    type: Schema.Types.ObjectId,
    ref: "BingoTemplate",
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  bingoFigure: {
    type: Schema.Types.ObjectId,
    ref: "BingoFigure",
    required: false,
  },
  roomCode: {
    type: String,
    required: true,
  },
  start_time: {
    type: Date,
    default: Date.now,
  },
  end_time: {
    type: Date,
  },
  number_of_winners: {
    type: Number,
    default: 0,
  },
  winners: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  history_of_ballots: [String],
});

const Bingo = mongoose.model("BingoRooms", bingoSchema);

export default Bingo;
