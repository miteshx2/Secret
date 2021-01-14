const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ejs = require('ejs')
const encrypt = require('mongoose-encryption')

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

const secret = "THisisnotaSecret.";

userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});
//This should done before creating model..

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res)=>{
    res.render("home");
})

app.route("/register")
.get((req, res)=>{
    res.render("register");
})

.post((req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save((err)=>{
        if(err){
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});



app.route("/login")
.get((req, res) => {
    res.render("login")
})

.post((req, res) => {

    const password = req.body.password;

    User.findOne({email: req.body.username}, (err, foundUser)=>{
        if(!err){
            if(foundUser){
                if(foundUser.password === password)
                {
                    res.render("secrets");
                }
                else {
                    console.log("Wrong Credentials");
                }
            }
        }
        else {
            console.log(err);
        }
    })
});


app.listen(3000, ()=>{
    console.log("server running on port 3000.");
})