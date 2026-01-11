const express = require('express');
const { acceptAgreement, getAgreementStatus } = require('../controllers/agreementController');

const router = express.Router();

router.post('/', acceptAgreement);
router.get('/status', getAgreementStatus);

module.exports = router;
