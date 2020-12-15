const createCurvature = (start, end, curv, type) => {
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

export {
  createCurvature,
}
