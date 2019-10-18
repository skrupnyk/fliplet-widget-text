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
        changed: false
      }
    },
    mounted() {
      if (this.mode !== 'interact' && !this.isDev) {
        return
      }

      this.initializeEditor()
        .then(() => {
          Fliplet.Studio.emit('tinymce', {
            message: 'tinymceInitialised'
          })

          this.attachEvenHandlers()
        })
    },
    methods: {
      initializeEditor() {
        return new Promise((resolve, reject) => {
          $(`[data-text-id="${this.settings.id}"]`).tinymce({
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
            plugins: [
              'advlist lists link image charmap hr',
              'searchreplace wordcount insertdatetime table textcolor colorpicker',
              'noneditable'
            ],
            toolbar: [
              'formatselect | fontselect fontsizeselect |',
              'bold italic underline strikethrough | forecolor backcolor |',
              'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |',
              'blockquote subscript superscript | link table insertdatetime charmap hr |',
              'removeformat'
            ].join(' '),
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
            setup: (editor) => {
              editor.on('init', () => {
                this.editor = editor

                // Remove any existing markers
                this.removeMirrorMarkers()

                // initialize value if it was set prior to initialization
                if (this.settings.html) {
                  editor.setContent(this.settings.html, {
                    format: 'raw'
                  })
                }

                resolve()
              })

              editor.on('change', () => {
                // Remove any existing markers
                this.removeMirrorMarkers()
              })

              editor.on('focus', () => {
                Fliplet.Studio.emit('show-toolbar', true)
              })

              editor.on('blur', () => {
                // Remove any existing markers
                this.removeMirrorMarkers()

                // Save changes
                this.saveChanges()
              })

              editor.on('NodeChange', (e) => {
                /******************************************************************/
                /* Mirror TinyMCE selection and styles to Studio TinyMCE instance */
                /******************************************************************/

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
              })
            }
          })
        })
      },
      attachEvenHandlers() {
        Fliplet.Studio.onEvent((event) => {
          const eventDetail = event.detail
          let editor = null

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
              editor = tinymce.activeEditor
              editor.undoManager.transact(() => {
                editor.focus()
                editor.formatter.apply(
                  eventDetail.payload.format, {
                    value: eventDetail.payload.value
                  }
                )
                editor.nodeChanged()
              });
              break
            case 'tinymce.removeFormat':
              editor = tinymce.activeEditor
              editor.undoManager.transact(() => {
                editor.focus()
                editor.formatter.remove(
                  eventDetail.payload.format, {
                    value: null
                  }, null, true
                )
                editor.nodeChanged()
              })
              break
            case 'widgetCancel':
              Fliplet.Studio.emit('show-toolbar', false)
            default:
              break
          }
        })
      },
      removeMirrorMarkers() {
        // Remove any existing markers
        $('.' + this.MIRROR_ELEMENT_CLASS).removeClass(this.MIRROR_ELEMENT_CLASS)
        $('.' + this.MIRROR_ROOT_CLASS).removeClass(this.MIRROR_ROOT_CLASS)
      },
      saveChanges() {
        const data = {
          html: this.editor.getContent()
        }

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