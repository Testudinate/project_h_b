require(Modules.CallList); 
require(Modules.ASR); 
require(Modules.AI); 
require(Modules.Player);
  
const callerid = "+711111111111"; //number phone callerid
// Dialogflow access 
const $access_token = "test"; //dialogflow token
  
const $baseUri = "https://api.dialogflow.com/v1/query?v=20150910"; 
  
let call = null; 
let first_name, last_name, phone_number, player; 
  
// Number of failed requests to dialogflow 
let attempts = 0; 
  
let step = 1; 
  
// Is ignored? 
let silence = false; 
  
// Answers 
let ans0, ans1, ans2; 
  
const sessionId = () => Math.floor(100000 * Math.random()); 
  
// AppEvents.Started dispatched for each CSV record 
VoxEngine.addEventListener(AppEvents.Started, (e) => { 
  let data = VoxEngine.customData(); // <-- data from CSV string in JSON format 
      data = JSON.parse(data); 
      first_name = data.first_name; 
      last_name = data.last_name; 
      phone_number = data.phone_number; 
 
      Logger.write(first_name)
      Logger.write(last_name)
      Logger.write(phone_number)
      Logger.write($access_token)
      Logger.write($baseUri)
      
      // Call to SDK 
      // call = VoxEngine.callUser(phone_number);  
      // Call to Phone 
      call = VoxEngine.callPSTN(phone_number, callerid); 
  
      // Trying to detect voicemail 
      call.addEventListener(CallEvents.AudioStarted, function(){ 
          AI.detectVoicemail(call).catch(()=>{}) 
      }); 
  
      call.addEventListener(CallEvents.Connected, handleCallConnected); 
      call.addEventListener(CallEvents.Disconnected, handleCallDisconnected); 
      call.addEventListener(CallEvents.Failed, handleCallFailed); 
      call.addEventListener(AI.Events.VoicemailDetected, voicemailDetected); 
  }); 
  
function handleCallConnected() { 
  setTimeout(function () { 
  //call.say('Здравствуйте '+first_name+'! Вас беспокоит компания "". Хотите оставить свой отзыв?', Language.Premium.RU_RUSSIAN_YA_FEMALE); 
  //call.addEventListener(CallEvents.PlaybackFinished, handleIntroPlayed); 
  //call.say('Алло. Здравствуйте',Language.Premium.RU_RUSSIAN_YA_FEMALE);
  player = VoxEngine.createURLPlayer("http://u0165014...Hello.mp3", false);
  player.addEventListener(PlayerEvents.PlaybackFinished, handleIntroPlayed);
  player.sendMediaTo(call);
  }, 500); 
} 
 
function handleIntroPlayed(){ 
  call.removeEventListener(CallEvents.PlaybackFinished); 
  myasr = VoxEngine.createASR({ 
    lang: ASRLanguage.RUSSIAN_RU 
  }); 
  
  asrTimeout = setTimeout(function () { 
    recognitionEnded(); 
    silence = true; 
    call.hangup(); 
  }, 5000); 
  
  myasr.addEventListener(ASREvents.CaptureStarted, function (asrevent) { 
    call.stopPlayback(); 
    clearTimeout(asrTimeout); 
  }); 

  myasr.addEventListener(ASREvents.Result, handleResult); 
    // Send call audio to recognition engine 
    call.sendMediaTo(myasr); 
  } 
  
function handleQuestionsPlayed(){ 
  call.removeEventListener(CallEvents.PlaybackFinished); 
  myasr = VoxEngine.createASR({ 
    lang: ASRLanguage.RUSSIAN_RU 
  }); 
  
  asrTimeout = setTimeout(function () { 
    recognitionEnded(); 
    silence = true; 
    call.hangup(); 
  }, 5000); 
  
  myasr.addEventListener(ASREvents.CaptureStarted, function (asrevent) { 
    call.stopPlayback(); 
    clearTimeout(asrTimeout); 
  }); 
  
  myasr.addEventListener(ASREvents.Result, handleResult);   
    // Send call audio to recognition engine 
    call.sendMediaTo(myasr); 
  } 
  
