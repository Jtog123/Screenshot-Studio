
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import session from "express-session"
import pg from "pg"
import passport from "passport"
import GoogleStrategy  from "passport-google-oauth20"
import Stripe from "stripe"
//import {API_URL} from "../../client/src/config"


//import UserModel from "../../dataModels/UserModel"

enum SubscriptionType {
    Free = "Free",
    WeekendWarrior = "Weekend",
    Monthly = "Monthly"
}

type AppUser = {
    user_id? : number
    google_id: string,
    display_name :string,
    email :string
    profile_picture: string,
    subscription_type : SubscriptionType,
    export_count? : number
    last_export? : Date
}

require('dotenv').config({path:".env"}); //../.env

const stripe = new Stripe(process.env.STRIPE_S_KEY!, {
    apiVersion: "2026-03-25.dahlia",

});

const {Pool} = pg

//Create a pool, better than creating several different Clients
//port 5432
const pool = new Pool({
    user: process.env.DB_USER as string,
    host: process.env.DB_HOST as string,
    database: process.env.DB_DATABASE as string,
    password: process.env.DB_PASSWORD as string,
    port: Number(process.env.DO_DB_PORT),
    ssl: {
        rejectUnauthorized: false // This is required for DigitalOcean
    }
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
            google_id TEXT UNIQUE NOT NULL ,
            email TEXT NOT NULL,
            display_name TEXT,
            subscription_type TEXT,
            profile_picture TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            last_login TIMESTAMP DEFAULT NOW(),
            export_count INTEGER DEFAULT 0,
            last_export TIMESTAMPTZ,
            weekend_expires_at TIMESTAMPTZ
        )`
    );

    await pool.query(`
        CREATE TABLE IF NOT EXISTS payments (
            payment_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
            stripe_session_id TEXT NOT NULL,
            stripe_customer_id TEXT,
            stripe_subscription_id TEXT,
            plan TEXT NOT NULL,
            amount INTEGER NOT NULL,
            currency TEXT DEFAULT 'usd',
            status TEXT DEFAULT 'completed',
            created_at TIMESTAMP DEFAULT NOW()

        )`
    );
}


createPool();



    

//var appUser : AppUser | null = null;


const router = express.Router();
const PORT = process.env.PORT || 5050;

const app = express();

app.use(cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true
}));

//my server recieves this from stripe
app.post("/api/webhook", express.raw({type: "application/json"}), async (req, res) => {
    const sig = req.headers["stripe-signature"]!;
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch(err) {
        console.error("webhook Error:", err);
        return res.status(400).send("webhook error");
    }


    try {
        switch(event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as any;
                const plan = session.metadata.plan;
                const google_id = session.client_reference_id;

                const userResult = await pool.query(
                    `SELECT user_id FROM users WHERE google_id = $1`, [google_id]
                );

                if(userResult.rows.length === 0) {
                    console.error(`User not found for google_id: ${google_id}`);
                    return res.status(404).json({error:"user not found"});
                }

                const user_id = userResult.rows[0].user_id;

                //const user_id = userResult.rows[0].user_id;

                if(plan === "weekend" ) {
                    const expiresAt = new Date();
                    expiresAt.setHours(expiresAt.getHours() + 48);

                    await pool.query(`
                        UPDATE users
                        SET
                            subscription_type = 'Weekend',
                            weekend_expires_at = $1
                        WHERE google_id = $2
                    `, [expiresAt, google_id]);

                    await pool.query(`
                        INSERT INTO payments(
                            user_id,
                            stripe_session_id,
                            stripe_customer_id,
                            stripe_subscription_id,
                            plan,
                            amount,
                            status
                        ) VALUES($1, $2, $3, $4, $5, $6, $7)
                    `, [
                        user_id,
                        session.id,
                        session.customer,
                        session.subscription,
                        'weekend',
                        599,
                        'completed'
                        
                    ]);

                    console.log(`Weekend pass activated for ${google_id} expires at ${expiresAt}`);
                } else if (plan === "monthly") {
                    await pool.query(`
                        UPDATE users
                        SET subscription_type = 'Monthly'
                        WHERE google_id = $1

                    `, [google_id]);

                    await pool.query(`
                        INSERT INTO payments(
                            user_id,
                            stripe_session_id,
                            stripe_customer_id,
                            stripe_subscription_id,
                            plan,
                            amount,
                            status
                        ) VALUES($1, $2, $3, $4, $5, $6, $7)
                    `, [
                        user_id,
                        session.id,
                        session.customer,
                        session.subscription,
                        'monthly',
                        1399,
                        'completed'
                        
                    ]);
                    console.log(`Monthly pass activated for ${google_id} `);
                }
                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object as any;
                const customer = await stripe.customers.retrieve(subscription.customer) as any;

                await pool.query(`
                    UPDATE users
                    SET subscription_type = 'Free'
                    WHERE email = $1
                `, [customer.email]);

                console.log("subscription cancelled for: ", customer.email);
                break;
            } 
            case "invoice.payment_failed" : {
                const invoice = event.data.object as any;
                //Send email to user to update card
                break;
            }
            case "customer.subscription.updated" : {
                const subscription = event.data.object as any;

                if(subscription.status === "past_due") {
                    console.log(`Subscription past due for customer ${subscription.customer}`)
                }
                break;
            }
            default:
                console.log("Unhandled event");
        }
        res.json({received: true});
    } catch(err) {
        console.error("Webhook handler:", err);
        res.status(500).json({error: "Webhook handler error"});
    }
})

app.use(express.json());

//Allows application to track a user of the app, and store user specific data that presists across requests
app.use(session({
    secret: process.env.SESSION_SECRET as string, // replace later
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000
    } // set to true later?
}));

app.use(passport.initialize());
app.use(passport.session());

//What minimum information do I need for this user ot find them later?
passport.serializeUser((user: Express.User, done) => {
    //console.log("order");
    //console.log("user we got is", user)
   
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



passport.use(
    new GoogleStrategy.Strategy(
        {
            clientID: process.env.CLIENT_ID as string,
            clientSecret: process.env.CLIENT_SECRET as string,
            callbackURL: `${process.env.BACKEND_URL}/auth/google/cb`
            //`https:localhost:5050/auth/google/cb`
        }, async function(token, refreshToken, profile, done) {
            try {
                let profilePictureTemp = profile._json["picture"] as string

                //The callback to searlizeUser function
                const user : AppUser = {
                    google_id: profile.id,
                    display_name : profile.displayName,
                    email: profile.emails?.[0].value as string,
                    profile_picture: profilePictureTemp,
                    subscription_type: SubscriptionType.Free,
                    export_count: 0
                }

                //POSTGRES Logic Here
                let app_user = await pool.query(`SELECT * FROM users WHERE google_id = $1`, [profile.id]);

                if(app_user.rowCount! > 0) {
                    //user already in DB
                    //app_user = app_user.rows[0];
                    //console.log('User in Google Strategy:', app_user); 
                    const existingUser = await pool.query(
                        `UPDATE users SET last_login = NOW() WHERE google_id = $1 RETURNING *`, [user.google_id]
                    );
                    return done(null, existingUser.rows[0]);

                } else {
                    //User is not in DB, insert them in
                    const newUser = await pool.query(
                        `INSERT INTO users (google_id, email, display_name, subscription_type, profile_picture, created_at, last_login, export_count) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6) RETURNING *`, [
                            user.google_id, user.email, user.display_name,  user.subscription_type, user.profile_picture, 0
                        ]
                    );
                    app_user = newUser.rows[0];
                }
                //console.log(profile);
                return done(null, app_user);

                //google returns a bunch of stuff
                //determine the user
            } catch(err) {
                console.error(err, " Problem with google strategy.");
                return done(err, undefined)
            }


            }
        )
    )




router.get("/auth/google", passport.authenticate("google", {scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"]}));

router.get("/auth/google/cb", passport.authenticate("google", {failureRedirect: "/auth/failure"}), (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/editor` || "http://localhost:5173/editor");
    //"http://localhost:5173/editor"

    
})

