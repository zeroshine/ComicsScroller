// @flow
import React, { PureComponent } from 'react';
import cn from './RippleCircle.css';

function getRippleClass(active: boolean, opacity: boolean): string {
  if (active) {
    if (opacity) return cn.RippleCircleOpacity;
    return cn.RippleCircleActive;
  }
  return cn.RippleCircle;
}

class RippleCircle extends PureComponent {
  props: {
    removeRippleHandler: Function,
    radius: number,
    id: string,
    left: string,
    top: string,
  };

  readyOpacity: boolean;

  state = {
    active: false,
    opacity: false,
  };

  componentDidMount() {
    document.addEventListener('mouseup', this.mouseUpHandler);
    setTimeout(() => this.setState({ active: true }), 0);
  }

  mouseUpHandler = () => {
    document.removeEventListener('mouseup', this.mouseUpHandler);
    if (this.readyOpacity) {
      this.setState({ opacity: true });
    } else {
      this.readyOpacity = true;
    }
  };

  transitionEndHandler = () => {
    if (this.state.active && this.state.opacity) {
      this.props.removeRippleHandler(this.props.id);
    } else if (this.readyOpacity) {
      this.setState({ opacity: true });
    } else {
      this.readyOpacity = true;
    }
  };

  render() {
    const { left, top, radius } = this.props;
    const { active, opacity } = this.state;
    const scale = (active) ? 1 : 0;
    const style = {
      transform: `translate(${left}px,${top}px) scale(${scale}, ${scale})`,
      width: radius * 2,
      height: radius * 2,
    };
    return (
      <span
        style={style}
        className={getRippleClass(active, opacity)}
        onTransitionEnd={this.transitionEndHandler}
      />
    );
  }
}

export default RippleCircle;
