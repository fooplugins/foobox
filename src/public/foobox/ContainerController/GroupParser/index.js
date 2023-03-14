import {extend} from "../../../../utils/object";
import {isStringNotEmpty} from "../../../../utils/is";
import Parser from "../Parser";
import Container from "../Container";
import {asyncForEach} from "../../../../utils/iasync";

//region type-definitions

/**
 * @typedef {Parser~Configuration} GroupParser~Configuration
 * @property {number} [priority=99]
 */

//endregion

class GroupParser extends Parser {

    /**
     * Get the parser configuration.
     * @type {GroupParser~Configuration}
     * @readonly
     */
    get config(){
        return super.config;
    }

    /**
     * The default configuration.
     * @returns {GroupParser~Configuration}
     */
    get defaults(){
        return extend(super.defaults, {
            priority: 99
        });
    }

    /**
     * @inheritDoc
     */
    async parseDocument(handledRefs, nocache) {
        const results = [];
        await asyncForEach(this.config.include, (selector) => {
            if (!handledRefs.has(selector)){
                const container = this.parse(selector, handledRefs, nocache);
                if (container && container.items.length){
                    results.push(container);
                    handledRefs.add(selector);
                }
            }
        });
        this.purgeCache(results);
        return results;
    }

    /**
     * @inheritDoc
     */
    shouldPurge(container) {
        return container.items.length === 0;
    }

    /**
     * @inheritDoc
     */
    create(ref, options, trigger){
        if (isStringNotEmpty(ref)){
            return new Container(this, ref, options, trigger);
        }
        return super.create(ref, options, trigger);
    }

    /**
     * @inheritDoc
     */
    getArgs(ref, nocache) {
        if (isStringNotEmpty(ref)){
            return { trigger: null, options: {}, itemRefs: document.querySelectorAll(ref) };
        }
        return super.getArgs(ref, nocache);
    }

}

export default GroupParser;