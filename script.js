const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
const ejs = require("ejs")

const app = express()

let cityName=""
let tempNum = "";
let tempIcon = "";
let imageURL = "http://openweathermap.org/img/wn/"+ tempIcon + "@2x.png"

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))
app.set('view engine', 'ejs')


app.get("/", function(req, res){
    res.render('home')
})


app.get("/query", (req,res) =>{
    res.render('query',{tempNum:tempNum, imageURL:imageURL, cityName:cityName})
})

app.get("/error", (req,res) =>{
    res.render('error')
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
            cityName = city
            tempNum = dataTempo.main.temp
            tempIcon = dataTempo.weather[0].icon  
            imageURL = "http://openweathermap.org/img/wn/"+ tempIcon + "@2x.png"  
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
