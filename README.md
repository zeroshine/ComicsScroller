# Comics Scroller
ComicsScroller is a chrome extension which makes the comics websites show all images of one chapter in the single page. And it will append all the images in the next chapter in the end of pages automatically when users scroll to the bottom of the page. It also can subscribe comics and notify you when there is an update.  

厭倦不斷跳出廣告跟要一張一張圖片往下點的漫畫網站了嘛？  
Comics Scroller 是一個 chrome extenstion 的開源專案  
基於 react & redux-observable 的技術  
在漫畫網站點進章節以後可以一次把一話的圖片全部秀出來，  
看完一話之後也會自動載入下一話的圖片，你只需要一直捲動頁面就好，  
自動記錄觀看過的章節，讓你不會忘記上次看到哪  
訂閱漫畫，漫畫更新會自動通知你  
直接跳轉本地端頁面 乾淨 無廣告 無惡意多餘javascritp程式碼  

# Support Websites
無限動漫  
http://www.comicbus.com/  

SFACG  
http://comic.sfacg.com/  

動漫屋  
http://www.dm5.com/      

# Chrome Web Store
https://chrome.google.com/webstore/detail/comics-scroller/mccpalfmlnjadfnojmphffidnbemnkec

# Official Site
http://zeroshine.github.io/ComicsScroller/

# Developing ComicsScroller
use webpack and flowtype and react to build  
## Install modules  
```
npm install
```
or
```
yarn
```
## Run dev server
```
npm start
```
And then you can go to chrome://extensions add your-project-path/ComicsScroller to your chrome for developing with hot-reload  

## Build extension  
```
npm run product
```

## Test
Use jest to test.  
But I am too busy to write enough test and will add more tests in the future.

```
npm test
```

# LICENSE
The MIT License (MIT)
