

import styles from './../sass/aos.scss';

import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';

import observe from './libs/observer';

import detect from './helpers/detector';
import handleScroll from './helpers/handleScroll';
import prepare from './helpers/prepare';
import elements from './helpers/elements';


let $aosElements = [];
let initialized = false;


let options = {
  offset: 120,
  delay: 0,
  easing: 'ease',
  duration: 400,
  disable: false,
  once: false,
  startEvent: 'DOMContentLoaded',
  throttleDelay: 99,
  debounceDelay: 50,
  disableMutationObserver: false,
};


const refresh = function refresh(initialize = false) {
  if (initialize) initialized = true;

  if (initialized) {
    $aosElements = prepare($aosElements, options);
    handleScroll($aosElements, options.once);
    return $aosElements;
  }
};


const refreshHard = function refreshHard() {
  $aosElements = elements();
  refresh();
};


const disable = function() {
  $aosElements.forEach(function(el, i) {
    el.node.removeAttribute('data-aos');
    el.node.removeAttribute('data-aos-easing');
    el.node.removeAttribute('data-aos-duration');
    el.node.removeAttribute('data-aos-delay');
  });
};



const isDisabled = function(optionDisable) {
  return optionDisable === true ||
  (optionDisable === 'mobile' && detect.mobile()) ||
  (optionDisable === 'phone' && detect.phone()) ||
  (optionDisable === 'tablet' && detect.tablet()) ||
  (typeof optionDisable === 'function' && optionDisable() === true);
};


const init = function init(settings) {
  options = Object.assign(options, settings);


  $aosElements = elements();
  const browserNotSupported = document.all && !window.atob;

  
  if (isDisabled(options.disable) || browserNotSupported) {
    return disable();
  }

 
  document.querySelector('body').setAttribute('data-aos-easing', options.easing);
  document.querySelector('body').setAttribute('data-aos-duration', options.duration);
  document.querySelector('body').setAttribute('data-aos-delay', options.delay);

 
  if (options.startEvent === 'DOMContentLoaded' &&
    ['complete', 'interactive'].indexOf(document.readyState) > -1) {
    refresh(true);
  } else if (options.startEvent === 'load') {
    window.addEventListener(options.startEvent, function() {
      refresh(true);
    });
  } else {
    document.addEventListener(options.startEvent, function() {
      refresh(true);
    });
  }


  window.addEventListener('resize', debounce(refresh, options.debounceDelay, true));
  window.addEventListener('orientationchange', debounce(refresh, options.debounceDelay, true));


  window.addEventListener('scroll', throttle(() => {
    handleScroll($aosElements, options.once);
  }, options.throttleDelay));

 
  if (!options.disableMutationObserver) {
    observe('[data-aos]', refreshHard);
  }

  return $aosElements;
};


module.exports = {
  init,
  refresh,
  refreshHard
};


const flicker = "power1.inOut"; 
const flicker2 = "power0.none";
const strongFlicker = "power2.inOut";


function getGlitchy(
  glitchKeyframeAmount,
  glitchKeyframeOffset,
  glitchFrameSize
) {
  const keyframes = [];
  for (let i = 0; i < glitchKeyframeAmount; i++) {
    const keyframe = {};
    const randomNumber1 = gsap.utils.random(10, 90, 5);
    const randomNumber2 =
      randomNumber1 + gsap.utils.random(-glitchFrameSize, glitchFrameSize, 2);
    const randomOffset = gsap.utils.random(
      glitchKeyframeOffset,
      -1 * glitchKeyframeOffset
    );
    const isLastFrame = i === glitchKeyframeAmount - 1;

   
    if (i % 3 === 0 || isLastFrame) {
      keyframe.clipPath = `polygon(0 ${randomNumber1}%, 100% ${randomNumber1}%, 100% ${randomNumber1}%, 0 ${randomNumber1}%)`;
    } else {
      keyframe.clipPath = `polygon(0 ${randomNumber1}%, 100% ${randomNumber1}%, 100% ${randomNumber2}%, 0   ${randomNumber2}%)`;
      keyframe.xPercent = randomOffset;
    }
    keyframe.webkitClipPath = keyframe.clipPath;
    keyframes.push(keyframe);
  }
  return keyframes;
}

