Fliplet.Widget.instance('text', (widgetData) => {
  const selector = '[data-text-id="' + widgetData.id + '"]';

  new Vue({
    el: $(selector)[0],
    data() {
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
      }
    },
    mounted() {
      if (this.mode !== 'interact' && !this.isDev) {
        return
      }

      this.initializeEditor()
        .then(() => {
          this.isInitialized = true
          this.editor.hide()

          this.studioEventHandler()
          this.attachEventHandler()
        })
    },
    methods: {
      initializeEditor() {
        const $element = $(`#wysiwyg-${this.settings.id}`)
        this.editor = tinymce.get($element.attr('id'))

        if (this.editor) {
          this.editor.remove()
          this.editor = null
        }

        return new Promise((resolve, reject) => {
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
            setup: (editor) => {
              editor.on('init', () => {
                this.editor = editor

                // Remove any existing markers
                this.removeMirrorMarkers()

                // Removes position from Editor element.
                // TinyMCE adds the position style to place the toolbar absolute positioned
                // We hide the toolbar and the TinyMCE feature is causing problems
                $element.attr('style', (i, style) => {
                  return style.replace(/position[^;]+;?/g, '')
                })

                // To process image selection after image is loaded
                Fliplet.Studio.emit('get-selected-widget');

                resolve()
              })

              editor.on('change', () => {
                Fliplet.Studio.emit('get-selected-widget', this.settings.id)

                // Remove any existing markers
                this.removeMirrorMarkers()

                if (!this.isInitialized) {
                  return
                }

                // Save changes
                this.debounceSave()
              })

              editor.on('keydown', () => {
                Fliplet.Studio.emit('get-selected-widget', this.settings.id)

                if (!this.isInitialized) {
                  return
                }

                // Save changes
                this.debounceSave()
              })

              editor.on('focus', () => {
                $element.parent().attr('draggable', false)
                Fliplet.Studio.emit('show-toolbar', true)
              })

              editor.on('blur', () => {
                this.onBlur = true
                $element.parent().attr('draggable', true)

                // Remove any existing markers
                this.removeMirrorMarkers()

                if (!this.isInitialized) {
                  return
                }

                // Save changes
                this.debounceSave()
              })

              editor.on('nodeChange', (e) => {
                /******************************************************************/
                /* Mirror TinyMCE selection and styles to Studio TinyMCE instance */
                /******************************************************************/

                if (this.isInitialized) {
                  Fliplet.Studio.emit('get-selected-widget', this.settings.id)
                }

                // Remove any existing markers
                this.removeMirrorMarkers()

                // Mark e.element and the last element of e.parents with classes
                e.element.classList.add(this.MIRROR_ELEMENT_CLASS)
                if (e.parents.length) {
                  e.parents[e.parents.length - 1].classList.add(this.MIRROR_ROOT_CLASS)
                }

                const fontFamily = window.getComputedStyle(e.element).getPropertyValue('font-family')
                const fontSize = window.getComputedStyle(e.element).getPropertyValue('font-size')

                // Send content to Studio
                Fliplet.Studio.emit('tinymce', {
                  message: 'tinymceNodeChange',
                  payload: {
                    html: e.parents.length ?
                      e.parents[e.parents.length - 1].outerHTML :
                      e.element.outerHTML,
                    styles: [
                      '.' + this.MIRROR_ELEMENT_CLASS + ' {',
                      '\tfont-family: ' + fontFamily + ';',
                      '\tfont-size: ' + fontSize + ';',
                      '}'
                    ].join('\n')
                  }
                })

                if (!this.isInitialized) {
                  return
                }

                // Save changes
                this.debounceSave()
              })
            }
          })
        })
      },
      studioEventHandler() {
        Fliplet.Studio.onEvent((event) => {
          const eventDetail = event.detail

          if (!this.editor || !tinymce.activeEditor || this.editor.id !== tinymce.activeEditor.id) {
            return
          }

          switch (eventDetail.type) {
            case 'tinymce.execCommand':
              if (!eventDetail.payload) {
                break
              }

              const cmd = eventDetail.payload.cmd
              const ui = eventDetail.payload.ui
              const value = eventDetail.payload.value
              tinymce.activeEditor.execCommand(cmd, ui, value)
              break
            case 'tinymce.applyFormat':
              this.editor = tinymce.activeEditor
              this.editor.undoManager.transact(() => {
                this.editor.focus()
                this.editor.formatter.apply(
                  eventDetail.payload.format,
                  {
                    value: eventDetail.payload.value
                  }
                )
                this.editor.nodeChanged()
              })
              break
            case 'tinymce.removeFormat':
              this.editor = tinymce.activeEditor
              this.editor.undoManager.transact(() => {
                this.editor.focus()
                this.editor.formatter.remove(
                  eventDetail.payload.format,
                  {
                    value: null
                  }, null, true
                )
                this.editor.nodeChanged()
              });
              break
            default:
              break
          }
        })
      },
      attachEventHandler() {
        $(`#wysiwyg-${this.settings.id}`).on('click', () => {
          this.editor.show()

          Fliplet.Studio.emit('get-selected-widget', {
            value: this.settings.id,
            active: true
          })
        })
      },
      removeMirrorMarkers() {
        // Remove any existing markers
        $('.' + this.MIRROR_ELEMENT_CLASS).removeClass(this.MIRROR_ELEMENT_CLASS)
        $('.' + this.MIRROR_ROOT_CLASS).removeClass(this.MIRROR_ROOT_CLASS)
      },
      replaceWidgetInstances($html) {
        $html.find(this.WIDGET_INSTANCE_SELECTOR).replaceWith(function () {
          const widgetInstanceId = $(this).data('id');
    
          return '{{{widget ' + widgetInstanceId + '}}}';
        });
    
        return $html;
      },
      saveChanges() {
        const data = {
          html: this.editor.getContent()
        }

        if (this.onBlur) {
          // Remove tinymce on blur
          this.editor.hide()
        }

        this.onBlur = false

        const $html = $('<div>' + data.html + '</div>').clone()
        $replacedHTML = this.replaceWidgetInstances($html)

        data.html = $replacedHTML.html()

        return Fliplet.Env.get('development') ?
          Promise.resolve() :
          Fliplet.API.request({
            url: `v1/widget-instances/${this.settings.id}`,
            method: 'PUT',
            data
          })
            .then(() => {
              Fliplet.Studio.emit('page-preview-send-event', {
                type: 'savePage'
              })
            })
      }
    }
  });
});