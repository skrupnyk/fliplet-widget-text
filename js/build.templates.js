this["Fliplet"] = this["Fliplet"] || {};
this["Fliplet"]["Widget"] = this["Fliplet"]["Widget"] || {};
this["Fliplet"]["Widget"]["Templates"] = this["Fliplet"]["Widget"]["Templates"] || {};

this["Fliplet"]["Widget"]["Templates"]["templates.build.content"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "  <p>Click here to start typing...</p>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "  <p>&nbsp;</p>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.isInteractable || (depth0 && depth0.isInteractable) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.mode : depth0),(depth0 != null ? depth0.isDev : depth0),{"name":"isInteractable","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});