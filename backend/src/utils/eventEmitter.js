// eventEmitter.js
const EventEmitter = require('events');
class CustomEmitter extends EventEmitter {}
const customEmitter = new CustomEmitter();

module.exports = customEmitter; // Asegúrate de que esto esté al final del archivo
