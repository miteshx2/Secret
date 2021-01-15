require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ejs = require('ejs')
const bcrypt = require('bcrypt')
const saltRounds = 10;

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema =  new mongoose.Schema ({
    email: String,
    password: String
});

//change after L2 encryption : added ...new mongoose.Schema({})... 



const User = new mongoose.model("User", userSchema);

app.get("/", (req, res)=>{
    res.render("home");
})

app.route("/register")
.get((req, res)=>{
    res.render("register");
})

.post((req, res)=>{

    bcrypt.hash(req.body.password, saltRounds, (err, hash)=>{

        const newUser = new User({
            email: req.body.username,
            password: hash
        })
    
        newUser.save((err)=>{
            if(err){
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });
    
});



app.route("/login")
.get((req, res) => {
    res.render("login")
})

.post((req, res) => {

    User.findOne({email: req.body.username}, (err, foundUser)=>{
        if(!err){
            bcrypt.compare(req.body.password, foundUser.password, (err, result) => {
                if(result === true){
                    res.render("secrets")
                }
            })
        }
        else {
            console.log(err);
        }
    })
});


app.listen(3000, ()=>{
    console.log("server running on port 3000.");
})