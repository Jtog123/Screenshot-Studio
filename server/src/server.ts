
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import pg from "pg"
import passport from "passport"
import GoogleStrategy  from "passport-google-oauth20"

require('dotenv').config({path:"../.env"});
const PORT = 5050;

const app = express();


app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
}));

const router = express.Router();

app.use(express.json());


router.get("/", (req, res) => {
    res.json({message: "hello from the backend?"});
})

app.use("/", router);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});




