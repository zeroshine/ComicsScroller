// @flow
import React, { Component } from 'react';
import cn from './IconButton.css';
import ripple from '../Ripple';

class IconButton extends Component {
  props: {
    children?: React$Element<*>,
    onClickHandler: Function,
    onMouseDownHandler: Function,
  };

  node: any;

  onMouseDownHandler = (e) => {
    this.props.onMouseDownHandler(e, this.node);
  };

  onClickHandler = () => {
    if (this.props.onClickHandler) {
      this.props.onClickHandler();
    }
  };

  refHandler = (node) => { this.node = node; };

  render() {
    return (
      <span
        className={cn.IconButton}
        ref={this.refHandler}
        onClick={this.onClickHandler}
        onMouseDown={this.onMouseDownHandler}
      >
        {this.props.children}
      </span>
    );
  }
}

export default ripple(IconButton);
