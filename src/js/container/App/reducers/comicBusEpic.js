// @flow
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax';
import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import map from 'lodash/map';
import findIndex from 'lodash/findIndex';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import some from 'lodash/some';
import {
  updateTitle,
  updateComicsID,
  updateChapters,
  updateChapterList,
  concatImageList,
  loadImgSrc,
  updateChapterLatestIndex,
  updateChapterNowIndex,
  updateRenderIndex,
  updateReadedChapters,
  updateSubscribe,
} from './comics';
import { startScroll } from './scrollEpic';

const baseURL = 'http://www.comicbus.com';
const FETCH_CHAPTER = 'FETCH_CHAPTER';
const FETCH_IMAGE_SRC = 'FETCH_IMAGE_SRC';
const FETCH_IMG_LIST = 'FETCH_IMG_LIST';
const UPDATE_READED = 'UPDATE_READED';

declare var chrome: any;
type Store = {
  getState: Function,
};

function fetchImgs$(chapter: string) {
  return Observable.ajax({
    url: `${baseURL}/online/${chapter}`,
    responseType: 'document',
  }).mergeMap(function fetchImgPageHandler({ response }) {
    /* eslint-disable */
    eval(
      /(var chs.*var cs=\'[^']+\';)/.exec(
        response.querySelector('#Form1 > script').textContent,
      )[1],
    );
    let ch = /.*ch\=(.*)/.exec(chapter)[1];
    if (ch.indexOf('#') > 0) {
      ch = ch.split('#')[0];
    }
    const f = 50;
    if (ch.indexOf('-') > 0) {
      ch = ch.split('-')[0];
    }
    if (ch === '') {
      ch = 1;
    } else {
      ch = parseInt(ch, 10);
    }
    const ss = (a, b, c, d) => {
      const e = a.substring(b, b + c);
      return d == null ? e.replace(/[a-z]*/gi, '') : e;
    };
    const nn = n => (n < 10 ? '00' + n : n < 100 ? '0' + n : n);
    const mm = p => parseInt((p - 1) / 10, 10) % 10 + ((p - 1) % 10) * 3;
    let c = '';
    // $FlowFixMe
    const cc = cs.length;
    for (let j = 0; j < cc / f; j += 1) {
      // $FlowFixMe
      if (ss(cs, j * f, 4) == ch) {
        c = ss(cs, j * f, f, f);
        break;
      }
    }
    if (c == '') {
      c = ss(cs, cc - f, f);
      ch = c;
    }
    const ps = ss(c, 7, 3);
    const imgList = [];
    // $FlowFixMe
    for (let i = 0; i < ps; i += 1) {
      let c = '';
      const cc = cs.length;
      for (let j = 0; j < cc / f; j += 1) {
        // $FlowFixMe
        if (ss(cs, j * f, 4) == ch) {
          c = ss(cs, j * f, f, f);
          break;
        }
      }
      if (c == '') {
        c = ss(cs, cc - f, f);
        // $FlowFixMe
        ch = chs;
      }
      // $FlowFixMe
      const src = `http://img${ss(c, 4, 2)}.6comic.com:99/${ss(
        c,
        6,
        1,
      )}/${ti}/${ss(c, 0, 4)}/${nn(i + 1)}_${ss(c, mm(i + 1) + 10, 3, f)}.jpg`;
      imgList.push({
        chapter,
        src,
      });
    }
    // $FlowFixMe
    return Observable.of({ imgList, comicsID: ti });
    /* eslint-enable */
  });
}

export function fetchImgSrcEpic(action$: any, store: Store) {
  return action$.ofType(FETCH_IMAGE_SRC).mergeMap(action => {
    const { result, entity } = store.getState().comics.imageList;
    return Observable.from(result)
      .filter(item => {
        return (
          item >= action.begin &&
          item <= action.end &&
          entity[item].loading &&
          entity[item].type !== 'end'
        );
      })
      .map(id => {
        return loadImgSrc(entity[id].src, id);
      });
  });
}

export function fetchImgSrc(begin: number, end: number) {
  return { type: FETCH_IMAGE_SRC, begin, end };
}

export function fetchChapterPage$(url: string, comicsID: string) {
  return Observable.ajax({
    url,
    responseType: 'document',
  }).mergeMap(function fetchChapterPageHandler({ response }) {
    const chapterNodes = response.querySelectorAll('.ch');
    const volNodes = response.querySelectorAll('.vol');
    const title = response.title.split(',')[0];
    const coverURL = `${baseURL}/pics/0/${comicsID}.jpg`;
    const chapterList = [
      ...map(chapterNodes, n => {
        const arr = /\'(.*)-(.*)\.html/.exec(n.getAttribute('onclick'));
        return `comic-${arr[1]}.html?ch=${arr[2]}`;
      }).reverse(),
      ...map(volNodes, n => {
        const arr = /\'(.*)-(.*)\.html/.exec(n.getAttribute('onclick'));
        return `comic-${arr[1]}.html?ch=${arr[2]}`;
      }).reverse(),
    ];
    const chapters = {
      ...reduce(
        chapterNodes,
        (acc, n) => {
          const arr = /\'(.*)-(.*)\.html/.exec(n.getAttribute('onclick'));
          return {
            ...acc,
            [`comic-${arr[1]}.html?ch=${arr[2]}`]: {
              title:
                n.children.length > 0
                  ? n.children[0].textContent
                  : n.textContent,
              href: `${baseURL}/online/comic-${arr[1]}.html?ch=${arr[2]}`,
            },
          };
        },
        {},
      ),
      ...reduce(
        volNodes,
        (acc, n) => {
          const arr = /\'(.*)-(.*)\.html/.exec(n.getAttribute('onclick'));
          return {
            ...acc,
            [`comic-${arr[1]}.html?ch=${arr[2]}`]: {
              title:
                n.children.length > 0
                  ? n.children[0].textContent
                  : n.textContent,
              href: `${baseURL}/online/comic-${arr[1]}.html?ch=${arr[2]}`,
            },
          };
        },
        {},
      ),
    };
    return Observable.of({ title, coverURL, chapterList, chapters });
  });
}

