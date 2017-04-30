// @flow
import React, { PureComponent } from 'react';
import { map, filter } from 'lodash';
import RippleCircle from './RippleCircle';

const ripple = (WrapComponent: Class<React.Component<*, *, *>> | Function) => {
  class RippleComponent extends PureComponent {
    counter: number;

    props: {
      children?: any,
    };

    state = {
      ripples: [],
    };

    counter = 0;

    onMouseDownHandler = (e: any) => {
      if (e.defaultPrevented) return;
      const x = e.pageX - window.scrollX || window.pageXOffset;
      const y = e.pageY - window.scrollY || window.pageYOffset;
      const {
        left,
        top,
        height,
        width,
      } = e.currentTarget.getBoundingClientRect();
      const dx = x - left;
      const dy = y - top;
      const topLeft = dx * dx + dy * dy;
      const topRight = (width - dx) * (width - dx) + dy * dy;
      const bLeft = dx * dx + (height - dy) * (height - dy);
      const bRight =
        (width - dx) * (width - dx) + (height - dy) * (height - dy);
      const radius = Math.sqrt(Math.max(topLeft, topRight, bLeft, bRight));
      this.counter = this.counter + 1;
      this.setState({
        ripples: [
          ...this.state.ripples,
          {
            left: dx - radius,
            top: dy - radius,
            radius,
            id: `ripple${this.counter}`,
          },
        ],
      });
    };

    removeRippleHandler = (id: string) => {
      this.setState({
        ripples: filter(this.state.ripples, item => item.id !== id),
      });
    };

    render() {
      const { ...others } = this.props;
      return (
        <WrapComponent {...others} onMouseDownHandler={this.onMouseDownHandler}>
          {map(this.state.ripples, item => (
            <RippleCircle
              key={item.id}
              id={item.id}
              radius={item.radius}
              top={item.top}
              left={item.left}
              removeRippleHandler={this.removeRippleHandler}
            />
          ))}
          {this.props.children}
        </WrapComponent>
      );
    }
  }

  return RippleComponent;
};

export default ripple;