router.get("/auth/failure", (req, res) => {
    res.send("Authentication Failed");
    //redirect back to home
    res.redirect( process.env.FRONTEND_URL || "http://localhost:5173");
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

router.post("/api/cancel-subscription", async function(req, res) {
    try {

        if(!req.user) {
            res.status(401).json({error: "Not authenticated"});
        }

        const user = req.user as any;

        const userResult = await pool.query(
            `
                SELECT subscription_type
                FROM users
                WHERE google_id = $1
            `, [user.google_id]
        );

        if(userResult.rows.length === 0) {
            return res.status(404).json({error: "User not found"});

        }

        const subscriptionType = userResult.rows[0].subscription_type;

        if(subscriptionType === "Weekend") {
            return res.json({
                message: "Weekend warrior pass will automatically expire after 48 hours. No action needed.",
                auto_expire: true
            });
        }

        if(subscriptionType === "Monthly") {
            const paymentResult = await pool.query(
                `
                SELECT stripe_subscription_id
                FROM payments
                WHERE user_id = (SELECT user_id FROM users WHERE google_id = $1)
                AND stripe_subscription_id IS NOT NULL
                ORDER BY created_at DESC
                LIMIT 1
                
                `, [user.google_id]
            )

            if(paymentResult.rows[0].length === 0) {
                return res.status(404).json({ error: "No active subscription found" });

            }

            const stripeSubscriptionID = paymentResult.rows[0].stripe_subscription_id;

            await stripe.subscriptions.update(stripeSubscriptionID, {
                cancel_at_period_end: true
            });

            return res.json({
                success:true,
                message: "Subscirption will cancel at the end of your billing period"
            });
        }

        // User is Free tier
        return res.json({ 
            message: "You don't have an active subscription to cancel"
        });

    } catch(err) {
        console.error("Error fetch stripe customer info");
        return;
    }
})

router.get("/api/userdata", async function (req, res) {
    try {
        if(!req.user) {
            res.status(401).json({error: "Not authenticated"});
        }

        const user = req.user as any;

        const result = await pool.query(
            `
            SELECT 
                email,
                display_name,
                subscription_type,
                export_count,
                last_export
            FROM users
            WHERE google_id = $1
            `, [user.google_id]
        );

        const userEmail = result.rows[0].email;
        const userDisplayName = result.rows[0].display_name;
        const userSubscriptionType = result.rows[0].subscription_type;
        const userExportCount = result.rows[0].export_count;
        const lastExport = result.rows[0].last_export;
        //console.log(lastExport);

       // const canTakeMoreScreenShots = 

        res.json({
            user_email : userEmail,
            user_display_name : userDisplayName,
            subscription_type : userSubscriptionType,
            export_count : userExportCount,
            last_export : lastExport
        });

    } catch(err) {
        console.error("Error fetch last export");
        return;
    }
})

router.post("/api/export", async function(req, res) {
    try {
        if(!req.user) {
            return res.status(401).json({error: "Not authenticated"});
        }

        //user lives in the google session
        const user = req.user as any;

        const result = await pool.query(`
            UPDATE users
            SET 
                export_count = export_count + 1,
                last_export = NOW()
            WHERE google_id = $1
            RETURNING 
                export_count, 
                last_export
        `,[user.google_id]);

        if(result.rows.length === 0) {
            return res.status(404).json({error: "User not found"});
        }

        res.json({
                success: true,
                export_count: result.rows[0].export_count,
                last_export : result.rows[0].last_export
        });



    } catch(err) {
        console.error("Export count update error: ", err);
        res.status(500).json({error: "failed to update export count"});

    }



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


//Stripe Routes
router.post("/api/create-checkout-session", async function(req, res) {
    //console.log(req.headers);

    try {

        if(!req.user) {
            return res.status(401).json({error:"Not authenticated"});
        }

        const user = req.user as any;
        const {plan} = req.body;
        let priceData : any;
        let mode : "payment" | "subscription";
        console.log("Plan is: ", plan);

        if(plan === "weekend" ) {
            mode = "payment";
            priceData = {
                currency: "usd",
                unit_amount: 599,
                product_data: {
                    name: "Weekend Warrior Pass",
                    description: "48-hour unlimited access"
                }
            }
        } else {
            mode = "subscription";
            priceData = {
                currency: "usd",
                unit_amount : 1399,
                recurring: {
                    interval: "month"
                },
                product_data: {
                    name: "Monthly Pass",
                    description: "Unlimited access"
                }
                
            }
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: mode,
            line_items: [{
                price_data: priceData,
                quantity:1
            }],
            customer_email: user.email,
            client_reference_id: user.google_id,
            metadata: {
                google_id: user.google_id,
                plan: plan
            },
            success_url: `${process.env.FRONTEND_URL}/purchase-success`|| "http://localhost:5173/purchase-success",
            cancel_url: process.env.FRONTEND_URL || "http://localhost:5173/"

        });

        //update database here?

        res.json({url: session.url});
    } catch(err) {
        console.error("Stripe session:", err);
        res.status(500).json();
    }
    

    
});




//creates base route, if we had a router.get("/editor"), route will be /editor
//app.use("/api") -> router.get("/editor") -> /api/editor
app.use("/", router);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});




