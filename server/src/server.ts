
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import session from "express-session"
import pg from "pg"
import passport from "passport"
import GoogleStrategy  from "passport-google-oauth20"

//import UserModel from "../../dataModels/UserModel"

enum SubscriptionType {
    Free,
    WeekendWarrior,
    Monthly
}

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

/*
user_id SERIAL PRIMARY KEY - generate primary keys
//ex. INSERT INTO employees (emp_id, first_name, last_name) VALUES (DEFAULT, 'Jane', 'Smith');
*/

//create the tables needed
const createPool = async() => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            google_id TEXT UNIQUE ,
            email TEXT,
            display_name TEXT,
            subscription_type TEXT,
            profile_picture TEXT,
            created_at TIMESTAMP,
            last_login TIMESTAMP,
            export_count INT
        )`
    );
}


createPool();


type AppUser = {
    google_id: string,
    display_name :string
    profile_picture: string
    email :string
    subscription_type : SubscriptionType
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


/*
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            google_id TEXT UNIQUE ,
            email TEXT,
            display_name TEXT,
            subscription_type TEXT,
            profile_picture TEXT,
            created_at TIMESTAMP,
            last_login TIMESTAMP,
            export_count INT
        )`
*/


try {
    passport.use(
        new GoogleStrategy.Strategy(
            {
                clientID: process.env.CLIENT_ID as string,
                clientSecret: process.env.CLIENT_SECRET as string,
                callbackURL: "http://localhost:5050/auth/google/cb"
            }, async function(token, refreshToken, profile, done) {
                let profilePictureTemp = profile._json["picture"] as string
                //The callback to searlizeUser function
                const user : AppUser = {
                    google_id: profile.id,
                    display_name : profile.displayName,
                    profile_picture: profilePictureTemp,
                    email: profile.emails?.[0].value as string,
                    subscription_type: SubscriptionType.Free
                }

                //POSTGRES Logic Here
                let app_user = await pool.query(`SELECT * FROM users WHERE google_id = $1`, [user.google_id]);

                
                if(app_user) {
                    let userInDB : boolean = app_user.rowCount! > 0;

                    if(userInDB) {
                        //alter the table update last_logic

                    } else {
                        //User is not in DB, insert them in
                        const result = await pool.query(
                            `INSERT INTO users (user_id, google_id, email, display_name, subscription_type, profile_picture, created_at, last_login, export_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, [
                                'DEFAULT', user.google_id, user.email, user.display_name,  user.subscription_type, user.profile_picture, 'NOW()', 'NOW()'
                            ]
                        );

                    }
                }


                console.log(profile);
                return done(null, user);
                //google returns a bunch of stuff
                //determine the user
                }
            )
        )
} catch (err) {
    console.error("Error with google strategy", err);
}



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




