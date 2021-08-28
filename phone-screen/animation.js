document.addEventListener("DOMContentLoaded", function() {

// Set user photo (top center)
var userPhoto = "./cat.jpg"
// (Photo by Alina Vilchenko from Pexels - https://www.instagram.com/secretly_canadian/ )
$("#photo").css(`background-image`,`url(${userPhoto})`)

// Set username (below photo)
var username = "My Friend's Name"
$("#username").html(username)

// Set default typing speed
var typingSpeed = .15 //Seconds per character

// Set number of extra animation loops
// (0 = play once | 1 = play twice | -1 = infinite replay)
var extraLoops = -1

// -- Please Read First --
//
// Set Text Messages
//
// 1. A type "sleep" is required between every "text" or "header" type
// Set the "seconds" value to 0 if no pause is desired
//
// 2. Use span tags around emojis
// These have been modified to prevent extra vertical space
// Example: <span>🍔&nbsp;</span>
// (GSAP won't show a space after the emoji by default
// Add "&nbsp;" after the emoji as shown to force a space)
//
// 3. messages.typing_speed is an optional override of the default typingSpeed
//
var messages = [
  {
    type: "header"
  },
  {
    type: "sleep", 
    seconds:0
  },
  {
    type: "text",
    is_local_user: false,
    text:`Lorem ipsum dolor sit am`
  },
  { 
    type: "sleep",
    seconds:0
  },
  {
    type: "text",
    is_local_user: true, 
    text:`Lorem <span>🍔&nbsp;</span> lorem ipsum`,
    typing_speed: .2
  },
  { 
    type: "sleep", 
    seconds:0
  },
  {
    type: "text",
    is_local_user: false,
    text:`Lorem ipsum dolor sit am. Ipsum dolor sit am, lorem ipsum <span>🥔&nbsp;</span> dolor.`
  },
  { 
    type: "sleep", 
    seconds:0
  },
  {
    type: "text",
    is_local_user: true, 
    text:`Lorem ipsum dolor sit am`
  },
  { 
    type: "sleep", 
    seconds:0
  },
  {
    type: "text",
    is_local_user: false, 
    text:`Lorem ipsum`
  },
  { 
    type: "sleep", 
    seconds:0
  },
  {
    type: "text",
    is_local_user: true,  
    text:`Lorem ipsum dolor?`
  },
  { 
    type: "sleep", 
    seconds:0
  },
  {
    type: "text",
    is_local_user: false, 
    text:`Lorem ipsum dolor sit am!`
  },
  { 
    type: "sleep", 
    seconds:0
  },
  {
    type: "text",
    is_local_user: true,  
    text:`Lorem...`
  },
  { 
    type: "sleep", 
    seconds:0
  },
  {
    type: "text",
    is_local_user: false, 
    text:`...`
  },
  { 
    type: "sleep", 
    seconds:0
  },
  {
    type: "text",
    is_local_user: true,  
    text:`Lorem ipsum!`
  },
  { 
    type: "sleep", 
    seconds:0
  },
  {
    type: "text",
    is_local_user: false,
    text:`Lorem ipsum.`
  },
  { 
    type: "sleep", 
    seconds:10
  }
]


//Get and format current time
var currentdate = new Date();

if (currentdate.getMinutes() < 10){
  var minutes = '0' + currentdate.getMinutes()
}else{
  var minutes = currentdate.getMinutes()
}

var currentTime = currentdate.getHours() + ":" + minutes


//Build array from default speed typingSpeed and override speed typing_speed
var typingSpeeds = []
for(let i=0; i<messages.length; i++){
  if(messages[i].is_local_user==true){
      if(typeof messages[i].typing_speed != "undefined"){
        typingSpeeds[i] = messages[i].typing_speed
      }else{
        typingSpeeds[i] = typingSpeed
      }
  }
}

//Build the message divs based on JSON input
var messageContent

for(let i=0; i<messages.length; i++){

  if (messages[i].type=='header'){
    messageContent = messageContent + `<div id="messageHeader${i}" class="messageHeader">Text Message<br>Today ${currentTime} AM</div>`
  }

  else if(messages[i].type=='text'){

    if(messages[i].is_local_user==true){
      messageContent = messageContent + `<div id="message${i}" class="localMessage"><div>${messages[i].text}</div></div>`
      if(i<messages.length-2){
        if(messages[i+2].is_local_user==false){messageContent = messageContent + `<div class="spacer"></div>`}
      }
    }
    
    else{
      messageContent = messageContent + `<div id="message${i}" class="incomingMessage"><div>${messages[i].text}</div></div>`
      if(i<messages.length-2){
        if(messages[i+2].is_local_user==true){messageContent = messageContent + `<div class="spacer"></div>`}
      }
    }
  }

  else if(messages[i].type=='sleep'){
    //No action
  }

  else{
    alert('JSON file error') 
    return;
  }
}


//Add messages to DOM, then wait and calculate animations
$("#messages")
.html(messageContent)
.ready(function(){
  setTimeout(function(){ fadeInAnimation() },300)
});


//Add text animation plugin
gsap.registerPlugin(TextPlugin);


//Fade in entire phone, then start animation loop
function fadeInAnimation(){

  //Setup timeline
  var tFadeIn = gsap.timeline({paused:true});

  //Fade in animation
  tFadeIn.to(`#wrapper`, {opacity: 1, duration: .15});
  //Start animation loop
  tFadeIn.add(function(){ startAnimation() })

  //Start timeline
  tFadeIn.play()

}


//Setup and play GSAP timeline
function startAnimation(){

  //Setup timeline (repeat:-1 will loop animation infinitely)
  var tMessages = gsap.timeline({paused:true,repeat:extraLoops});

  //Setup variables
  var yDistances = []
  var scrollDistances = []
  var originalWidths = []
  var originalHeights = []

  //Loop through JSON input
  for(let i=0; i<messages.length; i++){

    //Animate message bubbles
    if(messages[i].type=='text'){

      //Measure distance to input window
      yDistances[i] =  $("#wrapper").outerHeight() - $(`#message${i}`).position().top - $(`#message${i}`).outerHeight() - 6; //Subtract distance from bottom too (6px)
    
      //Animate local user message
      if(messages[i].is_local_user==true){
    
          //Animate first few local message bubbles - without scroll
          if(yDistances[i] > $(`#message${i}`).outerHeight()){

            //Animate typing/sending sequence
            tMessages.add(function(){$(`#inputBox`).removeClass('cursor').addClass('typing')})
            tMessages.to(`#inputBox`, {duration: 0, text: messages[i].text.charAt(0), ease: "none"});
            tMessages.to(`#inputBox`, {duration: messages[i].text.replace(/\<span\>|\<\/span\>|\&nbsp\;/g, "").length*typingSpeeds[i], text: messages[i].text, ease: RoughEase.ease.config({ template: Power4.easeOut, strength: 0.25, points: 5, taper: "both", randomize: true, clamp: true})});
            tMessages.to(`#sendBtn`, {opacity:.1, duration:0},"+=.3");

            //Save height/width for final state
            originalWidths[i] = $(`#message${i} > div`).outerWidth()
            tMessages.to(`#message${i} > div`, {width:function(){return $(`#inputWrapper`).outerWidth();},maxWidth:"100%",duration:0}); 
            originalHeights[i] = $(`#message${i} > div`).outerHeight()
            tMessages.to(`#message${i} > div`, {height:function(){return $(`#inputWrapper`).outerHeight();},duration:0});

            //Move message to input window location
            tMessages.to(`#message${i}`, {opacity:1,y:yDistances[i],duration:0});

            //Reset input box
            tMessages.to(`#inputBox`, {duration: 0, text: '', ease: "none"});
            tMessages.add(function(){$(`#inputBox`).addClass('cursor').removeClass('typing')})

            //Animate message bubble
            tMessages.to(`#message${i} > div`, {autoRound:false, backgroundColor:'#4fcc6a',width:originalWidths[i],height:originalHeights[i],scaleX:0.9, scaleY:0.9, duration: .15});
            tMessages.to(`#message${i} > div`, {color:'white',duration:.01 },'-=.07');
            tMessages.to(`#message${i} > div`, {autoRound:false, scaleX:1, scaleY:1, duration: .15});
            tMessages.to(`#message${i}`, {autoRound:false, y:0,duration: .3},"-=.3");

            //Add message header to top
            if (messages[i-2].type=='header'){
              tMessages.add(function(){gsap.to(`#messageHeader${i-2}`, {opacity: 1, duration: .15},"-=.15");})
            }

            //Move tail and restore send button
            if(i>2){if(messages[i-2].is_local_user==true){ tMessages.add(function(){$(`#message${i-2} > div`).removeClass('tail')},'-=.2')}}
            tMessages.add(function(){$(`#message${i} > div`).addClass('tail')},'-=.2')
            tMessages.to(`#sendBtn`, {opacity:1, duration:.3});

          }

          //Animate later local message bubbles - with scroll
          else{

            //Measure distance to scroll message div
            scrollDistances[i] = - $(`#message${i}`).position().top - $(`#message${i}`).outerHeight() + $(`#wrapper`).innerHeight() - 36 - 10  //Subtract footer height and add spacer
            
            //Animate typing/sending sequence
            tMessages.add(function(){$(`#inputBox`).removeClass('cursor').addClass('typing')})
            tMessages.to(`#inputBox`, {duration: 0, text: messages[i].text.charAt(0), ease: "none"});
            tMessages.to(`#inputBox`, {duration: messages[i].text.replace(/\<span\>|\<\/span\>|\&nbsp\;/g, "").length*typingSpeeds[i], text: messages[i].text, ease: RoughEase.ease.config({ template: Power4.easeOut, strength: 0.25, points: 5, taper: "both", randomize: true, clamp: true})});
            tMessages.to(`#sendBtn`, {opacity:.1, duration:0},"+=.3");

            //Save current height/width before adapting to match input box
            originalWidths[i] = $(`#message${i} > div`).outerWidth()
            tMessages.to(`#message${i} > div`, {width:function(){return $(`#inputWrapper`).outerWidth();},maxWidth:"100%",duration:0});
            originalHeights[i] = $(`#message${i} > div`).outerHeight()
            tMessages.to(`#message${i} > div`, {height:function(){return $(`#inputWrapper`).outerHeight();},duration:0}); 

            //Show message bubble
            tMessages.to(`#message${i}`, {opacity:1,duration:0});

            //Reset input box
            tMessages.to(`#inputBox`, {duration: 0, text: '', ease: "none"});
            tMessages.add(function(){$(`#inputBox`).addClass('cursor').removeClass('typing')})

            //Animate message movement, check if scroll is needed

            //Might need scroll
            if(yDistances[i] < $(`#message${i}`).outerHeight() &&  yDistances[i] > 0){
              tMessages.to(`#message${i}`, {opacity:1,y:yDistances[i],duration:0});
            }
            //Will need scroll
            else{
              tMessages.to(`#message${i}`, {autoRound:false, opacity:1,y:yDistances[i]-scrollDistances[i] - 25 ,duration:0});
            }

            //Animate message to final position
            tMessages.to(`#message${i} > div`, {autoRound:false, backgroundColor:'#4fcc6a', width:originalWidths[i],height:originalHeights[i],scaleX:0.9, scaleY:0.9, duration: .15});
            tMessages.to(`#message${i} > div`, {color:'white',duration:.01 },'-=.07');
            tMessages.to(`#message${i} > div`, {autoRound:false, scaleX:1, scaleY:1, duration: .15});
            tMessages.to(`#message${i}`, {autoRound:false, y:0,duration: .3},"-=.3");

            //Might need scroll
            if(yDistances[i] < $(`#message${i}`).outerHeight() &&  yDistances[i] > 0){
              if(scrollDistances[i] < 0){tMessages.to(`#messages`, {autoRound:false, y:scrollDistances[i], duration: .3},"-=.3");}
            }
            //Will need scroll
            else{
              tMessages.to(`#messages`, {autoRound:false, y:scrollDistances[i], duration: .3},"-=.3");
            }

            //Add message header to top
            if (messages[i-2].type=='header'){
              tMessages.add(function(){gsap.to(`#messageHeader${i-2}`, {opacity: 1, duration: .15},"-=.15");})
            }

            //Move message bubble tail and restore send button
            if(i>2){if(messages[i-2].is_local_user==true){ tMessages.add(function(){$(`#message${i-2} > div`).removeClass('tail')},'-=.2')}}
            tMessages.add(function(){$(`#message${i} > div`).addClass('tail')},'-=.2')
            tMessages.to(`#sendBtn`, {opacity:1, duration:.3});
          }
      }

      //Animate non-local incoming message bubbles
      else{

        //Add message header to top
        if (messages[i-2].type=='header'){
          tMessages.add(function(){gsap.to(`#messageHeader${i-2}`, {opacity: 1, duration: .15});})
        }

        //Fade in first few message bubbles - without scroll
        if(yDistances[i] > $(`#message${i}`).outerHeight()){
          //Fade in message bubble
          tMessages.to(`#message${i}`, {opacity: 1,duration: .15});
          //Move message bubble tail
          if(i>2){if(messages[i-2].is_local_user==false){ tMessages.add(function(){$(`#message${i-2} > div`).removeClass('tail')},'-=.3')}}
          tMessages.add(function(){$(`#message${i} > div`).addClass('tail')},'-=.2')
        }

        //Fade in later message bubbles - with scroll
        else{
          //Measure distance to scroll message div
          scrollDistances[i] = - $(`#message${i}`).position().top - $(`#message${i}`).outerHeight() + $(`#wrapper`).innerHeight() - 36 - 10  //Subtract footer height and spacer above
         
          //Might need scroll
          if(yDistances[i] < $(`#message${i}`).outerHeight() &&  yDistances[i] > 0){
            if(scrollDistances[i] < 0){tMessages.to(`#messages`, {autoRound:false, y:scrollDistances[i], duration: .3},"-=.3");}
          }
          //Will need scroll
          else{
            tMessages.to(`#messages`, {autoRound:false, y:scrollDistances[i], duration: .3});
          }

          //Fade in
          tMessages.to(`#message${i}`, {opacity: 1,duration: .15},"-=.15");

          //Move message bubble tail
          if(i>2){if(messages[i-2].is_local_user==false){ tMessages.add(function(){$(`#message${i-2} > div`).removeClass('tail')},'-=.3')}}
          tMessages.add(function(){$(`#message${i} > div`).addClass('tail')},'-=.2')
        }
      }

    }

    //Pause (sleep) between messages
    else if(messages[i].type=='sleep'){
      //Set delay
      tMessages.to("#messages", {delay: messages[i].seconds});
    }

    else if(messages[i].type=='header'){
      //Action moved to messages[i].type=="text"
    }

    //Alert for JSON typos
    else{
      alert('JSON file error') 
      return;
    }
  }


  //Set overall animation speed (debugging only - use typingSpeed, messages.typing_speed, or messages.seconds otherwise)
  tMessages.timeScale(1)

  //Start animation
  tMessages.play()


  //Monitor and control input window animations

  //Setup icon toggle timeline
  var tBtnToggle = gsap.timeline({paused:true});
    tBtnToggle.add(function(){btnStateNarrow=true;inputScrollPush = 0})
    tBtnToggle.to("#cameraAppstoreIcons", {xPercent: -200, ease: Back.easeIn.config(.5), duration: .3});
    tBtnToggle.to("#chevronSquareFill", {opacity: 1,  ease:"none", duration: 0},"-=.1");
    tBtnToggle.to("#chevronSquareFill", { xPercent:-100, ease: Back.easeOut.config(.5), duration: .3},"-=.3");
    tBtnToggle.to("#inputWrapper", {width: 252, ease: Back.easeOut.config(.5), duration: .3},"-=.2");
    tBtnToggle.add(function(){btnStateNarrow=false})

  //Setup variables
  var originalHeight = $(`#inputBox`).outerHeight()
  var time = (tMessages.duration()*(extraLoops+1)) +1
  var infiniteLoop = false
  //Remove time limit on infinitely looping timeline
  if( tMessages.repeat() == -1 ){ infiniteLoop = true }
  var btnStateNarrow = true
  var inputPushReset=[true,true,true]
  
  //Check character count and div height, animate to fit
  function monitorInput(time){

    //Check character count, toggle GSAP timeline
    if($(`#inputBox`).text().length>17){
      if(btnStateNarrow==true){
        tBtnToggle.play()
        btnStateNarrow=false
        inputPushReset=[true,true,true]
      }
    }else{
      if(btnStateNarrow==false){
        tBtnToggle.reverse();
        btnStateNarrow=true
        inputPushReset=[true,true,true]
      }
    }
    
    //Check input div height, scroll messages up if space is needed

    //Check if height is 2 lines
    if($(`#inputBox`).outerHeight() > 1.5*originalHeight){
      //If ready, scroll messages up to make room for typing input
      if($("#messages").position().top < 0 && inputPushReset[0]==true){
        gsap.to(`#messages`, {y:$("#messages").position().top - ($(`#inputBox`).outerHeight()/2), duration: .3});
        inputScrollPush = $(`#inputBox`).outerHeight()/2
        inputPushReset[0]=false
      }
    }
    //Check if height is 3 lines
    if($(`#inputBox`).outerHeight() > 2.5*originalHeight){
      //If ready, scroll messages up to make room for typing input
      if($("#messages").position().top < 0 && inputPushReset[1]==true){
        gsap.to(`#messages`, {y:$("#messages").position().top - ($(`#inputBox`).outerHeight()/3), duration: .3});
        inputScrollPush = $(`#inputBox`).outerHeight()/3
        inputPushReset[1]=false
      }
    }
    //Check if height is 4 lines
    if($(`#inputBox`).outerHeight() > 3.3*originalHeight){
      //If ready, scroll messages up to make room for typing input
      if($("#messages").position().top < 0 && inputPushReset[2]==true){
        gsap.to(`#messages`, {y:$("#messages").position().top - ($(`#inputBox`).outerHeight()/4), duration: .3});
        inputScrollPush = $(`#inputBox`).outerHeight()/4
        inputPushReset[2]=false
      }
    }

    //Set recursion to 150ms, and run until animation finishes + 1 second
    if(infiniteLoop == true){
      setTimeout(function(){ monitorInput() },150)
    }else if(time >= 0 ){
      setTimeout(function(){ monitorInput(time-.15) }.bind(time),150)
    }

  }

  //Start monitoring function
  monitorInput(time)
}


})
