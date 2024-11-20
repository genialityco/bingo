import Bingo from "../models/bingo";

class BingoServices {
  async createBingo(data) {
    try {
      const bingo = new Bingo(data);
      await bingo.save();
      return bingo;
    } catch (error) {
      console.error("Error creating bingo:", error);
      throw error;
    }
  }

  async getBingoById(id) {
    try {
      const bingo = await Bingo.findById(id).populate("bingo_figure");
      return bingo;
    } catch (error) {
      console.error("Error finding bingo:", error);
      throw error;
    }
  }

  async findBingoByField(fieldName, value) {
    try {
      const query = {};
      query[fieldName] = value;
      const bingo = await Bingo.findOne(query).populate("bingo_figure");
      if (!bingo) {
        // Devuelve null para indicar que no se encontró el bingo
        return null;
      }
      return bingo;
    } catch (error) {
      console.error(`Error finding bingo by ${fieldName}:`, error);
      throw new Error(`Error finding bingo: ${error.message}`);
    }
  }

  async addBallotToHistory(bingoId, ballot) {
    try {
      const bingo = await this._findBingoById(bingoId);
      bingo.history_of_ballots.push(ballot);
      await bingo.save();
      return bingo;
    } catch (error) {
      console.error("Error add ballot to history:", error);
      throw error;
    }
  }

  async markGameEnd(bingoId, winners) {
    try {
      const bingo = await this._findBingoById(bingoId);
      if (bingo) {
        bingo.end_time = new Date();
        bingo.number_of_winners = winners.length;
        bingo.winners = winners;
        await bingo.save();
        return bingo;
      }
    } catch (error) {
      console.error("Error at the end of the game:", error);
      throw error;
    }
  }

  async updateBingoCapacity(bingoId, capacity) {
    try {
      const bingo = await Bingo.findByIdAndUpdate(bingoId, { capacity: capacity }, { new: true });
      return bingo;
    } catch (error) {
      console.error("Error updating bingo capacity:", error);
      throw error;
    }
  }

  async getAllBingos() {
    try {
      const bingos = await Bingo.find({});
      return bingos;
    } catch (error) {
      console.error("Error getting all bingos:", error);
      throw error;
    }
  }

  async addBingoValue (bingoId, updateData) {
    try {
      const updatedBingo = await Bingo.findByIdAndUpdate(
        bingoId,
        { $push: { bingo_values: updateData } },
        {
          new: true,
        }
      );
      return updatedBingo;
    } catch (error) {
      console.error("Error updating bingo:", error);
      throw error;
    }
  }

  async updateBingo(bingoId, updateData) {
    try {
      const updatedBingo = await Bingo.findByIdAndUpdate(bingoId, updateData, {
        new: true,
      });
      return updatedBingo;
    } catch (error) {
      console.error("Error updating bingo:", error);
      throw error;
    }
  }

  async deleteBingo(id) {
    try {
      const result = await Bingo.findByIdAndDelete(id);
      return result;
    } catch (error) {
      console.error("Error deleting bingo:", error);
      throw error;
    }
  }

  async _findBingoById(id) {
    const bingo = await Bingo.findById(id);
    if (!bingo) throw new Error(`Bingo with ID ${id} not found`);
    return bingo;
  }
}

export default new BingoServices();
