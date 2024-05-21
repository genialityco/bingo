import mongoose from "mongoose";

const bingoFigureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  format: { type: String, required: true },
  image: { type: String, required: true },
  index_to_validate: [{ type: Number, required: true }],
  category: { type: String, required: true },
  updated_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
});

const BingoFigure = mongoose.model("BingoFigures", bingoFigureSchema);

export default BingoFigure;
