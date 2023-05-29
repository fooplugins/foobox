"use strict";
(self["webpackChunkfoobox"] = self["webpackChunkfoobox"] || []).push([["foobox.wordpress"],{

/***/ "./src/public/foobox.wordpress/config.js":
/*!***********************************************!*\
  !*** ./src/public/foobox.wordpress/config.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/is */ "./src/utils/is.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __types__: ["image", "iframe", "video"],
  priority: 39,
  include: [".wp-block-gallery"],
  exclude: [".nolightbox"],
  defaultProperties: [{
    name: "url",
    elem: ["href"],
    required: true,
    test: _utils_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty
  }, {
    name: "title",
    elem: ["^figcaption/innerHTML"],
    test: _utils_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty
  }, {
    name: "description",
    elem: ["img/alt"],
    test: _utils_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty
  }],
  image: {
    priority: 10,
    include: ["figure > a[href^='http'][href*='.svg']", "figure > a[href^='http'][href*='.png']", "figure > a[href^='http'][href*='.jpg']", "figure > a[href^='http'][href*='.jpeg']", "figure > a[href^='http'][href*='.webp']", "figure > a[href^='http'][href*='.gif']", "figure > a[href^='http'][href*='.bmp']", "figure > a[href^='http'][href*='fakeimg.pl']"]
  },
  video: {
    priority: 15,
    include: ["figure > a[href^='http'][href*='youtube.com/watch/']", "figure > a[href^='http'][href*='youtube.com/v/']", "figure > a[href^='http'][href*='youtube.com/embed/']", "figure > a[href^='http'][href*='youtube-nocookie.com/watch/']", "figure > a[href^='http'][href*='youtube-nocookie.com/v/']", "figure > a[href^='http'][href*='youtube-nocookie.com/embed/']", "figure > a[href^='http'][href*='youtu.be/']", "figure > a[href^='http'][href*='vimeo.com/']:not([href*='vimeo.com/user'])", "figure > a[href^='http'][href*='.mp4']", "figure > a[href^='http'][href*='.ogv']", "figure > a[href^='http'][href*='.wmv']", "figure > a[href^='http'][href*='.webm']"]
  },
  iframe: {
    priority: 20,
    include: ["figure > a[href^='http']"]
  }
});

/***/ }),

/***/ "./src/public/foobox.wordpress/index.pro.js":
/*!**************************************************!*\
  !*** ./src/public/foobox.wordpress/index.pro.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _foobox_index_pro__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../foobox/index.pro */ "./src/public/foobox/index.pro.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config */ "./src/public/foobox.wordpress/config.js");


_foobox_index_pro__WEBPACK_IMPORTED_MODULE_0__["default"].registerParser("wordpress", _config__WEBPACK_IMPORTED_MODULE_1__["default"]);

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/public/foobox.wordpress/index.pro.js"));
/******/ }
]);
//# sourceMappingURL=foobox.wordpress.js.map