const createCurvature = () => {

}

/**
 * 
 * @param nodeId node id
 * @param params curvature, rerouteCurvature, rerouteCurvatureStartEnd, rerouteFixCurvature, rerouteWidth, zoom
 */
const updateConnectionNodes = (nodeId, params) => {
  const { curvature, rerouteCurvature, rerouteCurvatureStartEnd, rerouteFixCurvature, rerouteWidth, zoom } = params;
  const idSearch = 'node_in_' + nodeId;
  const idSearchOut = 'node_out_' + nodeId;
  
  // TODO: replace querySelector to something.
  const precanvas = document.querySelector("#drawflow").querySelector(".drawflow");
  
  let precanvasWitdhZoom = (precanvas.clientWidth / (precanvas.clientWidth * zoom)) || 0;
  let precanvasHeightZoom = (precanvas.clientHeight / (precanvas.clientHeight * zoom)) || 0;

  
}

export {
  updateConnectionNodes,
}