function handleResult(asrevent) { 
   recognitionEnded(); 
   let userSpeech = asrevent.text; 
   Logger.write("text:  " + userSpeech); 
   if (attempts > 5 ){ 
     call.hangup(); 
     handleCallFailed(); 
   } 
  
   switch (step) { 
     case 1: // Yes or No question 
     makeHttpRequest("YesorNo-followup", userSpeech, (e) => {
      Logger.write(e.text);
      const res = JSON.parse(e.text); 
      Logger.write("result:  " + res.result); 
      if (!res.result){ 
          call.say("Извините, повторите пожалуйста", Language.Premium.RU_RUSSIAN_YA_FEMALE); 
          attempts++; 
          call.addEventListener(CallEvents.PlaybackFinished, handlePlaybackFinished); 
      } 
      else if (res.result.action === "input.unknown"){ 
          call.say(res.result.fulfillment.speech, Language.Premium.RU_RUSSIAN_YA_FEMALE); 
          call.addEventListener(CallEvents.PlaybackFinished, handlePlaybackFinished); 
      } 
      else if (res.result.action === "input.cancel"){ 
          //call.say("Простите за беспокойство. Желаю хорошего дня!", Language.Premium.RU_RUSSIAN_YA_FEMALE); 
          player = VoxEngine.createURLPlayer("http://.../Sorry.mp3", false);
          //call.addEventListener(CallEvents.PlaybackFinished, () => { 
          player.addEventListener(PlayerEvents.PlaybackFinished, () => {                      
            ans0 = "No"; 
            call.hangup() 
          });                
          player.sendMediaTo(call);
        } 
      else if (res.result.action === "input.welcome"){ 
      //call.say("Вас приветствует ...", Language.Premium.RU_RUSSIAN_YA_FEMALE); 
      player = VoxEngine.createURLPlayer("http://.../Offer_IZO.mp3", false);
      //call.addEventListener(CallEvents.PlaybackFinished, handlePlaybackFinished); 
      player.addEventListener(PlayerEvents.PlaybackFinished, handlePlaybackFinished);
      step++; 
      player.sendMediaTo(call);
      } 
  }); 
  break;   
 
  case 2: // Yes or No question 
      makeHttpRequest("YesorNo-followup", userSpeech, (e) =>{ 
        const res = JSON.parse(e.text); 
        if (!res.result){ 
          call.say("Извините, повторите пожалуйста", Language.Premium.RU_RUSSIAN_YA_FEMALE); 
          attempts++; 
          call.addEventListener(CallEvents.PlaybackFinished, handlePlaybackFinished); 
        } 
        else if (res.result.action === "input.unknown"){ 
          call.say(res.result.fulfillment.speech, Language.Premium.RU_RUSSIAN_YA_FEMALE); 
          call.addEventListener(CallEvents.PlaybackFinished, handlePlaybackFinished); 
        } 
        else if (res.result.action === "answer.no"){ 
          //call.say("Простите за беспокойство. Желаю хорошего дня!", Language.Premium.RU_RUSSIAN_YA_FEMALE); 
          player = VoxEngine.createURLPlayer("http://u0165014.plsk.regruhosting.ru/nannys-school.ru/HRbot/Sorry.mp3", false);
          //call.addEventListener(CallEvents.PlaybackFinished, () => { 
          player.addEventListener(PlayerEvents.PlaybackFinished, () => {                      
            ans0 = "No"; 
            call.hangup();            
          });                
          player.sendMediaTo(call);
        }  
				else if (res.result.action ==="answer.yes"){
				  attempts++;
					ans2 = res.result.resolvedQuery; // Save the result 
          //call.say("Мы Вам отправим СМС. Всего Доброго!", Language.Premium.RU_RUSSIAN_YA_FEMALE); 
          player = VoxEngine.createURLPlayer("http://.../OK,SMS.mp3",false);
          //call.addEventListener(CallEvents.PlaybackFinished, () => { 
          player.addEventListener(PlayerEvents.PlaybackFinished, () => {
          
            Net.httpRequest("https://sms.ru/sms/send?api_id=а45ка4ккк&to="+ phone_number +"&msg=https://hr-bot.typeform.com/to/fmLaWN&json=1", function(e) {
						  if(e.code == 200) { 
							  Logger.write("Connected successfully");
								Logger.write("code:  " + e.code);
								Logger.write("data:  " + e.data);
								Logger.write("error:  " + e.error);
								Logger.write("headers:  " + JSON.stringify(e.headers));
								Logger.write("raw_headers:  " + e.raw_headers);
								Logger.write("text:  " + e.text);
							} else { 
								Logger.write("Unable to connect");
							}
							}, { rawOutput: true } );
              call.hangup();
           }); 
           player.sendMediaTo(call);
					 }				 				  
       }); 
       break;   
    } 
 } 
// Playback finished 
function handlePlaybackFinished(e) { 
  call.removeEventListener(CallEvents.PlaybackFinished, handlePlaybackFinished); 
  handleQuestionsPlayed(); 
} 

function recognitionEnded(){ 
  myasr.stop(); 
} 

function voicemailDetected(e) { 
// Is there a Voicemail? 
  if (e.confidence >= 75) { 
    VoxEngine.CallList.reportError('Voicemail', call.hangup()); 
  } 
} 
  
function makeHttpRequest($contexts, $query, $callback) { 
  Logger.write("01 Start httpRequest");
  Logger.write("02 Start url "+ $baseUri);
  Logger.write("02 Start context "+ $contexts);
  Logger.write("03 Start query "+ encodeURI($query));
  Logger.write("04 Start sessionId "+ sessionId);
  
  Net.httpRequest($baseUri+($contexts ? `&contexts=${$contexts}` : "")+"&query=" + encodeURI($query) +
    "&lang=ru&sessionId=" + sessionId() + "&timezone=Europe/Moscow", $callback,
     { headers: ["Authorization: bearer "+$access_token]});
  } 
 
function handleCallDisconnected(e) { 
  // Tell CallList processor about successful call result 
  CallList.reportResult({ 
    result: true, 
    duration: e.duration, 
    answers: { 
      ans0: ans0, 
      ans1: ans1, 
      ans2: ans2, 
    }, 
    silence: silence 
  }, VoxEngine.terminate); 
} 
  
function handleCallFailed(e) { 
  CallList.reportError({ 
    result: false, 
    msg: 'Failed', 
    code: e.code 
    }, VoxEngine.terminate); 
} 
