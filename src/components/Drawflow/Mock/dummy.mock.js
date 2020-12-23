export default () => {
  return new Promise((resolve) => {
    resolve({
      "nodes": {
        "1": {
          "id": 1,
          "type": "Common",
          "data": {
            "type": "Numeric",
            "name": "HLuF7rwKIuD",
            "value": "asdf"
          },
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
            "x": 43.3125,
            "y": 14
          }
        },
        "2": {
          "id": 2,
          "type": "Common",
          "data": {
            "type": "String",
            "name": "y24mqVYQtD",
            "value": "eeee"
          },
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
            "x": 469.3125,
            "y": 286
          }
        },
        "3": {
          "id": 3,
          "type": "Common",
          "data": {
            "type": "String",
            "name": "y24mqVYQtD",
            "value": "asdffff"
          },
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
            "x": 436.8125,
            "y": 92
          }
        },
        "4": {
          "id": 4,
          "type": "Common",
          "data": {
            "type": "String",
            "name": "1qdlCNXqYBsE",
            "value": "qqweee"
          },
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
            "x": 36.3125,
            "y": 209
          }
        }
      },
      "connections": {
        "1_1_3_1": [
          {
            "x": 327.3125,
            "y": 327
          }
        ],
        "4_1_2_1": [
          {
            "x": 323.3125,
            "y": 57
          }
        ]
      },
      "connectionsLabel": {
        "1_1_3_1": "test label",
      }
    });
  });
}