import { NODE_CATEGORY } from "../../../common/Enum";
import getDummy from "./dummy.mock";
import getFilters from "./fields.mock";
import { 
    getSingle,
    getThreshold,
} from "./rules.mock";

export default {
    getDummy,
    [NODE_CATEGORY.FILTER]: getFilters,
    [NODE_CATEGORY.SINGLE]: getSingle,
    [NODE_CATEGORY.THRESHOLD]: getThreshold,
}
