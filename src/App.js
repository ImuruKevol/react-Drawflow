import React, { useState, useEffect } from 'react';
import Drawflow from './components/Drawflow/Drawflow';
import { LIST_TYPE, PAGE, RULES, RULES_LIST_TYPE } from './common/Enum';
import mock from "./components/Drawflow/Mock";
import './App.css';

function App() {
  // TODO remove
  const current = window.location.pathname.slice(1).length === 0?RULES.SINGLE:window.location.pathname.slice(1);
  //* original data list
  const [dataObj, setDataObj] = useState(null);
  //* cache; cacheing dataObj.list
  // const [cache, setCache] = useState([]);
  const [canvasData, setCanvasData] = useState(null);

  useEffect(() => {
    mock.getFilters(PAGE[current]).then(data => {
      setDataObj(data);
      mock.getDummy().then(data => {
        setCanvasData(data);
      })
    });
  }, []);

  const clearCurrent = () => {
    setDataObj(null);
  }

  const getDataByScroll = async (searchWord = "") => {
    //* get next data
    let result = await mock.getFilters(PAGE[current], searchWord);
    
    setDataObj({
      ...dataObj,
      list: [...dataObj.list, ...result.list],
    });
  }

  const isInfinityScroll = RULES_LIST_TYPE[current] !== LIST_TYPE.FILTER;

  return (
    <div className="App">
      {/* {current === LIST_TYPE.RULE && <button onClick={() => {setCurrent(LIST_TYPE.FILTER)}}>Fields</button>} */}
      {/* {current === LIST_TYPE.FILTER && <button onClick={() => {setCurrent(LIST_TYPE.RULE)}}>Rules</button>} */}
      {canvasData &&
      <Drawflow
        type={RULES_LIST_TYPE[current]}
        dataObj={dataObj}
        canvasData={canvasData}
        getDataByScroll={getDataByScroll}
        clearCurrent={clearCurrent}
        infinityScroll={isInfinityScroll}
      />}
    </div>
  );
}

export default App;
