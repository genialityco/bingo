import auth from "../config/firebase/admin";

class FirebaseService {
  async getUsers() {
    try {
      const listUsersResult = await auth.listUsers();
      return listUsersResult.users;
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      throw error;
    }
  }

  async deleteAllUsers() {
    try {
      const users = await this.getUsers();
      const deletePromises = users.map(user => auth.deleteUser(user.uid));
      
      // Wait for all delete promises to complete
      await Promise.all(deletePromises);
      
      console.log("Todos los usuarios han sido eliminados.");
    } catch (error) {
      console.error("Error al eliminar los usuarios:", error);
      throw error;
    }
  }
}

export default new FirebaseService();
