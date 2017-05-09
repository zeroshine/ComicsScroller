// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import filter from 'lodash/filter';
import Loading from 'cmp/Loading';
import ConnectedComicImage from 'cmp/ComicImage';
import cn from './ImgContainer.css';

class ImgContainer extends Component {
  props: {
    paddingTop: string,
    paddingBottom: number,
    renderResult: Array<number>,
  };

  render() {
    return (
      <div
        className={cn.ImgContainer}
        style={{
          paddingTop: this.props.paddingTop + 48,
          paddingBottom: this.props.paddingBottom,
        }}
      >
        {this.props.renderResult.length > 0
          ? map(this.props.renderResult, key => (
              <ConnectedComicImage key={key} index={key} />
            ))
          : <Loading />}
      </div>
    );
  }
}

const getRenderResult = createSelector(
  comics => comics.imageList.result,
  comics => comics.renderBeginIndex,
  comics => comics.renderEndIndex,
  (result, begin, end) => filter(result, item => item >= begin && item <= end),
);

const margin = 20;

const getPaddingTop = createSelector(
  comics => comics.imageList.result,
  comics => comics.imageList.entity,
  comics => comics.renderBeginIndex,
  comics => comics.innerHeight,
  (result, entity, begin, innerHeight) =>
    reduce(
      filter(result, item => item < begin),
      (acc, i) => {
        if (entity[i].type === 'wide')
          return acc + (innerHeight - 68) + 2 * margin;
        return acc + entity[i].height + 2 * margin;
      },
      0,
    ),
);

const getPaddingBottom = createSelector(
  comics => comics.imageList.result,
  comics => comics.imageList.entity,
  comics => comics.renderEndIndex,
  comics => comics.innerHeight,
  (result, entity, end, innerHeight) =>
    reduce(
      filter(result, item => item > end),
      (acc, i) => {
        if (entity[i].type === 'wide')
          return acc + (innerHeight - 68) + 2 * margin;
        return acc + entity[i].height + 2 * margin;
      },
      0,
    ),
);

function mapStateToProps({ comics }) {
  return {
    paddingTop: getPaddingTop(comics),
    paddingBottom: getPaddingBottom(comics),
    renderResult: getRenderResult(comics),
  };
}

export default connect(mapStateToProps)(ImgContainer);
