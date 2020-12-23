import {CURV as curv} from "../../common/Enum";

const createCurvature = (start, end, type) => {
  let hx1 = null;
  let hx2 = null;

  //type openclose open close other
  switch (type) {
    case 'open':
      if (start.x >= end.x) {
        hx1 = start.x + Math.abs(end.x - start.x) * curv;
        hx2 = end.x - Math.abs(end.x - start.x) * (curv * -1);
      } else {
        hx1 = start.x + Math.abs(end.x - start.x) * curv;
        hx2 = end.x - Math.abs(end.x - start.x) * curv;
      }
      return ' M ' + start.x + ' ' + start.y + ' C ' + hx1 + ' ' + start.y + ' ' + hx2 + ' ' + end.y + ' ' + end.x + '  ' + end.y;

    case 'close':
      if (start.x >= end.x) {
        hx1 = start.x + Math.abs(end.x - start.x) * (curv * -1);
        hx2 = end.x - Math.abs(end.x - start.x) * curv;
      } else {
        hx1 = start.x + Math.abs(end.x - start.x) * curv;
        hx2 = end.x - Math.abs(end.x - start.x) * curv;
      }
      return ' M ' + start.x + ' ' + start.y + ' C ' + hx1 + ' ' + start.y + ' ' + hx2 + ' ' + end.y + ' ' + end.x + '  ' + end.y;

    case 'other':
      if (start.x >= end.x) {
        hx1 = start.x + Math.abs(end.x - start.x) * (curv * -1);
        hx2 = end.x - Math.abs(end.x - start.x) * (curv * -1);
      } else {
        hx1 = start.x + Math.abs(end.x - start.x) * curv;
        hx2 = end.x - Math.abs(end.x - start.x) * curv;
      }
      return ' M ' + start.x + ' ' + start.y + ' C ' + hx1 + ' ' + start.y + ' ' + hx2 + ' ' + end.y + ' ' + end.x + '  ' + end.y;

    default:
      hx1 = start.x + Math.abs(end.x - start.x) * curv;
      hx2 = end.x - Math.abs(end.x - start.x) * curv;

      return ' M ' + start.x + ' ' + start.y + ' C ' + hx1 + ' ' + start.y + ' ' + hx2 + ' ' + end.y + ' ' + end.x + '  ' + end.y;
  }
}

const getCanvasInfo = () => {
  // TODO : replace querySelector to someting
  const canvas = document.querySelector("#drawflow").querySelector(".drawflow");
  const canvasRect = canvas.getBoundingClientRect();
  return {
      x: canvasRect.x,
      y: canvasRect.y,
      width: canvas.clientWidth,
      height: canvas.clientHeight,
  };
}

const getPos = (clientX, clientY, zoom) => {
  const { x, y, width, height } = getCanvasInfo();
  return  {
      x: clientX * (width / (width * zoom)) - (x * (width / (width * zoom))),
      y: clientY * (height / (height * zoom)) - (y * (height / (height * zoom))),
  }
}

const findIndexByElement = (elmt) => {
  const { parentElement } = elmt;
  const arr = Array.from(parentElement.childNodes);
  
  for(let i=0;i<arr.length;i++) {
      if(arr[i] === elmt) return i;
  }
  return -1;
}

export default {
  createCurvature,
  getCanvasInfo,
  getPos,
  findIndexByElement,
}
