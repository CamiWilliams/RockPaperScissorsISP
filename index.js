// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk');
const ACTIONS = [
    'rock',
    'paper',
    'scissors',
    'spock',
    'lizard'
];


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Welcome to Rock Paper Scissors. Lucky you. What do you draw?';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const GameIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GameIntent';
    },
    async handle(handlerInput) {
        let speechText = '';
        let reprompt = 'What action would you like to play next? ';
        
        const actionRaw = handlerInput.requestEnvelope.request.intent.slots.action.value;
        const action = actionRaw.toLowerCase();
        if (action === 'lizard' || action === 'spock') {
            const locale = handlerInput.requestEnvelope.request.locale;
            const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
            
            const res = await ms.getInSkillProducts(locale);
            const product = res.inSkillProducts.filter(record => record.referenceName === 'spock_lizard_pack');
            
            if (!isEntitled(product)) {
                const upsellMessage = "You don't currently own the spock lizard action pack. Want to learn more about it?";
                                
                return handlerInput.responseBuilder
                  .addDirective({
                    'type': 'Connections.SendRequest',
                    'name': 'Upsell',
                    'payload': {
                      'InSkillProduct': {
                        'productId': product[0].productId
                      },
                      'upsellMessage': upsellMessage
                    },
                    'token': 'correlationToken'
                  })
                  .getResponse();
            }
        }
        const alexaAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length - 1)];
        const combo = action + alexaAction;
        
        switch (combo) {
            case 'rockrock':
                speechText += "You played rock, and I played rock. It is a tie! ";
                break;
            case 'rockspock':
                speechText += "You played rock, and I played spock. I win! ";
                break;
            case 'rocklizard':
                speechText += "You played rock, and I played lizard. You win! ";
                break;
            case 'rockpaper':
                speechText += "You played rock, and I played paper. I win! ";
                break;
            case 'rockscissors':
                speechText += "You played rock, and I played scissors. You win! ";
                break;
            case 'paperrock':
                speechText += "You played paper, and I played rock. You win! ";
                break;
            case 'paperspock':
                speechText += "You played paper, and I played spock. You win! ";
                break;
            case 'paperlizard':
                speechText += "You played paper, and I played lizard. I win! ";
                break;
            case 'paperscissors':
                speechText += "You played paper, and I played scissors. I win! ";
                break;
            case 'paperpaper':
                speechText += "You played paper, and I played paper. It is a tie! ";
                break;
            case 'scissorsrock':
                speechText += "You played scissors, and I played rock. I win! ";
                break;
            case 'scissorsspock':
                speechText += "You played scissors, and I played spock. I win! ";
                break;
            case 'scissorslizard':
                speechText += "You played scissors, and I played lizard. You win! ";
                break;
            case 'scissorspaper':
                speechText += "You played scissors, and I played paper. You win! ";
                break;
            case 'spockscissors':
                speechText += "You played spock, and I played scissors. You win! ";
                break;
            case 'lizardscissors':
                speechText += "You played lizard, and I played scissors. I win! ";
                break;
            case 'spockpaper':
                speechText += "You played spock, and I played paper. I win! ";
                break;
            case 'lizardpaper':
                speechText += "You played lizard, and I played paper. You win! ";
                break;
            case 'spockrock':
                speechText += "You played spock, and I played rock. You win! ";
                break;
            case 'lizardrock':
                speechText += "You played lizard, and I played rock. I win! ";
                break;
            case 'spockspock':
                speechText += "You played spock, and I played spock. It is a tie! ";
                break;
            case 'lizardlizard':
                speechText += "You played lizard, and I played lizard. It is a tie! ";
                break;
            default:
                break;
        }
        
        return handlerInput.responseBuilder
            .speak(speechText + reprompt)
            .reprompt(reprompt)
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const UpsellResponseHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "Connections.Response" &&
        handlerInput.requestEnvelope.request.name === "Upsell";
  },
  handle(handlerInput) {
    if (handlerInput.requestEnvelope.request.status.code === 200) {
      let speechOutput = "";
      let reprompt = "";

      if (handlerInput.requestEnvelope.request.payload.purchaseResult === 'ACCEPTED') {
        speechOutput = "You can now use spock lizard in your game! ";
        reprompt = "What action would you like to use? ";
      } else if (handlerInput.requestEnvelope.request.payload.purchaseResult === 'DECLINED') {
        speechOutput = "Okay. I can't offer you the spock lizard pack at any time. ";
        reprompt = "What action would you like to use? ";
      }

      return handlerInput.responseBuilder
        .speak(speechOutput + reprompt)
        .reprompt(reprompt)
        .getResponse();
    } else {
      // Something has failed with the connection.
      console.log('Connections.Response indicated failure. error:' + handlerInput.requestEnvelope.request.status.message); 
      return handlerInput.responseBuilder
        .speak("There was an error handling your purchase request. Please try again or contact us for help.")
        .getResponse();
    }
  }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.standard()
    .addRequestHandlers(
        LaunchRequestHandler,
        GameIntentHandler,
        UpsellResponseHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
    
function isProduct(product) {
  return product && product.length > 0;
}
function isEntitled(product) {
  return isProduct(product) && product[0].entitled === "ENTITLED";
}
