console.log("start reader");
var comics = comics || { };
comics.comicScript=document.createElement("script");
comics.comicScript.src=chrome.extension.getURL("comics.js");
comics.echoScript=document.createElement("script");
comics.echoScript.src=chrome.extension.getURL("echo.js");
comics.commicCss=document.createElement("link");
comics.commicCss.rel="stylesheet";
comics.commicCss.href=chrome.extension.getURL("comics.css");
(document.head||document.documentElement).appendChild(comics.commicCss);
(document.head||document.documentElement).appendChild(comics.echoScript);
(document.head||document.documentElement).appendChild(comics.comicScript);
// chrome.tabs.executeScript(null,{file: "reader.js"});



 