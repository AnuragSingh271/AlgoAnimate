import React from 'react';
import './styles.css';
import { animated } from 'react-spring';

const AnimatedBlock = ({
  item,
  props: { x, ...rest },
  length,
  index,
  isSwap,
}) => {
  return (
    <animated.div
      className="animated-block"
      style={{
        height: item.height,
        zIndex: length - index,
        transform: x.interpolate((x) => `translate3d(${x}px,0,0)`),
        ...rest,
        backgroundImage: isSwap
          ? `linear-gradient(45deg, #13B1B7, #11C2C9)`
          : `linear-gradient(45deg, #287ED0, #5466FF)`,
      }}
    >
      <span>{item.height}</span>
    </animated.div>
  );
};

export default AnimatedBlock;
