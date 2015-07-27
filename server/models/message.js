var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new mongoose.Schema({
    user: Schema.Types.Mixed,
    content: String,
    createdAt: { type: Date, default: Date.now() }
});

module.exports = MessageSchema;