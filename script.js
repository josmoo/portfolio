document.documentElement.style.setProperty('--scrollbarWidth',
   (window.innerWidth - document.documentElement.clientWidth) + "px");

let faders =  document.querySelectorAll(".fadeIn");

const appearOptions = {
  threshold: .22
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll){
  entries.forEach(entry => {
    if(!entry.isIntersecting){
      return;
    }
    entry.target.classList.add("appear");
    appearOnScroll.unobserve(entry.target);
  })
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});