import mongoose from "mongoose";

const { Schema, Types } = mongoose;

// Subesquemas
const bingoAppearanceSchema = new Schema({
  background_color: { type: String, default: "#00bcd4" },
  background_image: { type: String, default: null },
  banner: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/magnetic-be10a.appspot.com/o/Bingo%2FBANNER-BINGO.jpg?alt=media&token=0d1fa6e4-e540-45ce-b106-e5df7b40c1f0",
  },
  footer: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/magnetic-be10a.appspot.com/o/Bingo%2FBanner_Bingo.jpg?alt=media&token=80b7dcc1-667c-4ae3-9238-e5d401b916cd",
  },
  dial_image: { type: String, default: null },
});

const bingoValueSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() },
  carton_value: { type: String, required: true },
  carton_type: {
    type: String,
    enum: ["default", "text", "image"],
    required: true,
  },
  ballot_value: { type: String, required: true },
  ballot_type: {
    type: String,
    enum: ["default", "text", "image"],
    required: true,
  },
  positions: { type: Array, required: false },
});

const bingoPositionsDisabledSchema = new Schema({
  position: {
    type: Number,
    required: false,
  },
  default_image: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/magnetic-be10a.appspot.com/o/logos%2FLOGOS%20MAGNETIC-03.png?alt=media&token=2cc96a2f-cc4f-4883-8ce1-3bd2f8b07a6f",
  },
});

// Esquema principal
const bingoSchema = new Schema({
  // Información básica
  name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  bingo_code: {
    type: String,
    required: true,
  },

  // Tiempos
  start_time: {
    type: Date,
    default: Date.now,
  },
  end_time: {
    type: Date,
  },

  // Juego
  bingo_figure: {
    type: Schema.Types.ObjectId,
    ref: "BingoFigures",
    required: false,
  },
  rules: { type: String, required: false },
  history_of_ballots: [String],
  number_of_winners: {
    type: Number,
    default: 0,
  },
  winners: [
    {
      type: Schema.Types.ObjectId,
    },
  ],

  // Configuraciones adicionales
  creator_id: { type: Schema.Types.ObjectId, required: false },
  bingo_appearance: {
    type: bingoAppearanceSchema,
    default: () => ({}),
  },
  bingo_values: [bingoValueSchema],
  positions_disabled: [bingoPositionsDisabledSchema],
  dimensions: { type: String, default: "5x5" },

  // Configuración general
  is_template: {
    type: Boolean,
    default: false,
  },
  is_public: {
    type: Boolean,
    default: true,
  },

  // Metadatos
  updated_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
});

const Bingo = mongoose.model("Bingo", bingoSchema);

export default Bingo;
