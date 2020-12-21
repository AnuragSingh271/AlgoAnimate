import React, { useEffect, useState } from 'react';
import ThreeStateButton from './component/button/threestatebutton/ThreeStateButton';
import Legend from './component/legend/Legend';
import VisualizerHeader from '../../component/header/SectionHeader';
import AlgorithmSelector from './component/selectors/algorithmselector/AlgorithmSelector';
import SpeedSelector from './component/selectors/sliderselector/SliderSelector';
import DataSizeSelector from './component/selectors/sliderselector/SliderSelector';
import './styles.css';
import CodeExplanation from '../codeinformation/codeexplaination/CodeExplanation';
import CodeTemplate from '../codeinformation/codetemplate/CodeTemplate';
import {
  arrayCopy,
  generateArray,
  getAnimationArr,
  resetArray,
  translateXOfVisualizer,
  isCountingSort,
  isMergeSort,
  roundToTwoDp,
  isRadixSort,
} from './util/GeneralUtil';
import { handleSwap } from './util/SwappingAlgoUtil';
import { handleMergeSort } from './util/MergeSortUtil';
import { buckets, executeCountSort } from './util/CountingSortUtil';
import { executeRadixSort, stack } from './util/RadixSortUtil';
import NewDataButton from './component/button/newdatabutton/NewDataButton';
import {
  DataSizeSelectorProps,
  SpeedSelectorProps,
} from './component/selectors/sliderselector/SelectorProps';
import AnimationProgressBar from './component/animationprogressbar/AnimationProgressBar';
import BackButton from './component/button/forwardbackbutton/BackButton';
import ForwardButton from './component/button/forwardbackbutton/ForwardButton';
import AnimationScreen from './component/animationscreen/AnimationScreen';
import StepByStep from './component/stepbystep/StepByStep';
import bubbleSort from '../algorithm/sortingalgorithms/bubbleSort';

const VisualizerStateContext = React.createContext({ isPlay: false, isReplay: false });

