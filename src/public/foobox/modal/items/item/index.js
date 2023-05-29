import "./index.scss";
import { isFunction, isStringNotEmpty } from "../../../../../utils/is";

export * from "./caption";
export * from "./image";

class ItemElement extends HTMLElement {
    constructor() {
        super();
    }

    get type(){
        return this.getAttribute( 'type' );
    }

    set type( value ){
        if ( isStringNotEmpty( value ) ){
            this.setAttribute( 'type', value );
        } else {
            this.removeAttribute( 'type' );
        }
    }

    doResize( size ){
        let child;
        for ( child of this.children ){
            if ( !isFunction( child[ 'doResize' ] ) ) continue;
            child.doResize( size );
        }
    }
}

customElements.define( 'foobox-item', ItemElement );

export default ItemElement;