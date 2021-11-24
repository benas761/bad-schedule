var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var con = require('./database.js');
var app = require('../app');
var ver = require('./validation.js');
var jwt = require('jsonwebtoken');
const {insertPost, updatePost, eventPost, deletePost, schedulePost} = require('./posts.js');
const {registerGet, loginGet, tokenPost, registerPost} = require("./login.js");
const {rootGet} = require('./gets.js')
const {tokenCheck, scheduleCheck, verifyRegister, verifyEvent} = require('./middleware.js');

router.get('/register', registerGet);
router.get('/login', loginGet);
router.post('/tokenPost', tokenPost);
router.post('/registerPost', verifyRegister, registerPost);

var middleware = [tokenCheck];

router.post('/schedulePost', middleware, schedulePost);

middleware = [tokenCheck, scheduleCheck, verifyEvent];

router.post('/eventInsert', middleware, insertPost);
router.post('/eventUpdate', middleware, updatePost);

middleware = [tokenCheck, scheduleCheck];

router.get('/', middleware, rootGet);
router.post('/eventSelect', middleware, eventPost);
router.post('/eventDelete', middleware, deletePost);

module.exports = router;