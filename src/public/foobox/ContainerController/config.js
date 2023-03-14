import parser_config from "./Parser/config";
import groups_config from "./GroupParser/config";
import GroupParser from "./GroupParser";

export default {
    __parsers__: ["default", ["groups", GroupParser]],
    default: parser_config,
    groups: groups_config
};