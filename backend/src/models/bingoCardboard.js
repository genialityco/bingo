import mongoose, { Schema } from "mongoose";

const bingoCardboardSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  bingoId: {
    type: Schema.Types.ObjectId,
    ref: "BingoTemplate",
    required: true,
  },
  cardboard_code: {
    type: String,
    required: true,
  },
  game_card_values: {
    type: [{ type: mongoose.Schema.Types.Mixed }],
    required: true,
  },
  game_marked_squares: {
    type: [{ type: mongoose.Schema.Types.Mixed }],
    required: true,
  },
  userId: { type: String, required: true },
  updated_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
});

const BingoCardboard = mongoose.model("BingoCardboard", bingoCardboardSchema);

export default BingoCardboard;
