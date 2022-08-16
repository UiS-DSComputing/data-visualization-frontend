import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FiFilter } from "react-icons/fi";
import { useSelector } from "react-redux";
import Slider from "./common//MultiRangeSlider";
import BarChart from "./common/BarChart";
import LineChart from "./common/LineChart";

const FileDataViewer = (props) => {
  const token = useSelector((state) => state.accessToken);

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const [fileData, setFileData] = useState([]);
  const [columnData, setColumnData] = useState([]);
  const [allModels, setAllModels] = useState([
    { name: "No Model Applied", id: 0 },
    { name: "model 1 Applied", id: 1 },
    { name: "model 2 Applied", id: 2 },
    { name: "model 3 Applied", id: 3 },
  ]);
  const [selectedModel, setSelectedModel] = useState('0');
  const [modelOutput, setModelOutput] = useState({});

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  useEffect(() => {
    applyModel();
  }, [selectedModel]);

  // Model Load
  const applyModel = async () => {
    if (selectedModel !== "0") {
      await axios
        .get(
          `http://localhost:8000/file_apply_model/${props.id}/${selectedModel}`,
          config
        )
        .then((res) => {
          console.log(Object.values(res.data));
          setModelOutput(res.data);
        });
    } else {
      console.log("model 0 applied");
    }
  };

  //////// For LineCart
  const [lineChartData, setLineChartData] = useState({ x: [], y: [] });
  const [isLineChartFilterShow, setIsLineChartFilterShow] = useState(false);
  const [xLAx, setXLAx] = useState("");
  const [yLAx, setYLAx] = useState("");

  const [xLMax, setXLMax] = useState(0);
  const [xLMin, setXLMin] = useState(0);
  const [yLMax, setYLMax] = useState(0);
  const [yLMin, setYLMin] = useState(0);

  const [xLMaxInit, setXLMaxInit] = useState(0);
  const [xLMinInit, setXLMinInit] = useState(0);
  const [yLMaxInit, setYLMaxInit] = useState(0);
  const [yLMinInit, setYLMinInit] = useState(0);

  /////// For Barchar
  const [barChartData, setBarChartData] = useState({ x: [], y: [] });
  const [isBarChartFilterShow, setIsBarChartFilterShow] = useState(false);
  const [xBAx, setXBAx] = useState("");
  const [yBAx, setYBAx] = useState("");

  const [xBMax, setXBMax] = useState(0);
  const [xBMin, setXBMin] = useState(0);
  const [yBMax, setYBMax] = useState(0);
  const [yBMin, setYBMin] = useState(0);

  const [xBMaxInit, setXBMaxInit] = useState(0);
  const [xBMinInit, setXBMinInit] = useState(0);
  const [yBMaxInit, setYBMaxInit] = useState(0);
  const [yBMinInit, setYBMinInit] = useState(0);

  // Common
  const loadFileData = async () => {
    await axios
      .get(`http://localhost:8000/file-read/${props.id}`, config)
      .then((res) => {
        setFileData(res.data.data.slice(1));
      });
  };

  const loadColumnData = () => {
    setColumnData(Object.keys(fileData[0]));
  };

  useEffect(() => {
    loadFileData();
  }, []);

  useEffect(() => {
    fileData.length && loadColumnData();
  }, [fileData]);

  useEffect(() => {
    columnData.length && setXLAx(columnData[0]);
    columnData.length && setYLAx(columnData[1]);

    columnData.length && setXBAx(columnData[0]);
    columnData.length && setYBAx(columnData[1]);
  }, [columnData]);

  // For Line Chart
  useEffect(() => {
    xLAx !== "" &&
      yLAx !== "" &&
      setLineChartData({
        x: fileData.map((d) => {
          return d[xLAx];
        }),
        y: fileData.map((d) => {
          return d[yLAx];
        }),
      });

    lineChartData.x.length &&
      setXLMaxInit(Math.max.apply(Math, lineChartData.x));
    lineChartData.x.length &&
      setXLMinInit(Math.min.apply(Math, lineChartData.x));
    lineChartData.y.length &&
      setYLMaxInit(Math.max.apply(Math, lineChartData.y));
    lineChartData.y.length &&
      setYLMinInit(Math.min.apply(Math, lineChartData.y));
  }, [xLAx, yLAx, fileData]);

  useEffect(() => {
    lineChartData.x.length && setXLMax(Math.max.apply(Math, lineChartData.x));
    lineChartData.y.length && setYLMax(Math.max.apply(Math, lineChartData.y));
    lineChartData.x.length && setXLMin(Math.min.apply(Math, lineChartData.x));
    lineChartData.y.length && setYLMin(Math.min.apply(Math, lineChartData.y));
  }, [lineChartData]);

  const handleXLChange = (e) => {
    setXLAx(e.target.value);
  };

  const handleYLChange = (e) => {
    setYLAx(e.target.value);
  };

  useEffect(() => {
    lineChartData.x.length &&
      lineChartData.y.length &&
      setLineChartData({
        x: fileData
          .map((d) => {
            return d[xLAx];
          })
          .filter((xval) => Number(xval) >= xLMin && Number(xval) <= xLMax),
        y: fileData
          .map((d) => {
            return d[yLAx];
          })
          .filter((yval) => Number(yval) >= yLMin && Number(yval) <= yLMax),
      });
  }, [xLMax, xLMin, yLMax, yLMin]);

  const changeRangeXL = ({ minVal, maxVal }) => {
    setXLMin(minVal);
    setXLMax(maxVal);
  };

  const changeRangeYL = ({ minVal, maxVal }) => {
    setYLMin(minVal);
    setYLMax(maxVal);
  };

  const showLineChartFilter = () => {
    lineChartData.x.length &&
      setXLMaxInit(Math.max.apply(Math, lineChartData.x));
    lineChartData.x.length &&
      setXLMinInit(Math.min.apply(Math, lineChartData.x));
    lineChartData.y.length &&
      setYLMaxInit(Math.max.apply(Math, lineChartData.y));
    lineChartData.y.length &&
      setYLMinInit(Math.min.apply(Math, lineChartData.y));
    setIsLineChartFilterShow(true);
  };

  // For Bar Chart
  useEffect(() => {
    xBAx !== "" &&
      yBAx !== "" &&
      setBarChartData({
        x: fileData.map((d) => {
          return d[xBAx];
        }),
        y: fileData.map((d) => {
          return d[yBAx];
        }),
      });

    barChartData.x.length && setXBMaxInit(Math.max.apply(Math, barChartData.x));
    barChartData.x.length && setXBMinInit(Math.min.apply(Math, barChartData.x));
    barChartData.y.length && setYBMaxInit(Math.max.apply(Math, barChartData.y));
    barChartData.y.length && setYBMinInit(Math.min.apply(Math, barChartData.y));
  }, [xBAx, yBAx, fileData]);

  useEffect(() => {
    barChartData.x.length && setXBMax(Math.max.apply(Math, barChartData.x));
    barChartData.y.length && setYBMax(Math.max.apply(Math, barChartData.y));
    barChartData.x.length && setXBMin(Math.min.apply(Math, barChartData.x));
    barChartData.y.length && setYBMin(Math.min.apply(Math, barChartData.y));
  }, [barChartData]);

  const handleXBChange = (e) => {
    setXBAx(e.target.value);
  };

  const handleYBChange = (e) => {
    setYBAx(e.target.value);
  };

  useEffect(() => {
    barChartData.x.length &&
      barChartData.y.length &&
      setBarChartData({
        x: fileData
          .map((d) => {
            return d[xBAx];
          })
          .filter((xval) => Number(xval) >= xBMin && Number(xval) <= xBMax),
        y: fileData
          .map((d) => {
            return d[yBAx];
          })
          .filter((yval) => Number(yval) >= yBMin && Number(yval) <= yBMax),
      });
  }, [xBMax, xBMin, yBMax, yBMin]);

  const changeRangeXB = ({ minVal, maxVal }) => {
    setXBMin(minVal);
    setXBMax(maxVal);
  };

  const changeRangeYB = ({ minVal, maxVal }) => {
    setYBMin(minVal);
    setYBMax(maxVal);
  };

  const showBarChartFilter = () => {
    barChartData.x.length && setXBMaxInit(Math.max.apply(Math, barChartData.x));
    barChartData.x.length && setXBMinInit(Math.min.apply(Math, barChartData.x));
    barChartData.y.length && setYBMaxInit(Math.max.apply(Math, barChartData.y));
    barChartData.y.length && setYBMinInit(Math.min.apply(Math, barChartData.y));
    setIsBarChartFilterShow(true);
  };

  return (
    <>
      {fileData.length && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <div className="chart-container">
              <div className="chart-filter">
                <div>
                  <select value={selectedModel} onChange={handleModelChange}>
                    {allModels.length &&
                      allModels.map((model) => {
                        return (
                          <option key={model.id} value={model.id}>
                            {model.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div
                  className="az-header-right"
                  style={{ justifyContent: "end" }}
                >
                  <div
                    className="dropdown az-profile-menu"
                    style={{ cursor: "pointer" }}
                  >
                    <a
                      style={{ fontSize: "1.2rem" }}
                      className="az-img-user"
                      onClick={showLineChartFilter}
                    >
                      <FiFilter />
                    </a>

                    {isLineChartFilterShow && (
                      <div
                        className="dropdown-menu"
                        style={{
                          display: "block",
                          padding: "0.6rem",
                          borderRadius: "5px",
                          width: "fit-content",
                          opacity: "0.9",
                        }}
                      >
                        <div className="filter-header">
                          <h5>Filter</h5>
                          <a
                            style={{ fontSize: "1.5rem" }}
                            onClick={() => setIsLineChartFilterShow(false)}
                          >
                            <AiOutlineCloseCircle className="" />
                          </a>
                        </div>

                        <div className="filter-container">
                          <div className="filter-content">
                            <div className="filter-content-top">
                              <h6>X Axis</h6>
                              <select value={xLAx} onChange={handleXLChange}>
                                {columnData.length &&
                                  columnData.map((cl) => {
                                    return (
                                      <option key={cl} value={cl}>
                                        {cl}
                                      </option>
                                    );
                                  })}
                              </select>
                            </div>

                            <div className="filter-content-bottom">
                              <Slider
                                min={xLMinInit}
                                max={xLMaxInit}
                                stateChanger={changeRangeXL}
                              />
                            </div>
                          </div>

                          <div className="filter-content">
                            <div className="filter-content-top">
                              <h6>Y Axis</h6>
                              <select value={yLAx} onChange={handleYLChange}>
                                {columnData.length &&
                                  columnData.map((cl) => {
                                    return (
                                      <option key={cl} value={cl}>
                                        {cl}
                                      </option>
                                    );
                                  })}
                              </select>
                            </div>

                            <div className="filter-content-bottom">
                              <Slider
                                min={yLMinInit}
                                max={yLMaxInit}
                                stateChanger={changeRangeYL}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <LineChart data={lineChartData} ax={{ x: xLAx, y: yLAx }} />
            </div>

            <div className="chart-container">
              <div className="chart-filter">
                <div></div>
                <div
                  className="az-header-right"
                  style={{ justifyContent: "end" }}
                >
                  <div
                    className="dropdown az-profile-menu"
                    style={{ cursor: "pointer" }}
                  >
                    <a
                      style={{ fontSize: "1.2rem" }}
                      className="az-img-user"
                      onClick={showBarChartFilter}
                    >
                      <FiFilter />
                    </a>

                    {isBarChartFilterShow && (
                      <div
                        className="dropdown-menu"
                        style={{
                          display: "block",
                          padding: "0.6rem",
                          borderRadius: "5px",
                          width: "fit-content",
                          opacity: "0.9",
                        }}
                      >
                        <div className="filter-header">
                          <h5>Filter</h5>
                          <a
                            style={{ fontSize: "1.5rem" }}
                            onClick={() => setIsBarChartFilterShow(false)}
                          >
                            <AiOutlineCloseCircle className="" />
                          </a>
                        </div>

                        <div className="filter-container">
                          <div className="filter-content">
                            <div className="filter-content-top">
                              <h6>X Axis</h6>
                              <select value={xBAx} onChange={handleXBChange}>
                                {columnData.length &&
                                  columnData.map((cl) => {
                                    return (
                                      <option key={cl} value={cl}>
                                        {cl}
                                      </option>
                                    );
                                  })}
                              </select>
                            </div>

                            <div className="filter-content-bottom">
                              <Slider
                                min={xBMinInit}
                                max={xBMaxInit}
                                stateChanger={changeRangeXB}
                              />
                            </div>
                          </div>

                          <div className="filter-content">
                            <div className="filter-content-top">
                              <h6>Y Axis</h6>
                              <select value={yBAx} onChange={handleYBChange}>
                                {columnData.length &&
                                  columnData.map((cl) => {
                                    return (
                                      <option key={cl} value={cl}>
                                        {cl}
                                      </option>
                                    );
                                  })}
                              </select>
                            </div>

                            <div className="filter-content-bottom">
                              <Slider
                                min={yBMinInit}
                                max={yBMaxInit}
                                stateChanger={changeRangeYB}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <BarChart data={barChartData} ax={{ x: xBAx, y: yBAx }} />
            </div>
          </div>
          {
              selectedModel !== '0' &&
              <div className="model-container">
                <div className="sub-title">{`Model ${selectedModel} Applied Output`}</div>

                {
                  selectedModel === '1' ? 
                  <div class="table-responsive" style={{ marginTop: "1rem" }}>
                <table class="table table-striped mg-b-0">
                  <thead>
                    <tr>
                      {Object.keys(modelOutput).length &&
                        Object.keys(modelOutput).map((col) => {
                          return <th>{col}</th>;
                        })}
                    </tr>
                  </thead>
                  <tbody>
                          <tr>
                            {Object.values(modelOutput).length &&
                              Object.values(modelOutput).map((col) => {
                                return <td>{col[0]}</td>;
                              })}
                          </tr>
                  </tbody>
                </table>
                </div>
                :
                <div class="table-responsive" style={{ marginTop: "1rem" }}>
                <table class="table table-striped mg-b-0">
                  <thead>
                    <tr>
                      <th>{' '}</th>
                      {Object.keys(modelOutput).length &&
                        Object.keys(modelOutput).map((col) => {
                          return <th>{col}</th>;
                        })}
                    </tr>
                  </thead>
                  <tbody>
                          <tr>
                            <td>Min</td>
                            {Object.values(modelOutput).length &&
                              Object.values(modelOutput).map((col) => {
                                return <td>{col.min}</td>;
                              })}
                          </tr>
                          <tr>
                            <td>Max</td>
                            {Object.values(modelOutput).length &&
                              Object.values(modelOutput).map((col) => {
                                return <td>{col.max}</td>;
                              })}
                          </tr>
                  </tbody>
                </table>
                </div>
                }
              </div>
              
          }
        </div>
      )}
    </>
  );
};

export default FileDataViewer;
