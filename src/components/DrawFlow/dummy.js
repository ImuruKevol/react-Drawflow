const dummy = {
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
            "connections": [
                {
                    "node": "2",
                    "input": "output_1"
                }
            ]
          }
        },
        "outputs": {
          "output_1": {
            "connections": []
          }
        }
      },
      "pos": {
        "x": 90.3125,
        "y": 32
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
            "connections": [
                {
                    "node": "2",
                    "output": "input_1"
                }
            ]
          }
        }
      },
      "pos": {
        "x": 218.3125,
        "y": 123
      }
    },
    "3": {
      "id": 3,
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
        "x": 99.3125,
        "y": 203
      }
    },
    "4": {
      "id": 4,
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
        "x": 404.3125,
        "y": 41
      }
    },
    "5": {
      "id": 5,
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
        "x": 364.3125,
        "y": 226
      }
    },
    "6": {
      "id": 6,
      "type": "Source",
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
        "x": 447.3125,
        "y": 117
      }
    }
  };

export default dummy;
