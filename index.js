var Alexa = require("ask-sdk");
// var OpenAI = require("openai");
//const myDocument = require('./main.json');
//const myDocument1 = require('./main1.json');
var mlang = "";
var mlang1 = "";
var mlang2 = "";
var mwordfirst = "";
var mwordmiddle = "";
var mwordlast = "";
const {
  FunctionDeclarationSchemaType,
  HarmBlockThreshold,
  HarmCategory,
  VertexAI
} = require('@google-cloud/vertexai');
const project = 'ai-6435a';
const location = 'us-east4';
const textModel =  'gemini-1.0-pro';
//const textModel =  'gemini-pro';
const visionModel = 'gemini-1.0-pro-vision';

const {JWT} = require('google-auth-library');
const keys = require('./gookeys.json');

// async function main() {
 // const client = new JWT({
const client = {
credentials: {
    client_email: keys.client_email,
    private_key: keys.private_key,
   // scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  }
  };
//  const url = `https://dns.googleapis.com/dns/v1/projects/${keys.project_id}`;
 // const res = await client.request({url});
 // console.log(res.data);
//}

// main().catch(console.error);
const vertexAI = new VertexAI({project: project, location: location, googleAuthOptions: client});

// Instantiate Gemini models
const generativeModel = vertexAI.getGenerativeModel({
    model: textModel,
    // The following parameters are optional
    // They can also be passed to individual content generation requests
    safetySettings: [{category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE}],
generationConfig: {maxOutputTokens: 300,
    "temperature": 0.2,
    "topP": 0.8,
    "topK": 40
},
  });

const generativeVisionModel = vertexAI.getGenerativeModel({
    model: visionModel,
});

const generativeModelPreview = vertexAI.preview.getGenerativeModel({
    model: textModel,
});

const AWS = require('aws-sdk');
//var s3 = new AWS.S3({accessKeyId: process.env.AWS_KEY});
//console.log("api key",s3.config.accessKeyId);
var chatCompletion = {};
//const openai = new OpenAI({
//    apiKey: s3.config.accessKeyId,
//});
var mword = "";
var mword1 = "";
var msuccess = "nok";
const RequestLog = {
    process(handlerInput) {
        console.log(`REQUEST ENVELOPE = ${JSON.stringify(handlerInput.requestEnvelope)}`);
    },
};

const ResponseLog = {
    process(handlerInput) {
        console.log(`RESPONSE BUILDER = ${JSON.stringify(handlerInput)}`);
    },
};
const LaunchHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest'  ;
    },
    handle(handlerInput) {


            return handlerInput.responseBuilder
            .speak("Welcome to Suggest a movie skill. Begin the sentence with 'Say a movie' or 'Tell a movie' followed by the characters,and/or genre and/or the movie rating. You can say 'Say a kid frindly movie in cartoon genre with a 'P.G' rating' or 'Tell a female lead movie in romantic genre with a 'P.G - 13' rating' or say 'suggest a child lead movie in fiction category and General rating or say 'help with Movie Suggest' to know more'. So what do you want to say?")
            .reprompt("Say a kid frindly movie in cartoon genre with a P.G rating")
            .withSimpleCard("Sugggest a movie","Welcome to Suggest a movie skill. Begin the sentence with 'Say a movie' or 'Tell a movie' followed by the characters,and/or genre and/or the movie rating. You can say 'Say a kid frindly movie in cartoon genre with a 'P.G' rating' or 'Tell a female lead movie in romantic genre with a 'P.G - 13' rating' or say 'suggest a child lead movie in fiction category and General rating or say 'help with Movie Suggest' to know more'. So what do you want to say?")
            .getResponse();



    },
};  // End LaunchRequestHandler


 const suggestmovieHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' && handlerInput.requestEnvelope.request.intent.name === 'suggestmovie';
    },
   async handle(handlerInput) {
   //  handle(handlerInput) {
       mword1 = "";
         mword = getSpokenValue(handlerInput.requestEnvelope, 'aicharacters') + " " + getSpokenValue(handlerInput.requestEnvelope, 'aigenre') + " " + getSpokenValue(handlerInput.requestEnvelope, 'airating')
         console.log("mword",mword);
       if ( getSpokenValue(handlerInput.requestEnvelope, 'aicharacters') != undefined)
       {
            mwordfirst = getSpokenValue(handlerInput.requestEnvelope, 'aicharacters')
            mlang1 = handlerInput.requestEnvelope.request.intent.slots.aicharacters.resolutions.resolutionsPerAuthority[0].status.code;
       }
       else
       {
           mwordfirst = "";
            mlang1 = "";
       }
       if ( getSpokenValue(handlerInput.requestEnvelope, 'aigenre') != undefined)
       {
           mwordmiddle =  getSpokenValue(handlerInput.requestEnvelope, 'aigenre')
            mlang2 = handlerInput.requestEnvelope.request.intent.slots.aigenre.resolutions.resolutionsPerAuthority[0].status.code;
       }
       else
       {
            mwordmiddle = "";
             mlang2 = "";
       }
       if ( getSpokenValue(handlerInput.requestEnvelope, 'airating') != undefined)
       {
            mwordlast =  getSpokenValue(handlerInput.requestEnvelope, 'airating')
            mlang = handlerInput.requestEnvelope.request.intent.slots.airating.resolutions.resolutionsPerAuthority[0].status.code;
       }
       else
       {
            mwordlast =  ""
           mlang = ""
       }

      // console.log("resolutions",handlerInput.requestEnvelope.request.intent.slots.airating.resolutions)
      // console.log("mlang",mlang,handlerInput.requestEnvelope.request.intent.slots.airating.resolutions)
      // console.log("mlang1",handlerInput.requestEnvelope.request.intent.slots.aicharacters.resolutions)
      // let mlang1 = handlerInput.requestEnvelope.request.intent.slots.aicharacters.resolutions.resolutionsPerAuthority[0].status.code;
      // console.log("mlang1",mlang1)
      // let mlang2 = handlerInput.requestEnvelope.request.intent.slots.aigenre.resolutions.resolutionsPerAuthority[0].status.code;
       console.log("mlang2",mlang2)

        console.log("mwordfirst, mwordlast,mlang,mlang1",mwordfirst,mwordlast,mlang,mlang1)
        if ((mwordlast == undefined || mwordlast == "") && (mwordfirst == undefined || mwordfirst == "")  && (mwordmiddle == undefined || mwordmiddle == ""))
       {
           return handlerInput.responseBuilder
           .speak("Say the characters in the movie, genre or category of the movie or the rating. You can say 'Suggest a movie with animal lead in drama genre with a PG rating'. You can also say help for help. Please try again.")
             //  .speak(" " + "<audio src='soundbank://soundlibrary/alarms/beeps_and_bloops/zap_03'/>" + chatCompletion.choices[0].message.content + "To translate another text say another sentence or say stop to exit. ")
               .reprompt("Say 'suggest a movie with a General rating' or say help. Please try again. ")
               .withSimpleCard("Say 'suggest a movie with a General rating' or say help. Please try again. ")
              .getResponse();
       }
        if ((mlang == "ER_SUCCESS_NO_MATCH") && (mlang1 == "ER_SUCCESS_NO_MATCH") && (mlang2 == "ER_SUCCESS_NO_MATCH") )
       {
           // let mwordfirst = getSpokenValue(handlerInput.requestEnvelope).split(' ')[0]
           //  let mwordfirst = getSpokenValue(handlerInput.requestEnvelope.request.intent.slots)
           console.log("mword","next ", mword, mlang, mwordlast)


           return handlerInput.responseBuilder
           .speak("Say the characters or the genre or the ratings from the available list. For details on the list, say help and try again.")
           //  .speak(" " + "<audio src='soundbank://soundlibrary/alarms/beeps_and_bloops/zap_03'/>" + chatCompletion.choices[0].message.content + "To translate another text say another sentence or say stop to exit. ")
           .reprompt("Say the characters or the genre or the ratings from the available list. Say help for the list and try again. ")
           .withSimpleCard("Say the characters or the genre or the ratings from the available list. Say help for the list and try again.  ")
           .getResponse();
       }
           if ((mwordfirst != undefined || mwordfirst != "") && (mwordlast != undefined || mwordlast != "") && (mwordmiddle != undefined || mwordmiddle != "") && (mlang != "ER_SUCCESS_NO_MATCH" && mlang1 != "ER_SUCCESS_NO_MATCH" && mlang2 != "ER_SUCCESS_NO_MATCH"))
           {
               mword = "Suggest a " +  mwordfirst + " movie in " + mwordmiddle + "genre and a " + mwordlast + " rating, in a short summary."
               await getvalu()
              //  getvalu()
               console.log("complete", mword1.substring(0, 500));
               mword1 = mword1.substring(0, 500)
               return handlerInput.responseBuilder
               .speak("The movie is "   + mword1 + ". To ask another question on movies say 'suggest a movie with your options. ' or say stop to exit. ")
               //  .speak(" " + "<audio src='soundbank://soundlibrary/alarms/beeps_and_bloops/zap_03'/>" + chatCompletion.choices[0].message.content + "To translate another text say another sentence or say stop to exit. ")
               .reprompt(" Do you want to ask me anything else? Say Suggest a movie with your options.")
               .withSimpleCard("Movie Suggest","The movie is " + mword1)
               .getResponse();
           }

       else
       {
           return handlerInput.responseBuilder
           .speak(" Please repeat with 'Suggest a movie with your options'  or say 'stop to exit.' ")
           .reprompt(" Please repeat or stop to exit")
           .withSimpleCard("Movie Suggest","Please repeat with 'Suggest a movie with your options'  or say 'stop to exit.'")
           .getResponse();
       }

    },

};

  async function getvalu()
                            {
                                console.log("inside=============",mword)
                                const request1 = {
                                    contents: [{role: 'user', parts: [{text: 'Who is james bond'}]}],
                                  };

                                        //    chatCompletion =   await generativeModel.generateContentStream(request1);
                                console.log("chat===============");
                                try {
                                     //   const resp = await generativeModel.generateContentStream(request1);
                                    const resp = await generativeModel.generateContentStream(mword);
                                  //  console.log('resp=============', resp.response);
                                        const data = await resp.response;
                                    console.log('dara=========', data.candidates[0].content, "content=======",data.candidates[0].content.parts[0]);
                                        const textValue = data.candidates[0].content.parts[0].text;
                                    console.log('nonreplace=========', textValue);
                                          mword1 = JSON.stringify(textValue.replace(/[\(,\),\/,\-,\:,\\",\*,/\n,/\n\n,\_,\**,\#,]/g, " "));
                                        console.log('nonStreaming=========', mword1);
                                      } catch (error) {
                                          mword1 = error
                                        console.error('An error occurred:', error);
                                      }


                                return mword1;
         }

function getSpokenValue(requestEnvelope, slotName) {
    if (requestEnvelope &&
        requestEnvelope.request &&
        requestEnvelope.request.intent &&
        requestEnvelope.request.intent.slots &&
        requestEnvelope.request.intent.slots[slotName] &&
        requestEnvelope.request.intent.slots[slotName].value) {

        return requestEnvelope.request.intent.slots[slotName].value;
    }
    return undefined;
}

const HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return (request.type === 'IntentRequest'
                && request.intent.name === 'AMAZON.HelpIntent');
    },
    handle(handlerInput) {

                return handlerInput.responseBuilder
                .speak("Choose the characters from the options 'male lead','female lead', 'animal lead','Child lead', 'Kid friendly', 'family friendly'. Choose the genre or category from 'dark','scary','tragedy','comedy','non-cartoon','non-animated', 'cartoon','animated','fiction','fantasy','drama'. You can say 'Suggest a movie with a male lead with 'R', rating' or 'Suggest a female lead movie with a PG rating'. So what do you want to say? ")
                .reprompt("Say 'Suggest a female lead movie in fantasy with a PG rating")
                .withSimpleCard("Sugggest a movie","Choose the characters from the options 'male lead','female lead', 'animal lead','Child lead', 'Kid friendly', 'family friendly'. Choose the genre or category from 'dark', 'scary', 'tragedy', 'comedy', 'non-cartoon', 'non-animated', 'cartoon', 'animated', 'fiction', 'fantasy', 'drama'. You can say 'Suggest a movie with a male lead with 'R' rating' or 'Suggest a female lead movie with a PG rating'. So what do you want to say? ")
                .getResponse();

    },
};


function getrandomaudio()
{
    const audio = ["soundbank://soundlibrary/human/amzn_sfx_crowd_applause_04", "soundbank://soundlibrary/human/amzn_sfx_crowd_cheer_med_01", "soundbank://soundlibrary/human/amzn_sfx_crowd_excited_cheer_01" ];
    return audio[Math.floor(Math.random() * audio.length)];

}
function getrandomwrngaudio()
{
    const audio = ["soundbank://soundlibrary/telephones/modern_rings/modern_rings_03" ,"soundbank://soundlibrary/telephones/car_cell_phones/car_cell_phones_03" ,"soundbank://soundlibrary/swords/swords_06"];
    return audio[Math.floor(Math.random() * audio.length)];

}


const FallbackHandler = {
    canHandle(handlerInput) {
          const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
        && (request.intent.name === 'AMAZON.FallbackIntent' || request.type==='Alexa.Presentation.APL.UserEvent');
    },
    handle(handlerInput) {

            return handlerInput.responseBuilder
            .speak("Ok. I can not help you with that. Say Suggest a movie with a male lead. So what do you want to do? ")
            .withSimpleCard("Suggest a movie", "I can not help you with that. Say 'a male lead movie with a 'R' rating'. So what do you want to say? ")
               .getResponse();


    },
};


const ExitHandler = {
    canHandle(handlerInput) {
          const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
        && (request.intent.name === 'AMAZON.StopIntent' || request.intent.name === 'AMAZON.CancelIntent'|| request.type==='Alexa.Presentation.APL.UserEvent');
    },
    handle(handlerInput) {

            return handlerInput.responseBuilder
            .speak("Ok. Bye and have a great day. ")
            .withSimpleCard("Suggest a movie", "Ok. Bye and have a great day. ")
            .withShouldEndSession(true)
            .getResponse();


    },
};


const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        return handlerInput.responseBuilder
        .speak("There was a system error. Please try again later. ")
        .withSimpleCard("Suggest a movie", "There was a system error. Please try again later. ")
        .withShouldEndSession(true)
        .getResponse();
        //  this.emit("Session ended request");
        //  return handlerInput.responseBuilder.getResponse();
    },
};


const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
    },
};
const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
.addRequestHandlers(
                    LaunchHandler,
                    suggestmovieHandler,
                    FallbackHandler,
                    HelpHandler,
                    ExitHandler,
                    SessionEndedRequestHandler
                    )
.addRequestInterceptors(RequestLog)
.addResponseInterceptors(ResponseLog)
.addErrorHandlers(ErrorHandler)
.lambda();
