define(["src/util/util"],function(a){function b(a){return a?a.getUrl():void 0}var c=function(a,b){this.labels={},this.icon,a&&this.setLabel(a),b&&this.setIcon(b)};return c.prototype={setIcon:function(a){var b=this;require(["form/icon"],function(c){a instanceof c||(a=new c(a)),b.icon})},setLabel:function(b,c){c||(c=a.getCurrentLang()),this.labels[c]=b},getIconTag:function(){return this.icon?['<img src="',b(this.icon),'" alt="',this.getLabel(),'" />'].join(""):void 0},getLabel:function(b){return b||(b=a.getCurrentLang()),this.labels[b]||""},duplicate:function(){var a=new a;for(var b in this.labels)a.setLabel(this.labels[b],b);return a.setIcon(this.icon),a},getIconUrl:b},c});