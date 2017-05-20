// @flow
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import initObject from './util/initObject';
import {
  fetchChapterPage$ as fetchChapterPage$Dm5,
} from './container/App/reducers/dm5Epic';
import {
  fetchChapterPage$ as fetchChapterPage$Sf,
} from './container/App/reducers/sfEpic';
import {
  fetchChapterPage$ as fetchChapterPage$comicbus,
} from './container/App/reducers/comicBusEpic';

const dm5Regex = /http\:\/\/(tel||www)\.dm5\.com\/(m\d+)\//;
const sfRegex = /http\:\/\/comic\.sfacg\.com\/(HTML\/[^\/]+\/.+)$/;
const comicbusRegex = /http\:\/\/(www|v)\.comicbus.com\/online\/(comic-\d+\.html\?ch=.*$)/;

declare var chrome: any;
declare var ga: any;

const fetchChapterPage$ = {
  sf: fetchChapterPage$Sf,
  dm5: fetchChapterPage$Dm5,
  comicbus: fetchChapterPage$comicbus,
};

function dm5RefererHandler(details) {
  return {
    requestHeaders: [
      ...details.requestHeaders,
      {
        name: 'Referer',
        value: 'http://www.dm5.com/',
      },
    ],
  };
}

function dm5CookieHandler(details) {
  return {
    requestHeaders: map(details.requestHeaders, item => {
      if (item.name === 'Cookie') {
        return {
          name: item.name,
          value: `${item.value};isAdult=1`,
        };
      }
      return item;
    }),
  };
}

function sfRefererHandler(details) {
  return {
    requestHeaders: [
      ...details.requestHeaders,
      {
        name: 'Referer',
        value: 'http://comic.sfacg.com/HTML/',
      },
    ],
  };
}

chrome.browserAction.setBadgeBackgroundColor({ color: '#F00' });

chrome.webRequest.onBeforeSendHeaders.addListener(
  dm5RefererHandler,
  { urls: ['http://www.dm5.com/m*/chapterfun*'] },
  ['requestHeaders', 'blocking'],
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  dm5CookieHandler,
  { urls: ['http://www.dm5.com/m*/'] },
  ['requestHeaders', 'blocking'],
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  sfRefererHandler,
  { urls: ['http://*.sfacg.com/*'] },
  ['requestHeaders', 'blocking'],
);

chrome.notifications.onClicked.addListener(id => {
  if (id !== 'Comics Scroller Update') {
    chrome.tabs.create({ url: id });
  }
  chrome.notifications.clear(id);
});

function comicsQuery() {
  chrome.storage.local.get(item => {
    if (typeof item !== 'undefined' && typeof item.subscribe !== 'undefined') {
      chrome.browserAction.setBadgeText({
        text: `${item.update.length > 0 ? item.update.length : ''}`,
      });
      forEach(item.subscribe, ({ site, comicsID }) => {
        const { chapterURL } = item[site][comicsID];
        const fetchChapterPage = fetchChapterPage$[site];
        fetchChapterPage(
          chapterURL,
        ).subscribe(({ title, chapterList, coverURL, chapters }) => {
          const comic = item[site][comicsID];
          forEach(chapterList, chapterID => {
            if (!comic.chapters[chapterID]) {
              chrome.storage.local.get(oldStore =>
                chrome.storage.local.set(
                  {
                    ...oldStore,
                    [site]: {
                      ...oldStore[site],
                      [comicsID]: {
                        ...oldStore[site][comicsID],
                        title,
                        chapterList,
                        coverURL,
                        chapters,
                      },
                    },
                    update: [
                      {
                        site,
                        chapterID,
                        updateChapter: {
                          title: chapters[chapterID].title,
                          href: chapters[chapterID].href,
                        },
                        comicsID,
                      },
                      ...oldStore.update,
                    ],
                  },
                  () =>
                    chrome.notifications.create(
                      chapters[chapterID].href,
                      {
                        type: 'image',
                        title: 'Comics Scroller Update',
                        iconUrl: './imgs/comics-48.png',
                        imageUrl: coverURL,
                        message: `${comic.title} ${title} 更新`,
                      },
                      () =>
                        chrome.storage.local.get(store =>
                          chrome.browserAction.setBadgeText({
                            text: `${store.update.length}`,
                          }),
                        ),
                    ),
                ),
              );
            }
          });
        });
      });
    }
  });
}

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'update') {
    chrome.storage.local.get(item => {
      const { version } = chrome.runtime.getManifest();
      if (!item.version) {
        chrome.storage.local.clear();
        chrome.storage.local.set(initObject);
      } else {
        chrome.storage.local.set({ ...initObject, ...item });
      }
      chrome.notifications.create('Comics Scroller Update', {
        type: 'basic',
        iconUrl: './imgs/comics-128.png',
        title: 'Comics Scroller Update',
        message: `Comics Scroller 版本 ${version} 更新`,
      });
    });
  }
});

chrome.webNavigation.onBeforeNavigate.addListener(
  details => {
    if (comicbusRegex.test(details.url)) {
      console.log('comicbus fired');
      const chapter = comicbusRegex.exec(details.url)[2];
      chrome.tabs.update(details.tabId, {
        url: `${chrome.extension.getURL('app.html')}?site=comicbus&chapter=${chapter}`,
      });
      ga('send', 'event', 'comicbus view');
    } else if (sfRegex.test(details.url)) {
      console.log('sf fired');
      const chapter = sfRegex.exec(details.url)[1];
      chrome.tabs.update(details.tabId, {
        url: `${chrome.extension.getURL('app.html')}?site=sf&chapter=${chapter}`,
      });
      ga('send', 'event', 'sf view');
    } else if (dm5Regex.test(details.url)) {
      console.log('dm5 fired');
      let chapter = '';
      chapter = dm5Regex.exec(details.url)[2];
      chrome.tabs.update(details.tabId, {
        url: `${chrome.extension.getURL('app.html')}?site=dm5&chapter=${chapter}`,
      });
      ga('send', 'event', 'dm5 view');
    }
  },
  {
    url: [
      { urlMatches: 'comicbus\.com\/online\/.*$' },
      { urlMatches: 'comic\.sfacg\.com\/HTML\/[^\/]+\/.+$' },
      { urlMatches: 'http://(tel||www)\.dm5\.com/m\d*' },
    ],
  },
);

chrome.alarms.create('comcisScroller', {
  when: Date.now(),
  periodInMinutes: 10,
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'comcisScroller') {
    comicsQuery();
  }
});

/* eslint-disable */
// prettier-ignore
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
// $FlowFixMe
m=s.getElementsByTagName(o)[0];a.alocal=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://ssl.google-analytics.com/analytics.js','ga');
ga('create', 'UA-59728771-1', 'auto');
ga('set', 'checkProtocolTask', null);
ga('send', 'pageview');
