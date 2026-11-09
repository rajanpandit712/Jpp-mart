const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.get('/search', locationController.searchPlaces);
router.get('/reverse', locationController.reverseGeocode);
router.get('/validate-pincode/:pincode', locationController.validatePincode);

module.exports = router;
