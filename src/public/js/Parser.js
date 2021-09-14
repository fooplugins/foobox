(function(_, _utils, _is, _obj) {

    _.Parser = _utils.Class.extend({
        construct: function() {
            const self = this;
            self.parsed = [];
        },
        find: function(root, selector, exclude){
            const self = this;
            let found = _utils.toArray(root.querySelectorAll(selector));
            if (_is.string(exclude)){
                found = found.filter(function(element){
                    if (_is.selectorOrChildOf(element, exclude)){
                        console.debug("Skipping excluded element.", { "root": root, "element": element, "selector": selector, "exclude": exclude });
                        return false;
                    }
                    if (self.parsed.indexOf(element) !== -1){
                        console.debug("Skipping parsed element.", { "root": root, "element": element, "selector": selector, "exclude": exclude });
                        return false;
                    }
                    return true;
                });
            } else {
                found = found.filter(function(element){
                    if (self.parsed.indexOf(element) !== -1){
                        console.debug("Skipping parsed element.", { "root": root, "element": element, "selector": selector, "exclude": exclude });
                        return false;
                    }
                    return true;
                });
            }
            return found;
        },
        parse: function(element, config) {
            const self = this, instances = [], p = config.parser;
            if (_is.object(p) && _is.array(p.containers) && p.containers.length > 0) {

                p.containers.forEach(function(selector){

                    const containers = self.find(element, selector, p.exclude);
                    if (containers.length > 0){
                        const parsed = containers.map(function(container){
                            return self.parseInstance(container, config);
                        }).filter(function(instance){
                            return instance !== null;
                        });
                        if (parsed.length > 0){
                            instances.push.apply(instances, parsed);
                        } else {
                            console.debug("Unable to parse any instances from matched containers.", {"parser": self, "element": element, "selector": selector, "containers": containers});
                        }
                    } else {
                        console.debug("No containers matched the selector.", {"parser": self, "element": element, "selector": selector});
                    }

                });

                self.parsed = [];

            }
            return instances;
        },
        parseInstance: function(element, config) {
            const self = this,
                options = _utils.getJsonAttribute(element, "data-foobox", _obj.extend({}, config.defaults, config.parser)),
                classes = _utils.getJsonAttribute(element, "data-foobox-classes", config.classes),
                i18n = _utils.getJsonAttribute(element, "data-foobox-i18n", config.i18n),
                id = element.dataset.id || element.id || options.id;

            if (!_is.string(options.layout)){
                options.layout = "modern";
            }

            if (!_is.hash(options.types)){
                console.debug("Invalid types supplied.", {"parser": self, "types": options.types});
                return null;
            }

            let trigger = null, items = [], found;

            if (_is.string(options.items)){
                if (_is.selector(element, options.items) && self.parsed.indexOf(element) === -1 && !_is.selectorOrChildOf(element, options.exclude)){
                    found = [element];
                    trigger = "element";
                } else {
                    found = self.find(element, options.items, options.exclude);
                    trigger = "items";
                }
                items = found.map(function(element){
                    return self.parseItem(element, options);
                }).filter(function(item){
                    return item !== null;
                });
            } else if (_is.array(options.items)){
                items = options.items.map(function(item){
                    if (_is.string(item)){
                        item = {url: item};
                    }
                    return self.parseItem(item, options);
                }).filter(function(item){
                    return item !== null;
                });
                trigger = "element";
            }
            if (id !== null && _is.array(window[id + "_items"])){
                items = items.concat(window[id + "_items"].map(function(item){
                    //TODO: Convert from FooGallery items to FooBox items
                    return item;
                }));
            }

            if (trigger !== null && items.length > 0){
                self.parsed.push(element);
                items.forEach(function(item){
                    if (item.hasOwnProperty("parsedFrom") && _is.element(item.parsedFrom)){
                        self.parsed.push(item.parsedFrom);
                    }
                });
                console.debug("Parsed config.", {"parsedFrom": element,"trigger": trigger,"options": options,"items": items});
                return {
                    "parsedFrom": element,
                    "type": _is.string(options.layout) ? options.layout : "modern",
                    "trigger": trigger,
                    "options": options,
                    "classes": classes,
                    "i18n": i18n,
                    "items": items
                };
            }
            return null;
        },
        /**
         * @param obj
         * @param options
         * @returns {object|null}
         */
        parseItem: function(obj, options){
            const self = this,
                isHash = _is.hash(obj),
                isElement = !isHash && _is.element(obj);

            let id = null;
            if (isHash){
                id = obj.id || null;
            }
            if (isElement){
                id = obj.dataset.id || obj.id || null;
            }

            let url = null;
            if (isHash){
                url = obj.url || obj.href || null;
            } else if (isElement){
                url = obj.dataset.url || obj.dataset.href || obj.href || null;
            }
            if (url === null){
                console.debug("Unable to parse url from object.", {"parser": self, "object": obj, "options": options});
                return null;
            }

            const types = Object.keys(options.types);
            let type = null;
            if (isElement){
                const value = obj.dataset.type;
                if (_is.string(value) && types.some(function(type){ return value === type; })){
                    type = value;
                }
            }
            if (type === null){
                type = _utils.find(types, function(type){
                    const opt = options.types[type];
                    if (!opt || (isElement && _is.string(opt.selector) && !_is.selector(obj, opt.selector))){
                        return false;
                    }
                    if (_is.string(opt.regex)){
                        opt.regex = new RegExp(opt.regex);
                    }
                    if (opt.regex instanceof RegExp){
                        if (_is.string(opt.exclude)){
                            opt.exclude = new RegExp(opt.exclude);
                        }
                        if (opt.exclude instanceof RegExp){
                            return opt.regex.test(url) && !opt.exclude.test(url);
                        } else {
                            return opt.regex.test(url);
                        }
                    }
                });
            }
            if (!type){
                console.debug("Unable to parse type from object or url.", {"parser": self, "parsedFrom": obj, "url": url, "options": options});
                return null;
            }
            const opt = options.types[type];
            let width = opt.width || null;
            if (isHash){
                width = obj.width;
            } else if (isElement) {
                const value = obj.dataset.width;
                if (_is.string(value) && _is.size(value)){
                    width = value;
                }
            }
            let height = opt.height || null;
            if (isHash){
                height = obj.height;
            } else if (isElement) {
                const value = obj.dataset.height;
                if (_is.string(value) && _is.size(value)){
                    height = value;
                }
            }
            let aspectRatio = opt.aspectRatio || null;
            if (isHash){
                aspectRatio = obj.aspectRatio;
            } else if (isElement) {
                const value = obj.dataset.aspectRatio;
                if (_is.string(value)){
                    aspectRatio = value;
                }
            }
            let title = opt.title || null;
            if (isHash){
                title = obj.title;
            } else if (isElement) {
                const value = obj.dataset.title || obj.dataset.captionTitle || obj.dataset.lightboxTitle;
                if (_is.string(value)){
                    title = value;
                }
            }
            let description = opt.description || null;
            if (isHash){
                description = obj.description;
            } else if (isElement) {
                const value = obj.dataset.description || obj.dataset.captionDesc || obj.dataset.lightboxDescription;
                if (_is.string(value)){
                    description = value;
                }
            }
            return {
                "parsedFrom": obj,
                "options": {
                    "id": id,
                    "url": url,
                    "type": type,
                    "width": width,
                    "height": height,
                    "aspectRatio": aspectRatio,
                    "title": title,
                    "description": description
                }
            };
        }
    });

    /**
     * @typedef {Object} FooBox~Options
     * @property {string} [id=null]
     * @property {boolean} [loop=false]
     */

})(
    FooBox,
    FooBox.utils,
    FooBox.utils.is,
    FooBox.utils.obj
);