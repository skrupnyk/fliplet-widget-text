Fliplet.Widget.instance('text', (widgetData) => {
  var editor;
  var MIRROR_ELEMENT_CLASS = 'fl-mirror-element';
  var MIRROR_ROOT_CLASS = 'fl-mirror-root';
  var WIDGET_INSTANCE_SELECTOR = '[data-fl-widget-instance]';
  var $WYSIWYG_SELECTOR = $('[data-widget-id="wysiwyg-' + widgetData.id + '"]');
  var debounceSave = _.debounce(saveChanges, 500);
  var mode = Fliplet.Env.get('mode');
  var isDev = Fliplet.Env.get('development');
  var isInitialized = false;
  var onBlur = false;
  var contentTemplate = Fliplet.Widget.Templates['templates.build.content'];

  function cleanUpContent() {
    // Remove any existing markers
    $('.' + MIRROR_ELEMENT_CLASS).removeClass(MIRROR_ELEMENT_CLASS);
    $('.' + MIRROR_ROOT_CLASS).removeClass(MIRROR_ROOT_CLASS);

    // Remove empty class attributes
    $('[class=""]').removeAttr('class');
  }

  function replaceWidgetInstances($html) {
    $html.find(WIDGET_INSTANCE_SELECTOR).replaceWith(function () {
      var widgetInstanceId = $(this).data('id');

      return '{{{widget ' + widgetInstanceId + '}}}';
    });

    return $html;
  }

  function saveChanges() {
    cleanUpContent();

    var data = {
      html: editor.getContent()
    };

    onBlur = false;

    var $html = $('<div>' + data.html + '</div>').clone();
    var $replacedHTML = replaceWidgetInstances($html);

    data.html = $replacedHTML.html();

    return Fliplet.Env.get('development')
      ? Promise.resolve()
      : Fliplet.API.request({
          url: `v1/widget-instances/${widgetData.id}`,
          method: 'PUT',
          data: data
        })
        .then(() => {
          Fliplet.Studio.emit('page-preview-send-event', {
            type: 'savePage'
          });
        });
  }

  function studioEventHandler() {
    Fliplet.Studio.onEvent((event) => {
      var eventDetail = event.detail

      if (!editor || !tinymce.activeEditor || editor.id !== tinymce.activeEditor.id) {
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
          editor = tinymce.activeEditor;
          editor.undoManager.transact(function () {
            editor.focus();
            editor.formatter.apply(
              eventDetail.payload.format,
              {
                value: eventDetail.payload.value
              }
            );
            editor.nodeChanged();
          });

          break;
        case 'tinymce.removeFormat':
          editor = tinymce.activeEditor;
          editor.undoManager.transact(function () {
            editor.focus();
            editor.formatter.remove(
              eventDetail.payload.format,
              {
                value: null
              }, null, true
            );
            editor.nodeChanged();
          });

          break;
        case 'widgetCancel':
          if (onBlur) {
            // Remove tinymce on blur
            editor.hide();
          }

          break;
        default:
          break;
      }
    })
  }

  function attachEventHandler() {
    $WYSIWYG_SELECTOR.on('click', function () {
      editor.show();

      Fliplet.Studio.emit('get-selected-widget', {
        value: widgetData.id,
        active: true
      });
    })
  }

  function initializeEditor() {
    var $element = $WYSIWYG_SELECTOR;
    editor = tinymce.get($element.attr('id'));

    if (editor) {
      editor.remove();
      editor = null;
    }

    return new Promise((resolve) => {
      $element.tinymce({
        inline: true,
        menubar: false,
        force_br_newlines: false,
        force_p_newlines: true,
        forced_root_block: 'p',
        object_resizing: false,
        verify_html: false,
        plugins: [
          'advlist lists link image charmap hr',
          'searchreplace wordcount insertdatetime table textcolor colorpicker',
          'noneditable'
        ],
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
        valid_children : '+body[style],-font[face],div[br,#text],img,+span[div|section|ul|ol|form|header|footer|article|hr|table]',
        toolbar: [
          'formatselect | fontselect fontsizeselect |',
          'bold italic underline strikethrough | forecolor backcolor |',
          'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |',
          'blockquote subscript superscript | link table insertdatetime charmap hr |',
          'removeformat'
        ].join(' '),
        fontsize_formats: '8px 10px 12px 14px 16px 18px 24px 36px',
        setup: (ed) => {
          ed.on('init', function () {
            editor = ed

            // Remove any existing markers
            cleanUpContent();

            // Removes position from Editor element.
            // TinyMCE adds the position style to place the toolbar absolute positioned
            // We hide the toolbar and the TinyMCE feature is causing problems
            $element.attr('style', function (i, style) {
              return style.replace(/position[^;]+;?/g, '');
            });

            // To process image selection after image is loaded
            Fliplet.Studio.emit('get-selected-widget');

            resolve();
          })

          ed.on('change', function () {
            Fliplet.Studio.emit('get-selected-widget', widgetData.id);

            if (!isInitialized) {
              return;
            }

            // Save changes
            debounceSave();
          })

          ed.on('keydown', function () {
            Fliplet.Studio.emit('get-selected-widget', widgetData.id);

            if (!isInitialized) {
              return;
            }

            // Save changes
            debounceSave();
          })

          ed.on('focus', function () {
            $element.parents('[draggable="true"]').attr('draggable', false);
            Fliplet.Studio.emit('show-toolbar', true);
          })

          ed.on('blur', function () {
            onBlur = true;
            $element.parents('[draggable="false"]').attr('draggable', true);

            if (!isInitialized) {
              return;
            }

            // Save changes
            debounceSave();
          })

          ed.on('nodeChange', function (e) {
            /******************************************************************/
            /* Mirror TinyMCE selection and styles to Studio TinyMCE instance */
            /******************************************************************/

            if (isInitialized) {
              Fliplet.Studio.emit('get-selected-widget', widgetData.id);
            }

            // Mark e.element and the last element of e.parents with classes
            e.element.classList.add(MIRROR_ELEMENT_CLASS);

            if (e.parents.length) {
              e.parents[e.parents.length - 1].classList.add(MIRROR_ROOT_CLASS);
            }

            var fontFamily = window.getComputedStyle(e.element).getPropertyValue('font-family');
            var fontSize = window.getComputedStyle(e.element).getPropertyValue('font-size');

            // Send content to Studio
            Fliplet.Studio.emit('tinymce', {
              message: 'tinymceNodeChange',
              payload: {
                html: e.parents.length ?
                  e.parents[e.parents.length - 1].outerHTML :
                  e.element.outerHTML,
                styles: [
                  '.' + MIRROR_ELEMENT_CLASS + ' {',
                  '\tfont-family: ' + fontFamily + ';',
                  '\tfont-size: ' + fontSize + ';',
                  '}'
                ].join('\n')
              }
            });

            if (!isInitialized) {
              return;
            }

            // Save changes
            debounceSave();
          })
        }
      })
    })
  }

  function registerHandlebarsHelpers() {
    Handlebars.registerHelper('isInteractable', function(options) {
      var result = mode === 'interact' || isDev;

      if (result === false) {
        return options.inverse(this);
      }

      return options.fn(this);
    });
  }

  function insertPlaceholder() {
    _.assignIn(widgetData, {
      mode: mode,
      isDev: isDev
    });

    var contentHTML = contentTemplate(widgetData);

    $WYSIWYG_SELECTOR.append(contentHTML);
  }

  function init() {
    registerHandlebarsHelpers();

    if (!widgetData.html) {
      insertPlaceholder();
    }

    if (mode !== 'interact' && !isDev) {
      return;
    }

    initializeEditor()
      .then(() => {
        isInitialized = true;
        editor.hide();

        studioEventHandler();
        attachEventHandler();
      });
  }

  init();
});