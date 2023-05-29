/**
 * @typedef {Object} ResizeObserverSize
 * @property {number} inlineSize
 * @property {number} blockSize
 * @property {number} width
 * @property {number} height
 */
/**
 * @typedef {Object} ResizeObserverEntry
 * @property {ResizeObserverSize|Array<ResizeObserverSize>|undefined} contentBoxSize
 * @property {DOMRect} contentRect
 */
/**
 * Gets the width and height from the ResizeObserverEntry
 * @param {ResizeObserverEntry} entry - The entry to retrieve the size from.
 * @returns {{width: Number,height: Number}}
 */
function getResizeObserverEntrySize( entry ) {
    let width, height;
    if ( entry.contentBoxSize ) {
        // Checking for chrome as using a non-standard array
        if ( entry.contentBoxSize[ 0 ] ) {
            width = entry.contentBoxSize[ 0 ].inlineSize;
            height = entry.contentBoxSize[ 0 ].blockSize;
        } else {
            width = entry.contentBoxSize.inlineSize;
            height = entry.contentBoxSize.blockSize;
        }
    } else {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
    }
    return {
        width: width,
        height: height
    };
}

export default getResizeObserverEntrySize;