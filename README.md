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

## Create/configure accounts with Postman, Google, and StatusCake

You need to create a BitScoop account via (https://bitscoop.com/signup) as well as an AWS account.
You will need to create a Postman Pro account, a Google account, and/or a StatusCake account to use those services in this demo.
For the sake of brevity we will not cover the specifics here, but you can find step-by-step instructions in our blog post about this demo at <INSERT_LINK_HERE>.

## Add API Maps to BitScoop

To quickly get started with what you'll need on BitScoop, you can add the following API Maps using the buttons below.
Note that you do not need to use all of these services for the demo to run, as the Amazon Lambda function that powers the Alexa Skill will adjust automatically based on how you configure it.
So you only need to add the ones to BitScoop that you want to try for yourself.
Make sure to substitute the values for the API keys, client IDs, and client secrets where appropriate.

| API Map   | File Name       |                                                                                                                                                                                                                                    |
|----------------|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Postman Pro API Monitors | postman.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-alexa-demo/master/fixtures/maps/postman.json) |
| Google Analytics Data | google_analytics.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-alexa-demo/master/fixtures/maps/google.json) |
| StatusCake Health Alerts | statuscake.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-alexa-demo/master/fixtures/maps/statuscake.json) |
| GitHub Issues | github.json | [![Add to BitScoop](https://assets.bitscoop.com/github/AddBitScoopXSmall.png)](https://bitscoop.com/maps/create?source=https://raw.githubusercontent.com/bitscooplabs/bitscoop-alexa-demo/master/fixtures/maps/github.json) |

## Authorize Google Analytics (only if using that service)

Make a POST request to the Connection URL shown on the Details page for the Google Analytics map; it will be in the form https://api.bitscoop.com/<map_id>/connections.
The response body will contain two fields, 'redirectUrl' and 'id'.
Save 'id', which is the ID of the new connection, for later, and go to the redirectUrl in a browser.
Google should request authorization for the Analytics API for one of your Google accounts.
If successful, you should be able to make calls via that map with the header 'X-Connection-Id: <connection_id>'.

## Deploy this project to Amazon Lambda

If you want to build this project yourself, you will need to have node.js and `npm` installed on your machine so that you can install the demo’s dependencies before uploading the code to Lambda.
From the top level of this directory, run

```
npm install
```

to install all of the dependencies, then go to the src/ directory and again run

```
npm install
```

Finally go back to the top level and run the command

```
grunt build
```

to zip the project to dist/bitscoop-alexa-demo-<version>.zip

Alternatively, you can download a pre-zipped copy of the code at https://cdn.bitscoop.com/bitscoop-alexa-demo/0.1.0/bitscoop-alexa-demo-0.1.0.zip.
The SHA-256 hash for this file is https://cdn.bitscoop.com/bitscoop-alexa-demo/0.1.0/bitscoop-alexa-demo-0.1.0.zip.sha256.

Whichever way you chose, you need to upload this code to Lambda.

Go to (https://console.aws.amazon.com/lambda/home) and click ‘Create a Lambda function’.

For the blueprint select ‘Blank Function’. For the trigger, click the gray dashed box and select ‘Alexa Skills Kit’. Name the function whatever you want and set the runtime to Node.js 6.10.

For Code Entry Type click the dropdown and select ‘Upload a .ZIP file’, then click on the Upload button that appears and then navigate to and select the bitscoop-alexa-demo-<version>.zip file. The Handler should be ‘index.handler’.

You will need to add several Environment Variables, with the number depending on how many services you wish to run. You will always need to add the following variables:

* BITSCOOP_API_KEY (obtainable at https://bitscoop.com/keys)
* ALEXA_APP_ID (you will fill this in later)

If you are getting data from GitHub, you will need to add these:

* GITHUB_MAP_ID (The ID of the BitScoop API map you created for GitHub)
* GITHUB_USER (the username that owns the repo you’re interested in)
* GITHUB_REPO (the name of the repo you’re interested in)

If you are getting data from Google Analytics, you will need to add these:

* GOOGLE_MAP_ID (The ID of the BitScoop API map you created for Google)
* GOOGLE_GA_VIEW_ID (the ID of the View you are monitoring)
* GOOGLE_CONNECTION_ID (the ID of the BitScoop Connection you created to the Google Analytics API Map)

If you are getting data from StatusCake, you will need to add these:

* STATUSCAKE_MAP_ID (The ID of the BitScoop API map you created for StatusCake)
* STATUSCAKE_TEST_ID (the ID of the Test you are monitoring)

If you are getting data from Postman, you will need to add these:

* POSTMAN_MAP_ID (The ID of the BitScoop API map you created for Postman)
* POSTMAN_MONITOR_ID (the ID of the Monitor you are running)

Select Next.

Create a new custom role and use the default policy for lambda_basic_execution, which should be

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

Select Next.

Open the Advanced Settings accordion. You’ll probably want to set the Timeout to 10 seconds. Make sure that VPC is set to ‘No VPC’. Hit next and you’ll be taken to a review screen, and then select ‘Create Function’ at the very bottom of the page.

If you did not set a trigger earlier, go to the details for the function and click the tab ‘Triggers’. Click ‘Add Trigger’, click on the dashed gray box, then select ‘Alexa Skills Kit’ and then click ‘Submit’.

In the upper-right-hand corner of the screen, just below the AWS toolbar, you should see:

```
ARN - arn:aws:lambda:<region>:<id>:function:<function name>
```

You will need this ARN for the next step.

## Create the Alexa Skill

Go to (https://developer.amazon.com/edw/home.html#/skills) and click ‘Add a New Skill’.

Pick ‘Custom Interaction’ for the Skill Type, enter ‘Ops Buddy’ for Name and Interaction Name, and click Save. Click on Interaction Model on the left-hand side. Under Intent Schema enter:

```
{
  “intents”: [
    {
      “intent”: “AboutIntent”
    },
    {
      “intent”: “StackIntent”
    }
  ]
}
```

and under Sample Utterances enter:

```
StackIntent how's the stack doing
StackIntent how is the stack doing
StackIntent how is the stack doing today
```

You can add more utterances if you wish; the key thing is that they must start with ‘StackIntent’ to call the right Intent in the Lambda function. Click Save when you’re done.

Next click on Configuration. Service Endpoint Type should be ‘AWS Lambda ARN’, and the geographical region should be whichever is closest to you. Paste the ARN from the end of Step 3 into the text box for the region you selected. Make sure ‘account linking’ is set to No and click ‘Save’. Click on Test and enable test mode if you wish. Finally, go to Privacy and Compliance and select ‘No’ for the three radio selections, then Save.

If everything has gone right, your skill should be ready to go. The following sections explain how to test the Lambda function and the Alexa Skill.

## Testing the Lambda function

Click the ‘Actions’ dropdown next to ‘Test’ and select ‘Configure Test Event’.
Select the template ‘Alexa Intent - Recipe’.
Copy the Alexa Skill ID into `session.application.applicationId` and `context.System.application.applicationId`, as well as changing `request.intent.name` to ‘StackIntent’.
Click Save and Test and the function should run.

## Testing the Alexa Skill

Go to the ‘Test’ tab in the Alexa Skill and enable testing if you have not already done so.
In ‘Enter Utterance’ insert an utterance that you defined when you created the Skill.
Click ‘Ask <Skill name>’ to make a test request.
