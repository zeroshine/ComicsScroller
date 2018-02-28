// @flow
import map from 'lodash/map';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import pickBy from 'lodash/pickBy';

type Action = {
  type: string,
  data: {
    update: Array<*>,
    subscribe: Array<*>,
    history: Array<*>,
    dm5: any,
    sf: any,
    comicbus: any,
  },
  category: string,
  index: number,
};

type State = {
  update: Array<*>,
  subscribe: Array<*>,
  history: Array<*>,
  dm5: {
    baseURL: 'http://www.dm5.com',
  },
  sf: {
    baseURL: 'http://comic.sfacg.com',
  },
  comicbus: {
    baseURL: 'http://www.comicbus.com',
  },
};

const initialState = {
  update: [],
  subscribe: [],
  history: [],
  dm5: {
    baseURL: 'http://www.dm5.com',
  },
  sf: {
    baseURL: 'http://comic.sfacg.com',
  },
  comicbus: {
    baseURL: 'http://www.comicbus.com',
  },
};

const UPDATE_POPUP_DATA = 'UPDATE_POPUP_DATA';
const REMOVE_CARD = 'REMOVE_CARD';
const SHIFT_CARDS = 'SHIFT_CARDS';
const MOVE_CARD = 'MOVE_CARD';

export default function popup(state: State = initialState, action: Action) {
  switch (action.type) {
    case UPDATE_POPUP_DATA:
      return {
        update: map(action.data.update, item => ({
          ...item,
          shift: false,
          move: false,
        })),
        subscribe: map(action.data.subscribe, item => ({
          ...item,
          shift: false,
          move: false,
        })),
        history: map(action.data.history, item => ({
          ...item,
          shift: false,
          move: false,
        })),
        dm5: {
          ...state.dm5,
          ...action.data.dm5,
        },
        sf: {
          ...state.sf,
          ...action.data.sf,
        },
        comicbus: {
          ...state.comicbus,
          ...action.data.comicbus,
        },
      };
    case REMOVE_CARD:
      if (action.category === 'history') {
        const index = findIndex(state.history, item => item.move);
        const { site, comicsID } = state.history[index];
        return {
          ...state,
          history: filter(state.history, item => !item.move).map(item => ({
            ...item,
            move: false,
            shift: false,
          })),
          [site]: pickBy(state[site], item => item.comicsID !== comicsID),
        };
      }
      return {
        ...state,
        [action.category]: filter(
          state[action.category],
          item => !item.move,
        ).map(item => ({ ...item, move: false, shift: false })),
      };
    case SHIFT_CARDS:
      return {
        ...state,
        [action.category]: map(state[action.category], (item, i) => {
          if (i > action.index) return { ...item, shift: true };
          return item;
        }),
      };
    case MOVE_CARD:
      return {
        ...state,
        [action.category]: map(state[action.category], (item, i) => {
          if (i === action.index) return { ...item, move: true };
          return item;
        }),
      };
    default:
      return state;
  }
}

export function updatePopupData(data: {
  subscribe: Array<*>,
  history: Array<*>,
  update: Array<*>,
}) {
  return { type: UPDATE_POPUP_DATA, data };
}

export function removeCard(category: string, index: number) {
  return { type: REMOVE_CARD, category, index };
}

export function shiftCards(category: string, index: number) {
  return { type: SHIFT_CARDS, category, index };
}

export function moveCard(category: string, index: number) {
  return { type: MOVE_CARD, category, index };
}
