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

    } else if (event.request.type === "SessionEndedRequest") {

    }
  } catch (e) {
    context.fail("Exception: " + e);
  }

  function onLaunch(callback) {
    getWelcomeResponse(callback);
  }

  function getWelcomeResponse(callback) {
    var sessionAttributes = {};
    var cardTitle = "Taking care of JoJo";
    var voiceOutput = "What does JoJo need?";

    var repromptVoiceOutput = "Please tell me what you're doing to take care of JoJo.";
    repromptVoiceOutput += "You can say ";
    repromptVoiceOutput += "'I'm giving JoJo food' or ";
    repromptVoiceOutput += "'I'm giving JoJo medicine' or ";
    repromptVoiceOutput += "'I'm giving JoJo butt punches'.";
    var shouldEndSession = false;

    var builtSpeechletResponse = buildSpeechletResponse(cardTitle, voiceOutput, repromptVoiceOutput, shouldEndSession);

    callback(sessionAttributes, builtSpeechletResponse);
  }




  /*
  These build functions are triggered for every event request type
  */
  function buildSpeechletResponse(cardTitle, voiceOutput, repromptVoiceOutput, shouldEndSession) {
    return {
      outputSpeech: {
        type: "PlainText",
        text: voiceOutput
      },
      card: {
        type: "Simple",
        title: "SessionSpeechlet - " + cardTitle,
        content: "SessionSpeechlet - " + voiceOutput
      },
      reprompt: {
        outputSpeech: {
          type: "PlainText",
          text: repromptVoiceOutput
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