var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var PORT = 3000;

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/populatedb", { useNewUrlParser: true });




// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
});

//cheerio
const cheerio = require("cheerio")
const axios = require("axios")
var db = require("./models")
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.bbc.com/sport").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        // console.log(response.data)
        // Now, we grab every h2 within an article tag, and do the following:
        $("h3.gs-c-promo-heading__title").each(function (i, element) {
            console.log($(element).text())
            console.log($(element).parent().attr("href"))

            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(element).text()
            result.link = $(element).parent().attr("href")

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        })
        res.send("All Done")
    })








})
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
})