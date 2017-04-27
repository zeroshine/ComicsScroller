// @flow
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/mergeMap';
import { updateInnerHeight } from './comics';

const START_RESIZE_EPIC = 'START_RESIZE_EPIC';

function fromResizeEvent() {
  return Observable.fromEvent(window, 'resize')
    .throttleTime(100)
    .mergeMap(() => [updateInnerHeight(window.innerHeight)]);
}

export default function resizeEpic(action$: any) {
  return action$.ofType(START_RESIZE_EPIC).mergeMap(() => fromResizeEvent());
}

export function startResize() {
  return { type: START_RESIZE_EPIC };
}