export function fetchImgListEpic(action$: any, store: Store) {
  return action$.ofType(FETCH_IMG_LIST).mergeMap(action => {
    const { chapterList } = store.getState().comics;
    const chapter = chapterList[action.index];
    return fetchImgs$(chapter).mergeMap(({ imgList }) => {
      const nowImgList = store.getState().comics.imageList.result;
      if (nowImgList.length === 0) {
        return [
          concatImageList(imgList),
          updateRenderIndex(0, 6),
          fetchImgSrc(0, 6),
          startScroll(),
        ];
      }
      return [concatImageList(imgList)];
    });
  });
}

export function fetchImgList(index: number) {
  return { type: FETCH_IMG_LIST, index };
}

export function fetchChapterEpic(action$: any) {
  return action$.ofType(FETCH_CHAPTER).mergeMap(action =>
    fetchImgs$(action.chapter).mergeMap(({ imgList, comicsID }) => {
      return Observable.merge(
        Observable.of(updateComicsID(comicsID)),
        Observable.of(concatImageList(imgList)),
        Observable.of(updateRenderIndex(0, 6)),
        Observable.of(fetchImgSrc(0, 6)),
        Observable.of(startScroll()),
        fetchChapterPage$(
          `${baseURL}/html/${comicsID}.html`,
          comicsID,
        ).mergeMap(({ title, coverURL, chapterList, chapters }) => {
          const chapterIndex = findIndex(
            chapterList,
            item => item === action.chapter,
          );
          return Observable.bindCallback(chrome.storage.local.get)().mergeMap(
            item => {
              const newItem = {
                ...item,
                update: filter(
                  item.update,
                  updateItem =>
                    updateItem.site !== 'comicbus' ||
                    updateItem.chapterID !== action.chapter,
                ),
                history: [
                  {
                    site: 'comicbus',
                    comicsID,
                  },
                  ...filter(
                    item.history,
                    historyItem =>
                      historyItem.site !== 'comicbus' ||
                      historyItem.comicsID !== comicsID,
                  ),
                ],
                comicbus: {
                  ...item.comicbus,
                  [comicsID]: {
                    title,
                    chapters,
                    chapterList,
                    coverURL,
                    chapterURL: `${baseURL}/html/${comicsID}.html`,
                    lastReaded: action.chapter,
                    readedChapters: {
                      ...(item.comicbus[comicsID]
                        ? item.comicbus[comicsID].readedChapters
                        : {}),
                      [action.chapter]: action.chapter,
                    },
                  },
                },
              };
              chrome.browserAction.setBadgeText({
                text: `${
                  newItem.update.length === 0 ? '' : newItem.update.length
                }`,
              });
              const subscribe = some(
                item.subscribe,
                citem =>
                  citem.site === 'comicbus' && citem.comicsID === comicsID,
              );
              return Observable.merge(
                Observable.of(updateSubscribe(subscribe)),
                Observable.bindCallback(chrome.storage.local.set)(
                  newItem,
                ).mergeMap(() => {
                  chrome.browserAction.setBadgeText({
                    text: `${
                      newItem.update.length === 0 ? '' : newItem.update.length
                    }`,
                  });
                  const result$ = [
                    updateTitle(title),
                    updateReadedChapters(
                      newItem.comicbus[comicsID].readedChapters,
                    ),
                    updateChapters(chapters),
                    updateChapterList(chapterList),
                    updateChapterNowIndex(chapterIndex),
                  ];
                  if (chapterIndex > 0) {
                    result$.push(
                      fetchImgList(chapterIndex - 1),
                      updateChapterLatestIndex(chapterIndex - 1),
                    );
                  } else {
                    result$.push(updateChapterLatestIndex(chapterIndex - 1));
                  }
                  return result$;
                }),
              );
            },
          );
        }),
      );
    }),
  );
}

export function fetchChapter(chapter: string) {
  return { type: FETCH_CHAPTER, chapter };
}

export function updateReadedEpic(action$: any, store: { getState: Function }) {
  return action$.ofType(UPDATE_READED).mergeMap(action =>
    Observable.bindCallback(chrome.storage.local.get)().mergeMap(item => {
      const { comicsID, chapterList } = store.getState().comics;
      const chapterID = chapterList[action.index];
      const newItem = {
        ...item,
        update: filter(
          item.update,
          uitem => uitem.site !== 'comicbus' || uitem.chapterID !== chapterID,
        ),
        comicbus: {
          ...item.comicbus,
          [comicsID]: {
            ...item.comicbus[comicsID],
            lastReaded: chapterID,
            readedChapters: {
              ...item.comicbus[comicsID].readedChapters,
              [chapterID]: chapterID,
            },
          },
        },
      };
      return Observable.bindCallback(chrome.storage.local.set)(
        newItem,
      ).mergeMap(() => {
        chrome.browserAction.setBadgeText({
          text: `${newItem.update.length === 0 ? '' : newItem.update.length}`,
        });
        return [
          updateReadedChapters(newItem.comicbus[comicsID].readedChapters),
          updateChapterNowIndex(action.index),
        ];
      });
    }),
  );
}

export function updateReaded(index: number) {
  return { type: UPDATE_READED, index };
}
