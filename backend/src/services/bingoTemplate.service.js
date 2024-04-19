import BingoTemplate from "../models/bingoTemplate";

class BingoTemplateServices {
  async createBingo(bingoData) {
    try {
      const bingo = new BingoTemplate(bingoData);
      await bingo.save();
      return bingo;
    } catch (error) {
      console.error("Error creating bingo:", error);
      throw error;
    }
  }

  async getBingoById(id) {
    try {
      const bingo = await BingoTemplate.findById(id).populate("creatorId");
      if (!bingo) {
        throw new Error("Bingo not found");
      }
      return bingo;
    } catch (error) {
      console.error("Error finding bingo:", error);
      throw error;
    }
  }

  async updateBingo(id, updateData) {
    try {
      const bingo = await BingoTemplate.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!bingo) {
        throw new Error("Bingo not found");
      }
      return bingo;
    } catch (error) {
      console.error("Error updating bingo:", error);
      throw error;
    }
  }

  async deleteBingo(id) {
    try {
      const result = await BingoTemplate.findByIdAndDelete(id);
      if (!result) {
        throw new Error("Bingo not found");
      }
      return result;
    } catch (error) {
      console.error("Error deleting bingo:", error);
      throw error;
    }
  }

  async listAllBingos() {
    try {
      const bingos = await BingoTemplate.find({});
      return bingos;
    } catch (error) {
      console.error("Error listing all bingos:", error);
      throw error;
    }
  }
}

export default new BingoTemplateServices();
