"use strict";
(self["webpackChunkfoobox"] = self["webpackChunkfoobox"] || []).push([["foobox.ready"],{

/***/ "./src/public/foobox.ready/index.pro.js":
/*!**********************************************!*\
  !*** ./src/public/foobox.ready/index.pro.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_domReady__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/domReady */ "./src/utils/domReady.js");
/* harmony import */ var _foobox_index_pro__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../foobox/index.pro */ "./src/public/foobox/index.pro.js");
/* harmony import */ var _utils_task__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/task */ "./src/utils/task.js");



const task = (0,_utils_task__WEBPACK_IMPORTED_MODULE_2__["default"])('FooBox:init');
(0,_utils_domReady__WEBPACK_IMPORTED_MODULE_0__["default"])().then(() => _foobox_index_pro__WEBPACK_IMPORTED_MODULE_1__["default"].init(__webpack_require__.g.FOOBOX)).then(() => task.end());

/***/ }),

/***/ "./src/utils/domReady.js":
/*!*******************************!*\
  !*** ./src/utils/domReady.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is.js */ "./src/utils/is.js");

let promise = null;
/**
 * Returns a promise that is resolved once the DOMContentLoaded event has been fired. Multiple calls to this method will return the same promise.
 * @returns {Promise}
 */
function domReady() {
  if (!(0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isPromise)(promise)) {
    promise = new Promise(resolved => {
      setTimeout(() => {
        if (document.readyState !== "loading") resolved();else document.addEventListener('DOMContentLoaded', resolved, false);
      }, 0);
    });
  }
  return promise;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (domReady);

/***/ }),

/***/ "./src/utils/task.js":
/*!***************************!*\
  !*** ./src/utils/task.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ start)
/* harmony export */ });
const arrow = (color, indent = 0) => `color: ${color}; text-indent:${0.4 * 4 * indent}em; padding: 0.4em; margin-right: 0.4em;`;
const style = (color, backgroundColor) => `display: inline-block; color: ${color}; background-color: ${backgroundColor}; border-radius: 3px; padding: 0.4em; margin-right: 0.4em;`;
const diff = (start, end) => {
  const value = end - start,
    color = value > 50 ? "red" : value > 25 ? "darkorange" : "green";
  return {
    value,
    color
  };
};
function start(name) {
  const startTime = performance.now();
  const startFormat = `%c-->%c${name}`;
  console.debug(startFormat, arrow('green'), style("gray", "white"));
  return {
    end: () => {
      const duration = diff(startTime, performance.now());
      const endFormat = `%c<--%c${name}%c${duration.value.toFixed(2)}ms`;
      console.debug(endFormat, arrow('red'), style("gray", "white"), style("white", duration.color));
    }
  };
}
;

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/public/foobox.ready/index.pro.js"));
/******/ }
]);
//# sourceMappingURL=foobox.ready.js.map