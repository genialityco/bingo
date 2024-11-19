import FirebaseService from "../services/firebase.service";
import sendResponse from "../utils/sendResponse";

class FirebaseController {
  async getUsers(req, res) {
    try {
      const users = await FirebaseService.getUsers();
      sendResponse(res, 200, users, "Usuarios obtenidos correctamente");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  async deleteAllUsers(req, res) {
    try {
      await FirebaseService.deleteAllUsers();
      sendResponse(res, 200, null, "Todos los usuarios han sido eliminados");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }
}

export default new FirebaseController();