const Visualizer = () => {
  // isPlay and isReplay simulate the 3 states
  const [isPlay, setIsPlay] = useState(false);
  const [isReplay, setIsReplay] = useState(false);

  // this is to ensure we can click back arrow without trigger any new re-rendering of data
  const [isReset, setIsReset] = useState(false);

  const [isInMidstOfSort, setIsInMidstOfSort] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [dataSize, setDataSize] = useState(15);
  const [visualizerAlgorithm, setVisualizerAlgorithm] = useState('Bubble Sort');
  const [arrayData, setArrayData] = useState(generateArray(dataSize, visualizerAlgorithm));
  const [referenceArray, setReferenceArray] = useState(arrayCopy(arrayData));
  const [animationArr, setAnimationArr] = useState(bubbleSort(arrayCopy(arrayData)));
  const [animationPercentage, setAnimationPercentage] = useState(0);
  const [idx, setIdx] = useState(0);
  const [countArr, setCountArr] = useState(arrayCopy(buckets));
  const [stackArr, setStackArr] = useState(arrayCopy(stack));

  // This is introduced to simplify the back animation for MergeSort
  const [historyArr, setHistoryArr] = useState([]);

  useEffect(() => {
    if (isPlay === false) {
      setAnimationArr(getAnimationArr(visualizerAlgorithm, arrayCopy(arrayData)));
    }
  }, [isPlay, speed, dataSize, visualizerAlgorithm, arrayData]);

  const changeDataSize = (val) => {
    if (val !== dataSize) {
      setDataSize(val);
      setArrayData(generateArray(val, visualizerAlgorithm));
      setCountArr(arrayCopy(buckets));
      setStackArr(arrayCopy(stack));
      setIsReplay(false);
      setAnimationPercentage(0);
      setIsReset(true);
    }
  };

  const executeForwardSwapAnimation = () => {
    let animationArrSwapIdx = animationArr[idx];
    const animationPx = roundToTwoDp(((idx + 1) / animationArr.length) * 100);

    if (isCountingSort(visualizerAlgorithm)) {
      executeCountSort(animationArrSwapIdx, referenceArray, animationPx, countArr, true);
    } else if (isRadixSort(visualizerAlgorithm)) {
      executeRadixSort(animationArrSwapIdx, referenceArray, stackArr, true);
    } else if (isMergeSort(visualizerAlgorithm)) {
      let nextReferenceArray = handleMergeSort(referenceArray, animationArrSwapIdx);
      historyArr.push(referenceArray);
      setHistoryArr(historyArr);
      setReferenceArray(nextReferenceArray);
    } else {
      let newReferenceArray = handleSwap(
        animationArrSwapIdx[1],
        animationArrSwapIdx[0],
        referenceArray,
        animationArrSwapIdx[2],
        visualizerAlgorithm
      );
      if (idx + 1 >= animationArr.length) {
        resetDataWhenAnimationFinish(newReferenceArray);
      } else {
        setReferenceArray(newReferenceArray);
      }
    }
    setIdx(idx + 1);
    setAnimationPercentage(animationPx);
  };

  const executeBackwardSwapAnimation = () => {
    // this occurs if the users click too fast
    if (idx - 1 < 0) {
      setIdx(0);
      return;
    }
    let animationArrSwapIdx = animationArr[idx - 1];
    const animationPx = roundToTwoDp(((idx - 1) / animationArr.length) * 100);

    if (isCountingSort(visualizerAlgorithm)) {
      executeCountSort(animationArrSwapIdx, referenceArray, animationPx, countArr, false);
    } else if (isRadixSort(visualizerAlgorithm)) {
      executeRadixSort(animationArrSwapIdx, referenceArray, stackArr, false);
    } else if (isMergeSort(visualizerAlgorithm)) {
      let nextReferenceArray = historyArr.pop();
      setHistoryArr(historyArr);
      setReferenceArray(nextReferenceArray);
    } else {
      let temp = handleSwap(
        animationArrSwapIdx[1],
        animationArrSwapIdx[0],
        referenceArray,
        animationArrSwapIdx[2],
        visualizerAlgorithm
      );
      setReferenceArray(temp);
    }

    if (idx === animationArr.length) {
      setIsReplay(false);
    }
    setIdx(idx - 1);
    setAnimationPercentage(animationPx);
  };

  const resetDataWhenAnimationFinish = (finalReferenceArray) => {
    setIsPlay(false);
    setIsReplay(true);
    setReferenceArray(resetArray(visualizerAlgorithm, finalReferenceArray));
  };

  const value = {
    isPlay,
    isReplay,
    speed,
    arrayData,
    referenceArray,
    animationArr,
    countArr,
    stackArr,
    isInMidstOfSort,
    dataSize,
    visualizerAlgorithm,
    animationPercentage,
    idx,
    isReset,
    setIsReset,
    setIsReplay,
    setIsPlay,
    setIsInMidstOfSort,
    setVisualizerAlgorithm,
    setArrayData,
    setAnimationPercentage,
    setAnimationArr,
    setIdx,
    setReferenceArray,
    setCountArr,
    setStackArr,
    executeForwardSwapAnimation,
    executeBackwardSwapAnimation,
    resetDataWhenAnimationFinish,
  };

  return (
    <div id="visualizer">
      <VisualizerStateContext.Provider value={{ ...value }}>
        <div className="visualizer">
          <div className="visualizer-header-box">
            <VisualizerHeader sectionHeader="Visualizer" translateX="translate(25px)" />
            <AlgorithmSelector />
          </div>
          <div
            className="visualizer-box"
            style={{
              transform:
                !isRadixSort(visualizerAlgorithm) &&
                `translateX(-${translateXOfVisualizer(dataSize)}px)`,
            }}
          >
            <AnimationScreen />
          </div>
          <StepByStep />
          <AnimationProgressBar />
          <div className="controller-box">
            <div className="speed-selector-box">
              <SpeedSelector setData={(val) => setSpeed(val)} {...SpeedSelectorProps} />
              <DataSizeSelector setData={(val) => changeDataSize(val)} {...DataSizeSelectorProps} />
            </div>
            <div className="button-box">
              <BackButton />
              <div className="play-reset-button-box">
                <ThreeStateButton />
                <NewDataButton />
              </div>
              <ForwardButton />
            </div>
            <div className="legend-box">
              <Legend />
            </div>
          </div>
        </div>
      </VisualizerStateContext.Provider>
      <div className="code">
        <CodeExplanation algo={visualizerAlgorithm} />
        <CodeTemplate algo={visualizerAlgorithm} />
      </div>
    </div>
  );
};

export { VisualizerStateContext };
export default Visualizer;
