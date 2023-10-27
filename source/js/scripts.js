var navMain = document.querySelector(".navigation");
var navToggle = document.querySelector(".page-header__toggler");

navMain.classList.remove("navigation--nojs");

navToggle.addEventListener("click", function () {
  if (navMain.classList.contains("navigation--closed")) {
    navMain.classList.remove("navigation--closed");
    navMain.classList.add("navigation--opened");
  } else {
    navMain.classList.add("navigation--closed");
    navMain.classList.remove("navigation--opened");
  }
});

//swticher`s button

var exmSwticher = document.querySelector(".switcher");
var exmButton = document.querySelector(".switcher__button");

exmButton.addEventListener("click", function () {
  if (exmSwticher.classList.contains("switcher--before")) {
    exmSwticher.classList.remove("switcher--before");
    exmSwticher.classList.add("switcher--after");
  } else {
    exmSwticher.classList.add("switcher--before");
    exmSwticher.classList.remove("switcher--after");
  }
});
