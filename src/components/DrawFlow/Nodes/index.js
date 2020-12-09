/* eslint-disable import/no-anonymous-default-export */
import Collector from "./Collector";
import Destination from "./Destination";
import Device from "./Device";
import DeviceCustom from "./DeviceCustom";
import Event from "./Event";
import Source from "./Source";

// key is must Camel.
// and recommand only alphabet.
// trim(key).toLowerCase() => className
export default {
    Collector,
    Destination,
    Device,
    DeviceCustom,
    Event,
    Source,
};
