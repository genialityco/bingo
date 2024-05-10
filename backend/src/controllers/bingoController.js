import BingoServices from "../services/bingo.service";
import sendResponse from "../utils/sendResponse";
const customEmitter = require("../utils/eventEmitter");

class BingoController {
  // POST /bingos - Crear una nueva sala
  async createBingo(req, res) {
    try {
      const bingo = await BingoServices.createBingo(req.body);
      sendResponse(res, 201, bingo, "Bingo created successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // GET /bingos/:id - Obtener una sala por ID
  async getBingoById(req, res) {
    try {
      const bingo = await BingoServices.getBingoById(req.params.id);
      if (!bingo) {
        return sendResponse(res, 404, null, "Bingo not found");
      }
      sendResponse(res, 200, bingo, "Bingo retrieved successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // GET /bingos/search - Buscar una sala por un campo específico
  async findBingoByField(req, res) {
    try {
      const { field, value } = req.query;
      if (!field || !value) {
        return sendResponse(
          res,
          400,
          null,
          "Missing field or value in query parameters."
        );
      }
      const bingo = await BingoServices.findBingoByField(field, value);
      if (!bingo) {
        return sendResponse(
          res,
          404,
          null,
          `Bingo not found with ${field}: ${value}`
        );
      }
      sendResponse(res, 200, bingo, "Bingo found successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // PUT /bingos/:id/ballots - Añadir balota al historial
  async addBallotToHistory(req, res) {
    try {
      const bingo = await BingoServices.addBallotToHistory(
        req.params.id,
        req.body.ballot
      );
      sendResponse(
        res,
        200,
        bingo,
        "Ballot added to bingo history successfully"
      );
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // POST /bingos/:id/end - Marcar el fin del juego
  async markGameEnd(req, res) {
    try {
      const bingo = await BingoServices.markGameEnd(
        req.params.id,
        req.body.winners
      );
      sendResponse(res, 200, bingo, "Game ended successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // PUT /bingos/:id/capacity - Actualizar la capacidad de la sala
  async updateBingoCapacity(req, res) {
    try {
      const bingo = await BingoServices.updateBingoCapacity(
        req.params.id,
        req.body.capacity
      );
      sendResponse(res, 200, bingo, "Bingo capacity updated successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // GET /bingos - Listar todas las salas
  async getAllBingos(req, res) {
    try {
      const bingos = await BingoServices.getAllBingos();
      sendResponse(res, 200, bingos, "Bingos retrieved successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // PUT /bingos/:id - Actualizar una sala
  async updateBingo(req, res) {
    try {
      const bingo = await BingoServices.updateBingo(req.params.id, req.body);
      sendResponse(res, 200, bingo, "Bingo updated successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // DELETE /bingos/:id - Eliminar una sala
  async deleteBingo(req, res) {
    try {
      const result = await BingoServices.deleteBingo(req.params.id);
      sendResponse(res, 200, result, "Bingo deleted successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  async sangBingo(req, res) {
    const { markedSquares, id, userId, cardboardCode } = req.body;
    const bingo = await BingoServices.getBingoById(id);

    const figure = bingo.bingo_figure.index_to_validate;
    const historyBallots = bingo.history_of_ballots;

    customEmitter.emit("sangBingo", { userId: userId, status: "Validando" });

    // Obtener los índices marcados que están marcados como true
    const indicesMarcados = markedSquares
      .map((celda, indice) => celda.isMarked && indice)
      .filter((indice) => indice !== false);

    // Verificar si todos los índices de la figura están marcados
    const esFiguraCompleta = figure.every((indiceFigura) =>
      indicesMarcados.includes(indiceFigura)
    );

    // Verificar si los valores en los índices de la figura que están marcados
    // coinciden con los valores de las balotas que han salido
    const esValido = figure.every((indiceFigura) => {
      const square = markedSquares[indiceFigura];
      // Comprueba si el cuadrado está marcado como deshabilitado o si su valor está en el historial de balotas
      return (
        square.value === "Disabled" || historyBallots.includes(square.value)
      );
    });
    // Determinar si es ganador
    const esGanador = esFiguraCompleta && esValido;

    // Emitir el evento y enviar la respuesta basada en si es ganador o no
    setTimeout(() => {
      if (esGanador) {
        customEmitter.emit("sangBingo", {
          userId: userId,
          status: true,
          cardboardCode,
        });
        sendResponse(res, 200, esGanador, "¡Ganaste el Bingo!");
      } else {
        customEmitter.emit("sangBingo", {
          userId: userId,
          status: false,
          cardboardCode,
        });
        sendResponse(res, 400, esGanador, "Todavía no ganas el Bingo.");
      }
    }, "7000");
  }
}

export default new BingoController();
