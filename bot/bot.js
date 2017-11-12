// Our Twitter library
var Twit = require('twit');

const fs = require('fs');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// This is the URL of a search for the latest tweets on the '#mediaarts' hashtag.
var mediaArtsSearch = {q: "@EmojifyOfficial", count: 10, result_type: "recent"};

// This function finds the latest tweet with the #mediaarts hashtag, and retweets it.
function retweetLatest() {
	T.get('search/tweets', mediaArtsSearch, function (error, data) {
	  // log out any errors and responses
	  console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		//var tweetId = data.statuses[0].id_str;
		var tweetId = {
			status: '@' + data.statuses[0].user.screen_name + " " + 'https://emojify.github.io/?' + data.statuses[0].entities.media[0].media_url,
			in_reply_to_status_id: data.statuses[0].id_str,
			auto_populate_reply_metadata: true
		}

		console.log(data.statuses[0]);
		//fs.appendFile('image-link.txt', data.statuses[0].entities.media[0].media_url);
		// ...and then we tell Twitter we want to retweet it!
		T.post('statuses/update', tweetId, function (error, tweet, response) {
			if (response) {
				console.log('Success! Check your bot, it should have retweeted something.')
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})
    //
		// T.post('statuses/rew', tweetId, function (error, tweet, response) {
		// 	if (response) {
		// 		console.log('Success! Check your bot, it should have retweeted something.')
		// 	}
		// 	// If there was an error with our Twitter call, we print it out here.
		// 	if (error) {
		// 		console.log('There was an error with Twitter:', error);
		// 	}
		// })
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

// Try to retweet something as soon as we run the program...
retweetLatest();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 5000);
