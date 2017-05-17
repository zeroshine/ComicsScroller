// @flow
import reduce from 'lodash/reduce';
import { site, baseURL } from './getAction';

type State = {
  innerHeight: number,
  site: string,
  comicsID: string,
  title: string,
  chapterLatestIndex: number,
  chapterNowIndex: number,
  baseURL: string,
  subscribe: boolean,
  chapters: {},
  chapterList: Array<*>,
  readedChapters: {},
  renderBeginIndex: number,
  renderEndIndex: number,
  imageList: {
    result: Array<*>,
    entity: {},
  },
};

type Action = {
  type: string,
  src: string,
  data: any,
  index: number,
  begin: number,
  end: number,
  height: number,
  innerHeight: number,
};

const initialState = {
  innerHeight: window.innerHeight,
  site,
  comicsID: '',
  title: '',
  chapterLatestIndex: 0,
  chapterNowIndex: 0,
  baseURL,
  subscribe: false,
  chapters: {},
  chapterList: [],
  readedChapters: {},
  renderBeginIndex: 0,
  renderEndIndex: 0,
  imageList: {
    result: [],
    entity: {},
  },
};

const UPDATE_COMICS_ID = 'UPDATE_COMICS_ID';
const UPDATE_SUBSCRIBE = 'UPDATE_SUBSCRIBE';
const UPDATE_TITLE = 'UPDATE_TITLE';
const UPDATE_CHAPTERS = 'UPDATE_CHAPTERS';
const UPDATE_CHAPTER_LIST = 'UPDATE_CHAPTER_LIST';
const UPDATE_CHAPTER_LATEST_INDEX = 'UPDATE_CHAPTER_LATEST_INDEX';
const UPDATE_CHAPTER_NOW_INDEX = 'UPDATE_CHAPTER_NOW_INDEX';
const UPDATE_RENDER_INDEX = 'UPDATE_RENDER_INDEX';
const UPDATE_READED_CHAPTERS = 'UPDATE_READED_CHAPTERS';
const CONCAT_IMAGE_LIST = 'CONCAT_IMAGE_LIST';
const LOAD_IMAGE_SRC = 'LOAD_IMAGE_SRC';
const UPDATE_IMAGE_TYPE = 'UPDATE_IMAGE_TYPE';
const UPDATE_INNER_HEIGHT = 'UPDATE_INNER_HEIGHT';
const RESET_IMAGE = 'RESET_IMAGE';

export default function comics(state: State = initialState, action: Action) {
  switch (action.type) {
    case LOAD_IMAGE_SRC:
      if (action.index >= 0) {
        return {
          ...state,
          imageList: {
            ...state.imageList,
            entity: {
              ...state.imageList.entity,
              [action.index]: {
                ...state.imageList.entity[action.index],
                src: action.src,
                loading: false,
              },
            },
          },
        };
      }
      return state;
    case UPDATE_IMAGE_TYPE:
      if (action.index >= 0) {
        return {
          ...state,
          imageList: {
            ...state.imageList,
            entity: {
              ...state.imageList.entity,
              [action.index]: {
                ...state.imageList.entity[action.index],
                height: action.height,
                type: action.imgType,
              },
            },
          },
        };
      }
      return state;
    case CONCAT_IMAGE_LIST:
      if (action.data && action.data.length) {
        const data = action.data;
        return {
          ...state,
          imageList: {
            ...state.imageList,
            result: [
              ...state.imageList.result,
              ...Array.from(
                { length: data.length },
                (v, k) => k + state.imageList.result.length,
              ),
              data.length + state.imageList.result.length,
            ],
            entity: {
              ...reduce(
                data,
                (acc, item, k) => ({
                  ...acc,
                  [state.imageList.result.length + k]: {
                    ...item,
                    loading: true,
                    height: 1400,
                    type: 'image',
                  },
                }),
                state.imageList.entity,
              ),
              [data.length + state.imageList.result.length]: {
                type: 'end',
                chapter: data[0].chapter,
                loading: false,
                height: 72,
              },
            },
          },
        };
      }
      return state;
    case UPDATE_CHAPTER_LATEST_INDEX:
      return {
        ...state,
        chapterLatestIndex: action.data,
      };
    case UPDATE_CHAPTER_NOW_INDEX:
      if (state.chapterList && action.data >= 0) {
        const chapter = state.chapterList[action.data];
        document.title = `${state.title} ${state.chapters[chapter].title}`;
        window.history.replaceState(
          {},
          document.title,
          `?site=${state.site}&chapter=${chapter}`,
        );
      }
      return {
        ...state,
        chapterNowIndex: action.data,
      };
    case UPDATE_RENDER_INDEX:
      return {
        ...state,
        renderBeginIndex: action.begin,
        renderEndIndex: action.end,
      };
    case UPDATE_READED_CHAPTERS:
      return {
        ...state,
        readedChapters: action.data,
      };
    case UPDATE_CHAPTERS:
      return {
        ...state,
        chapters: action.data,
      };
    case UPDATE_CHAPTER_LIST:
      return {
        ...state,
        chapterList: action.data,
      };
    case UPDATE_COMICS_ID:
      return {
        ...state,
        comicsID: action.data,
      };
    case UPDATE_SUBSCRIBE:
      return {
        ...state,
        subscribe: action.data,
      };
    case UPDATE_TITLE:
      return {
        ...state,
        title: action.data,
      };
    case RESET_IMAGE:
      return {
        ...state,
        imageList: {
          result: [],
          entity: {},
        },
      };
    case UPDATE_INNER_HEIGHT:
      return {
        ...state,
        innerHeight: action.innerHeight,
      };
    default:
      return state;
  }
}

export function updateTitle(data: string) {
  return { type: UPDATE_TITLE, data };
}

export function updateComicsID(data: string) {
  return { type: UPDATE_COMICS_ID, data };
}

export function updateSubscribe(data: Array<*>) {
  return { type: UPDATE_SUBSCRIBE, data };
}

export function updateReadedChapters(data: {}) {
  return { type: UPDATE_READED_CHAPTERS, data };
}

export function updateChapters(data: {}) {
  return { type: UPDATE_CHAPTERS, data };
}

export function updateChapterList(data: Array<*>) {
  return { type: UPDATE_CHAPTER_LIST, data };
}

export function updateChapterLatestIndex(data: number) {
  return { type: UPDATE_CHAPTER_LATEST_INDEX, data };
}

export function updateChapterNowIndex(data: number) {
  return { type: UPDATE_CHAPTER_NOW_INDEX, data };
}

export function updateRenderIndex(begin: number, end: number) {
  return { type: UPDATE_RENDER_INDEX, begin, end };
}

export function concatImageList(data: Array<*>) {
  return { type: CONCAT_IMAGE_LIST, data };
}

export function loadImgSrc(src: string, index: number) {
  return { type: LOAD_IMAGE_SRC, src, index };
}

export function updateImgType(height: number, index: number, imgType: string) {
  return { type: UPDATE_IMAGE_TYPE, height, index, imgType };
}

export function resetImg() {
  return { type: RESET_IMAGE };
}

export function updateInnerHeight(innerHeight: number) {
  return { type: UPDATE_INNER_HEIGHT, innerHeight };
}
