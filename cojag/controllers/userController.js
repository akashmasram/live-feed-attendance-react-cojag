const AddUsers = require('../models/userModel')

exports.GetUser = async (req, res) => {
    try {
        const products = await AddUsers.find({user:req.user.id}); // Fetch all users

        const modifiedProducts = products.map(product => ({
            _id: product._id, // Ensure to include the ID
            username: product.username,
            images: product.images ? product.images.map(img => ({
                data: img.data.toString('base64'),
                contentType: img.contentType
            })) : [] // Convert each image buffer to base64
        }));

        res.json(modifiedProducts); // Send modified result
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


exports.AddUser = async (req, res) => {
    const { username } = req.body;

    const userImages = req.files.map(file => ({
        name: file.originalname,
        data: file.buffer,
        contentType: file.mimetype
    }));

    const newUser = new AddUsers({
        username: username,
        images: userImages,
        user: req.user.id
    });

    await newUser.save();
    res.status(200).send("User uploaded successfully");
};