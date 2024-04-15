import mongoose from "mongoose";

const { Schema } = mongoose;

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
  id: { type: Number, required: true },
  value: { type: String, required: true },
  type: { type: String, enum: ["default", "text", "image"], required: true },
  imageUrl: {
    type: String,
    required: function () {
      return this.type === "image";
    },
  },
});

const bingoSchema = new Schema({
  title: { type: String, required: true },
  rules: { type: String, required: false },
  creatorId: { type: Schema.Types.ObjectId, required: false },
  bingoAppearance: {
    type: bingoAppearanceSchema,
    default: () => ({}),
  },
  bingoValues: [bingoValueSchema],
  dimensions: { type: String, default: "4x4" },
  updated_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
});

const Bingo = mongoose.model("Bingo", bingoSchema);

export default Bingo;
