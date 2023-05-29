import "./index.scss";
import { isBoolean, isStringNotEmpty } from "../../../../../../utils/is";

class CaptionElement extends HTMLElement {

    static get observedAttributes() {
        return [ 'title', 'description' ];
    }

    constructor() {
        super();
        this.attachShadow( { mode: "open" } ).append( this.header, this.section, this.ownerDocument.createElement( 'slot' ), this.toolbar );
    }

    #header;

    get header() {
        if ( !this.#header ) {
            this.#header = this.ownerDocument.createElement( 'header' );
            this.#header.setAttribute( 'part', 'title' );
        }
        return this.#header;
    }

    #section;

    get section() {
        if ( !this.#section ) {
            this.#section = this.ownerDocument.createElement( 'section' );
            this.#section.setAttribute( 'part', 'description' );
        }
        return this.#section;
    }

    #toolbar;

    get toolbar() {
        if ( !this.#toolbar ) {
            this.#toolbar = this.ownerDocument.createElement( 'div' );
            this.#toolbar.setAttribute( 'part', 'toolbar' );
            const close = this.ownerDocument.createElement( 'button' );
            close.innerHTML = '&times;';
            close.addEventListener( 'click', ( e ) => {
                e.preventDefault();
                this.toggle();
            } );
            const slot = this.ownerDocument.createElement( 'slot' );
            slot.name = 'toolbar';
            this.#toolbar.append( close, slot );
        }
        return this.#toolbar;
    }

    get open() {
        return this.hasAttribute( 'open' );
    }

    set open( value ) {
        this.toggleAttribute( 'open', Boolean( value ) );
    }

    get description() {
        return this.getAttribute( 'description' );
    }

    set description( value ) {
        if ( isStringNotEmpty( value ) ) {
            this.setAttribute( 'description', value );
        } else {
            this.removeAttribute( 'description' );
        }
    }

    get position() {
        return this.getAttribute( 'position' );
    }

    set position( value ) {
        if ( [ 'top', 'bottom' ].includes( value ) ) {
            this.setAttribute( 'position', value );
        } else {
            this.removeAttribute( 'position' );
        }
    }

    attributeChangedCallback( name, oldValue, newValue ) {
        if ( name === "title" )
            this.header.innerHTML = newValue;

        if ( name === "description" )
            this.section.innerHTML = newValue;

        console.log( "attr changed: ", name, oldValue, newValue );
    }

    toggle( force ) {
        return this.open = isBoolean( force ) ? force : !this.open;
    }
}

customElements.define( 'foobox-caption', CaptionElement );

export default CaptionElement;