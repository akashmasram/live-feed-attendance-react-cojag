const mongoose = require('mongoose');
const user = require('./authModel')

const AddUserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    images: [{
        name: String,
        data: Buffer,
        contentType: String
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AddUser',
        required: true
    }
});

const AddUser = mongoose.model('AddUser', AddUserSchema);
module.exports = AddUser;