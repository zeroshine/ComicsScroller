// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import map from 'lodash/map';
import MoreIcon from 'imgs/more_vert.svg';
import ComicCard from 'cmp/ComicCard';
import ripple from 'cmp/Ripple';
import { updatePopupData, shiftCards } from './reducers/popup';
import cn from './PopUpApp.css';
import initObject from '../../util/initObject';

declare var chrome: any;

function stopImmediatePropagation(e) {
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
}

function preventDefault(e) {
  e.preventDefault();
}

function getShiftMarkerClass(
  selectedType: 'update' | 'subscribe' | 'history',
): string {
  switch (selectedType) {
    case 'update':
      return cn.shiftMarker_left;
    case 'subscribe':
      return cn.shiftMarker_mid;
    case 'history':
      return cn.shiftMarker_right;
    default:
      return cn.shiftMarker_left;
  }
}

function getContainerClass(
  selectedType: 'update' | 'subscribe' | 'history',
): string {
  switch (selectedType) {
    case 'update':
      return cn.CardContainer_left;
    case 'subscribe':
      return cn.CardContainer_mid;
    case 'history':
      return cn.CardContainer_right;
    default:
      return cn.CardContainer_left;
  }
}

const Tab = ({
  className,
  children,
  type,
  onMouseDownHandler,
}: {
  className: string,
  children: any,
  type: string,
  onMouseDownHandler: Function,
}) => (
  <span className={className} onMouseDown={onMouseDownHandler}>
    <div data-type={type}>{type}</div>
    {children}
  </span>
);

const RippleTab = ripple(Tab);

const MenuButton = ({
  children,
  showMenu,
  showMenuHandler,
  onMouseDownHandler,
  downloadHandler,
  uploadHandler,
  resetHandler,
  aRefHandler,
  inputRefHandler,
  fileOnChangeHandler,
}: {
  children: any,
  showMenu: boolean,
  showMenuHandler: Function,
  onMouseDownHandler: Function,
  downloadHandler: Function,
  uploadHandler: Function,
  resetHandler: Function,
  aRefHandler: Function,
  inputRefHandler: Function,
  fileOnChangeHandler: Function,
}) => (
  <span
    className={cn.button}
    onClick={showMenuHandler}
    onMouseDown={onMouseDownHandler}
  >
    <MoreIcon />
    <div className={cn.rippleContainer}>
      {children}
    </div>
    <div className={showMenu ? cn.menuOn : cn.menuOff}>
      <div onMouseDown={preventDefault} onClick={downloadHandler}>Download Config</div>
      <div onMouseDown={preventDefault} onClick={uploadHandler}>Upload Config</div>
      <div onMouseDown={preventDefault} onClick={resetHandler}>Reset Config</div>
      <a
        style={{ display: 'none' }}
        ref={aRefHandler}
        onClick={stopImmediatePropagation}
      >
        Download Config
      </a>
      <input
        ref={inputRefHandler}
        type={'file'}
        style={{ display: 'none' }}
        onChange={fileOnChangeHandler}
        onClick={stopImmediatePropagation}
      />
    </div>
  </span>
);

const RippleMenu = ripple(MenuButton);

class PopUpApp extends Component {
  props: {
    update: Array<*>,
    subscribe: Array<*>,
    history: Array<*>,
    updatePopupData: Function,
    shiftCards: Function,
  };
  fileInput: HTMLInputElement;
  aRef: HTMLAnchorElement;

  state = {
    selectedType: 'update',
    showMenu: false,
  };

  componentDidMount() {
    chrome.storage.local.get((item) => {
      this.props.updatePopupData(item);
    });
  }

  tabOnClickHandler = (e) => {
    const selectedType = e.target.getAttribute('data-type');
    this.setState({ selectedType });
  };

  transitionEndHandler = (e) => {
    const index = parseInt(e.target.getAttribute('data-index'), 10);
    const move = e.target.getAttribute('data-move');
    const shift = e.target.getAttribute('data-shift');
    const category = this.state.selectedType;
    const len = this.props[category].length;
    if (move === 'true') {
      if (len > 1) {
        this.props.shiftCards(category, index);
      } else {
        chrome.storage.local.get((item) => {
          this.props.updatePopupData(item);
        });
      }
    } else if (shift === 'true' && index === len - 1) {
      chrome.storage.local.get((item) => {
        this.props.updatePopupData(item);
      });
    }
  };

