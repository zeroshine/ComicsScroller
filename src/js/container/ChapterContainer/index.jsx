// @flow
// this module is prepare for another way to infinite scroll but fail
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import map from 'lodash/map';
import ComicImage from 'cmp/ComicImage';
import cn from './ChapterContainer.css';

class ChapterContainer extends Component {
  node: HTMLBaseElement;

  refHandler = node => {
    this.node = node;
  };

  render() {
    return (
      <div
        style={this.props.show ? undefined : { height: this.node.clientHeight }}
        className={cn.ChapterContainer}
        ref={this.refHandler}
      >
        <div style={this.props.show ? undefined : { display: 'none' }}>
          {map(this.props.result, index => (
            <ComicImage
              key={index}
              index={index}
              chapter={this.props.chapter}
            />
          ))}
          <div className={cn.end}>本章結束</div>
        </div>
      </div>
    );
  }
}

ChapterContainer.propTypes = {
  result: PropTypes.arrayOf(PropTypes.string).isRequired,
  show: PropTypes.bool.isRequired,
};

function mapStateToProps(state, ownProps) {
  const { result, show } = state.comics.imageList.chapterEntity[
    ownProps.chapter
  ];
  return {
    result,
    show,
  };
}

export default connect(mapStateToProps)(ChapterContainer);
