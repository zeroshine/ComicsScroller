/*! echo.js v1.6.0 | (c) 2015 @toddmotto | https://github.com/toddmotto/echo */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return factory(root);
    });
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.echo = factory(root);
  }
})(this, function (root) {

  'use strict';

  var echo = {};

  var callback = function () {};

  var update = function () {};

  var imgRender=function(elem) {
    return (function(){
      elem.src = elem.getAttribute('data-echo');
      elem.removeAttribute('data-echo');
    })(elem);
  };

  var offset, poll, delay, useDebounce, unload;

  var inView = function (element, view) {
    var box = element.getBoundingClientRect();
    return (box.right >= view.l && box.bottom >= view.t && box.left <= view.r && box.top <= view.b);
  };

  var checkView, setInViewInfor;

  echo.checkView =function(element,view){
    var box=element.getBoundingClientRect();
    return ((box.bottom+box.top)/2 >= view.t && (box.bottom+box.top)/2 <= view.b);
  };

  var setInViewInfor=function(){
    var nodes = document.querySelectorAll('img[data-title]');    
    var oview={
      l: 0,
      t: 0,
      b: (root.innerHeight || document.documentElement.clientHeight),
      r: (root.innerWidth || document.documentElement.clientWidth)
    };
        
    for (var i = 0; i < nodes.length; i++) {
      var elem=nodes[i];
      if(echo.checkView(elem, oview)){
        if(comics.chaptertxt.textContent!==elem.getAttribute("data-title")){
          comics.chaptertxt.textContent=elem.getAttribute("data-title");  
        }
        if(elem.getAttribute("data-num")=="0"){
          comics.nextURL=comics.nextURL_tmp;
          comics.preURL=comics.preURL_tmp;
        }
        // console.log(parseInt(elem.getAttribute("data-chapter")));
        // console.log(comics.maxChapter);
        if(elem.getAttribute("data-chapter")==comics.maxChapter){
          comics.nextChapter.style.display="none";
        }else{
          comics.nextChapter.style.display="inline-block";
        }
        if(elem.getAttribute("data-chapter")==1){
          comics.preChapter.style.display="none";
        }else{
          comics.preChapter.style.display="inline-block";
        }
        return;
      }
    }

  };

  var debounceOrThrottle = function () {
    if(!useDebounce && !!poll) {
      return;
    }
    clearTimeout(poll);
    poll = setTimeout(function(){
      setInViewInfor();
      echo.render();
      poll = null;
    }, delay);
  };
  
  echo.init = function (opts) {
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
    setInViewInfor=opts.setInViewInfor || setInViewInfor;
    echo.render();
    if (document.addEventListener) {
      root.addEventListener('scroll', debounceOrThrottle, false);
      root.addEventListener('load', debounceOrThrottle, false);
    } else {
      root.attachEvent('onscroll', debounceOrThrottle);
      root.attachEvent('onload', debounceOrThrottle);
    }
  };

  echo.render = function () {
    var nodes = document.querySelectorAll('img[data-echo], [data-echo-background]');
    var length = nodes.length;
    var src, elem;
    var view = {
      l: 0 - offset.l,
      t: 0 - offset.t,
      b: (root.innerHeight || document.documentElement.clientHeight) + offset.b,
      r: (root.innerWidth || document.documentElement.clientWidth) + offset.r
    };
    for (var i = 0; i < length; i++) {
      elem = nodes[i];
      if (echo.checkView(elem, view)) {

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
          // elem.removeAttribute('data-echo');
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
    if (!length) {
      console.log("detach");
      update();
    }
  };

  

  echo.detach = function () {
    if (document.removeEventListener) {
      root.removeEventListener('scroll', debounceOrThrottle);
    } else {
      root.detachEvent('onscroll', debounceOrThrottle);
    }
    clearTimeout(poll);
  };

  return echo;

});
