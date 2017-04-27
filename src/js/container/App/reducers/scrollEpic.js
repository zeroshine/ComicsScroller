// @flow
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import findIndex from 'lodash/findIndex';
import {
  fetchImgSrc,
  fetchImgList,
  updateReaded,
} from './getAction';
import { updateChapterLatestIndex, updateRenderIndex } from './comics';

const START_SCROLL_EPIC = 'START_SCROLL_EPIC';
const STOP_SCROLL_EPIC = 'STOP_SCROLL_EPIC';
declare var document: Document;
// function getImageIndexOnScreen(entity, begin, end) {
//   if (end <= begin) {
//     return {
//       begin: begin - 6,
//       end: begin + 6,
//     };
//   }
//   const index = Math.floor((begin + end) / 2);
//   const { bottom, top } = entity[index].node.getBoundingClientRect();
//   const { innerHeight } = window;
//   if ((top <= 0 && bottom >= 0) ||
//     (bottom >= innerHeight && top <= innerHeight) ||
//     (top > 0 && top < innerHeight && bottom > 0 && bottom < innerHeight)) {
//     return {
//       begin: index - 6,
//       end: index + 6,
//     };
//   } else if (top > innerHeight) {
//     return getImageIndexOnScreen(entity, begin, index);
//   } else if (bottom < 0) {
//     return getImageIndexOnScreen(entity, index + 1, end);
//   }
//   return { begin: -1, end: -1 };
// }

const margin = 20;

function fromScrollEvent(store: { getState: Function }, cancelType: string) {
  return Observable.fromEvent(document, 'scroll')
    .throttleTime(100)
    .mergeMap(() => {
      const { entity, result } = store.getState().comics.imageList;
      const {
        chapterList,
        chapterLatestIndex,
        chapterNowIndex,
        renderBeginIndex,
        renderEndIndex,
        innerHeight,
      } = store.getState().comics;
      let accHeight = margin;
      let viewIndex = 0;
      const scrollTop = (document.body) ? document.body.scrollTop : 0;
      const len = result.length;
      for (let i = 0; i < len; i += 1) {
        viewIndex = i;
        if (accHeight > scrollTop) {
          break;
        }
        if (entity[result[i]].type === 'wide') {
          accHeight += (innerHeight - 68) + (2 * margin);
        } else {
          accHeight += entity[result[i]].height + (2 * margin);
        }
      }
      const imgChapter = entity[viewIndex].chapter;
      const imgChapterIndex = findIndex(chapterList, item => item === imgChapter);
      const result$ = [];
      if ((renderBeginIndex + renderEndIndex) / 2 !== viewIndex) {
        result$.push(
          updateRenderIndex(viewIndex - 6, viewIndex + 6),
          fetchImgSrc(viewIndex - 6, viewIndex + 6));
      }
      if (chapterLatestIndex === imgChapterIndex && chapterLatestIndex > 0) {
        result$.push(
          fetchImgList(chapterLatestIndex - 1),
          updateChapterLatestIndex(chapterLatestIndex - 1));
      }
      if (chapterNowIndex !== imgChapterIndex) {
        result$.push(
          updateReaded(imgChapterIndex),
        );
      }
      return result$;
    }).takeUntil(cancelType);
}

export default function scrollEpic(action$: any, store: { getState: Function }) {
  return action$.ofType(START_SCROLL_EPIC)
    .mergeMap(() => fromScrollEvent(store, action$.ofType(STOP_SCROLL_EPIC)));
}

export function startScroll() {
  return { type: START_SCROLL_EPIC };
}

export function stopScroll() {
  return { type: STOP_SCROLL_EPIC };
}
