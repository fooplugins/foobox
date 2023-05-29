import "./index.scss";
import getResizeObserverEntrySize from "../../../../utils/getResizeObserverEntrySize";
import debounce from "../../../../utils/debounce";

export * from "../items";
export * from "../overlay";

class InnerElement extends HTMLElement {
    constructor() {
        super();
        this.#observer = new ResizeObserver( debounce( this.onResize.bind( this ), 50 ) );
    }

    #observer;

    onResize( entries ){
        if ( !this.items ) return;
        const entry = entries.length ? entries[0] : null;
        if ( !entry ) return;
        const size = getResizeObserverEntrySize( entry );
        this.items.doResize( size );
        console.log( 'onResize', size );
    }

    connectedCallback(){
        if ( this.isConnected ){
            this.#observer.unobserve( this );
            this.#observer.observe( this );
        }
    }

    disconnectedCallback(){
        this.#observer.unobserve( this );
    }

    get items(){
        return this.querySelector( 'foobox-items' );
    }

    get overlay(){
        return this.querySelector( 'foobox-overlay' );
    }

    get cover(){
        return this.hasAttribute( 'cover' );
    }

    set cover( value ){
        this.toggleAttribute( 'cover', Boolean( value ) );
    }
}

customElements.define( 'foobox-inner', InnerElement );

export default InnerElement;