import TemplatesBingo from "../models/templatesBingo";

class TemplatesBingoServices {
  async createTemplate(templateData) {
    try {
      const template = new TemplatesBingo(templateData);
      await template.save();
      return template;
    } catch (error) {
      // Manejo de errores, por ejemplo, loguear el error y luego lanzarlo
      console.error("Error creating template:", error);
      throw error;
    }
  }

  async getTemplate(id) {
    try {
      const template = await TemplatesBingo.findById(id);
      return template;
    } catch (error) {
      console.error("Error finding template:", error);
      throw error;
    }
  }

  async getAllTemplates() {
    try {
      const templates = await TemplatesBingo.find({});
      return templates;
    } catch (error) {
      console.error("Error getting all templates:", error);
      throw error;
    }
  }

  async updateTemplate(id, updateData) {
    try {
      const updatedTemplate = await TemplatesBingo.findByIdAndUpdate(
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
      const result = await TemplatesBingo.findByIdAndDelete(id);
      return result;
    } catch (error) {
      console.error("Error deleting template:", error);
      throw error;
    }
  }
}

export default new TemplatesBingoServices();
