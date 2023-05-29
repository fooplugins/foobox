import "./index.scss";
import { isFunction } from "../../../../utils/is";

export * from "./item";

class ItemsElement extends HTMLElement {
    constructor() {
        super();
    }

    doResize( size ){
        let child;
        for ( child of this.children ){
            if ( !isFunction( child[ 'doResize' ] ) ) continue;
            child.doResize( size );
        }
    }
}

customElements.define( 'foobox-items', ItemsElement );

export default ItemsElement;