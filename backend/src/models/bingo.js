import mongoose from "mongoose";

const { Schema, Types } = mongoose;

// Subesquemas
const bingoAppearanceSchema = new Schema({
  background_color: { type: String, default: "#00bcd4" },
  background_image: { type: String, default: null },
  banner: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/template%2FbingoHeader.png?alt=media&token=973f45a2-deab-42f4-9479-546d9a0315aa",
  },
  footer: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/template%2FbingoFooter.png?alt=media&token=08c9bac6-563d-419a-b207-d2dd2846ba1d",
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
    required: false,
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
