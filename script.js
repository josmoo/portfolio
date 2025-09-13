//import SimpleParallax from "simple-parallax-js/vanilla";

document.documentElement.style.setProperty('--scrollbarWidth',
   (window.innerWidth - document.documentElement.clientWidth) + "px");
   
let expandedCard;
let initialProperties = [];
let finalProperties = [];
let cardClip;


function setup() {
  document.addEventListener('click', (e) => {
    console.log("CLICK");
    if (expandedCard) return;

    if (e.target.matches('.projectCard')) {
        expandedCard = e.target;
    } else if (e.target.closest('.projectCard')) {
        expandedCard = e.target.closest('.projectCard');
    }
    
    if (!expandedCard) return;

    const closeButton = expandedCard.querySelector('.projectCard__close');
    closeButton.addEventListener('click', collapse);

    expand();
  })
}

function expand(){
    getCardContent().addEventListener('transitionend', onExpandTransitionEnd);

    disablePageScroll(); 
    
    collectInitialProperties();

    expandedCard.classList.add('projectCard--expanded');

    collectFinalProperties();

    setInvertedTransformAndOpacity();

    clipCardContent();

    requestAnimationFrame(()=>{
        expandedCard.classList.add('projectCard--animatable');
        startExpanding();
    })
}

function getAnimatableElements() {
  if (expandedCard){
    return expandedCard.querySelectorAll('.jsAnimatable');
  }
}

function getCardContent() {
  if (expandedCard){
    return expandedCard.querySelector('.projectCard__content');
  }
}

function collectInitialProperties(){
    for (const element of getAnimatableElements()){
        initialProperties.push({
            rect: element.getBoundingClientRect(),
            opacity: parseFloat(window.getComputedStyle(element).opacity)
        });
    }

    const cardRect = expandedCard.getBoundingClientRect();
    cardClip = {
        top: cardRect.top, //todo study
        right: window.innerWidth - cardRect.right,
        bottom: window.innerHeight - cardRect.bottom,
        left:  cardRect.left
    }
}

function collectFinalProperties(){
    for (const element of getAnimatableElements()){
        finalProperties.push({
            rect: element.getBoundingClientRect(),
            opacity: parseFloat(window.getComputedStyle(element).opacity)
        });
    }
}

function setInvertedTransformAndOpacity(){
    for (const [i, element] of getAnimatableElements().entries()){
        const left = initialProperties[i].rect.left - finalProperties[i].rect.left;
        const top = initialProperties[i].rect.top - finalProperties[i].rect.top;
        const scale = initialProperties[i].rect.width / finalProperties[i].rect.width;

        element.style.transform = `
            translate(${left}px, ${top}px)
            scale(${scale})`;

        element.style.opacity = initialProperties[i].opacity;
    }
}

function clipCardContent(){
    getCardContent().style.clipPath = `
        inset(${cardClip.top}px ${cardClip.right}px ${cardClip.bottom}px ${cardClip.left}px round 5px)
    `;
}

function startExpanding() {
  for (const [i, element] of getAnimatableElements().entries()) {
    element.style.transform = 'translate(0, 0) scale(1)';
    element.style.opacity = finalProperties[i].opacity;
  }
  getCardContent().style.clipPath = 'inset(0)';
}

function onExpandTransitionEnd(e) {
  const cardContent = getCardContent();
  if (e.target !== cardContent) return;

  expandedCard.classList.remove('projectCard--animatable');

  cardContent.removeEventListener('transitionend', onExpandTransitionEnd);

  removeStyles();
}

function removeStyles() {
  for (const element of getAnimatableElements()) {
    element.style = null;
  }

  getCardContent().style = null;
}

function collapse() {
  getCardContent().addEventListener('transitionend', onCollapseTransitionEnd);

  setCollapsingInitialStyles();

  requestAnimationFrame(() => {
    expandedCard.classList.add('projectCard--animatable');
    startCollapsing();
  })
}

function setCollapsingInitialStyles(){
    for (const element of getAnimatableElements()){
        element.style.transform = `translate(0,0) scale(1)`;
    }
    getCardContent().style.clipPath = 'inset(0)';
}

function startCollapsing() {
    setInvertedTransformAndOpacity();
    clipCardContent();
}

function onCollapseTransitionEnd(e) {
  const cardContent = getCardContent();
  if (e.target !== cardContent) return;

  expandedCard.classList.remove('projectCard--animatable');
  expandedCard.classList.remove('projectCard--expanded');

  cardContent.removeEventListener('transitionend', onCollapseTransitionEnd);

  removeStyles();
  enablePageScroll();

  cleanup();
}

function disablePageScroll(){
  document.body.style.overflow = 'hidden';
}

function enablePageScroll(){
  document.body.style.overflow = '';
}

function cleanup() {
  expandedCard = null;
  cardClip = null;
  initialProperties = [];
  finalProperties = [];
}

setup();
console.log("AAAAAA");