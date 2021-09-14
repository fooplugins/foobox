(function($, _, _utils, _is, _fn){

    /**
     * @summary The image item class that handles displaying images within the lightbox.
     * @memberof FooBox.
     * @class ImageItem
     * @param {string} type
     * @param {FooBox.Item~Configuration} config
     * @param {FooBox.Modal} modal
     * @param {number} index
     * @augments FooBox.Item
     */
    _.ImageItem = _.Item.extend(/** @lends FooBox.ImageItem.prototype */{
        doCreateContent: function(){
            return document.createElement("img");
        },
        doLoadContent: function(element){
            const self = this;
            return $.Deferred(function(def){
                function onload(){
                    element.removeEventListener("error", onerror);
                    def.resolve();
                }
                function onerror(){
                    element.removeEventListener("load", onload);
                    def.resolve();
                }
                element.addEventListener("load", onload, {once: true});
                element.addEventListener("error", onerror, {once: true});
                element.src = self.opt.url;
                if (element.complete){
                    onload();
                }
            }).promise();
        }
    });

    _.items.register("image", _.ImageItem, {
        options: {},
        classes: {
            type: "fbx-type-image"
        }
    }, 0);

})(
    FooBox.$,
    FooBox,
    FooBox.utils,
    FooBox.utils.is,
    FooBox.utils.fn
);