require("dotenv").config();
var spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var fs = require("fs");
var keys = require("./keys.js");

var spotify = new spotify(keys.spotify);

var command = process.argv[2];
var value = process.argv.slice(3).join(" ");
checkCommand();

function checkCommand() {
    if (command === "concert-this") {
        concert();
    }
    else if (command === "spotify-this-song") {
        song();
    }
    else if (command === "movie-this") {
        movie();
    }
    else if (command === "do-what-it-says") {
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                return console.log(error);
            }

            var dataArr = data.split(",");
            command = dataArr[0];
            value = dataArr[1];
            checkCommand();
        });
    }
}

function concert() {
    axios.get("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp")
        .then(function (response) {
            for (event in response.data) {
                console.log("EVENT NUMBER " + (parseInt(event) + 1));
                console.log("Name of venue: " + response.data[event].venue.name);
                console.log("Venue location: " + response.data[event].venue.city);
                console.log("Date of event: " + moment(response.data[event].datetime).format("MM/DD/YYYY"));
                console.log("-------------------------------------------------------")
            }
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

function song() {
    if (value === "") {
        value = "never gonna give you up";
    }

    spotify.search({ type: 'track', query: value }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("SONG INFO -");
        console.log("-----------------------------------------------------------");
        console.log("Artists:");
        for (artist in data.tracks.items[0].artists) {
            console.log((parseInt(artist) + 1) + ": " + data.tracks.items[0].artists[artist].name);
        }
        console.log("-----------------------------------------------------------");
        console.log("Song Name: ");
        console.log(data.tracks.items[0].name);
        console.log("-----------------------------------------------------------");
        console.log("Album: ");
        console.log(data.tracks.items[0].album.name);
        console.log("-----------------------------------------------------------");
        console.log("Spotify Link: ");
        console.log(data.tracks.items[0].external_urls.spotify);
        console.log("-----------------------------------------------------------");
    });
}

function movie() {
    if (value === "") {
        value = "Mr Nobody";
    }

    axios.get("http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=92a438ed")
        .then(function (response) {
            console.log("MOVIE INFO -");
            console.log("-----------------------------------------------------------");
            console.log("Movie Title: ");
            console.log(response.data.Title);
            console.log("-----------------------------------------------------------");
            console.log("Year of Release: ");
            console.log(response.data.Year);
            console.log("-----------------------------------------------------------");
            console.log("IMDb Rating: ");
            console.log(response.data.Ratings[0].Value);
            console.log("-----------------------------------------------------------");
            console.log("Rotten Tomatoes Rating: ");
            console.log(response.data.Ratings[1].Value);
            console.log("-----------------------------------------------------------");
            console.log("Country: ");
            console.log(response.data.Country);
            console.log("-----------------------------------------------------------");
            console.log("Language: ");
            console.log(response.data.Lanuage);
            console.log("-----------------------------------------------------------");
            console.log("Plot: ");
            console.log(response.data.Plot);
            console.log("-----------------------------------------------------------");
            console.log("Actors: ");
            console.log(response.data.Actors);
            console.log("-----------------------------------------------------------");
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}



