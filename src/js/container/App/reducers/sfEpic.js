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

const baseURL = 'http://comic.sfacg.com';
const FETCH_CHAPTER = 'FETCH_CHAPTER';
const FETCH_IMAGE_SRC = 'FETCH_IMAGE_SRC';
const FETCH_IMG_LIST = 'FETCH_IMG_LIST';
const UPDATE_READED = 'UPDATE_READED';
declare var chrome: any;

function fetchImgs$(chapter) {
  return Observable.ajax({
    url: `${baseURL}/${chapter}`,
    responseType: 'document',
  }).mergeMap(function fetchImgPageHandler({ response }) {
    const comicsID = /\.sfacg\.com\/(.*\/)$/.exec(
      response.querySelector('.AD_D2 > a:nth-child(1)').href,
    )[1];
    const scriptURL = /src=\"\/(Utility\/\d+.*\.js)\">/.exec(
      response.head.innerHTML,
    )[1];
    return Observable.of({ chapter, scriptURL, comicsID });
  });
}

function fetchScript$(scriptURL, chapter) {
  return Observable.ajax({
    url: `${baseURL}/${scriptURL}`,
    responseType: 'text',
  }).mergeMap(function scriptURLHandler({ response }) {
    let picCount;
    let hosts;
    let picAy;
    eval(response); // eslint-disable-line
    // $FlowFixMe
    const imgList = Array.from({ length: picCount }, (v, k) => ({
      src: `${hosts[1]}${picAy[k]}`,
      chapter,
    }));
    return Observable.of({ imgList });
  });
}

export function fetchImgSrcEpic(action$: any, store: { getState: Function }) {
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

export function fetchChapterPage$(url: string) {
  return Observable.ajax({
    url,
    responseType: 'document',
  }).mergeMap(function fetchChapterPageHandler({ response }) {
    const chapterNode = response.querySelectorAll(
      '.serialise_list.Blue_link2 > li > a',
    );
    const title = response.querySelector(
      'body > table > tbody > tr > td:nth-child(1) > table:nth-child(2) > tbody > tr > td > h1 > b',
    ).textContent;
    const coverURL = response.querySelector('.comic_cover > img').src;
    const chapterList = map(chapterNode, n =>
      n.getAttribute('href').replace(/^(\/)/g, ''),
    );
    const chapters = reduce(
      chapterNode,
      (acc, n) => ({
        ...acc,
        [n.getAttribute('href').replace(/^(\/)/g, '')]: {
          title: n.textContent,
          href: n.href,
        },
      }),
      {},
    );
    return Observable.of({ title, coverURL, chapterList, chapters });
  });
}

export function fetchImgListEpic(action$: any, store: { getState: Function }) {
  return action$.ofType(FETCH_IMG_LIST).mergeMap(action => {
    const { chapterList } = store.getState().comics;
    const chapter = chapterList[action.index];
    return fetchImgs$(chapter).mergeMap(({ scriptURL }) => {
      return fetchScript$(scriptURL, chapter).mergeMap(({ imgList }) => {
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
  });
}

export function fetchImgList(index: number) {
  return { type: FETCH_IMG_LIST, index };
}

export function fetchChapterEpic(action$: any) {
  return action$.ofType(FETCH_CHAPTER).mergeMap(action =>
    fetchImgs$(action.chapter).mergeMap(({ chapter, scriptURL, comicsID }) => {
      return Observable.merge(
        Observable.of(updateComicsID(comicsID)),
        fetchScript$(scriptURL, action.chapter).mergeMap(({ imgList }) => [
          concatImageList(imgList),
          updateRenderIndex(0, 6),
          fetchImgSrc(0, 6),
          startScroll(),
        ]),
        fetchChapterPage$(`${baseURL}/${comicsID}`).mergeMap(
          ({ title, coverURL, chapterList, chapters }) => {
            const chapterIndex = findIndex(
              chapterList,
              item => item === chapter,
            );
            return Observable.bindCallback(chrome.storage.local.get)().mergeMap(
              item => {
                const newItem = {
                  ...item,
                  update: filter(
                    item.update,
                    updateItem =>
                      updateItem.site !== 'sf' ||
                      updateItem.chapterID !== chapter,
                  ),
                  history: [
                    {
                      site: 'sf',
                      comicsID,
                    },
                    ...filter(
                      item.history,
                      historyItem =>
                        historyItem.site !== 'sf' ||
                        historyItem.comicsID !== comicsID,
                    ),
                  ],
                  sf: {
                    ...item.sf,
                    [comicsID]: {
                      title,
                      chapters,
                      chapterList,
                      coverURL,
                      chapterURL: `${baseURL}/${comicsID}`,
                      lastReaded: chapter,
                      readedChapters: {
                        ...(item.sf[comicsID]
                          ? item.sf[comicsID].readedChapters
                          : {}),
                        [chapter]: chapter,
                      },
                    },
                  },
                };
                const subscribe = some(
                  item.subscribe,
                  citem => citem.site === 'sf' && citem.comicsID === comicsID,
                );
                chrome.browserAction.setBadgeText({
                  text: `${
                    newItem.update.length === 0 ? '' : newItem.update.length
                  }`,
                });
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
                      updateReadedChapters(newItem.sf[comicsID].readedChapters),
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
          },
        ),
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
          uitem => uitem.site !== 'sf' || uitem.chapterID !== chapterID,
        ),
        sf: {
          ...item.sf,
          [comicsID]: {
            ...item.sf[comicsID],
            lastReaded: chapterID,
            readedChapters: {
              ...item.sf[comicsID].readedChapters,
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
          updateReadedChapters(newItem.sf[comicsID].readedChapters),
          updateChapterNowIndex(action.index),
        ];
      });
    }),
  );
}

export function updateReaded(index: number) {
  return { type: UPDATE_READED, index };
}
