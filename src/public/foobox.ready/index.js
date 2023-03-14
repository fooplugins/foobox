import domReady from "../../utils/domReady";
import FooBox from "../foobox";
domReady().then(()=> FooBox.init( global.FOOBOX ));
