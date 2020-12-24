import React, { useState, useEffect } from 'react';
import Drawflow from './components/Drawflow/Drawflow';
import { NODE_CATEGORY } from './common/Enum';
import mock from "./components/Drawflow/Mock";
import './App.css';

// TODO : 시연용 함수 구성. 배포 시에는 하나만 쓰기
function App() {
  const [current, setCurrent] = useState(NODE_CATEGORY.FILTER);
  // original data list
  const [dataList, setDataList] = useState({
    [NODE_CATEGORY.FILTER]: null,
    [NODE_CATEGORY.SINGLE]: null,
    [NODE_CATEGORY.THRESHOLD]: null,
  });
  // cache; cacheing dataList.list
  // const [cache, setCache] = useState([]);
  const [canvasData, setCanvasData] = useState(null);

  useEffect(() => {
    getInitData().then(data => {
      setDataList(data);
    });
    mock.getDummy().then(data => {
      setCanvasData(data);
    })
  }, []);

  const paging = {
    [NODE_CATEGORY.FILTER]: 200,
    [NODE_CATEGORY.SINGLE]: 1000,
    [NODE_CATEGORY.THRESHOLD]: 1000,
  }

  const getInitData = async () => {
    let result = {};
    result[NODE_CATEGORY.FILTER] = await mock[NODE_CATEGORY.FILTER](paging[NODE_CATEGORY.FILTER]);
    result[NODE_CATEGORY.SINGLE] = await mock[NODE_CATEGORY.SINGLE](paging[NODE_CATEGORY.SINGLE]);
    result[NODE_CATEGORY.THRESHOLD] = await mock[NODE_CATEGORY.THRESHOLD](paging[NODE_CATEGORY.THRESHOLD]);

    return result;
  }

  const clearCurrent = () => {
    setDataList({
      [current]: null,
    });
  }

  const getDataByScroll = async (searchWord = "") => {
    // get next data
    let result = await mock[current](paging[current], searchWord);
    
    setDataList({
      ...dataList,
      [current]: {
        ...dataList[current],
        list: [...dataList[current].list, ...result.list],
      }
    });
  }

  return (
    <div className="App">
      {/* {current === NODE_CATEGORY.RULE && <button onClick={() => {setCurrent(NODE_CATEGORY.FILTER)}}>Fields</button>} */}
      {/* {current === NODE_CATEGORY.FILTER && <button onClick={() => {setCurrent(NODE_CATEGORY.RULE)}}>Rules</button>} */}
      <Drawflow
        type={current}
        dataObj={dataList[current]}
        canvasData={canvasData}
        getDataByScroll={getDataByScroll}
        clearCurrent={clearCurrent}
        infinityScroll={current !== NODE_CATEGORY.FILTER}
      />
    </div>
  );
}

export default App;
