(function($, _, _utils, _is){

    /**
     * @summary The video item class that handles displaying video urls within the lightbox.
     * @memberof FooBox.
     * @class VideoItem
     * @param {string} type
     * @param {FooBox~ItemConfig} config
     * @param {FooBox.Modal} modal
     * @param {number} index
     * @augments FooBox.Item
     */
    _.VideoItem = _.Item.extend(/** @lends FooBox.VideoItem.prototype */{
        doCreateContent: function(){
            const self = this, iframe = document.createElement("iframe");
            _utils.setAttributes(iframe, self.opt.attr);
            return iframe;
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
            }).promise();
        }
    });

    _.items.register("video", _.VideoItem, {
        options: {
            attr: {
                allow: "autoplay; fullscreen;"
            }
        },
        classes: {
            type: "fbx-type-video"
        }
    }, 0);

})(
    FooBox.$,
    FooBox,
    FooBox.utils,
    FooBox.utils.is
);