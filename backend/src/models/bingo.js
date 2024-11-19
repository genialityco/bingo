import mongoose from "mongoose";

const { Schema, Types } = mongoose;

// Subesquemas
const bingoAppearanceSchema = new Schema({
  background_color: { type: String, default: "#00bcd4" },
  background_image: { type: String, default: null },
  banner: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/magnetic-be10a.appspot.com/o/bingo%2Fimages%2Fdefault%2FBanner_Bingo.jpg?alt=media&token=6db9ac84-6b19-46ee-986d-3b8fd581721d",
  },
  footer: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/magnetic-be10a.appspot.com/o/bingo%2Fimages%2Fdefault%2FFooter_Bingo.jpg?alt=media&token=6b485484-8417-417a-bf67-8da901257f8a",
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
