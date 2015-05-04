/*! echo.js v1.6.0 | (c) 2015 @toddmotto | https://github.com/toddmotto/echo */
  'use strict';

  var chapterAction=require("../actions/chapterAction.js");

  var echo = {};

  var callback = function () {};

  var update = function () {};

  var imgRender=function(elem) {
    return (function(){
      elem.src = elem.getAttribute('data-echo');
      elem.removeAttribute('data-echo');
      // elem.removeAttribute('style');
    })(elem);
  };

  var offset, poll, delay, useDebounce, unload;

  echo.hadInited=false;

  var inView = function (element, view) {
    var box = element.getBoundingClientRect();
    return (box.right >= view.l && box.bottom >= view.t && box.left <= view.r && box.top <= view.b);
  };

  var checkView, setInViewInfor, scrollRender;

  var checkView =function(element,view){
    var box=element.getBoundingClientRect();
    return (box.bottom >= view.t && box.top <= view.b);
  };

  var setInViewInfor=function(){
    // console.log("setInViewInfor");
    var nodes = document.querySelectorAll('img[data-num]');
    var length = nodes.length;
    var src, elem;
    var view = {
      t: 0,
      b: (window.innerHeight || document.documentElement.clientHeight)
    };
    var oview = {
      t: 0 - offset.t,
      b: (window.innerHeight || document.documentElement.clientHeight) + offset.b
    };
    for (var i = 0; i < length; i++) {
      elem=nodes[i];
      if(checkView(elem,view)){
        // console.log("elem "+elem.getAttribute("data-chapter"));
        chapterAction.scroll(elem.getAttribute("data-chapter"),elem.getAttribute("data-num")+'/'+elem.getAttribute("data-pageMax"));
      }
      if(checkView(elem, oview)){
        if(elem.naturalHeight>0){
          if(elem.naturalWidth>1000){
            // console.log('elem',elem.getAttribute('data-num'));
            elem.removeAttribute('style');
            var h=window.innerHeight-58;
            elem.style.maxHeight=h.toString()+'px';
            elem.style.width="80%";
          }
        }  
      }
    }
  };

  var debounceOrThrottle = function () {
    if(!useDebounce && !!poll) {
      return;
    }
    clearTimeout(poll);
    poll = setTimeout(function(){
      // console.log("poll");
      setInViewInfor();
      // console.log(scrollRender);
      if(scrollRender){
        // console.log("poll render");
        echo.render();  
      }
      poll = null;
    }, delay);
  };
  
  echo.init = function (opts) {
    scrollRender=true;
    opts = opts || {};
    var offsetAll = opts.offset || 0;
    var offsetVertical = opts.offsetVertical || offsetAll;
    var offsetHorizontal = opts.offsetHorizontal || offsetAll;
    var optionToInt = function (opt, fallback) {
      return parseInt(opt || fallback, 10);
    };
    offset = {
      t: optionToInt(opts.offsetTop, offsetVertical),
      b: optionToInt(opts.offsetBottom, offsetVertical),
      l: optionToInt(opts.offsetLeft, offsetHorizontal),
      r: optionToInt(opts.offsetRight, offsetHorizontal)
    };
    delay = optionToInt(opts.throttle, 250);
    useDebounce = opts.debounce !== false;
    unload = !!opts.unload;
    callback = opts.callback || callback;
    update=opts.update || update;
    imgRender=opts.imgRender || imgRender;
    // setInViewInfor=opts.setInViewInfor || setInViewInfor;
    echo.hadInited=true;
    echo.render();
    setInViewInfor();
    if (document.addEventListener) {
      window.addEventListener('scroll', debounceOrThrottle, false);
      window.addEventListener('load', debounceOrThrottle, false);
    } else {
      window.attachEvent('onscroll', debounceOrThrottle);
      window.attachEvent('onload', debounceOrThrottle);
    }
  };

  echo.render = function () {
    var nodes = document.querySelectorAll('img[data-echo], [data-echo-background]');
    var length = nodes.length;
    var src, elem;
    var view = {
      l: 0 - offset.l,
      t: 0 - offset.t,
      b: (window.innerHeight || document.documentElement.clientHeight) + offset.b,
      r: (window.innerWidth || document.documentElement.clientWidth) + offset.r
    };
    for (var i = 0; i < length; i++) {
      elem = nodes[i];

      if (checkView(elem, view)) {
        if (unload) {
          elem.setAttribute('data-echo-placeholder', elem.src);
        }
        if (elem.getAttribute('data-echo-background') !== null) {
          elem.style.backgroundImage = "url(" + elem.getAttribute('data-echo-background') + ")";
        }
        else {
          imgRender(elem);
          //elem.src = elem.getAttribute('data-echo');
        }
        if (!unload) {
          elem.removeAttribute('data-echo');
          // elem.removeAttribute('data-echo-background');
        }
        callback(elem, 'load');
      }
      else if (unload && !!(src = elem.getAttribute('data-echo-placeholder'))) {
        if (elem.getAttribute('data-echo-background') !== null) {
          elem.style.backgroundImage = "url(" + src + ")";
        }
        else {
          elem.src = src;
        }
        elem.removeAttribute('data-echo-placeholder');
        callback(elem, 'unload');
      }
    }
    if (!length&&scrollRender) {
      console.log("render complete");
      // chapterAction.update();
      scrollRender=false;
    }
  };

  echo.run=function(){
    scrollRender=true;
    echo.render();
  };

  echo.detach = function () {
    if (document.removeEventListener) {
      window.removeEventListener('scroll', debounceOrThrottle);
    } else {
      window.detachEvent('onscroll', debounceOrThrottle);
    }
    clearTimeout(poll);
  };

  module.exports=echo;

