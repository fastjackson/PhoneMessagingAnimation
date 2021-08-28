document.addEventListener("DOMContentLoaded", function() {

  function resizePhone(){

    const phoneWrapper = document.getElementById('phone-wrapper');
    const phone = document.getElementById('phone');

    let currentWidth = Math.max(phoneWrapper.offsetWidth, phoneWrapper.clientWidth)
    let originalWidth = 396
    let ratio = currentWidth / originalWidth

    if(ratio<=1){
      phone.setAttribute('style',`transform:scale(${ratio})`);
      phoneWrapper.setAttribute('style',`height:${phone.getBoundingClientRect().height + 15.5}px;`); //Include padding-top (pt-3 == 16px), subtract .5px for sub-pixel rounding
    }else{
      phone.setAttribute('style',`transform:scale(1)`);
      phoneWrapper.setAttribute('style','');
    }

  }

  resizePhone()

  window.addEventListener("resize", function(){
    resizePhone()
  });

});
