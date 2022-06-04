"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_session_1 = __importDefault(require("express-session"));
var app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));
app.get('/', function (req, res) {
    res.render('pages/auth');
});
var port = process.env.PORT || 3000;
app.listen(port, function () { return console.log('App listening on port ' + port); });
/*  PASSPORT SETUP  */
var passport_1 = __importDefault(require("passport"));
var userProfile;
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.set('view engine', 'ejs');
app.get('/success', function (req, res) { return res.send(userProfile); });
app.get('/error', function (req, res) { return res.send("error logging in"); });
passport_1.default.serializeUser(function (user, cb) {
    cb(null, user);
});
passport_1.default.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
/*  Google AUTH  */
var passport_google_oauth_1 = __importDefault(require("passport-google-oauth"));
var googlestrat = passport_google_oauth_1.default.OAuth2Strategy;
var GOOGLE_CLIENT_ID = '432116981285-ok41adbn7m3tr4etfqd6ffooo9t1svt0.apps.googleusercontent.com';
var GOOGLE_CLIENT_SECRET = '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';
passport_1.default.use(new googlestrat({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
}, function (accessToken, refreshToken, profile, done) {
    userProfile = profile;
    return done(null, userProfile);
}));
app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/error' }), function (req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
});
//# sourceMappingURL=server.js.map