import express from "express";
import session from "express-session"
import GoogleStrategy from "passport-google-oauth"
import cors from "cors";
import bodyParser from "body-parser"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

const app = express();

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET',
  rolling: true,
  cookie: {
    maxAge: 360000,
    secure: false
  }
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());

app.use(cors({
  origin: true,
  credentials: true
}))


//const mongoURI: string = "mongodb+srv://turd_waffle:saif5017@cluster0.bxt7i.mongodb.net/?retryWrites=true&w=majority";

app.get('/', function (req, res) {
  res.render('pages/auth');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));


/*  PASSPORT SETUP  */

import passport from "passport"
let userProfile: any;

app.use(passport.initialize());
app.use(passport.session());

app.get('/success', async (req, res) => {

  if (req.isAuthenticated()) {
    console.log(userProfile)
    res.json(userProfile)
  } else {
    res.send("please login")
  }

});
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

/*  Google AUTH  */

const googlestrat = GoogleStrategy.OAuth2Strategy

const GOOGLE_CLIENT_ID = '432116981285-ok41adbn7m3tr4etfqd6ffooo9t1svt0.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new googlestrat({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
    userProfile = profile;
    return done(null, userProfile);
  }
));


/////////////////AUTHENTICATION/////////////////////////

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  async function (req, res) {
    // Successful authentication, redirect success.
    try {
      // Get user input
      const displayName = userProfile.displayName;
      const email = userProfile.emails[0].value
      const id = userProfile.id

      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await prisma.oauthuser.findUnique({
        where: {
          user_id: id
        }
      })

      if (oldUser) {
        console.log("old user")
        return res.redirect('http://localhost:3001/DashBoard')
      }

      const user = await prisma.oauthuser.create({
        data: {
          user_id: id,
          name: displayName,
          email: email,
          latitude: 0,
          longitude: 0
        }
      })

      if (user) {console.log("added")}
      // Create user in our database

      // return new user
      res.redirect('http://localhost:3001/DashBoard');
    } catch (err) {
      console.log(err);
    }
  });


//////////////////////////////STREAMKEY AUTH//////////////////////////////

app.post("/auth", (req, res) => {
  const streamKey = req.body.key;

  if (streamKey == "key123") {
    res.status(200).send();
    return;
  }

  res.status(400).send();
})




