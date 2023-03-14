import Plugin from "./Plugin";
import defaults from "./config";
import ContainerController from "./ContainerController";
// import ModalController from "./controllers/ModalController";

import utils from "../../utils";

const plugin = new Plugin(defaults, ContainerController);
plugin.utils = utils;

global.FooBox = plugin;

export default plugin;