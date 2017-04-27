// @flow
import {
  fetchChapterEpic as fetchChapterEpicDM5,
  fetchChapter as fetchChapterDM5,
  fetchImgSrcEpic as fetchImgSrcEpicDM5,
  fetchImgSrc as fetchImgSrcDM5,
  fetchImgListEpic as fetchImgListEpicDM5,
  fetchImgList as fetchImgListDM5,
  updateReadedEpic as updateReadedEpicDM5,
  updateReaded as updateReadedDM5,
} from './dm5Epic';

import {
  fetchChapterEpic as fetchChapterEpicSF,
  fetchChapter as fetchChapterSF,
  fetchImgSrcEpic as fetchImgSrcEpicSF,
  fetchImgSrc as fetchImgSrcSF,
  fetchImgListEpic as fetchImgListEpicSF,
  fetchImgList as fetchImgListSF,
  updateReadedEpic as updateReadedEpicSF,
  updateReaded as updateReadedSF,
} from './sfEpic';

import {
  fetchChapterEpic as fetchChapterEpicComicbus,
  fetchChapter as fetchChapterComicbus,
  fetchImgSrcEpic as fetchImgSrcEpicComicbus,
  fetchImgSrc as fetchImgSrcComicbus,
  fetchImgListEpic as fetchImgListEpicComicbus,
  fetchImgList as fetchImgListComicbus,
  updateReadedEpic as updateReadedEpicComicbus,
  updateReaded as updateReadedComicbus,
} from './comicBusEpic';

function getInfor(site) {
  switch (site) {
    case 'dm5':
      return {
        site,
        baseURL: 'http://www.dm5.com',
      };
    case 'sf':
      return {
        site,
        baseURL: 'http://comic.sfacg.com',
      };
    case 'comicbus':
      return {
        site,
        baseURL: 'http://www.comicbus.com',
      };
    default:
      return {};
  }
}

function getAction(site) {
  switch (site) {
    case 'dm5':
      return {
        fetchChapter: fetchChapterDM5,
        fetchImgSrc: fetchImgSrcDM5,
        fetchImgList: fetchImgListDM5,
        updateReaded: updateReadedDM5,
      };
    case 'sf':
      return {
        fetchChapter: fetchChapterSF,
        fetchImgSrc: fetchImgSrcSF,
        fetchImgList: fetchImgListSF,
        updateReaded: updateReadedSF,
      };
    case 'comicbus':
      return {
        fetchChapter: fetchChapterComicbus,
        fetchImgSrc: fetchImgSrcComicbus,
        fetchImgList: fetchImgListComicbus,
        updateReaded: updateReadedComicbus,
      };
    default:
      return {};
  }
}

function getEpic(site) {
  switch (site) {
    case 'dm5':
      return {
        fetchChapterEpic: fetchChapterEpicDM5,
        fetchImgSrcEpic: fetchImgSrcEpicDM5,
        fetchImgListEpic: fetchImgListEpicDM5,
        updateReadedEpic: updateReadedEpicDM5,
      };
    case 'sf':
      return {
        fetchChapterEpic: fetchChapterEpicSF,
        fetchImgSrcEpic: fetchImgSrcEpicSF,
        fetchImgListEpic: fetchImgListEpicSF,
        updateReadedEpic: updateReadedEpicSF,
      };
    case 'comicbus':
      return {
        fetchChapterEpic: fetchChapterEpicComicbus,
        fetchImgSrcEpic: fetchImgSrcEpicComicbus,
        fetchImgListEpic: fetchImgListEpicComicbus,
        updateReadedEpic: updateReadedEpicComicbus,
      };
    default:
      return {};
  }
}

const _site = (/site=(.*)&/.test(document.URL)) ? /site=(.*)&/.exec(document.URL)[1] : ''; //eslint-disable-line

export const {
  site,
  baseURL,
} = getInfor(_site);

export const {
  fetchChapter,
  fetchImgSrc,
  fetchImgList,
  updateReaded,
} = getAction(_site);

export const {
  fetchChapterEpic,
  fetchImgSrcEpic,
  fetchImgListEpic,
  updateReadedEpic,
} = getEpic(_site);
