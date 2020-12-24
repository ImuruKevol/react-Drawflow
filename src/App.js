import React, { useState, useEffect } from 'react';
import Drawflow from './components/Drawflow/Drawflow';
import { NODE_CATEGORY } from './common/Enum';
import getDummyFields from "./components/Drawflow/Mock/fields.mock";
import getDummyRules from "./components/Drawflow/Mock/rules.mock";
import './App.css';

function App() {
  const [current, setCurrent] = useState(NODE_CATEGORY.FIELD);
  const [cache, setCache] = useState({
    [NODE_CATEGORY.FIELD]: null,
    [NODE_CATEGORY.RULE]: null,
  });
  
  useEffect(() => {
    if(cache[current]) return;

    let result = null;
    if(current === NODE_CATEGORY.RULE) {
      result = getDummyRules(10);
    }
    else if(current === NODE_CATEGORY.FIELD) {
      result = getDummyFields(10);
    }

    result.then(dataObj => {
      setCache({
        ...cache,
        [current]: dataObj,
      })
    });
  }, [current]);

  const clearCache = () => {
    setCache({
      [current]: null,
    });
  }

  const pushDataObj = (type, dataObj) => {
    let obj = null;
    if(type === NODE_CATEGORY.FIELD) {
      obj = {...cache[current]};
      console.log(cache[current])
      try{
        obj.list = [...cache[current].list, ...dataObj.list];
      }
      catch{
        obj.list = [...dataObj.list];
      }
    }
    else if(type === NODE_CATEGORY.RULE) {
      obj = {
        ...cache[current],
        single: {
          ...cache[current].single,
        },
        threshold: {
          ...cache[current].threshold,
        },
      }
      try{
        obj.single.list = [...cache[current].single.list, ...dataObj.single.list];
        obj.threshold.list = [...cache[current].threshold.list, ...dataObj.threshold.list];
      }
      catch{
        obj.single.list = [...dataObj.single.list];
        obj.threshold.list = [...dataObj.threshold.list];
      }
    }
    setCache({
      ...cache,
      [type]: obj,
    })
  }

  // TODO : 이전 입력값과 현재 입력값 비교하여 length 증가이면 현재 cache 배열 사용하기
  // TODO : 전체 리스트는 따로 관리하기
  const getDataByScroll = async (searchWord = "") => {
    let result = null;
    if(current === NODE_CATEGORY.FIELD) {
      result = (await getDummyFields(10, searchWord));
    }
    else if(current === NODE_CATEGORY.RULE) {
      result = await getDummyRules(10, searchWord);
    }
    pushDataObj(current, result);
  }

  return (
    <div className="App">
      {current === NODE_CATEGORY.RULE && <button onClick={() => {setCurrent(NODE_CATEGORY.FIELD)}}>Fields</button>}
      {current === NODE_CATEGORY.FIELD && <button onClick={() => {setCurrent(NODE_CATEGORY.RULE)}}>Rules</button>}
      <Drawflow
        type={current}
        dataObj={cache[current]}
        getDataByScroll={getDataByScroll}
        pushDataObj={pushDataObj}
        clearCache={clearCache}
      />
    </div>
  );
}

export default App;
