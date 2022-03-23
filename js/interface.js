var widgetId = parseInt(Fliplet.Widget.getDefaultId(), 10);
var widgetData = Fliplet.Widget.getData(widgetId) || {};

function saveData() {
  Fliplet.Widget.save(widgetData)
    .then(function() {
      console.log('widgetData: ', widgetData);
      console.log('widgetId: ', widgetId);
      Fliplet.Widget.complete();
      Fliplet.Studio.emit('reload-widget-instance', widgetId);
    });
}

Fliplet.Widget.onSaveRequest(function() {
  saveData();
});
