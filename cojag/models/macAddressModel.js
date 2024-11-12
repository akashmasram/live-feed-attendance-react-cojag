
const mongoose = require('mongoose');

const AddMacAddressSchema = new mongoose.Schema({
    macAddress: {
        type: String,
        required: true,
        unique: true 
    },
    name: {
        type: String,
        required: true 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AddUser',
        required: true
    }
});

const AddMacAddress = mongoose.model('AddMacAddress', AddMacAddressSchema);

module.exports = AddMacAddress;