const Face = require('../models/faceModel');

exports.getFaces = async (req, res) => {
    try {
        const faces = await Face.find({user: req.user.id}); // Fetch all face records
        res.json(faces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};