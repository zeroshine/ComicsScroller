// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import some from 'lodash/some';
import filter from 'lodash/filter';
import MenuIcon from 'imgs/menu.svg';
import NextIcon from 'imgs/circle-right.svg';
import PrevIcon from 'imgs/circle-left.svg';
import TagIcon from 'imgs/tag.svg';
import FbIcon from 'imgs/facebook.svg';
import GithubIcon from 'imgs/github.svg';
import IconButton from '../../component/IconButton';
import cn from './App.css';
import ImgContainer from '../ImgContainer';
import ChapterList from '../ChapterList';
import {
  resetImg,
  updateChapterLatestIndex,
  updateSubscribe,
} from './reducers/comics';
import {
  fetchImgList,
  fetchChapter,
  updateReaded,
} from './reducers/getAction';
import { stopScroll } from './reducers/scrollEpic';
import { startResize } from './reducers/resizeEpic';

declare var chrome: any;

function getTagIconClass(chapterTitle, subscribe) {
  if (chapterTitle === '') return cn.icon_deactive;
  if (subscribe) return cn.icon_subscribe;
  return cn.icon;
}

class App extends Component {
  props: {
    title: string,
    comicsID: string,
    chapter: string,
    chapterTitle: string,
    site: string,
    chapterNowIndex: number,
    prevable: boolean,
    nextable: boolean,
    subscribe: boolean,
    fetchChapter: Function,
    stopScroll: Function,
    startResize: Function,
    resetImg: Function,
    updateChapterLatestIndex: Function,
    updateSubscribe: Function,
    updateReaded: Function,
    fetchImgList: Function,
  };

  state = {
    showChapterList: false,
  };

  componentDidMount() {
    this.props.startResize();
    chrome.runtime.onMessage.addListener(() => {
      chrome.storage.local.get((item) => {
        const { subscribe, site, comicsID } = this.props;
        if (!item[this.props.site][comicsID]) {
          chrome.tabs.getCurrent((tab) => {
            chrome.tabs.remove(tab.id);
          });
        }
        if (!some(item.subscribe, citem => (citem.site === site && citem.comicsID === comicsID))
            && subscribe) {
          this.props.updateSubscribe(false);
        }
      });
    });
    const chapter = (window.location.search.split('&chapter='))[1];
    this.props.fetchChapter(chapter);
  }

  showChapterListHandler = () => {
    const body = document.body;
    if (!(body instanceof HTMLElement)) {
      return;
    }
    if (!this.state.showChapterList) {
      body.style.overflowY = 'hidden';
    } else {
      body.removeAttribute('style');
    }
    this.setState({ showChapterList: !this.state.showChapterList });
  };

  prevChapterHandler = () => {
    const index = this.props.chapterNowIndex + 1;
    this.props.stopScroll();
    this.props.resetImg();
    this.props.updateReaded(index);
    this.props.updateChapterLatestIndex(index);
    this.props.fetchImgList(index);
  };

  nextChapterHandler = () => {
    const index = this.props.chapterNowIndex - 1;
    this.props.stopScroll();
    this.props.resetImg();
    this.props.updateReaded(index);
    this.props.updateChapterLatestIndex(index);
    this.props.fetchImgList(index);
  };

  subscribeHandler = () => {
    const { chapter, site, comicsID } = this.props;
    chrome.storage.local.get((item) => {
      if (item.subscribe) {
        let newItem = {};
        if (some(item.subscribe, citem => (citem.site === site && citem.comicsID === comicsID))) {
          newItem = {
            ...item,
            subscribe: filter(item.subscribe, citem =>
              (citem.site !== site && citem.chapter !== chapter)),
          };
          chrome.storage.local.set(newItem, () => this.props.updateSubscribe(false));
        } else {
          newItem = {
            ...item,
            subscribe: [
              {
                site,
                comicsID,
              },
              ...item.subscribe,
            ],
          };
          chrome.storage.local.set(newItem, () => this.props.updateSubscribe(true));
        }
      }
    });
  };

  render() {
    const { prevable, nextable, chapterTitle, subscribe } = this.props;
    return (
      <div className={cn.App}>
        <header className={cn.Header}>
          <span className={cn.leftContainer}>
            <IconButton onClickHandler={this.showChapterListHandler} >
              <MenuIcon className={cn.icon} />
            </IconButton>
            <span>Comics Scroller</span>
            <span>{`${this.props.title}  >`}</span>
            <span>{this.props.chapterTitle}</span>
          </span>
          <span className={cn.rigthtContainer}>
            <IconButton>
              <a href={'https://www.facebook.com/ComicsScroller/'}>
                <FbIcon
                  className={cn.icon}
                />
              </a>
            </IconButton>
            <IconButton>
              <a href={'https://github.com/zeroshine/ComicsScroller/issues'}>
                <GithubIcon
                  className={cn.icon}
                />
              </a>
            </IconButton>
            <IconButton onClickHandler={(prevable) ? this.prevChapterHandler : undefined} >
              <PrevIcon
                className={(prevable) ? cn.icon : cn.icon_deactive}
              />
            </IconButton>
            <IconButton onClickHandler={(nextable) ? this.nextChapterHandler : undefined} >
              <NextIcon
                className={(nextable) ? cn.icon : cn.icon_deactive}
              />
            </IconButton>
            <IconButton onClickHandler={(chapterTitle !== '') ? this.subscribeHandler : undefined} >
              <TagIcon
                className={getTagIconClass(chapterTitle, subscribe)}
              />
            </IconButton>
          </span>
        </header>
        <ImgContainer />
        <ChapterList
          show={this.state.showChapterList}
          showChapterListHandler={this.showChapterListHandler}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { title, chapterNowIndex, chapterList, chapters, subscribe, site, comicsID } = state.comics;
  const chapterID = chapterList[chapterNowIndex];
  return {
    title,
    chapterTitle: (chapterList.length > 0 && chapters[chapterID]) ? chapters[chapterID].title : '',
    site,
    chapter: (chapterList.length > 0 && chapters[chapterID]) ? chapters[chapterID].chapter : '',
    prevable: chapterNowIndex < chapterList.length,
    nextable: chapterNowIndex > 0,
    chapterNowIndex,
    comicsID,
    subscribe,
  };
}

export default connect(
  mapStateToProps, {
    fetchChapter,
    stopScroll,
    startResize,
    resetImg,
    updateReaded,
    updateChapterLatestIndex,
    updateSubscribe,
    fetchImgList,
  })(App);
