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
        WIDGET_INSTANCE_SELECTOR: '[data-fl-widget-instance]',
        changed: false,
        debounceSave: _.debounce(this.saveChanges, 500),
        isInitialized: false,
        onBlur: false
      };
    },
    mounted: function mounted() {
      var _this = this;

      if (this.mode !== 'interact' && !this.isDev) {
        return;
      }

      this.initializeEditor().then(function () {
        _this.isInitialized = true;

        _this.editor.hide();

        _this.studioEventHandler();

        _this.attachEventHandler();
      });
    },
    methods: {
      initializeEditor: function initializeEditor() {
        var _this2 = this;

        var $element = $("#wysiwyg-".concat(this.settings.id));
        this.editor = tinymce.get($element.attr('id'));

        if (this.editor) {
          this.editor.remove();
          this.editor = null;
        }

        return new Promise(function (resolve, reject) {
          $element.tinymce({
            inline: true,
            menubar: false,
            force_br_newlines: false,
            force_p_newlines: true,
            forced_root_block: 'p',
            object_resizing: false,
            verify_html: false,
            plugins: ['advlist lists link image charmap hr', 'searchreplace wordcount insertdatetime table textcolor colorpicker', 'noneditable'],
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
            toolbar: ['formatselect | fontselect fontsizeselect |', 'bold italic underline strikethrough | forecolor backcolor |', 'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |', 'blockquote subscript superscript | link table insertdatetime charmap hr |', 'removeformat'].join(' '),
            fontsize_formats: '8px 10px 12px 14px 16px 18px 24px 36px',
            setup: function setup(editor) {
              editor.on('init', function () {
                _this2.editor = editor; // Remove any existing markers

                _this2.removeMirrorMarkers(); // Removes position from Editor element.
                // TinyMCE adds the position style to place the toolbar absolute positioned
                // We hide the toolbar and the TinyMCE feature is causing problems


                $element.attr('style', function (i, style) {
                  return style.replace(/position[^;]+;?/g, '');
                }); // To process image selection after image is loaded

                Fliplet.Studio.emit('get-selected-widget');
                resolve();
              });
              editor.on('change', function () {
                Fliplet.Studio.emit('get-selected-widget', _this2.settings.id); // Remove any existing markers

                _this2.removeMirrorMarkers();

                if (!_this2.isInitialized) {
                  return;
                } // Save changes


                _this2.debounceSave();
              });
              editor.on('keydown', function () {
                Fliplet.Studio.emit('get-selected-widget', _this2.settings.id);

                if (!_this2.isInitialized) {
                  return;
                } // Save changes


                _this2.debounceSave();
              });
              editor.on('focus', function () {
                $element.parent().attr('draggable', false);
                Fliplet.Studio.emit('show-toolbar', true);
              });
              editor.on('blur', function () {
                _this2.onBlur = true;
                $element.parent().attr('draggable', true); // Remove any existing markers

                _this2.removeMirrorMarkers();

                if (!_this2.isInitialized) {
                  return;
                } // Save changes


                _this2.debounceSave();
              });
              editor.on('nodeChange', function (e) {
                /******************************************************************/

                /* Mirror TinyMCE selection and styles to Studio TinyMCE instance */

                /******************************************************************/
                if (_this2.isInitialized) {
                  Fliplet.Studio.emit('get-selected-widget', _this2.settings.id);
                } // Remove any existing markers


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

                if (!_this2.isInitialized) {
                  return;
                } // Save changes


                _this2.debounceSave();
              });
            }
          });
        });
      },
      studioEventHandler: function studioEventHandler() {
        var _this3 = this;

        Fliplet.Studio.onEvent(function (event) {
          var eventDetail = event.detail;

          if (!_this3.editor || !tinymce.activeEditor || _this3.editor.id !== tinymce.activeEditor.id) {
            return;
          }

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
              _this3.editor = tinymce.activeEditor;

              _this3.editor.undoManager.transact(function () {
                _this3.editor.focus();

                _this3.editor.formatter.apply(eventDetail.payload.format, {
                  value: eventDetail.payload.value
                });

                _this3.editor.nodeChanged();
              });

              break;

            case 'tinymce.removeFormat':
              _this3.editor = tinymce.activeEditor;

              _this3.editor.undoManager.transact(function () {
                _this3.editor.focus();

                _this3.editor.formatter.remove(eventDetail.payload.format, {
                  value: null
                }, null, true);

                _this3.editor.nodeChanged();
              });

              break;

            default:
              break;
          }
        });
      },
      attachEventHandler: function attachEventHandler() {
        var _this4 = this;

        $("#wysiwyg-".concat(this.settings.id)).on('click', function () {
          _this4.editor.show();

          Fliplet.Studio.emit('get-selected-widget', {
            value: _this4.settings.id,
            active: true
          });
        });
      },
      removeMirrorMarkers: function removeMirrorMarkers() {
        // Remove any existing markers
        $('.' + this.MIRROR_ELEMENT_CLASS).removeClass(this.MIRROR_ELEMENT_CLASS);
        $('.' + this.MIRROR_ROOT_CLASS).removeClass(this.MIRROR_ROOT_CLASS); // Remove empty class attributes

        $('[class=""]').removeAttr('class');
      },
      replaceWidgetInstances: function replaceWidgetInstances($html) {
        $html.find(this.WIDGET_INSTANCE_SELECTOR).replaceWith(function () {
          var widgetInstanceId = $(this).data('id');
          return '{{{widget ' + widgetInstanceId + '}}}';
        });
        return $html;
      },
      saveChanges: function saveChanges() {
        var data = {
          html: this.editor.getContent()
        };

        if (this.onBlur) {
          // Remove tinymce on blur
          this.editor.hide();
        }

        this.onBlur = false;
        var $html = $('<div>' + data.html + '</div>').clone();
        $replacedHTML = this.replaceWidgetInstances($html);
        data.html = $replacedHTML.html();
        return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({
          url: "v1/widget-instances/".concat(this.settings.id),
          method: 'PUT',
          data: data
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

module.exports = __webpack_require__(/*! /Users/hcarneiro/Repos/Fliplet/fliplet-widget-text/js/libs/build.js */"./js/libs/build.js");


/***/ })

/******/ });