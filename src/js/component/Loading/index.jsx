// @flow
import React, { Component } from 'react';
import cn from './Loading.css';

class Loading extends Component {
  render() {
    return (
      <div className={cn.Loading}>
        <svg>
          <circle cx="30" cy="30" r="25" />
        </svg>
      </div>
    );
  }
}

export default Loading;
