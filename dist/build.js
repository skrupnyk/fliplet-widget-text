/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/libs/build.js":
/*!**************************!*\
  !*** ./js/libs/build.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

Fliplet.Widget.instance('text', function (widgetData) {
  var selector = '[data-text-id="' + widgetData.id + '"]';
  new Vue({
    el: $(selector)[0],
    data: function data() {
      return {
        editor: undefined,
        settings: widgetData,
        mode: Fliplet.Env.get('mode'),
        isDev: Fliplet.Env.get('development'),
        MIRROR_ELEMENT_CLASS: 'fl-mirror-element',
        MIRROR_ROOT_CLASS: 'fl-mirror-root',
        changed: false
      };
    },
    mounted: function mounted() {
      var _this = this;

      if (this.mode !== 'interact' && !this.isDev) {
        return;
      }

      this.initializeEditor().then(function () {
        Fliplet.Studio.emit('tinymce', {
          message: 'tinymceInitialised'
        });

        _this.attachEvenHandlers();
      });
    },
    methods: {
      initializeEditor: function initializeEditor() {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          $("[data-text-id=\"".concat(widgetData.id, "\"]")).tinymce({
            force_br_newlines: false,
            force_p_newlines: true,
            image_advtab: true,
            menubar: false,
            statusbar: false,
            inline: true,
            resize: false,
            autoresize_bottom_margin: 0,
            autofocus: false,
            branding: false,
            plugins: ['advlist lists link image charmap hr', 'searchreplace wordcount insertdatetime table textcolor colorpicker', 'noneditable'],
            toolbar: ['formatselect | fontselect fontsizeselect |', 'bold italic underline strikethrough | forecolor backcolor |', 'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |', 'blockquote subscript superscript | link table insertdatetime charmap hr |', 'removeformat'].join(' '),
            noneditable_noneditable_class: 'fl-widget-instance',
            valid_styles: {
              '*': 'font-family,font-size,font-weight,font-style,text-decoration,text-align,padding,padding-left,padding-right,padding-top,padding-bottom,padding,margin-left,margin-right,margin-top,margin-bottom,margin,display,float,color,background,background-color,background-image,list-style-type,line-height,letter-spacing,width,height,min-width,max-width,min-height,max-height,border,border-top,border-bottom,border-left,border-right,position,opacity,top,left,right,bottom,overflow,z-index',
              img: 'text-align,margin-left,margin-right,display,float,width,height,background,background-color',
              table: 'border-color,width,height,font-size,font-weight,font-style,text-decoration,text-align,color,background,background-color,min-width,max-width,min-height,max-height,border,border-top,border-bottom,border-left,border-right,padding,padding-left,padding-right,padding-top,padding-bottom,padding,margin-left,margin-right,margin-top,margin-bottom,margin',
              tr: 'border-color,width,height,font-size,font-weight,font-style,text-decoration,text-align,color,background,background-color,min-width,max-width,min-height,max-height,border,border-top,border-bottom,border-left,border-right,padding,padding-left,padding-right,padding-top,padding-bottom,padding,margin-left,margin-right,margin-top,margin-bottom,margin',
              td: 'border-color,width,height,font-size,font-weight,font-style,text-decoration,text-align,color,background,background-color,min-width,max-width,min-height,max-height,border,border-top,border-bottom,border-left,border-right,padding,padding-left,padding-right,padding-top,padding-bottom,padding,margin-left,margin-right,margin-top,margin-bottom,margin',
              tbody: 'border-color,width,height,font-size,font-weight,font-style,text-decoration,text-align,color,background,background-color,min-width,max-width,min-height,max-height,border,border-top,border-bottom,border-left,border-right,padding,padding-left,padding-right,padding-top,padding-bottom,padding,margin-left,margin-right,margin-top,margin-bottom,margin',
              thead: 'border-color,width,height,font-size,font-weight,font-style,text-decoration,text-align,color,background,background-color,min-width,max-width,min-height,max-height,border,border-top,border-bottom,border-left,border-right,padding,padding-left,padding-right,padding-top,padding-bottom,padding,margin-left,margin-right,margin-top,margin-bottom,margin',
              tfoot: 'border-color,width,height,font-size,font-weight,font-style,text-decoration,text-align,color,background,background-color,min-width,max-width,min-height,max-height,border,border-top,border-bottom,border-left,border-right,padding,padding-left,padding-right,padding-top,padding-bottom,padding,margin-left,margin-right,margin-top,margin-bottom,margin'
            },
            valid_children: '+body[style],-font[face],div[br,#text],img,+span[div|section|ul|ol|form|header|footer|article|hr|table]',
            setup: function setup(editor) {
              editor.on('init', function () {
                _this2.editor = editor; // Remove any existing markers

                _this2.removeMirrorMarkers(); // initialize value if it was set prior to initialization


                if (_this2.settings.html) {
                  editor.setContent(_this2.settings.html, {
                    format: 'raw'
                  });
                }

                resolve();
              });
              editor.on('change', function () {
                // Remove any existing markers
                _this2.removeMirrorMarkers();
              });
              editor.on('focus', function () {
                Fliplet.Studio.emit('show-toolbar', true);
              });
              editor.on('blur', function (event) {
                // Remove any existing markers
                _this2.removeMirrorMarkers(); // Save changes


                _this2.saveChanges();
              });
              editor.on('NodeChange', function (e) {
                /******************************************************************/

                /* Mirror TinyMCE selection and styles to Studio TinyMCE instance */

                /******************************************************************/
                // Remove any existing markers
                _this2.removeMirrorMarkers(); // Mark e.element and the last element of e.parents with classes


                e.element.classList.add(_this2.MIRROR_ELEMENT_CLASS);

                if (e.parents.length) {
                  e.parents[e.parents.length - 1].classList.add(_this2.MIRROR_ROOT_CLASS);
                }

                var fontFamily = window.getComputedStyle(e.element).getPropertyValue('font-family');
                var fontSize = window.getComputedStyle(e.element).getPropertyValue('font-size'); // Send content to Studio

                Fliplet.Studio.emit('tinymce', {
                  message: 'tinymceNodeChange',
                  payload: {
                    html: e.parents.length ? e.parents[e.parents.length - 1].outerHTML : e.element.outerHTML,
                    styles: ['.' + _this2.MIRROR_ELEMENT_CLASS + ' {', '\tfont-family: ' + fontFamily + ';', '\tfont-size: ' + fontSize + ';', '}'].join('\n')
                  }
                });
              });
            }
          });
        });
      },
      attachEvenHandlers: function attachEvenHandlers() {
        Fliplet.Studio.onEvent(function (event) {
          var eventDetail = event.detail;
          var editor = null;

          switch (eventDetail.type) {
            case 'tinymce.execCommand':
              if (!eventDetail.payload) {
                break;
              }

              var cmd = eventDetail.payload.cmd;
              var ui = eventDetail.payload.ui;
              var value = eventDetail.payload.value;
              tinymce.activeEditor.execCommand(cmd, ui, value);
              break;

            case 'tinymce.applyFormat':
              editor = tinymce.activeEditor;
              editor.undoManager.transact(function () {
                editor.focus();
                editor.formatter.apply(eventDetail.payload.format, {
                  value: eventDetail.payload.value
                });
                editor.nodeChanged();
              });
              break;

            case 'tinymce.removeFormat':
              editor = tinymce.activeEditor;
              editor.undoManager.transact(function () {
                editor.focus();
                editor.formatter.remove(eventDetail.payload.format, {
                  value: null
                }, null, true);
                editor.nodeChanged();
              });
              break;

            default:
              break;
          }
        });
      },
      removeMirrorMarkers: function removeMirrorMarkers() {
        // Remove any existing markers
        $('.' + this.MIRROR_ELEMENT_CLASS).removeClass(this.MIRROR_ELEMENT_CLASS);
        $('.' + this.MIRROR_ROOT_CLASS).removeClass(this.MIRROR_ROOT_CLASS);
      },
      saveChanges: function saveChanges() {
        this.settings.html = this.editor.getContent();
        return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({
          url: "v1/widget-instances/".concat(widgetData.id),
          method: 'PUT',
          data: this.settings
        }).then(function () {
          Fliplet.Studio.emit('page-preview-send-event', {
            type: 'savePage'
          });
        });
      }
    }
  });
});

/***/ }),

/***/ 0:
/*!********************************!*\
  !*** multi ./js/libs/build.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\hugoc\Documents\GitHub\Fliplet\fliplet-widget-text\js\libs\build.js */"./js/libs/build.js");


/***/ })

/******/ });