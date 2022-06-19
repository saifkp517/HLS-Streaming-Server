"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
app.get('/success', function (req, res) { return res.send(userProfile.displayName + "asd"); });
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
/////////////////AUTHENTICATION/////////////////////////
var mongodb = __importStar(require("mongodb"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var User = require("./models");
// Register
app.post("/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, displayName, email, oldUser, user, token, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, id = _a.id, displayName = _a.displayName, email = _a.email;
                // Validate user input
                if (!(email && displayName && id)) {
                    res.status(400).send("All input is required");
                }
                return [4 /*yield*/, User.findOne({ email: email })];
            case 1:
                oldUser = _b.sent();
                if (oldUser) {
                    return [2 /*return*/, res.status(409).send("User Already Exist. Please Login")];
                }
                return [4 /*yield*/, User.create({
                        displayName: displayName,
                        id: id,
                        email: email.toLowerCase(), // sanitize: convert email to lowercase
                    })];
            case 2:
                user = _b.sent();
                token = jsonwebtoken_1.default.sign({ user_id: user._id, email: email }, process.env.TOKEN_KEY, {
                    expiresIn: "2h",
                });
                // save user token
                user.token = token;
                // return new user
                res.status(201).json(user);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                console.log(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Login
app.post("/login", function (req, res) {
    // our login logic goes here
});
var MongoClient = mongodb.MongoClient;
var db;
var url = "mongodb://0.0.0.0:27017/mytestingdb";
MongoClient.connect(url, function (err, database) {
    if (err) {
        console.log("connection error");
        console.log("error: " + err);
        process.exit(1);
    }
    db = database.db('mytestingdb');
});
//# sourceMappingURL=server.js.map