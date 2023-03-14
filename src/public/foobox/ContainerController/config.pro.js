import parser_config from "./Parser/config.pro";
import groups_config from "./GroupParser/config.pro";
import GroupParser from "./GroupParser";

export default {
    __parsers__: ["default", ["groups", GroupParser]],
    default: parser_config,
    groups: groups_config
};