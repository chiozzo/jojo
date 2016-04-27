exports.handler = function (event, context) {


  /**
  Fake event to aid VS Intellisense
  var event = {
    "session": {
      "sessionId": "SessionId.6d4e188e-b612-4789-90ad-cb1930dc1602",
      "application": {
        "applicationId": "amzn1.echo-sdk-ams.app.7ebaaba2-fb0e-421f-9636-33b865d5dad9"
      },
      "user": {
        "userId": "amzn1.echo-sdk-account.AGMGPBWJBSQSZAMGG7G42VIG5VPEBT22RLJPJG6GK7TBBXNL5YEH6"
      },
      "new": true
    },
    "request": {
      "type": "IntentRequest",
      "requestId": "EdwRequestId.f3c485cd-094a-47c6-8185-a0d1b9d1cc41",
      "timestamp": "2016-04-23T16:33:29Z",
      "intent": {
        "name": "GetQuote",
        "slots": {
          "Quote": {
            "name": "Quote",
            "value": "fix it"
          }
        }
      },
      "locale": "en-US"
    },
    "version": "1.0"
  }
  **/



  try {
    console.log("event.session.application.applicationId="
      + event.session.application.applicationId);
    /*
        if (event.session.new) {
          onSessionStarted({
            requestId: event.request.requestId
          }, event.session);
        }
    */
    if (event.request.type === "LaunchRequest") {
      // onLaunch (request, session, callback(to build response)
      onLaunch(
        function callback(sessionAttributes, speechletResponse) {
          // info on the Context Object used in Node and/or AWS
          // http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
          context.succeed(buildResponse(sessionAttributes, speechletResponse));
        });
    } else if (event.request.type === "IntentRequest") {
      onIntent(event.request,
        function callback(sessionAttributes, speechletResponse) {
          context.succeed(buildResponse(sessionAttributes, speechletResponse));
      });
    } else if (event.request.type === "SessionEndedRequest") {

    }
  } catch (e) {
    context.fail("Exception: " + e);
  }

  function onLaunch(callback) {
    getWelcomeResponse(callback);
  }
  function onIntent(eventRequest, callback) {
    var intent = eventRequest.intent;
    var intentName = intent.name;

    switch (intentName) {
      case "SetNeedMet": setNeedsMetToday(intent, callback); // NEED TO DEFINE THIS FUNCTION
    }
  }

  function setNeedsMetToday(intent, callback) {
    var sessionAttributes = {}; // WHAT THE F*CK ARE SESSION ATTRIBUTES?
      //They are variables that you would like to save for the session, dummy. I'll be using Firebase as well for cross session persistence.

    var cardTitle = "What JoJo needs:";
    var needGivenSlot = intent.slots.Need;
    var repromptVoiceOutput = "Apologies. ";
    repromptVoiceOutput += "I was letting my mind wander and didn't hear you.";
    repromptVoiceOutput += "What are you giving JoJo?";
    var shouldEndSession = false;
    var voiceOutput = "";
    var cardBody = "";

    if (needGivenSlot) {
      var needGiven = needGivenSlot.value;
      voiceOutput = "OK, You're giving JoJo ";
      voiceOutput += needGiven;
      voiceOutput += ". I'll make a note of it.";
    } else {
      voiceOutput = "If you tell me what you're giving JoJo then I'll make a note of it."
    }

    var builtSpeechletResponse = buildSpeechletResponse(cardTitle, cardBody, voiceOutput, repromptVoiceOutput, shouldEndSession)

    callback(sessionAttributes, builtSpeechletResponse);

  }

  function getWelcomeResponse(callback) {
    var sessionAttributes = {};
    var cardTitle = "Taking care of JoJo";

    var voiceOutput = "<speak>";
    voiceOutput += "What does JoJo need?";
    voiceOutput += "</speak>"

    var cardBody = "";

    var repromptVoiceOutput = "<speak>"
    repromptVoiceOutput += "Please tell me what you're doing to take care of JoJo.";
    repromptVoiceOutput += "You can say ";
    repromptVoiceOutput += "'I'm giving JoJo food' or ";
    repromptVoiceOutput += "'I'm giving JoJo medicine' or ";
    repromptVoiceOutput += "'I'm giving JoJo butt punches'.";
    repromptVoiceOutput += "</speak>"

    var shouldEndSession = false;

    var builtSpeechletResponse = buildSpeechletResponse(cardTitle, cardBody, voiceOutput, repromptVoiceOutput, shouldEndSession);

    callback(sessionAttributes, builtSpeechletResponse);
  }




  /*
  These build functions are triggered for every event request type
  */
  function buildSpeechletResponse(cardTitle, cardBody, voiceOutput, repromptVoiceOutput, shouldEndSession) {
    return {
      outputSpeech: {
        type: "SSML",
        ssml: voiceOutput
      },
      card: {
        type: "Simple",
        title: "SessionSpeechlet - " + cardTitle,
        content: "SessionSpeechlet - " + cardBody
      },
      reprompt: {
        outputSpeech: {
          type: "SSML",
          ssml: repromptVoiceOutput
        }
      },
      shouldEndSession: shouldEndSession
    };
  }

  function buildResponse(sessionAttributes, speechletResponse) {
    return {
      version: "1.0",
      sessionAttributes: sessionAttributes,
      response: speechletResponse
    };
  }
}