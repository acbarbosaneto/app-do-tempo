const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
const ejs = require("ejs")

const app = express()

let cityName=""
let tempNum = "";
let tempIcon = "";
let description = "";
let feelsLike = "";
const date = new Date()
const year = date.getFullYear();


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public/"));
app.set('view-engine', 'ejs');


app.get("/", function(req, res){
    res.render('home',{year:year})
})


app.get("/query", (req,res) =>{
    res.render('query',{tempNum:tempNum, tempIcon:tempIcon, cityName:cityName,description:description, feelsLike:feelsLike, year:year})
})

app.get("/error", (req,res) =>{
    res.render('error',{year:year})
})


app.post("/", function(req, res){
    const city = req.body.cityName
    const unit = "metric"
    const apiKey = "fe9100e0f633476eccc732fdac884141"
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unit + "&appid=" + apiKey
    
    https.get(url, function(response){
        if(response.statusCode===200){
        response.on("data", function(data){
            const dataTempo = JSON.parse(data)
            console.log(dataTempo)
            cityName = city + ", " + dataTempo.sys.country
            tempNum = dataTempo.main.temp
            description = dataTempo.weather[0].description
            feelsLike = dataTempo.main.feels_like
            tempIcon = "../images/" + dataTempo.weather[0].icon  + ".svg"
            console.log(tempIcon)
            res.redirect("/query")   
        })
        }else{
            res.redirect("/error") 
        }
    })

})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server running at port 3000.")
})
