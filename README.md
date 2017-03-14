# BitScoop Alexa Demo

You can build with any API on the BitScoop platform which makes being a software developer more interesting than ever.
In this demo, we demonstrate how to build an Alexa “skill” to make Alexa devices part of the DevOps team.

The Alexa skill we'll be making relies on BitScoop, Amazon Alexa, and Amazon Lambda.

At the end of this tutorial, you'll be able to ask Alexa, “Ops Buddy, how is the stack doing?” and get results pertaining to your stack.

For example:

(From Google Analytics)
*There were 523 visitors to the site today, and 201 were new visitors.*

(From StatusCake)
*There have been [no, X] outage alerts since yesterday.*

(From Postman)
*The API status check has [passed/failed].*

(From GitHub)
*There are [no, X] pending pull requests for API maps.*


## Add API Maps to BitScoop

To quickly get started with what you'll need on BitScoop, you can add the following API Maps using the buttons below.
Note that setting up all of these services is not required, the Amazon Lambda function that powers the Alexa Skill will adjust automatically based on how you configure it.
So you only need to add the ones to BitScoop that you want to try for yourself.
Make sure to substitute the values for the API keys, client IDs, and client secrets where appropriate.

| API Map   | File Name       |                                                                                                                                                                                                                                    |
|----------------|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Postman Pro API Monitors | postman.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-alexa-demo/master/fixtures/maps/postman.json) |
| Google Analytics Data | google_analytics.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-alexa-demo/master/fixtures/maps/google.json) |
| StatusCake Health Alerts | statuscake.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-alexa-demo/master/fixtures/maps/statuscake.json) |
| GitHub Issues | github.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-alexa-demo/master/fixtures/maps/github.json) |
