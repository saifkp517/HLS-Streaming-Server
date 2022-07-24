import express from "express";
import session from "express-session"
import GoogleStrategy from "passport-google-oauth"
import cors from "cors";
import bodyParser from "body-parser"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient();

const app = express();

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'mYsecretisalwaysbetterthanyoursbitch!.',
  rolling: true,
  cookie: {
    maxAge: 360000,
    secure: false
  }
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
});


app.get('/', function (req, res) {
  res.render('pages/auth');
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('App listening on port ' + port));


/*  PASSPORT SETUP  */

import passport from "passport"
let userProfile: any;

app.use(passport.initialize());
app.use(passport.session());

app.get('/success', async (req, res) => {
  res.json(userProfile)
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
  callbackURL: "http://localhost:4000/auth/google/callback"
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
        return res.redirect('http://localhost:3000/DashBoard')
      }

      let hashedKey: string = await bcrypt.hash(id, 10)

      console.log("UserKey: " + hashedKey)

      const user = await prisma.oauthuser.create({
        data: {
          user_id: id,
          name: displayName,
          email: email,
          live: false,
          userKey: hashedKey
        }
      })

      if (user) { console.log("added") }
      // Create user in our database

      // return new user
      res.redirect('http://localhost:3000/DashBoard');
    } catch (err) {
      console.log(err);
    }
  });

app.get('/key', async (req, res) => {

  const id = userProfile.id

  let hashedKey: string = await bcrypt.hash(id, 10)

  if (req.isAuthenticated()) {
    const user = await prisma.oauthuser.update({
      where: {
        user_id: id
      },
      data: {
        userKey: hashedKey
      },
    })

    res.json(hashedKey)

    console.log(user)

  } else {
    res.json("please login")
  }

});

app.get('/getstuff', async (req, res) => {
  const liveUsers = await prisma.oauthuser.findMany()

  res.json(liveUsers)
})


//////////////////////////////STREAMKEY AUTH//////////////////////////////

app.post("/auth", async (req, res) => {
  const streamKey = req.body.key;

  const user = await prisma.oauthuser.findFirst({
    where: {
      userKey: streamKey
    },
    select: {
      user_id: true
    }
  })

  if (user) {
    
    let string = JSON.stringify(user)
    let parse = JSON.parse(string)

    const livestatus = await prisma.oauthuser.update({
      where: {
        user_id: parse.user_id
      },
      data: {
        live: true
      },
    })

    console.log(livestatus)


    console.log("horray!")
    res.status(200).send();
    return;

  }

  res.status(403).send()

})

app.get("/notify", (req, res) => {
  console.log("notofied")
})

app.get("/done", (req, res) => {
  return console.log("we're done boys, wrap it up!")
})


app.get("/connection", (req, res) => {
  console.log("connected")
})

app.get("/play", (req, res) => {
  console.log("play")
})