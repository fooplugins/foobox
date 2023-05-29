import {isStringNotEmpty} from "../../utils/is";
import {asyncForEach} from "../../utils/iasync";
import Parser, { PARSER_DEFAULTS, PARSER_DEFAULTS_PRO } from "./Parser";
import Container from "./Container";

//region type-definitions

/**
 * @typedef {Parser~Configuration} GroupParser~Configuration
 * @property {number} [priority=99]
 */

//endregion

export const GROUP_PARSER_DEFAULTS = {
    ...PARSER_DEFAULTS,
    priority: 99,
    include: []
};

export const GROUP_PARSER_DEFAULTS_PRO = {
    ...PARSER_DEFAULTS_PRO,
    priority: 99,
    include: []
};

export default class GroupParser extends Parser {

    /**
     * @inheritDoc
     */
    async parseDocument( handledRefs, nocache ) {
        const results = [];
        await asyncForEach( this.config.include, ( selector ) => {
            if ( !handledRefs.has( selector ) ){
                const container = this.parse( selector, handledRefs, nocache );
                if ( container && container.items.length ){
                    results.push( container );
                    handledRefs.add( selector );
                }
            }
        } );
        this.purgeCache( results );
        return results;
    }

    /**
     * @inheritDoc
     */
    shouldPurge( container ) {
        return container.items.length === 0;
    }

    /**
     * @inheritDoc
     */
    create( ref, options, trigger ){
        if ( isStringNotEmpty( ref ) ){
            return new Container( this, ref, options, trigger );
        }
        return super.create( ref, options, trigger );
    }

    /**
     * @inheritDoc
     */
    getArgs( ref, nocache ) {
        if ( isStringNotEmpty( ref ) ){
            return { trigger: null, options: {}, itemRefs: document.querySelectorAll( ref ) };
        }
        return super.getArgs( ref, nocache );
    }

}