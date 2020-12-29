import React, { useState, useEffect } from 'react';
import Drawflow from './components/Drawflow/Drawflow';
import { LIST_TYPE, PAGE, RULES, RULES_LIST_TYPE } from './common/Enum';
import FilterList from "./components/Drawflow/NodeListMenu/FilterList";
import RuleList from "./components/Drawflow/NodeListMenu/RuleList";
import mock from "./components/Drawflow/Mock";
import './App.css';

function App() {
  // TODO change logic
  const current = window.location.pathname.slice(1).length === 0?RULES.SINGLE:window.location.pathname.slice(1);
  //* original data list
  const [dataObj, setDataObj] = useState(null);
  const [canvasData, setCanvasData] = useState(null);
  const [editLock, setEditLock] = useState(false);
  const [searchWord, setSearchWord] = useState("");

  useEffect(() => {
    const getInitData = async () => {
      let result = null;
      const current = window.location.pathname.slice(1).length === 0?RULES.SINGLE:window.location.pathname.slice(1);
      switch(RULES_LIST_TYPE[current]) {
        case LIST_TYPE.FILTER:
          result = await mock.getFilters(PAGE[current]);
          break;
        case LIST_TYPE.RULE:
          result = {
            [RULES.SINGLE]: await mock.getSingle(PAGE[current]),
            [RULES.THRESHOLD]: await mock.getThreshold(PAGE[current]),
          }
          break;
        default:
          break;
      }
      setDataObj(result);
    }
    getInitData();
    // TODO type별로 dummy 따로 만들기
    mock.getDummy().then(data => {
      setCanvasData(data);
    })
  }, []);

  const onDragStart = (e, data) => {
    e.dataTransfer.setData("data", JSON.stringify(data));
  }

  const isIncludeAndSearch = (target) => {
    const arr = searchWord.toLowerCase().split(" ").filter(item => item.length > 0);
    return arr.filter(word => target.toLowerCase().includes(word)).length === arr.length;
}

  const useSearchButton = RULES_LIST_TYPE[current] !== LIST_TYPE.FILTER;

  return (
    <div className="App">
      {canvasData && dataObj &&
      <>
      <div className="drawflow-node-list">
        <div className="drawflow-node-list-search">
            <input
                type="text"
                placeholder="space: and"
                onChange={e => {setSearchWord(e.target.value)}}
            />
            {useSearchButton && <button>검색</button>}
        </div>
        <div className="drawflow-node-list-flex">
          {RULES_LIST_TYPE[current] === LIST_TYPE.FILTER?
            <FilterList
              filterObj={dataObj}
              editLock={editLock}
              onDragStart={onDragStart}
              isIncludeAndSearch={isIncludeAndSearch}
            /> :
            RULES_LIST_TYPE[current] === LIST_TYPE.RULE?
            <RuleList
              single={dataObj[RULES.SINGLE]}
              threshold={dataObj[RULES.THRESHOLD]}
              editLock={editLock}
              onDragStart={onDragStart}
              isIncludeAndSearch={isIncludeAndSearch}
            /> :
            null
          }
        </div>
      </div>
      <Drawflow
        type={RULES_LIST_TYPE[current]}
        dataObj={dataObj}
        canvasData={canvasData}
        useSearchButton={useSearchButton}
        editLock={editLock}
        setEditLock={setEditLock}
        setSearchWord={setSearchWord}
      />
    </>}
    </div>
  );
}

export default App;
