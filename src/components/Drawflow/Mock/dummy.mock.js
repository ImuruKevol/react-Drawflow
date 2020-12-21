export default () => {
  return new Promise((resolve) => {
    resolve({
      "nodes": {
        "1": {
          "id": 1,
          "type": "Destination",
          "data": {},
          "port": {
            "in": 1,
            "out": 1
          },
          "connections": {
            "inputs": {
              "input_1": {
                "connections": []
              }
            },
            "outputs": {
              "output_1": {
                "connections": []
              }
            }
          },
          "pos": {
            "x": 40.3125,
            "y": 75
          }
        },
        "2": {
          "id": 2,
          "type": "Event",
          "data": {},
          "port": {
            "in": 1,
            "out": 1
          },
          "connections": {
            "inputs": {
              "input_1": {
                "connections": []
              }
            },
            "outputs": {
              "output_1": {
                "connections": []
              }
            }
          },
          "pos": {
            "x": 237.3125,
            "y": 131
          }
        }
      },
      "connections": {
        "1_1_2_1": [],
      },
      "connectionsLabel": {
        "1_1_2_1": "test\nasdf",
      }
    });
  });
}
