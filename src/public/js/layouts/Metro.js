(function(_, _utils){

    _.Modal.Metro = _.Modal.Classic.extend(/** @lend FooBox.Modal.Metro.prototype */{});

    _.layouts.register("metro", _.Modal.Metro, {
        options: {},
        i18n: {},
        classes: {
            layouts: { metro: "fbx-metro" }
        }
    });

})(
    FooBox,
    FooBox.utils
);