module.exports = (function() {


    var mongoose = require('mongoose');
    var fs = require('fs');
    var path = require('path');
    var directory = path.resolve('./');
    mongoose.connect('mongodb://localhost/1stand10');
    var Schema = mongoose.Schema;


    // ---------------------------------- SCHEMAS / MODELS ---------------------------------- //

    var MessageSchema = new mongoose.Schema({
        _room: {
            type: Schema.ObjectId,
            ref: 'Room'
        },
        user: Schema.Types.Mixed,
        content: {
            type: String
        },
        createdAt: Date,
    });

    var Message = mongoose.model('Message', MessageSchema);

    var RoomSchema = new mongoose.Schema({
        messages: [{
            type: Schema.Types.ObjectId,
            ref: 'Message'
        }],
        image: String,
        name: String
    });

    var Room = mongoose.model('Room', RoomSchema);

})();