const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

router.get('/', petController.getAllPets); // Public
router.get('/:id', petController.getPetById); // Public
// Admin only
router.post('/', authMiddleware, adminMiddleware, upload.single('picture'), petController.createPet);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('picture'), petController.updatePet);
router.delete('/:id', authMiddleware, adminMiddleware, petController.deletePet); // Admin only

module.exports = router;