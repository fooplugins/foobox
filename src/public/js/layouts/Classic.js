(function(_, _utils, _is){

    _.Modal.Classic = _.Modal.extend(/** @lend FooBox.Modal.Classic.prototype */{
        doShow: function(current, previous){
            const self = this;
            current.load().then(function(){
                if (self.shouldResize()){
                    self.resizeTo(current);
                }
            });
            if (_is.item(previous)){
                return Promise.all([previous.doHide(), current.doShow()]);
            }
            return current.doShow();
        },
        doAttach: function(){
            const self = this;
            if (self._super()){
                self.observer.observe(self.el.overlay, function(){
                    if (_is.item(self.current) && self.shouldResize()){
                        self.resizeTo(self.current);
                    }
                    else self.removeResize();
                }, {box: "border-box"});
                return true;
            }
            return false;
        },
        doDetach: function(){
            const self = this;
            self.observer.unobserve(self.el.overlay);
            return self._super();
        },
        shouldResize: function(){
            const self = this;
            return self.isLargeScreen() || self.opt.noMobile;
        },
        removeResize: function(){
            const inner = this.el.inner;
            inner.style.setProperty("transition-property", "none", "important");
            inner.offsetHeight;
            inner.style.removeProperty("width");
            inner.style.removeProperty("height");
            inner.style.removeProperty("transition-property");
            inner.offsetHeight;
        },
        resizeTo: function(item){
            const self = this, inner = self.el.inner;
            return new Promise(function(resolve, reject){
                if (_is.item(item)){
                    inner.style.setProperty("transition-property", "none", "important");
                    inner.offsetHeight;
                    const w = inner.style.getPropertyValue("width"),
                        h = inner.style.getPropertyValue("height");
                    inner.style.removeProperty("width");
                    inner.style.removeProperty("height");
                    inner.offsetHeight;
                    let size = item.getContentSize();
                    inner.style.setProperty("width", w);
                    inner.style.setProperty("height", h);
                    inner.offsetHeight;

                    if (size.width !== w || size.height !== h){
                        function setSize(){
                            inner.style.removeProperty("transition-property");
                            inner.style.setProperty("width", size.width);
                            inner.style.setProperty("height", size.height);
                        }
                        const transition = parseFloat(getComputedStyle(inner).getPropertyValue("--resize-duration")) !== 0;
                        if (transition){
                            _utils.onTransition(inner, setSize, ["width","height"])
                                .then(resolve, function(reason){
                                    if (reason !== "transitioncancel") reject(reason);
                                    else resolve();
                                });
                        } else {
                            setSize();
                            resolve();
                        }
                    } else {
                        resolve();
                    }
                } else {
                    resolve();
                }
            });
        }
    });

    _.layouts.register("classic", _.Modal.Classic, {
        options: {},
        i18n: {},
        classes: {
            layouts: { classic: "fbx-classic" }
        }
    });

})(
    FooBox,
    FooBox.utils,
    FooBox.utils.is
);