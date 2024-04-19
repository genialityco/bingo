import BingoFigure from "../models/bingoFigure";

class BingoFigureServices {
  async createTemplate(templateData) {
    try {
      const template = new BingoFigure(templateData);
      await template.save();
      return template;
    } catch (error) {
      console.error("Error creating template:", error);
      throw error;
    }
  }

  async getTemplate(id) {
    try {
      const template = await BingoFigure.findById(id);
      return template;
    } catch (error) {
      console.error("Error finding template:", error);
      throw error;
    }
  }

  async getAllTemplates() {
    try {
      const templates = await BingoFigure.find({});
      return templates;
    } catch (error) {
      console.error("Error getting all templates:", error);
      throw error;
    }
  }

  async updateTemplate(id, updateData) {
    try {
      const updatedTemplate = await BingoFigure.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      return updatedTemplate;
    } catch (error) {
      console.error("Error updating template:", error);
      throw error;
    }
  }

  async deleteTemplate(id) {
    try {
      const result = await BingoFigure.findByIdAndDelete(id);
      return result;
    } catch (error) {
      console.error("Error deleting template:", error);
      throw error;
    }
  }
}

export default new BingoFigureServices();
