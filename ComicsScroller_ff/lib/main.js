var tabs=require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
var { ToggleButton } = require("sdk/ui/button/toggle");
var ss=require("sdk/simple-storage");
var panels = require("sdk/panel");
var notifications = require("sdk/notifications");
var { setInterval } = require("sdk/timers");
var Comics_sf=require('./comics_sf.js');
var Comics_8=require('./comics_8.js');
var Comics_dm5=require('./comics_dm5.js');

ss.storage.readed=ss.storage.readed||[];
ss.storage.collected=ss.storage.collected||[];
ss.storage.update=ss.storage.update||[];


var panel = panels.Panel({
  height:402,
  width:502,
  contentURL: "./popup.html",
  contentScriptFile: "./popup_min.js",
  contentStyleFile: "./popup_min.css",
  contentScriptOptions:{
    collected:ss.storage.collected,
    readed:ss.storage.readed,
    update:ss.storage.update
  },
  onHide: handleHide
});

panel.on('show',function(){
    var obj={};
    obj.readed=ss.storage.readed;
    obj.update=ss.storage.update;
    obj.collected=ss.storage.collected;
    panel.port.emit('show',JSON.stringify(obj));
});

panel.port.on('open',function(msg){
    tabs.open(msg);
});

panel.port.on('saveReaded',function(msg){
    var obj=JSON.parse(msg);
    console.log('saveReaded',obj);
    ss.storage.readed=obj;
});

panel.port.on('saveUpdate',function(msg){
    var obj=JSON.parse(msg);
    ss.storage.update=obj;
});

panel.port.on('saveCollected',function(msg){
    var obj=JSON.parse(msg);
    ss.storage.collected=obj;
});

var button = ToggleButton({
    id: "Comics_Scroller",
    label: "Comics Scroller",
     icon: {
      "16": "./comics-16.png",
      "48": "./comics-48.png",
      "64": "./comics-64.png"
    },
    onChange: handleClick
});

function handleHide(){
    button.state('window',{checked:false});
}

function handleClick(state){
    if(state.checked){
        panel.show({
            position:button
        });
    }
}

pageMod.PageMod({
    include: "http://zeroshine.github.io/ComicsScroller/*",
    contentScriptWhen: "ready",
    contentScriptFile: ["./app_min.js"],
    contentStyleFile: ["./app_min.css"],
    contentScriptOptions:{
        collected:ss.storage.collected,
        readed:ss.storage.readed
    },
    onAttach:function(worker){
        worker.port.on('saveReaded',function(msg){
            var readedItems=ss.storage.readed;
            var obj=JSON.parse(msg);
            var array=[];
            // console.log(readedItems);
            // console.log('obj.url',obj.url);
            for(var i=0;i<readedItems.length;++i){
              // console.log('readedItems',readedItems[i].url);
              if(readedItems[i].url!==obj.url){
                array.push(readedItems[i]);    
              }
            }
            array.push(obj);
            // console.log('onAttach',array);
            ss.storage.readed=array;
            var collectedItems=ss.storage.collected;
            for(var i=0;i<collectedItems.length;++i){
              if(collectedItems[i].url===obj.url){
                collectedItems[i].lastReaded=obj.lastReaded;
                collectedItems[i].menuItems=obj.menuItems;
                collectedItems[i].markedPayload=obj.markedPayload;
              }
            }
            ss.storage.collected=collectedItems;
        });
        worker.port.on('saveCollected',function(msg){
            var obj=JSON.parse(msg);
            ss.storage.collected=obj;
        });
    }
});


var urlRegEX_8comics=/http\:\/\/new\.comicvip\.com\/show\/(.*-\d*.html\?ch=\d*)/;
var urlRegEX_sf=/http\:\/\/comic\.sfacg\.com\/(HTML\/[^\/]+\/.+)$/;
var urlRegEX_manben=/http\:\/\/www\.manben\.com\/(m\d*\/)/;
var urlRegEX_dm5=/http\:\/\/(tel||www)\.dm5\.com\/(m\d*\/)/;
// var url=data.url('reader.html').slice(0,-16);

tabs.on('ready',function(tab){
    if(urlRegEX_8comics.test(tab.url)){
        var chapter=urlRegEX_8comics.exec(tab.url)[1];
        tab.url="http://zeroshine.github.io/ComicsScroller/reader.html#/site/comics8/chapter/"+chapter;
    }else if(urlRegEX_sf.test(tab.url)){
        var chapter=urlRegEX_sf.exec(tab.url)[1];
        tab.url="http://zeroshine.github.io/ComicsScroller/reader.html#/site/sf/chapter/"+chapter;
    }else if(urlRegEX_manben.test(tab.url)||urlRegEX_dm5.test(tab.url)){
        var chapter=""
        if(urlRegEX_dm5.test(tab.url)){
            chapter=urlRegEX_dm5.exec(tab.url)[2];
        }else{
            chapter=urlRegEX_manben.exec(tab.url)[1];
        }
        tab.url="http://zeroshine.github.io/ComicsScroller/reader.html#/site/dm5/chapter/"+chapter;
    }
});



var events = require("sdk/system/events");
var { Cc,Ci } = require("chrome");
// Cu.import("resource://gre/modules/Services.jsm");

function listener(event) {
    var channel = event.subject.QueryInterface(Ci.nsIHttpChannel);    
    var url=channel.URI.spec;
    if(/www\.manben\.com\//.test(url)||/.*\.cdndm5.com\//.test(url)){
        // var channel = event.subject.QueryInterface(Ci.nsIHttpChannel);
        // console.log('channel referrer',channel.referrer);
        // console.log('change header',url);    
        // channel.setRequestHeader("User-Agent", "MyBrowser/1.0", false);
        // channel.referrer='http://www.manben.com';
        channel.setRequestHeader("Referer", "http://www.manben.com", false);
        channel.setRequestHeader("Cookie", "isAdult=1", false);
        // if (channel.referrer) channel.referrer.spec ='http://www.manben.com';
        
    }
}

events.on("http-on-modify-request", listener);

var comicsQuery = function(){
    // console.log("comicsQuery");
    // button.badge='1';
    // notifications.notify({
    //     title: "Comics Update",
    //     text: "test",
    //     iconURL:'./comics-128.png',
    // });    
    // chrome.storage.local.get('collected',function(items){
    var items=ss.storage.collected;
    for(var k=0;k<items.length;++k){
        var indexURL=items[k].url;
        var chapters=items[k].menuItems;
        var req=new XMLHttpRequest();
        req.open('GET',indexURL);
        req.responseType="document";
        if(items[k].site==='sf'){
            req.onload=(function(button,indexURL,chapters,req,items,k,Comics_sf){
                return function(){
                    Comics_sf.backgroundOnload(button,indexURL, chapters, req, items, k);
                }           
            })(button,indexURL,chapters,req,items,k,Comics_sf);
        }else if(items[k].site==='comics8'){
            req.onload=(function(button,indexURL,chapters,req,items,k,Comics_8){
                return function(){
                    Comics_8.backgroundOnload(button,indexURL, chapters, req, items, k);
                }           
            })(button,indexURL,chapters,req,items,k,Comics_8);
        }else if(items[k].site==='dm5'){
            req.onload=(function(button,indexURL,chapters,req,items,k,Comics_dm5){
                return function(){
                    Comics_dm5.backgroundOnload(button,indexURL, chapters, req, items, k);
                }           
            })(button,indexURL,chapters,req,items,k,Comics_dm5);
        }
        req.send();
    }
}

setInterval(comicsQuery,60000);