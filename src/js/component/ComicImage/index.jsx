// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import cn from './Image.css';
import { updateImgHeight } from '../../container/App/reducers/comics';

function getImgClass(showMode: string, type: string) {
  if (type === 'end') return cn.ComicImageEnd;
  switch (showMode) {
    case 'init':
      return cn.ComicImageInit;
    case 'normal':
      return cn.ComicImage;
    case 'wide':
      return cn.ComicImageWide;
    case 'natural':
      return cn.ComicImageNatural;
    default:
      return undefined;
  }
}

class ComicImage extends Component {
  state: {
    showImage: boolean,
    showMode: string,
  };

  props: {
    loading: boolean,
    src: number,
    type: string,
    index: Function,
    updateImgHeight: Function,
  };

  w: number;
  h: number;

  state = {
    showImage: false,
    showMode: 'init',
  };

  imgLoadHandler = (e) => {
    this.w = e.target.naturalWidth;
    this.h = e.target.naturalHeight;
    const innerHeight = window.innerHeight;
    if (this.h > innerHeight) {
      if (this.w > this.h) {
        this.setState({
          showMode: 'wide',
          showImage: true,
        });
        this.props.updateImgHeight(window.innerHeight - 68, this.props.index);
      } else {
        this.setState({
          showMode: 'normal',
          showImage: true,
        });
      }
    } else {
      this.setState({
        showMode: 'natural',
        showImage: true,
      });
      this.props.updateImgHeight(this.h, this.props.index);
    }
  };

  render() {
    return (
      <div className={getImgClass(this.state.showMode, this.props.type)}>
        {!this.state.showImage && this.props.type !== 'end'
          ? <div>Loading...</div>
          : undefined}
        {!this.props.loading && this.props.type !== 'end'
          ? <img
            style={this.state.showImage ? undefined : { display: 'none' }}
            src={this.props.src}
            onLoad={this.imgLoadHandler}
            alt={'comicImage'}
          />
          : undefined}
        {this.props.type === 'end' ? '本 章 結 束' : undefined}
      </div>
    );
  }
}

function makeMapStateToProps(state, props) {
  const { index } = props;
  return function mapStateToProps({ comics }) {
    return {
      src: comics.imageList.entity[index].src,
      loading: comics.imageList.entity[index].loading,
      type: comics.imageList.entity[index].type,
    };
  };
}

export default connect(makeMapStateToProps, {
  updateImgHeight,
})(ComicImage);
