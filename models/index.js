// Exporting an object containing all of our models
var Note = require("./Note")
var Article = require("./Article")
module.exports = {
    Article: Article,
    Note: Note
}