(function(cfg, $, _, _utils){

    _utils.ready(function(){
        _.plugin.configure(cfg);
        _.plugin.init();
    });

})(
    window.FOOBOX || {},
    FooBox.$,
    FooBox,
    FooBox.utils
);