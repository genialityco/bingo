import BingoCardboard from "../models/bingoCardboard";

class BingoCardboardServices {
  async createCardboard(data) {
    try {
      const cardboard = new BingoCardboard(data);
      await cardboard.save();
      return cardboard;
    } catch (error) {
      console.error("Error creating cardboard:", error);
      throw error;
    }
  }

  async getCardboard(id) {
    try {
      const cardboard = await BingoCardboard.findById(id);
      return cardboard;
    } catch (error) {
      console.error("Error finding cardboard:", error);
      throw error;
    }
  }

  async findCardboardByField(fieldName, value) {
    const query = {};
    query[fieldName] = value;
    const cardboard = await BingoCardboard.findOne(query);
    return cardboard;
  }

  async getAllCardboards() {
    try {
      const cardboards = await BingoCardboard.find({});
      return cardboards;
    } catch (error) {
      console.error("Error getting all cardboards:", error);
      throw error;
    }
  }

  async updateCardboard(id, updateData) {
    try {
      const updateCardboard = await BingoCardboard.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      return updateCardboard;
    } catch (error) {
      console.error("Error updating cardboard:", error);
      throw error;
    }
  }

  async deleteCardboard(id) {
    try {
      const result = await BingoCardboard.findByIdAndDelete(id);
      return result;
    } catch (error) {
      console.error("Error deleting cardboard:", error);
      throw error;
    }
  }
}

export default new BingoCardboardServices();
