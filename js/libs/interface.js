const widgetId = parseInt(Fliplet.Widget.getDefaultId(), 10)
const widgetData = Fliplet.Widget.getData(widgetId) || {}

const selector = '#text-wrapper'

const app = new Vue({
  el: selector,
  data() {
    return {
      settings: widgetData
    }
  },
  methods: {
    prepareToSaveData() {},
    saveData() {
      this.settings = Fliplet.Widget.getData(widgetId)

      Fliplet.Widget.save(this.settings)
        .then(() => {
          Fliplet.Widget.complete()
          Fliplet.Studio.emit('reload-widget-instance', widgetId)
        })
    }
  },
  created() {
    Fliplet.Widget.onSaveRequest(() => {
      this.saveData()
    })
  }
});