var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: "KDGCPtQT4In2pT7aKu3q7Ezm5",
    consumer_secret: "3fpELpk8jG8Y71z5EvmMPmU10uPDu0E3jizXxPjaJpaFRzjemp",
    access_token_key: "227676003-rKPoK58HU6JBWuiKDtfnKjRhxNC43TPF0KTIewE6",
    access_token_secret: "XTUmsDB4PNldXMJ6BEiFJxt08JmOMztV1omfoI5AQ7kR9",
});

client.stream('statuses/filter', {track: 'oncountry'},  function(stream){
    stream.on('data', function(tweet) {
        console.log(tweet.text);
    });

    stream.on('error', function(error) {
        console.log(error);
    });
});