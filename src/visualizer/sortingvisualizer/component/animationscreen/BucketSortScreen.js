import React, { useContext } from 'react';
import { VisualizerStateContext } from '../../Visualizer';
import { highlightOnesPlacing } from './NumberHighlighter';
import StackOfBoxes from './StackOfBoxes';
import './styles.css';

/**
 * Animation screen which shows the Bucket Sort algorithm
 *
 * @component
 * @category AnimationScreen
 */
const BucketSortScreen = () => {
  const { referenceArray, stackArr, dataSize } = useContext(VisualizerStateContext);

  const HorizontalBoxes = ({ dataSize, referenceArray }) => {
    const SingleBox = ({ item }) => (
      <div
        className="box"
        style={{
          visibility: item.isShown ? `visible` : `hidden`,
        }}
      >
        <div className="decimal">{highlightOnesPlacing(item.height)}</div>
      </div>
    );

    return (
      <div className="data-arr" style={{ gridTemplateColumns: `repeat(${dataSize}, 1fr)` }}>
        {referenceArray.map((x, index) => (
          <SingleBox item={x} key={index} />
        ))}
      </div>
    );
  };

  return (
    <div className="spaced-out-container">
      <HorizontalBoxes dataSize={dataSize} referenceArray={referenceArray} />
      <div className="stack-arr">
        {stackArr.map((stack) => (
          <StackOfBoxes individualStack={stack.array} value={stack.value} key={stack.value} />
        ))}
      </div>
    </div>
  );
};

export default BucketSortScreen;