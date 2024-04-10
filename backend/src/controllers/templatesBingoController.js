import templatesBingoServices from "../services/templatesBingo.service";
import sendResponse from "../utils/sendResponse";

class TemplatesBingoController {
  async createTemplate(req, res) {
    try {
      const template = await templatesBingoServices.createTemplate(req.body);
      sendResponse(res, 201, template, "Template created successfully");
    } catch (error) {
      sendResponse(res, 400, null, error.message);
    }
  }

  async getTemplate(req, res) {
    try {
      const template = await templatesBingoServices.getTemplate(req.params.id);
      if (!template) {
        return sendResponse(res, 404, null, "Template not found");
      }
      sendResponse(res, 200, template, "Template retrieved successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  async getAllTemplates(req, res) {
    try {
      const templates = await templatesBingoServices.getAllTemplates();
      sendResponse(res, 200, templates, "Templates retrieved successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  async updateTemplate(req, res) {
    try {
      const updatedTemplate = await templatesBingoServices.updateTemplate(
        req.params.id,
        req.body
      );
      if (!updatedTemplate) {
        return sendResponse(res, 404, null, "Template not found");
      }
      sendResponse(res, 200, updatedTemplate, "Template updated successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  async deleteTemplate(req, res) {
    try {
      const result = await templatesBingoServices.deleteTemplate(req.params.id);
      if (!result) {
        return sendResponse(res, 404, null, "Template not found");
      }
      sendResponse(res, 204, null, "Template deleted successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }
}

export default new TemplatesBingoController();
