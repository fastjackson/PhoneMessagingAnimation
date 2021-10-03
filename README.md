# Phone Messaging Animation
A customizable phone messagging app animation built with CSS + Javascript (GSAP)

https://user-images.githubusercontent.com/70291/131207930-6db10345-b55b-4d32-8571-603a1e3a697b.mp4

## Quick Setup

1. See `index.html` as an example of what to do:
   1. Put the animation `iframe` in your page.
   2. Setup the `iframe` with a fixed size or scale the width with CSS transforms. `resizePhone.js` provides an example of scaling the width.
   3. Add any border or framing on your page.


2. Customize the animation by modifying variables shown at the beginning of the animation.js file. Support for modifying the username, the user images, typing speed, number of animation loops, and message content is included.

## Details
Check the commented instructions inside the animation.js file carefully before modifying or adding messages. More details below.


### JSON Message Object Types: 

`header` - Displays current time (Required at beginning.)

`sleep` - Adds delay specified in `seconds`. All message should be separated by a `sleep`, even if `seconds ` is 0.

`text` - Adds a message to the animation

  + `is_local_user` - Boolean specifying who is typing the message.
    + When `true` the message is first typed on screen and then sent to a bubble on the right side of the animation pane.
    + When `false` the message simply appears in a bubble on the left side of the animation pane.
  + `text` - The message text.
    + Note: Wrap emojis with span tags and add any spaces inside: `<span>🍔&nbsp;</span>`
  + `typing_speed` - An optional single-message override of the default `typingSpeed` variable.
  
## Credits

Written by [Cody Daniels](https://github.com/codydaniels).

Released as open source by Fast Jackson LLC. 

Cat photo by [Alina Vilchenko from Pexels](https://www.instagram.com/secretly_canadian/)
