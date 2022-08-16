import React, { useLayoutEffect, useState } from "react";
import "./styles.css";

var thumbsize = 14;

const Slider = ({ min, max, stateChanger }) => {
  const [avg, setAvg] = useState((min + max) / 2);
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);

  const width = 200;
  const minWidth =
    thumbsize + ((avg - min) / (max - min)) * (width - 2 * thumbsize);
  const minPercent = ((minVal - min) / (avg - min)) * 100;
  const maxPercent = ((maxVal - avg) / (max - avg)) * 100;
  const styles = {
    min: {
      width: minWidth,
      left: 0,
      "--minRangePercent": `${minPercent}%`
    },
    max: {
      width: thumbsize + ((max - avg) / (max - min)) * (width - 2 * thumbsize),
      left: minWidth,
      "--maxRangePercent": `${maxPercent}%`
    }
  };

  useLayoutEffect(() => {
    setAvg((maxVal + minVal) / 2);
  }, [minVal, maxVal]);

//   console.log(maxVal, minVal);

  return (
    <>
      <div className="slider-label">
        <span>{min.toFixed(2)}</span>
        <span>{max.toFixed(2)}</span>
      </div>
      <div
        className="min-max-slider"
        data-legendnum="2"
        data-rangemin={min}
        data-rangemax={max}
        data-thumbsize={thumbsize}
        data-rangewidth={width}
      >
        <label htmlFor="min">M</label>
        <input
          id="min"
          className="min"
          style={styles.min}
          name="min"
          type="range"
          step="1"
          min={min}
          max={avg}
          value={minVal}
          onChange={({ target }) => { setMinVal(Number(target.value)); stateChanger({minVal, maxVal})}}
        />
        <label htmlFor="max">Maximum price</label>
        <input
          id="max"
          className="max"
          style={styles.max}
          name="max"
          type="range"
          step="1"
          min={avg}
          max={max}
          value={maxVal}
          onChange={({ target }) => { setMaxVal(Number(target.value)); stateChanger({minVal, maxVal}) }}
        />
      </div>
    </>
  );
};

export default Slider;