/*! modify from echo.js v1.6.0 | (c) 2015 @toddmotto | https://github.com/toddmotto/echo */
  'use strict';

  var chapterAction=require("../actions/chapterAction.js");

  var echo = {};

  var imgRender=function(elem) {
      elem.src = elem.getAttribute('data-echo');
      elem.removeAttribute('data-echo');
  };

  // var offset=5000;

  var delay=500;

  var useDebounce=false;

  echo.hadInited=false;

  var checkView, setInViewInfor, scrollRender, panel, poll,update ;

  // var view = {
  //   t: 0 - offset,
  //   b: window.innerHeight + offset,
  // };
  
  var windowView={
    t:0,
    b:window.innerHeight
  };

  var debounceOrThrottle = function () {
    if(!useDebounce && !!poll) {
      return;
    }
    clearTimeout(poll);
    poll = setTimeout(function(){
      echo.render();  
      poll = null;
    }, delay);
  };
  var bSeachElem=function(nodes,begin,end){
    var index=Math.floor((begin+end)/2);
    // console.log(begin,end,index);
    if(begin===end) return index;
    var box=nodes[index].getBoundingClientRect(); 
    if(box.bottom<windowView.t){
      return bSeachElem(nodes,index,end);
    }else if(box.top>windowView.b){
      return bSeachElem(nodes,begin,index);
    }else if(box.bottom >= windowView.t && box.top <= windowView.b){
      return index;
    }
  };
  echo.init = function (opts) {
    // scrollRender=true;
    console.log("echo init");
    opts = opts || {};
    // panel=document.getElementById('comics_panel');
    imgRender=opts.imgRender || imgRender;
    echo.hadInited=true;
    echo.render();
    window.addEventListener('scroll', debounceOrThrottle, false);
    // window.addEventListener('load', debounceOrThrottle, false);
  };
  echo.render = function () {
    // panel=document.getElementById('comics_panel');
    // var nodes = echo.nodes;
    // var length = nodes.length;
    // var renderstatus=false;
    // var inforstatus=false;   
    // for (var i = 0; i < nodes.length; ++i) {
    //   var elem = nodes[i];
    //   if(elem.getAttribute('data-echo')){
    //     imgRender(elem);
    //   }
    //   var box=elem.getBoundingClientRect(); 
            
    // }
    if(echo.nodes.length===0) return;
    var index=bSeachElem(echo.nodes, 0, echo.nodes.length-1);
    var elem=echo.nodes[index];
    
    if(elem.getAttribute('data-num')){
      chapterAction.scroll(elem.getAttribute("data-chapter"),elem.getAttribute("data-num")+'/'+elem.getAttribute("data-pageMax"));  
    }

    if(!elem.style.maxHeight && elem.naturalWidth/elem.naturalHeight>1){
      var h=window.innerHeight-58;
      elem.style.maxHeight=h.toString()+'px';
      elem.style.width=Math.round(h*(elem.naturalWidth)/(elem.naturalHeight)).toString()+'px';
    }   
    
    if(elem.getAttribute('data-echo')) imgRender(elem);

    for(var i=1;i<=5;++i){
      if(index-i>=0){
        var elem=echo.nodes[index-i];
        if(!elem.style.maxHeight&&elem.naturalWidth/elem.naturalHeight>1){
          var h=window.innerHeight-58;
          elem.style.maxHeight=h.toString()+'px';
          elem.style.width=Math.round(h*(elem.naturalWidth)/(elem.naturalHeight)).toString()+'px';
        }
        if(elem.getAttribute('data-echo')) imgRender(elem);
      }
      if(index+i<echo.nodes.length){
        var elem=echo.nodes[index+i];
        if(!elem.style.maxHeight && elem.naturalWidth/elem.naturalHeight>1){
          var h=window.innerHeight-58;
          elem.style.maxHeight=h.toString()+'px';
          elem.style.width=Math.round(h*(elem.naturalWidth)/(elem.naturalHeight)).toString()+'px';
        }
        if(elem.getAttribute('data-echo')) imgRender(elem);
      }
    }
    
  };

  echo.nodes=[];

  // echo.render = function () {
  //   var nodes = panel.children;
  //   // var length = nodes.length;
  //   var renderstatus=false;
  //   var inforstatus=false;   
  //   for (var i = 0; i < nodes.length; ++i) {
  //     var elem = nodes[i];
  //     var box=elem.getBoundingClientRect();
  //     if (box.bottom >= view.t && box.top <= view.b) {
  //       if(elem.naturalWidth/elem.naturalHeight>1){
  //         // elem.removeAttribute('style');
  //         var h=window.innerHeight-58;
  //         elem.style.maxHeight=h.toString()+'px';
  //         elem.style.width="80%";
  //       }
  //       if(elem.getAttribute('data-num')&&(box.bottom >= windowView.t && box.top <= windowView.b)){
  //         if(!inforstatus){
  //           chapterAction.scroll(elem.getAttribute("data-chapter"),elem.getAttribute("data-num")+'/'+elem.getAttribute("data-pageMax"));
  //           inforstatus=true;
  //         }
  //       }  
  //       if(elem.getAttribute('data-echo')){
  //         renderstatus=true;
  //         imgRender(elem);
  //       }else if(renderstatus){
  //         break;
  //       }
  //     }
  //   }
  // };

  echo.run=function(){
    // scrollRender=true;
    echo.render();
  };

  // echo.detach = function () {
  //   window.removeEventListener('scroll', debounceOrThrottle);
  //   clearTimeout(poll);
  // };

  module.exports=echo;

