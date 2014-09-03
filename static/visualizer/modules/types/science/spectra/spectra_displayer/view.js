define(["modules/default/defaultview","lib/plot/plot","src/util/datatraversing","src/util/api","src/util/util","src/util/debug"],function(a,b,c,d,e,f){function g(){}return g.prototype=$.extend(!0,{},a,{init:function(){this.series={},this.colorvars=[],this.dom=$("<div />"),this.zones={},this._currentHighlights={},this.module.getDomContent().html(this.dom),this.seriesActions=[],this.colorId=0,this.colors=["red","blue","green","black"],this.deferreds={},this.onchanges={}},inDom:function(){var a,d=this,e=$.proxy(this.module.getConfiguration,this.module),f=e("graphurl"),g=$.Deferred();if(f)$.getJSON(f,{},function(a){a.options.onMouseMoveData=function(a,b){d.module.controller.sendAction("mousetrack",b)},g.resolve(new b(d.dom.get(0),a.options,a.axis))});else{var a=new b(this.dom.get(0),{close:{left:!0,right:!0,top:!0,bottom:!0},onAnnotationMake:function(a){d.module.controller.sendAction("annotation",a,"onAnnotationAdd")},onAnnotationChange:function(a){d.module.controller.sendAction("annotation",a,"onAnnotationChange"),c.triggerDataChange(a)},onMouseMoveData:function(a,b){var c,e,f;for(var g in d.zones)if(b[g])for(var h in d.zones[g])c=Math.min(d.zones[g][h][0],d.zones[g][h][1]),e=Math.max(d.zones[g][h][0],d.zones[g][h][1]),f=b[g].trueX,f>c&&e>f?d._currentHighlights[h]=1:d._currentHighlights[h]&&(d._currentHighlights[h]=0)}});a.getBottomAxis().options.onZoom=function(a,b){d.module.controller.sendAction("fromto",new DataObject({type:"fromTo",value:new DataObject({from:a,to:b})}),"onZoomChange")},e("shiftxtozero")&&(a.getXAxis().options.shiftToZero=!0),a.getLeftAxis().setDisplay(e("displayYAxis",!1)),a.getLeftAxis().setLabel(e("yLabel","")),a.getXAxis().setDisplay(e("displayXAxis",!0)),a.getXAxis().setLabel(e("xLabel","")),a.getXAxis().togglePrimaryGrid(e("vertGridMain",!1)),a.getXAxis().toggleSecondaryGrid(e("vertGridSec",!1)),e("xastime")&&(a.getXAxis().options.unitModification="time"),a.getYAxis().togglePrimaryGrid(e("horGridMain",!1)),a.getYAxis().toggleSecondaryGrid(e("horGridSec",!1)),a.getXAxis().setAxisDataSpacing(e("xLeftSpacing"),e("xRightSpacing")),a.getYAxis().setAxisDataSpacing(e("yBottomSpacing"),e("yTopSpacing")),a.setDefaultWheelAction(e("wheelAction","none")),a.getXAxis().forceMin(e("minX",!1)),a.getLeftAxis().forceMin(e("minY",!1)),a.getXAxis().forceMax(e("maxX",!1)),a.getLeftAxis().forceMax(e("maxY",!1)),a.setOption("zoomMode",e("zoom")),g.resolve(a)}$.when(g).then(function(a){a&&(a.redraw(!0),d.graph=a,d.graph.getXAxis().flip(e("flipX",!1)),d.graph.getYAxis().flip(e("flipY",!1)),d.redraw(),d.resolveReady())})},onResize:function(){this.graph&&(this.graph.resize(this.width,this.height),this.redraw(!0))},redraw:function(a){var b=$.proxy(this.module.getConfiguration,this.module);a?this.graph.redraw():"none"==b("fullOut")?this.graph.redraw(!0,!0,!0):"xAxis"==b("fullOut")?this.graph.redraw(!1,!1,!0):"yAxis"==b("fullOut")?this.graph.redraw(!1,!0,!1):this.graph.redraw(),this.graph.drawSeries()},doZone:function(a,b,c,d){if(c&&!b[2]){var e=(this.series[a][0],this.graph.makeShape({type:"rect",pos:{x:b[0]},pos2:{x:b[1]},fillColor:d,opacity:"0.5"}));e.setFullHeight(),b.push(e)}else b[2]&&!c&&(b[2].kill(),b.splice(2,1))},setSerieParameters:function(a,b,c){var f=this,g=this.module.getConfiguration("plotinfos");if(c=c||[],g)for(var h=0,i=g.length;i>h;h++)b==g[h].variable&&(a.options.lineToZero=!g[h].plotcontinuous[0],a.options.useSlots=g[h].optimizeSlots?!!g[h].optimizeSlots[0]:!1,a.setLineColor(e.getColor(g[h].plotcolor)),a.setLineWidth(g[h].strokewidth||1),a.options.autoPeakPicking=g[h].peakpicking[0],g[h].markers[0]&&(a.showMarkers(),a.setMarkerType(1),a.setMarkerZoom(2),a.setMarkerStrokeColor(e.getColor(g[h].plotcolor)),a.setMarkerFillColor(e.getColor(g[h].plotcolor))));d.listenHighlight(c,function(b,d){a.toggleMarker([c.indexOf(d[0]),0],b,!0)}),a.options.onMouseOverMarker=function(a,b,e){d.highlight(c[a[0]],1),f.module.controller.onMouseOverMarker(e,b)},a.options.onMouseOutMarker=function(a,b,e){d.highlight(c[a[0]],0),f.module.controller.onMouseOutMarker(e,b)}},blank:{xyArray:function(a){this.removeSerie(a)},xArray:function(a){this.removeSerie(a)},jcamp:function(a){this.removeSerie(a)},chart:function(a){this.removeSerie(a)}},update:{fromTo:function(a){var b=this;a&&a.value&&b.dom.data("spectra")&&b.dom.data("spectra").setBoundaries(a.value.from,a.value.to)},chart:function(a,b){if(this.series[b]=this.series[b]||[],this.removeSerie(b),a){a=a.get();for(var c=a.data,d=0;d<c.length;d++){var e=c[d],f=c.serieLabel,g=[];if(e.y)for(var h=0,i=e.y.length;i>h;h++)g.push(e.x?e.x[h]:h),g.push(e.y[h]);var j=this.graph.newSerie(f,{trackMouse:!0});this.setSerieParameters(j,b,e._highlight),this.normalize(g,b),j.setData(g),e.infos&&j.setInfos(e.infos),j.autoAxis(),this.series[b].push(j)}this.redraw()}},xyArray:function(a,b){if(this.series[b]=this.series[b]||[],this.removeSerie(b),a){var c=a.get(),d=this.graph.newSerie(b,{trackMouse:!0});this.setSerieParameters(d,b),this.normalize(c,b),d.setData(c),d.autoAxis(),this.series[b].push(d),this.redraw()}},xArray:function(a,b){function d(a){for(var c=f.module.getConfiguration("minX")||0,d=f.module.getConfiguration("maxX")||a.length-1,e=(d-c)/(a.length-1),g=[],h=0,i=a.length;i>h;h++)g.push(c+e*h),g.push(a[h]);return f.normalize(g,b),g}var e,f=this;if(this.series[b]=this.series[b]||[],this.removeSerie(b),a){e=c.getValueIfNeeded(a);var g=f.graph.newSerie(b,{trackMouse:!0}),h=a.onChange(function(){g.setData(d(this.get())),f.redraw()});this.setOnChange(h,b,a),$.when(e).then(function(a){f.setSerieParameters(g,b),g.setData(d(a)),g.autoAxis(),f.series[b].push(g),f.redraw()})}},annotations:function(a){d.killHighlight(this.module.getId()),a=c.getValueIfNeeded(a),a&&(this.annotations=a,this.resetAnnotations(!0))},jcamp:function(a,b){if(a){a=a.get();var c,e=this;if(d.killHighlight(this.module.getId()+b),this.graph){this.zones[b]=a._zones,e.deferreds[b]&&e.deferreds[b].reject(),e.deferreds[b]=$.Deferred();var f=e.deferreds[b];require(["src/util/jcampconverter"],function(g){g(a,{lowRes:1024}).done(function(g){if("rejected"!=f.state()){if(e.deferreds[b]=!1,e.series[b]=e.series[b]||[],e.series[b]=[],g.contourLines)c=e.graph.newSerie(b,{trackMouse:!0},"contour"),e.setSerieParameters(c,b),c.setData(g.contourLines),c.autoAxis(),e.series[b].push(c);else{g=g.spectra;for(var h=0,i=g.length;i>h;h++){c=e.graph.newSerie(b,{trackMouse:!0});var j=g[h].data[g[h].data.length-1];e.setSerieParameters(c,b),e.normalize(j,b),c.setData(j),c.autoAxis(),e.series[b].push(c);break}d.listenHighlight(a._highlight||[],function(a,c){for(var d=0;d<c.length;d++)e.zones[b][c[d]]&&e.doZone(b,e.zones[b][c[d]],a,e.series[b].options.lineColor)},!0,e.module.getId()+b)}e.redraw(),e.resetAnnotations(!0)}})})}}},series_xy1d:function(a){this.graph.removeSeries();for(var b=0,c=a.length;c>b;b++){var d=this.graph.newSerie();d.autoAxis(),d.setData(a[b].data),d.setLineWidth(a[b].lineWidth||1),d.setLineColor(a[b].lineColor||e.getColor(e.getNextColorRGB(b,c)))}this.redraw()}},setOnChange:function(a,b,c){this.onchanges[b]&&this.onchanges[b].obj.unbindChange(this.onchanges[b].id),this.onchanges[b]={obj:c,id:a}},resetAnnotations:function(a){if(this.annotations){if(this.annotationsDone&&!a)return this.graph.redrawShapes();this.annotationsDone=!0,this.graph.removeAnnotations();for(var b=0,c=this.annotations.length;c>b;b++)this.doAnnotation(this.annotations[b])}},getFirstSerie:function(){for(var a in this.series)if(this.series[a][0])return this.series[a][0]},doAnnotation:function(a){if(this.graph){var b=this,c=this.graph.makeShape(a,{},!1);c.setSelectable(!0),c.setSerie(this.getFirstSerie()),f.debug("annotation.onChange is disabled, need to be fixed"),c.onMouseOver(function(a){d.highlight(a,1)}),c.onMouseOut(function(a){d.highlight(a,0)}),d.listenHighlight(a,function(a){a?c.highlight():c.unHighlight()},!1,b.module.getId()),c.draw(),c.redraw()}},removeSerie:function(a){if(this.series[a])for(var b=0;b<this.series[a].length;b++)this.series[a][b].kill(!0);this.series[a]=[]},makeSerie:function(a,b,c){var d=this,e=this.graph.newSerie(a.name);a.onChange(function(){e.setData(a.data),d.graph.redraw(),d.graph.drawSeries()}),this.onActionReceive.removeSerieByName.call(this,a.name||{}),e.autoAxis(),e.setData(a.data),this.seriesActions.push([b,e,a.name]),this.setSerieParameters(e,c),a.lineColor&&e.setLineColor(a.lineColor),a.lineWidth&&e.setLineWidth(a.lineWidth),this.redraw()},onActionReceive:{fromTo:function(a){this.graph.getBottomAxis()._doZoomVal(a.value.from,a.value.to,!0),this.graph.redraw(!0),this.graph.drawSeries()},addSerie:function(a){if(this.colorId++,a=a.get(),a.name)this.makeSerie(a,a,a.name);else for(var b in a)this.makeSerie(a[b],a)},removeSerie:function(a){a=a.get();for(var b=0,c=this.seriesActions.length;c>b;b++)this.seriesActions[b][0]==a&&(this.seriesActions[b][1].kill(),this.seriesActions.splice(b,1))},removeSerieByName:function(a){for(var b=0;b<this.seriesActions.length;b++)this.seriesActions[b][2]==a&&(this.seriesActions[b][1].kill(),this.seriesActions.splice(b,1),b--)}},getDom:function(){return this.dom},typeToScreen:{},normalize:function(a,b){var c=this.module.getConfiguration("plotinfos");if(c){for(var d="",e=0,f=c.length;f>e;e++)b==c[e].variable&&(d=c[e].normalize);if(d)if("max1"==d){for(var g=Number.MIN_VALUE,e=1;e<a.length;e+=2)a[e]>g&&(g=a[e]);for(var e=1;e<a.length;e+=2)a[e]/=g}else if("sum1"==d){for(var h=0,e=1;e<a.length;e+=2)h+=a[e];for(var e=1;e<a.length;e+=2)a[e]/=h}else if("max1min0"==d){for(var g=Number.MIN_VALUE,i=Number.MAX_VALUE,e=1;e<a.length;e+=2)a[e]>g&&(g=a[e]),a[e]<i&&(i=a[e]);for(var j=1/(g-i),e=1;e<a.length;e+=2)a[e]=(a[e]-i)*j}}}}),g});