const glitchKeyframes = getGlitchy(8, 2, 20);


function randomizedStretching() {
  var timeline = gsap.timeline();
  timeline.from(".main-line tspan", { 
    duration: 1,
    ease: flicker2,
    xPercent: (i) => {
      return gsap.utils.random(-400, 400, 5);
    },
    scaleX: (i) => {
      return gsap.utils.random(0, 10);
    },
    transformOrigin: "50% 50%",
    stagger: 0.05 // 각 tspan 요소에 시차를 둠
  }, 0);
  return timeline;
}


function opacityFlicker() {
  var timeline = gsap.timeline({defaults: {duration: 1.5, opacity: 0, stagger: 0.1}});
  timeline.from(".main-line", { 
    ease: strongFlicker,   
  }, 0);
  return timeline;
}


function linesTimeline() {
  var timeline = gsap.timeline({defaults:{ease: "expo.out", duration: 1}});
  timeline
    .from(".year", {xPercent: -100, opacity: 0}, 0.4) 
    .from(".fw", {xPercent: 100, opacity: 0}, 0.4)   
    .from(".fashion", {yPercent: -100, opacity: 0}, 0.6) 
    .from(".trends", {yPercent: 100, opacity: 0}, 0.8);  
  return timeline;
}


function openingPinkLines() {
  var timeline = gsap.timeline({defaults:{ duration: 0.5}});
  timeline
    .fromTo(".dash",{
      scaleY: 0,
      scaleX: 0,
      xPercent: -200,
      transformOrigin: "50% 50%",
      ease: "linear",
    },{
      scaleY: 0.2,
      scaleX: 20,
      ease: "linear",
    }, 0)
    .from(".dot",{
      xPercent: 900,
      scaleX: 300,
      transformOrigin: "100% 100%",
      ease: strongFlicker,
      opacity: 0,
    }, 0) 
    .to(".dash",{
      scaleX: 1,
      scaleY: 1,
      xPercent: -950,
      transformOrigin: "100% 100%",
      ease: strongFlicker,
    }, "-=0.5");
  return timeline;
}


function glitch() {
  var timeline = gsap.timeline();
  timeline
    .to(".glitchLayer",{
      duration: 0.1,
      opacity: 1, 
    },0)
    .to(".glitchLayer .text-group-glitch", { 
      duration: 1.5,
      ease: flicker2,
      keyframes: glitchKeyframes
    }, 0);
  return timeline;
}


function textGlitch() {
  var timeline = gsap.timeline({defaults: { duration: 0.5, transformOrigin: "100% 100%", ease: flicker}});
  timeline
    .to(".year", {xPercent: 10, yPercent: 5, rotate: 2}, 0)
    .to(".fw", {xPercent: -10, yPercent: -5, rotate: -2}, 0)
    .to(".fashion", {scaleY: 0.8, yPercent: 15, xPercent: 5}, 0)
    .to(".trends", {scaleX: 0.8, xPercent: -15, yPercent: 5}, 0);
  return timeline;
}

function finalTextGlitch() {
  var timeline = gsap.timeline();
  timeline
    .to(".main-line tspan", { // 모든 tspan 요소 원래대로 복원
      duration: 0.2,
      yPercent: 0,
      xPercent: 0,
      scaleX: 1,
      scaleY: 1,
      rotate: 0, // 회전도 복원
      transformOrigin: "100% 100%",
      ease: flicker,
    });
  return timeline;
}

var masterTimeline = gsap.timeline({delay: 1.5})
  .add(openingPinkLines(), 0)
  .add(opacityFlicker(), 0.5)
  .add(randomizedStretching(), 0.7)
  .add(linesTimeline(), 2.8)
  .add(glitch(), "-=0.5")
  .add(textGlitch(), "-=1")
  .add(glitch().timeScale(1.1), "+=1") // 글리치 효과 한 번 더 반복
  .add(finalTextGlitch().timeScale(1.1), "-=0.5"); // 최종 텍스트 복원