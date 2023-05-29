import utils from "../../utils";
import Plugin from "./Plugin";
import Parser, { PARSER_DEFAULTS, PARSER_DEFAULTS_PRO } from "./Parser";
import GroupParser, { GROUP_PARSER_DEFAULTS, GROUP_PARSER_DEFAULTS_PRO } from "./GroupParser";
import ModalElement from "./modal";

const plugin = new Plugin( {
    __parsers__: [
        ["default", Parser],
        ["groups", GroupParser]
    ],
    default: PARSER_DEFAULTS_PRO,
    groups: GROUP_PARSER_DEFAULTS_PRO,
    watch: false
} );

plugin.utils = utils;
plugin.Plugin = Plugin;
plugin.Parser = Parser;
plugin.GroupParser = GroupParser;
plugin.PARSER_DEFAULTS = PARSER_DEFAULTS;
plugin.GROUP_PARSER_DEFAULTS = GROUP_PARSER_DEFAULTS;
plugin.ModalElement = ModalElement;

export default plugin;