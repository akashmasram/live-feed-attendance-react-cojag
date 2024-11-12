const mongoose = require('mongoose');

const faceSchema = new mongoose.Schema({
    name: String,
    date: String,
    time: String,
    firstDetected: Date,
    lastDetected: Date,
    status: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AddUser',
        required: true
    }
});

const Face = mongoose.model('Face', faceSchema);
module.exports = Face;


// const Face = mongoose.model('Face', faceSchema);
// module.exports = Face;

// const Face = mongoose.model('Face', faceSchema);
// module.exports = Face;
