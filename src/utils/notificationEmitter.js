const { EventEmitter } = require("events");

const notificationEmitter = new EventEmitter();
notificationEmitter.setMaxListeners(0); // unlimited concurrent connected admins

module.exports = notificationEmitter;