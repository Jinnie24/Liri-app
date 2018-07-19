var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var fs = require('fs');
var request = require('request');

var command = process.argv[2];
var param = process.argv[3];
var song = "The Sign";
var movie = "Mr. Nobody."
var tweetArr = [];

function getCommand(command, param){

	switch(command){

        case 'my-tweets':
            getTweets(); 
            break;
        case 'spotify-this-song':
            if(param === undefined){
                param = song;
            }     
            getSong(param); 
            break;
        case 'movie-this':
            if(param === undefined){
                param = movie;
            }    
            getMovie(param); 
            break;
        case 'do-what-it-says':
            doList(); 
            break;
        default: 
            console.log("Invalid command. Please type any of the following commnds: my-tweets spotify-this-song movie-this or do-what-it-says");
        }

        

}
function getTweets(){

	var params = {screen_name: 'Jinnie10747761', count: 20, exclude_replies:true, trim_user:true};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
				if (error) {
                    console.log("---------------------------");
                    console.log(error);
                    console.log("---------------------------");
				}
				else{
                    tweetArr = tweets;

					for(i=0; i<tweetArr.length; i++){
                        console.log("---------------------------");
                        console.log("Tweet posted at: " + tweetArr[i].created_at);
                        console.log("Jinnie10747761: " + tweetArr[i].text);
                        console.log("---------------------------");
					}
				}
	});

}

function getSong(newSong){

	spotify.search({ type: 'track', query: newSong}, function(error, data) {
    if (error) {
        console.log("---------------------------");
        console.log(error);
        console.log("---------------------------");
        return;
    }

    var newSong = data.tracks.items[0];
    console.log("Artist(s) :");
    for(i=0; i<newSong.artists.length; i++){
    	console.log(newSong.artists[i].name);
    }
    console.log("");
    console.log("Song Name :");
    console.log(newSong.name);
    console.log("");
    console.log("Preview Link: ");
    console.log(newSong.preview_url);
    console.log("");
    console.log("Album: ");
    console.log(newSong.album.name);
    console.log("---------------------------");
	});

}
 function getMovie(movieName) {
    
    request("http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy", function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var movieObj = JSON.parse(body);
            console.log("Title: "+ movieObj.Title);
            console.log("Year: "+ movieObj.Year);
            console.log("IMDB Rating: "+ movieObj.imdbRating);
            
            console.log("Rotten Tomatoes Rating: " + movieObj.Ratings[1]["Value"]);
            console.log("Country: "+ movieObj.Country);
            console.log("Language: "+ movieObj.Language);
            console.log("Plot: "+ movieObj.Plot);
            console.log("Actors: "+ movieObj.Actors);
        }
    });
 }

 function doList(){
	fs.readFile("random.txt", "utf8", function(error, data){

		if (error){ 
			return console.log(error);
		}

		var randomArr = data.split(',');

		getCommand(randomArr[0], randomArr[1]);
	});
}

 getCommand(command, param);