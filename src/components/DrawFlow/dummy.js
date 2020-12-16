const dummy = {
  "nodes": {
    "1": {
        "id": 1,
        "type": "Collector",
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
          "x": 22.3125,
          "y": 57
        }
    },
    "2": {
        "id": 2,
        "type": "Device",
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
          "x": 231.3125,
          "y": 182
        }
    },
    "3": {
        "id": 3,
        "type": "DeviceCustom",
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
          "x": 196.813,
          "y": 33.5
        }
    },
    "4": {
        "id": 4,
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
          "x": 473.3125,
          "y": 144
        }
    }
  },
  "connections": {
    "1_1_3_1": [],
    "1_1_2_1": [],
    "3_1_4_1": [],
    "2_1_4_1": []
  }
}
// const dummy = {
//   "nodes": {
//     "1": {
//       "id": 1,
//       "type": "Collector",
//       "data": {},
//       "port": {
//         "in": 1,
//         "out": 1
//       },
//       "pos": {
//         "x": 90.3125,
//         "y": 32
//       }
//     "2": {
//       "id": 2,
//       "type": "Device",
//       "data": {},
//       "port": {
//         "in": 1,
//         "out": 1
//       },
//       "pos": {
//         "x": 218.3125,
//         "y": 123
//       }
//     "3": {
//       "id": 3,
//       "type": "Destination",
//       "data": {},
//       "port": {
//         "in": 1,
//         "out": 1
//       },
//       "pos": {
//         "x": 99.3125,
//         "y": 203
//       }
//     "4": {
//       "id": 4,
//       "type": "DeviceCustom",
//       "data": {},
//       "port": {
//         "in": 1,
//         "out": 1
//       },
//       "pos": {
//         "x": 404.3125,
//         "y": 41
//       }
//     "5": {
//       "id": 5,
//       "type": "Event",
//       "data": {},
//       "port": {
//         "in": 1,
//         "out": 1
//       },
//       "pos": {
//         "x": 364.3125,
//         "y": 226
//       }
//     "6": {
//       "id": 6,
//       "type": "Source",
//       "data": {},
//       "port": {
//         "in": 1,
//         "out": 1
//       },
//       "pos": {
//         "x": 447.3125,
//         "y": 117
//       }
//   },
//   "connections": {
//     "1_1_2_1": [{x:300,y:50}, {x:100,y:150}],
//     "1_1_3_1": [],
//   }
// };

export default dummy;
