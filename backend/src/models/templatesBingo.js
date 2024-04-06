import mongoose from "mongoose";

const templatesBingoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  format: { type: String, required: true },
  image: { type: String, required: true },
  index_to_validate: [{ type: Number, required: true }],
  category: { type: String, required: true },
  updated_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
});

const TemplatesBingo = mongoose.model("TemplatesBingo", templatesBingoSchema);

export default TemplatesBingo;
