const Face = require('../models/faceModel');

exports.updateFaceDescriptor = (req, res) => {
    const { faceId, name } = req.body;
    const updatedDescriptor = faceDescriptors.find(descriptor => descriptor.faceId === faceId);
    if (updatedDescriptor) {
        updatedDescriptor.name = name;
        res.status(200).send('Face descriptor updated successfully.');
    } else {
        res.status(404).send('Face descriptor not found.');
    }
};


exports.logFaceDetection = async (req, res) => {
    const { name } = req.body;
    const currentTime = new Date();
    const currentDate = currentTime.toISOString().split('T')[0]; // Get the date part (YYYY-MM-DD)
    const currentTimeStr = currentTime.toTimeString().split(' ')[0]; // Get the time part (HH:MM:SS)

    try {
        if (name === 'unknown') {
            return res.status(400).send('Unknown person detected.');
        }

        // Check if the person exists in the database (for any date)
        let person = await Face.findOne({ name, user:req.user.id });

        if (!person) {
            // If person is not found, create a new entry
            const newPerson = new Face({
                name,
                date: currentDate,
                time: currentTimeStr,
                firstDetected: currentTime,
                status: 'present',
                user: req.user.id
            });
            await newPerson.save();
            return res.status(200).send('Person detected and logged for the first time.');
        } 

        // If the person exists, check if they were detected today
        if (person.date === currentDate) {
            // Person was already detected today, do nothing
            return res.status(200).send('Person already detected today. No further logging required.');
        } else {
            // Update the existing entry with the new date and time (for a new day detection)
            person.date = currentDate;
            person.time = currentTimeStr;
            person.firstDetected = currentTime;
            await person.save();

            return res.status(200).send('Person detected again and updated for the new day.');
        }
    } catch (err) {
        console.error('Error logging face detection:', err);
        res.status(500).send('Error logging face detection.');
    } 
};