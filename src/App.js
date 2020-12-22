import './App.css';
import Drawflow from './components/Drawflow/Drawflow';
import { NODE_CATEGORY } from './common/Enum';
import getDummyFields from "./components/Drawflow/Mock/fields.mock";
import getDummyRules from "./components/Drawflow/Mock/rules.mock";
import { useState, useEffect } from 'react';

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
      console.debug("get dummy rules!");
      result = getDummyRules(200);
    }
    else if(current === NODE_CATEGORY.FIELD) {
      console.debug("get dummy fields!");
      result = getDummyFields(200);
    }

    result.then(dataObj => {
      setCache({
        ...cache,
        [current]: dataObj,
      })
    });
  }, [current]);

  // TODO : queue 만들기; 무한 스크롤, 페이징에 사용

  const getDataByScroll = async (type) => {
    let result = null;
    let obj = null;
    if(current === NODE_CATEGORY.FIELD) {
      console.debug("get dummy fields!");
      result = (await getDummyFields(200)).list;
      obj = {
        ...cache[current],
        list: [...cache[current].list, ...result],
      }
    }
    else if(current === NODE_CATEGORY.RULE) {
      console.debug("get dummy rules!");
      result = await getDummyRules(200);
      obj = {
        ...cache[current],
        single: {
          ...cache[current].single,
          list: [...cache[current].single.list, ...result.single.list],
        },
        threshold: {
          ...cache[current].threshold,
          list: [...cache[current].threshold.list, ...result.threshold.list],
        },
      }
    }
    setCache({
      ...cache,
      [current]: obj,
    });
  }

  return (
    <div className="App">
      {current === NODE_CATEGORY.RULE && <button onClick={() => {setCurrent(NODE_CATEGORY.FIELD)}}>Fields</button>}
      {current === NODE_CATEGORY.FIELD && <button onClick={() => {setCurrent(NODE_CATEGORY.RULE)}}>Rules</button>}
      <Drawflow
        type={current}
        dataObj={cache[current]}
        getDataByScroll={getDataByScroll}
      />
    </div>
  );
}

export default App;
