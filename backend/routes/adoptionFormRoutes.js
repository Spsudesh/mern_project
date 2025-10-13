const express = require('express');
const router = express.Router();
const adoptionFormController = require('../controllers/adoptionFormController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, adminMiddleware, adoptionFormController.getAllAdoptionForms); // Admin only
// Define specific route before param route to avoid shadowing
router.get('/me', authMiddleware, adoptionFormController.getAdoptionFormsByToken);
router.get('/:id', authMiddleware, adoptionFormController.getAdoptionFormById); // Authenticated users
router.post('/', authMiddleware, adoptionFormController.createAdoptionForm); // Authenticated users
router.put('/:id', authMiddleware, adminMiddleware, adoptionFormController.updateAdoptionForm); // Admin 
router.delete('/:id', authMiddleware, adminMiddleware, adoptionFormController.deleteAdoptionForm); // Admin 

module.exports = router;