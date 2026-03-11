
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import session from "express-session"
import pg from "pg"
import passport from "passport"
import GoogleStrategy  from "passport-google-oauth20"
//import UserModel from "../../dataModels/UserModel"

require('dotenv').config({path:"../.env"});

const {Pool} = pg

//Create a pool, better than creating several different Clients
const pool = new Pool({
    user: process.env.DB_USER as string,
    host: process.env.DB_HOST as string,
    database: process.env.DB_DATABASE as string,
    password: process.env.DB_PASSWORD as string,
    port: 5432
});


const createPool = async() => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            google_id TEXT UNIQUE,
            email TEXT,
            displayName TEXT,
            subscriptionType TEXT,
            profilePicture TEXT
        )`
    );
}

//cre
createPool();


type AppUser = {
    id: string,
    displayName :string
    profilePicture: string
    email? :string
}
    

//var appUser : AppUser | null = null;


const router = express.Router();
const PORT = 5050;

const app = express();

app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
}));

app.use(express.json());

//Allows application to track a user of the app, and store user specific data that presists across requests
app.use(session({
    secret: "mySessionSecret", // replace later
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false} // set to true later?
}));

app.use(passport.initialize());
app.use(passport.session());

//What minimum information do I need for this user ot find them later?
passport.serializeUser((user: Express.User, done) => {
    console.log("order");
    console.log("user we got is", user)
   
    done(null, (user as AppUser));
  
});

passport.deserializeUser(async (user:AppUser, done) => {
    done(null, user);
});
/*
passport.deserializeUser(async (user:AppUser, done) => {
    console.log("deserializing user with id: ", user.id);
    done(null, user);
});
*/



passport.use(
    new GoogleStrategy.Strategy(
        {
            clientID: process.env.CLIENT_ID as string,
            clientSecret: process.env.CLIENT_SECRET as string,
            callbackURL: "http://localhost:5050/auth/google/cb"
        }, async function(token, refreshToken, profile, done){
            let profilePictureTemp = profile._json["picture"] as string
            //The callback to searlizeUser function
            const user : AppUser = {
                id: profile.id,
                displayName : profile.displayName,
                profilePicture: profilePictureTemp
            }

            //console.log(profile._json["picture"]);
            return done(null, user);
            //google returns a bunch of stuff
            //determine the user
        }
    )
)


router.get("/auth/google", passport.authenticate("google", {scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"]}));

router.get("/auth/google/cb", passport.authenticate("google", {failureRedirect: "/auth/failure"}), (req, res) => {
    res.redirect("http://localhost:5173/editor");
    
})

router.get("/auth/failure", (req, res) => {
    res.send("Authentication Failed");
    //redirect back to home
    res.redirect("http://localhost:5173");
})

router.get("/", (req, res) => {
    res.json({message: "hello from the backend?"});
})

router.get("/auth/google/me", (req, res) => {
    //req.user stores user info, its the user who made the request
    if(!req.user) {
        return res.status(401).json({error: "Not authenticated"});
    }
    res.json({userProfile: req.user});
});



router.post("/auth/logout", function(req, res, next){
    req.logout(function(err) {
        if(err){ 
            return res.status(500).json({error: "Log out failed"});
        };
        console.log("logout success");
        res.json({success:true, message: "Logged Out"});
    })
});
//creates base route, if we had a router.get("/editor"), route will be /editor
//app.use("/api") -> router.get("/editor") -> /api/editor
app.use("/", router);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});




