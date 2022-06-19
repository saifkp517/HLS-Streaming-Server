import express from "express";
import session from "express-session"
import jwt from "jsonwebtoken"
import GoogleStrategy from "passport-google-oauth"
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser"

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

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json());

app.use(cors({
  origin: true,
  credentials: true
}))

const User = require("./models")

const url: string = "mongodb+srv://turd_waffle:saif5017@cluster0.bxt7i.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(url).then(() => console.log("connected to database"))
  .catch(err => console.log(err))

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
      const _id = userProfile.id

      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ _id })

      if (oldUser) {
        console.log("old user")
        return res.redirect('http://localhost:3001/DashBoard')
      }

      // Create user in our database
      const user = await new User({
        _id: _id,
        displayName: displayName,
        email: email,
        coordinates: {
          latitude: 0,
          longitude: 0
        }
      });
      const save = user.save()
      if (save) { console.log("added") }

      // return new user
      res.redirect('http://localhost:3001/DashBoard');
    } catch (err) {
      console.log(err);
    }
  });



/////////////////////////UPDATE LOCATION////////////////////////////////////////////

app.post('/location', async (req, res) => {
  try {

    let {latitude, longitude} = req.body;
    let displayName: string = req.body;
    console.log(longitude, latitude, displayName)

     User.findOneAndUpdate(displayName, {
      coordinates: {
        latitude: latitude,
        longitude: longitude
      }
    }).then((result: any) => console.log(result))
    .catch((err: any) => console.log("error: " + err))

  } catch (err) {
    res.json(err)
    console.log(err)
  }
})


////////////////////////////HAVERSINE FORMULA//////////////////////////

//using haversine formula to calculate the distance between 2 lattitudes

function distanceBetweenGeoPoints(lat1: number, lat2: number, lon1: number, lon2: number) {
  const EarthRadius = 6371 //km;
  let DeltaLattitude: number = lat2 - lat1;
  let DeltaLongitude: number = lon2 - lon1;

  let haversine = (Math.sin(DeltaLattitude / 2) ** 2) + Math.cos(lat1) * Math.cos(lat2) * (Math.sin(DeltaLongitude) ** 2)
  //atan2 returns the angle in radians
  let centralAngle = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  let distance = EarthRadius * centralAngle;
  console.log(distance)

}
