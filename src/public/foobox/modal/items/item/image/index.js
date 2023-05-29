import "./index.scss";
import { isStringNotEmpty } from "../../../../../../utils/is";

class ImageElement extends HTMLElement {

    static get observedAttributes() { return ['src', 'srcset', 'zoom']; }

    constructor() {
        super();
        this.attachShadow( { mode: "open" } ).append( this.img );
    }

    #img;

    get img() {
        if ( !this.#img ) {
            this.#img = this.ownerDocument.createElement( 'img' );
            this.#img.setAttribute( 'part', 'img' );
            this.#img.setAttribute( 'draggable', 'false' );
        }
        return this.#img;
    }

    get src(){
        return this.getAttribute( 'src' );
    }

    set src( value ){
        if ( isStringNotEmpty( value ) ){
            this.setAttribute( 'src', value );
        } else {
            this.removeAttribute( 'src' );
        }
    }

    get srcset(){
        return this.getAttribute( 'srcset' );
    }

    set srcset( value ){
        if ( isStringNotEmpty( value ) ){
            this.setAttribute( 'srcset', value );
        } else {
            this.removeAttribute( 'srcset' );
        }
    }

    get zoom(){
        return this.getAttribute( 'zoom' );
    }

    set zoom( value ){
        if ( isStringNotEmpty( value ) ){
            this.setAttribute( 'zoom', value );
        } else {
            this.removeAttribute( 'zoom' );
        }
    }



    attributeChangedCallback(name, oldValue, newValue) {
        if ( name === "src" )
            this.img.src = newValue;

        if ( name === "srcset" )
            this.img.srcset = newValue;

        if ( name === "zoom" ){
            let zoom = isStringNotEmpty( newValue ) ? Number.parseInt( newValue ) : 1;
            zoom = Number.isNaN( zoom ) ? 1 : zoom;
            let scale = this.doZoom( zoom );
            console.log( 'maxZoom', scale );
            this.style.setProperty( 'transform', `scale(${scale}) translateX(0px) translateY(0px)` );
        }

        console.log( "attr changed: ", name, oldValue, newValue );
    }

    doZoom( scale, cover = false ){
        if ( this.img.complete ) {
            const maxDensity = 1;
            let maxSize = cover ? {
                width: Math.round( Math.min( this.clientWidth, ( this.img.naturalWidth / this.img.naturalHeight ) * this.clientHeight ) ),
                height: Math.round( Math.min( this.clientHeight, ( this.img.naturalHeight / this.img.naturalWidth ) * this.clientWidth ) )
            } : {
                width: this.clientWidth,
                height: this.clientHeight
            };

            maxSize = {};

            const maxZoom = this.img.naturalWidth ? Math.max(round(this.clientWidth / this.img.naturalWidth, 5), 1) : 1;
        }
        return scale;
    }

    doResize( size ) {
        if ( this.img.complete ) {
            // const restrict = this.restrict( size );
            // switch ( restrict ) {
            //     case "width":
            //         this.img.style.removeProperty( "height" );
            //         this.img.style.setProperty( "width", "100%" );
            //         break;
            //     case "height":
            //         this.img.style.removeProperty( "width" );
            //         this.img.style.setProperty( "height", "100%" );
            //         break;
            //     default:
            //         this.img.style.removeProperty( "width" );
            //         this.img.style.removeProperty( "height" );
            //         break;
            // }
        }
    }

    restrict( size ) {
        if ( !this.img.complete ) return null;

        const { naturalWidth: width, naturalHeight: height } = this.img;

        const ratioX = size.width / width;
        const ratioY = size.height / height;

        console.log( 'restrict', size, width, height, ratioX, ratioY );

        if ( ratioY < ratioX ) return "height";
        if ( ratioX < ratioY ) return "width";
        return null;
    }
}

customElements.define( 'foobox-image', ImageElement );

export default ImageElement;