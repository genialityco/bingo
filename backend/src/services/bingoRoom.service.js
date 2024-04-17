import BingoRoom from "../models/roomBingo";

class BingoRoomServices {
  async createRoom(roomData) {
    try {
      const template = new BingoRoom(roomData);
      await template.save();
      return template;
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  }

  async getRoomById(id) {
    try {
      const template = await BingoRoom.findById(id).populate("bingoFigure");
      return template;
    } catch (error) {
      console.error("Error finding room:", error);
      throw error;
    }
  }

  async findRoomByField(fieldName, value) {
    try {
      const query = {};
      query[fieldName] = value;
      const room = await BingoRoom.findOne(query);
      if (!room) {
        throw new Error(`Room not found with ${fieldName}: ${value}`);
      }
      return room;
    } catch (error) {
      console.error(`Error finding room by ${fieldName}:`, error);
      throw error;
    }
  }

  async addBallotToHistory(roomId, ballot) {
    try {
      const room = await this._findRoomById(roomId);
      room.history_of_ballots.push(ballot);
      await room.save();
      return room;
    } catch (error) {
      console.error("Error add ballot to history:", error);
      throw error;
    }
  }

  async markGameEnd(roomId, winners) {
    try {
      const room = await this._findRoomById(roomId);
      if (room) {
        room.end_time = new Date();
        room.number_of_winners = winners.length;
        room.winners = winners;
        await room.save();
        return room;
      }
    } catch (error) {
      console.error("Error at the end of the game:", error);
      throw error;
    }
  }

  async updateRoomCapacity(roomId, capacity) {
    try {
      const room = await BingoRoom.findByIdAndUpdate(
        roomId,
        { capacity: capacity },
        { new: true }
      );
      return room;
    } catch (error) {
      console.error("Error updating room capacity:", error);
      throw error;
    }
  }

  async getAllBingos() {
    try {
      const bingos = await BingoRoom.find({});
      return bingos;
    } catch (error) {
      console.error("Error getting all rooms:", error);
      throw error;
    }
  }

  async updateRoom(roomId, updateData) {
    try {
      const updatedRoom = await BingoRoom.findByIdAndUpdate(
        roomId,
        updateData,
        { new: true }
      );
      return updatedRoom;
    } catch (error) {
      console.error("Error updating room:", error);
      throw error;
    }
  }

  async deleteRoom(id) {
    try {
      const result = await BingoRoom.findByIdAndDelete(id);
      return result;
    } catch (error) {
      console.error("Error deleting room:", error);
      throw error;
    }
  }

  async _findRoomById(roomId) {
    const room = await BingoRoom.findById(roomId);
    if (!room) throw new Error(`Room with ID ${roomId} not found`);
    return room;
  }
}

export default new BingoRoomServices();
