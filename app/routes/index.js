const express = require('express');
const router = express.Router();
const messaging = require('./../messaging/messaging');

/**
 * @api {get} / Homepage
 * @apiName Home
 * @apiGroup Layout
 */
router.get('/', (req, res) => {
	res.render('index', {
		title: messaging.titles.aboutUs
	});
});

/**
 * @api {get} /layout/navigation Get Navigation
 * @apiName GetNavigation
 * @apiGroup Layout
 */
router.get('/layout/navigation', (req, res) => {
	res.json(messaging.data.navigation);
});

module.exports = router;
