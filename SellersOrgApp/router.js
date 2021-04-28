const path = require('path');
const express = require('express');
const router = express.Router();
const signUp = require(path.join(__dirname,'route-functions','sign-up'));
const confirm = require(path.join(__dirname,'route-functions','confirm'));
const login = require(path.join(__dirname,'route-functions','login'));
const auth = require(path.join(__dirname,'route-functions','auth'));
const logout = require(path.join(__dirname,'route-functions','logout'));
const getAllLc = require(path.join(__dirname,'route-functions','get-all-lc'));
const createLc = require(path.join(__dirname,'route-functions','create-lc'));
const notifyMe = require(path.join(__dirname,'route-functions','notifyme'));
const getAllNot = require(path.join(__dirname,'route-functions','get-all-not'));

router.route('/signup').post(signUp);

router.route('/confirm').post(confirm);

router.route('/login').post(login);

router.route('/notifyme').post(notifyMe);

router.use(auth);

router.route('/logout').get(logout);

router.route('/getalllc').get(getAllLc);

router.route('/createlc').post(createLc);

router.route('/getallnotification').get(getAllNot);


module.exports = router;