  showMenuHandler = () => {
    if (!this.state.showMenu) {
      document.addEventListener('click', this.showMenuHandler);
    } else {
      document.removeEventListener('click', this.showMenuHandler);
    }
    this.setState(prevState => ({ showMenu: !prevState.showMenu }));
  };

  inputRefHandler = (node) => {
    this.fileInput = node;
  };

  uploadHandler = () => {
    if (this.fileInput) {
      this.fileInput.click();
    }
  };
  
  fileOnChangeHandler = () => {
    const fr = new FileReader();
    fr.onload = (e) => {
      const result = JSON.parse(e.target.result);
      chrome.storage.local.set(result, (err) => {
        if (!err) {
          chrome.storage.local.get((item) => {
            this.props.updatePopupData(item);
            chrome.browserAction.setBadgeText({
              text: `${item.update.length === 0 ? '' : item.update.length}`,
            });
            chrome.runtime.sendMessage({ msg: 'UPDATE' });
          });
        }
      });
    };
    fr.readAsText(this.fileInput.files.item(0));
  };

  aRefHandler = (node) => {
    this.aRef = node;
  };

  downloadHandler = () => {
    chrome.storage.local.get((item) => {
      const json = JSON.stringify(item);
      const blob = new Blob([json], { type: 'octet/stream' });
      const url = window.URL.createObjectURL(blob);
      if (this.aRef) {
        this.aRef.href = url;
        this.aRef.download = 'ComicsScroller_config.json';
        this.aRef.click();
        window.URL.revokeObjectURL(url);
      }
    });
  };

  resetHandler = () => {
    chrome.storage.local.clear();
    chrome.storage.local.set(initObject, () => {
      chrome.storage.local.get((item) => {
        this.props.updatePopupData(item);
        chrome.runtime.sendMessage({ msg: 'UPDATE' });
      });
    });
  };

  render() {
    return (
      <div className={cn.PopUpApp}>
        <div className={cn.headerContainer}>
          <header className={cn.header} onClick={this.tabOnClickHandler}>
            <RippleTab
              className={
                this.state.selectedType === 'update' ? cn.tabActive : cn.tab
              }
              type={'update'}
            />
            <RippleTab
              className={
                this.state.selectedType === 'subscribe' ? cn.tabActive : cn.tab
              }
              type={'subscribe'}
            />
            <RippleTab
              className={
                this.state.selectedType === 'history' ? cn.tabActive : cn.tab
              }
              type={'history'}
            />
            <span className={getShiftMarkerClass(this.state.selectedType)} />
          </header>
          <RippleMenu
            showMenu={this.state.showMenu}
            showMenuHandler={this.showMenuHandler}
            downloadHandler={this.downloadHandler}
            uploadHandler={this.uploadHandler}
            resetHandler={this.resetHandler}
            aRefHandler={this.aRefHandler}
            inputRefHandler={this.inputRefHandler}
            fileOnChangeHandler={this.fileOnChangeHandler}
          />
        </div>
        <div
          className={getContainerClass(this.state.selectedType)}
          onTransitionEnd={this.transitionEndHandler}
        >
          <div>
            {map(this.props.update, (item, i) => (
              <ComicCard
                key={`update_${item.comicsID}_${item.chapterID}`}
                category={this.state.selectedType}
                shift={item.shift}
                move={item.move}
                site={item.site}
                index={i}
                updateChapter={item.updateChapter}
                comicsID={item.comicsID}
                last={i === this.props[this.state.selectedType].length - 1}
              />
            ))}
          </div>
          <div>
            {map(this.props.subscribe, (item, i) => (
              <ComicCard
                key={`subscribe_${item.comicsID}`}
                category={this.state.selectedType}
                shift={item.shift}
                move={item.move}
                site={item.site}
                index={i}
                comicsID={item.comicsID}
                last={i === this.props[this.state.selectedType].length - 1}
              />
            ))}
          </div>
          <div>
            {map(this.props.history, (item, i) => (
              <ComicCard
                key={`history_${item.comicsID}`}
                category={this.state.selectedType}
                shift={item.shift}
                move={item.move}
                site={item.site}
                index={i}
                comicsID={item.comicsID}
                last={i === this.props[this.state.selectedType].length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    update: state.popup.update,
    subscribe: state.popup.subscribe,
    history: state.popup.history,
  };
}

export default connect(mapStateToProps, {
  updatePopupData,
  shiftCards,
})(PopUpApp);
