import "./index.scss";
class OverlayElement extends HTMLElement {
    constructor() {
        super();
    }


}

customElements.define( 'foobox-overlay', OverlayElement );

export default OverlayElement;