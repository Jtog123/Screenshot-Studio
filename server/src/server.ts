
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import session from "express-session"
import pg from "pg"
import passport from "passport"
import GoogleStrategy  from "passport-google-oauth20"


type AppUser = {
    id: string,
    displayName :String
    firstName? : string,
    lastName? : string,
    email? :string
}

require('dotenv').config({path:"../.env"});
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
    cookie: {secure: true} // set to true later?
}));

app.use(passport.initialize());
app.use(passport.session());

//What minimum information do I need for this user ot find them later?
passport.serializeUser((user: Express.User, done) => {
    done(null, (user as AppUser).id);

   
});






passport.use(
    new GoogleStrategy.Strategy(
        {
            clientID: process.env.CLIENT_ID as string,
            clientSecret: process.env.CLIENT_SECRET as string,
            callbackURL: "http://localhost:5050/auth/google/cb"
        }, async function(token, refreshToken, profile, done){
            const user : AppUser = {
                id: profile.id,
                displayName : profile.displayName
            }
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

//creates base route, if we had a router.get("/editor"), route will be /editor
//app.use("/api") -> router.get("/editor") -> /api/editor
app.use("/", router);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});




