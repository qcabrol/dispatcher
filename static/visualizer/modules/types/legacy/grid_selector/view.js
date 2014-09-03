define(["modules/default/defaultview","src/util/util"],function(a,b){function c(){}return c.prototype=$.extend(!0,{},a,{init:function(){this.domWrapper=$('<div class="ci-display-grid-selector"></div>'),this.module.getDomContent().html(this.domWrapper),this.dom=$("<form></form>").appendTo(this.domWrapper)},blank:function(){this.domTable.empty(),this.table=null},update:{preferences:function(a){if(a&&(a=a.value)){var b=a.categories,c=a.variables;this.cols=b,this.lines=c,this._selectors={},html='<table cellpadding="0" cellspacing="0">';for(var d=-2,e=c.length;e>d;d++){html+='<tr data-lineid="'+d+'" '+(d>-1?'style="background-color: '+c[d].color+'"':"")+">",html+=-1==d?"<td></td>":-2==d?"<th>All</th>":"<td>"+c[d].label+"</td>";for(var f=0,g=b.length;g>f;f++)-2==d?html+='<th width="'+("checkbox"==b[f].selectorType?"100":"")+'" data-colid="'+f+'">'+b[f].label+"</th>":-1==d?html+='<td data-colid="'+f+'">'+this.getSelector(b[f],null,f,d)+"</td>":(value=void 0,void 0!==this.module.getConfiguration()._data&&void 0!==this.module.getConfiguration()._data[b[f].name]&&void 0!==this.module.getConfiguration()._data[b[f].name][c[d].name]&&(value=this.module.getConfiguration()._data[b[f].name][c[d].name]),html+='<td data-colid="'+f+'" '+(d>-1?'data-lineid="'+d+'"':"")+">"+this.getSelector(b[f],c[d],f,d,value)+"</td>");html+="</tr>"}html+="</table>",this.module.controller.setSelector(this._selectors),this.dom.html(html),this.setEvents()}}},setEvents:function(){var a=this;$(this.dom).find('input[type="checkbox"]').bind("click",function(b,c){var d=$(this),e=void 0!==c?c:$(this).is(":checked"),f=d.data("colid"),g=d.data("lineid");void 0==g?a.changeSelectors(f,e):a.module.controller.selectorChanged(a.cols[f].name,a.lines[g].name,e)}),$(this.dom).find(".ci-rangebar").each(function(){var b=$(this),c=b.data("defaultmin"),d=b.data("defaultmax");b.slider({range:!0,min:$(this).data("minvalue"),max:$(this).data("maxvalue"),step:.01,values:[c,d],slide:function(b,c){var d=$(this),e=d.data("colid"),f=d.data("lineid");void 0==f&&a.changeSelectors(e,c.values),a.sliderUpdateValue(d,c.values,e,f)}})})},sliderUpdateValue:function(a,b,c,d){var e=this;a.prev().html(Math.round(100*b[0])+" %"),a.next().html(Math.round(100*b[1])+" %"),void 0!==d&&e.module.controller.selectorChanged(e.cols[c].name,e.lines[d].name,b)},changeSelectors:function(a,b){var c=this,d=this.dom.children("table").find('td[data-colid="'+a+'"][data-lineid]');if(b instanceof Array){var e=d.find(".ci-rangebar").slider("values",b);e.each(function(){c.sliderUpdateValue($(this),b,a,$(this).data("lineid"))})}else b?d.find('input[type="checkbox"]').not(":checked").trigger("click",!0):d.find('input[type="checkbox"]:checked').trigger("click",!1)},getSelector:function(a,c,d,e,f){if(this._selectors[a.name]=this._selectors[a.name]||{},"checkbox"==a.selectorType){var g=b.getNextUniqueId(),h=void 0!==f?f:a.defaultValue;return c&&(this._selectors[a.name][c.name]=h),'<input type="checkbox" id="'+g+'" '+(h?'checked="checked"':"")+'" data-colid="'+d+'" '+(c?'data-lineid="'+e+'"':"")+' /><label for="'+g+'">&nbsp;</label>'}if("range"==a.selectorType){var i=[];return i[0]=f?f[0]:a.defaultMinValue,i[1]=f?f[1]:a.defaultMaxValue,c&&(this._selectors[a.name][c.name]=i),'<div class="ci-rangebar-wrapper"><div class="ci-rangebar-min">'+Math.round(100*i[0])+' %</div><div class="ci-rangebar" data-minvalue="'+a.minValue+'" data-maxvalue="'+a.maxValue+'" data-defaultmin="'+i[0]+'" data-defaultmax="'+i[1]+'" data-colid="'+d+'" '+(c?'data-lineid="'+e+'"':"")+' ></div><div class="ci-rangebar-max">'+Math.round(100*i[1])+" %</div></div>"}},getDom:function(){return this.dom},typeToScreen:{}}),c});