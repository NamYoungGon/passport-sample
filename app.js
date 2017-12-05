const express = require('express')
const expressSession = require('express-session')
const passport = require('passport')
const passport_local = require('passport-local')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressSession({
    secret: 'asdfasdf',
    resave: true,
    saveUninitialized: true
}))
app.use(cookieParser())



app.use(passport.initialize())
app.use(passport.session())

// 패스포트 설정
var configPassport = require('./config/passport');
configPassport(app, passport);

// 미들웨어를 통해서 로그인 상태가 아닐 경우 로그인 화면으로 redirect
const isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login.html');
};

// id: 11, password: 11
app.get('/', isAuthenticated, (req, res) => {
    console.log('유저 정보')
    console.dir(req.user)
    res.redirect('login_success.html')
})

app.use('/', express.static(path.join(__dirname, 'public')))

const router = express.Router()
router.route('/api/user/login').post(passport.authenticate('local-login', {
    successRedirect : '/login_success.html', 
    failureRedirect : '/login.html', 
    failureFlash : false 
}))
app.use(router)



app.listen(3000, () => {
    console.log('WebServer Start : port 3000')
})