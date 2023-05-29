import domReady from "../../utils/domReady";
import FooBox from "../foobox/index.pro";

import startTask from "../../utils/task";

const task = startTask( 'FooBox:init' );
domReady().then(()=> FooBox.init( global.FOOBOX )).then( () => task.end() );
