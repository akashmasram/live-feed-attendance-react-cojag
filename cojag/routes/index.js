const express = require('express');
const multer = require('multer');
const upload = multer();

const { signup, signin } = require('../controllers/authController');
const { startFFmpeg } = require('../controllers/ffmpegController');
const faceController = require('../controllers/faceController');
const fetchController = require('../controllers/fetchController');
const { AddMac, getAllMacAddresses, startStream} = require('../controllers/macAddController')
const { AddUser, GetUser } = require('../controllers/userController')

const auth = require('../middleware/auth')

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/start', startFFmpeg);
router.post('/updateFaceDescriptor', faceController.updateFaceDescriptor);
router.post('/logFaceDetection',auth, faceController.logFaceDetection);
router.get('/',auth , fetchController.getFaces);
router.post('/add-macadd', auth , AddMac );
router.post("/addUser", upload.array('uploadimages'), auth, AddUser );
router.get("/cameralist", auth, getAllMacAddresses);
router.get('/allusers', auth, GetUser );
router.post('/start-stream', startStream );



module.exports = router;