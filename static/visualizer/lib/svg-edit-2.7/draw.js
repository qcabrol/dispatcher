!function(){svgedit.draw||(svgedit.draw={});var a=svgedit.NS,b="a,circle,ellipse,foreignObject,g,image,line,path,polygon,polyline,rect,svg,text,tspan,use".split(","),c={LET_DOCUMENT_DECIDE:0,ALWAYS_RANDOMIZE:1,NEVER_RANDOMIZE:2},d=c.LET_DOCUMENT_DECIDE;svgedit.draw.Layer=function(a,b){this.name_=a,this.group_=b},svgedit.draw.Layer.prototype.getName=function(){return this.name_},svgedit.draw.Layer.prototype.getGroup=function(){return this.group_},svgedit.draw.randomizeIds=function(a,b){d=a===!1?c.NEVER_RANDOMIZE:c.ALWAYS_RANDOMIZE,d!=c.ALWAYS_RANDOMIZE||b.getNonce()?d==c.NEVER_RANDOMIZE&&b.getNonce()&&b.clearNonce():b.setNonce(Math.floor(100001*Math.random()))},svgedit.draw.Drawing=function(b,e){if(!b||!b.tagName||!b.namespaceURI||"svg"!=b.tagName||b.namespaceURI!=a.SVG)throw"Error: svgedit.draw.Drawing instance initialized without a <svg> element";this.svgElem_=b,this.obj_num=0,this.idPrefix=e||"svg_",this.releasedNums=[],this.all_layers=[],this.current_layer=null,this.nonce_="";var f=this.svgElem_.getAttributeNS(a.SE,"nonce");f&&d!=c.NEVER_RANDOMIZE?this.nonce_=f:d==c.ALWAYS_RANDOMIZE&&this.setNonce(Math.floor(100001*Math.random()))},svgedit.draw.Drawing.prototype.getElem_=function(a){return this.svgElem_.querySelector?this.svgElem_.querySelector("#"+a):$(this.svgElem_).find("[id="+a+"]")[0]},svgedit.draw.Drawing.prototype.getSvgElem=function(){return this.svgElem_},svgedit.draw.Drawing.prototype.getNonce=function(){return this.nonce_},svgedit.draw.Drawing.prototype.setNonce=function(b){this.svgElem_.setAttributeNS(a.XMLNS,"xmlns:se",a.SE),this.svgElem_.setAttributeNS(a.SE,"se:nonce",b),this.nonce_=b},svgedit.draw.Drawing.prototype.clearNonce=function(){this.nonce_=""},svgedit.draw.Drawing.prototype.getId=function(){return this.nonce_?this.idPrefix+this.nonce_+"_"+this.obj_num:this.idPrefix+this.obj_num},svgedit.draw.Drawing.prototype.getNextId=function(){var a=this.obj_num,b=!1;this.releasedNums.length>0?(this.obj_num=this.releasedNums.pop(),b=!0):this.obj_num++;for(var c=this.getId();this.getElem_(c);)b&&(this.obj_num=a,b=!1),this.obj_num++,c=this.getId();return b&&(this.obj_num=a),c},svgedit.draw.Drawing.prototype.releaseId=function(a){var b=this.idPrefix+(this.nonce_?this.nonce_+"_":"");if("string"!=typeof a||0!==a.indexOf(b))return!1;var c=parseInt(a.substr(b.length),10);return"number"!=typeof c||0>=c||-1!=this.releasedNums.indexOf(c)?!1:(this.releasedNums.push(c),!0)},svgedit.draw.Drawing.prototype.getNumLayers=function(){return this.all_layers.length},svgedit.draw.Drawing.prototype.hasLayer=function(a){var b;for(b=0;b<this.getNumLayers();b++)if(this.all_layers[b][0]==a)return!0;return!1},svgedit.draw.Drawing.prototype.getLayerName=function(a){return a>=0&&a<this.getNumLayers()?this.all_layers[a][0]:""},svgedit.draw.Drawing.prototype.getCurrentLayer=function(){return this.current_layer},svgedit.draw.Drawing.prototype.getCurrentLayerName=function(){var a;for(a=0;a<this.getNumLayers();++a)if(this.all_layers[a][1]==this.current_layer)return this.getLayerName(a);return""},svgedit.draw.Drawing.prototype.setCurrentLayer=function(a){var b;for(b=0;b<this.getNumLayers();++b)if(a==this.getLayerName(b))return this.current_layer!=this.all_layers[b][1]&&(this.current_layer.setAttribute("style","pointer-events:none"),this.current_layer=this.all_layers[b][1],this.current_layer.setAttribute("style","pointer-events:all")),!0;return!1},svgedit.draw.Drawing.prototype.deleteCurrentLayer=function(){if(this.current_layer&&this.getNumLayers()>1){var a=this.current_layer.parentNode,b=(this.current_layer.nextSibling,a.removeChild(this.current_layer));return this.identifyLayers(),b}return null},svgedit.draw.Drawing.prototype.identifyLayers=function(){this.all_layers=[];var c,d=this.svgElem_.childNodes.length,e=[],f=[],g=null,h=!1;for(c=0;d>c;++c){var i=this.svgElem_.childNodes.item(c);if(i&&1==i.nodeType)if("g"==i.tagName){h=!0;var j=$("title",i).text();!j&&svgedit.browser.isOpera()&&i.querySelectorAll&&(j=$(i.querySelectorAll("title")).text()),j?(f.push(j),this.all_layers.push([j,i]),g=i,svgedit.utilities.walkTree(i,function(a){a.setAttribute("style","pointer-events:inherit")}),g.setAttribute("style","pointer-events:none")):e.push(i)}else if(~b.indexOf(i.nodeName)){{svgedit.utilities.getBBox(i)}e.push(i)}}var k=this.svgElem_.ownerDocument;if(e.length>0||!h){for(c=1;f.indexOf("Layer "+c)>=0;)c++;var l="Layer "+c;g=k.createElementNS(a.SVG,"g");var m=k.createElementNS(a.SVG,"title");m.textContent=l,g.appendChild(m);var n;for(n=0;n<e.length;++n)g.appendChild(e[n]);this.svgElem_.appendChild(g),this.all_layers.push([l,g])}svgedit.utilities.walkTree(g,function(a){a.setAttribute("style","pointer-events:inherit")}),this.current_layer=g,this.current_layer.setAttribute("style","pointer-events:all")},svgedit.draw.Drawing.prototype.createLayer=function(b){var c=this.svgElem_.ownerDocument,d=c.createElementNS(a.SVG,"g"),e=c.createElementNS(a.SVG,"title");return e.textContent=b,d.appendChild(e),this.svgElem_.appendChild(d),this.identifyLayers(),d},svgedit.draw.Drawing.prototype.getLayerVisibility=function(a){var b,c=null;for(b=0;b<this.getNumLayers();++b)if(this.getLayerName(b)==a){c=this.all_layers[b][1];break}return c?"none"!==c.getAttribute("display"):!1},svgedit.draw.Drawing.prototype.setLayerVisibility=function(a,b){if("boolean"!=typeof b)return null;var c,d=null;for(c=0;c<this.getNumLayers();++c)if(this.getLayerName(c)==a){d=this.all_layers[c][1];break}if(!d)return null;var e=d.getAttribute("display");return e||(e="inline"),d.setAttribute("display",b?"inline":"none"),d},svgedit.draw.Drawing.prototype.getLayerOpacity=function(a){var b;for(b=0;b<this.getNumLayers();++b)if(this.getLayerName(b)==a){var c=this.all_layers[b][1],d=c.getAttribute("opacity");return d||(d="1.0"),parseFloat(d)}return null},svgedit.draw.Drawing.prototype.setLayerOpacity=function(a,b){if(!("number"!=typeof b||0>b||b>1)){var c;for(c=0;c<this.getNumLayers();++c)if(this.getLayerName(c)==a){var d=this.all_layers[c][1];d.setAttribute("opacity",b);break}}}}();