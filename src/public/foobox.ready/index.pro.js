import domReady from "../../utils/domReady";
import FooBox from "../foobox/index.pro";
domReady().then(()=> FooBox.init( global.FOOBOX ));
