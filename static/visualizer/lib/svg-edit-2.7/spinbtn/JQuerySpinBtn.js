$.fn.SpinButton=function(a){function b(a,b){for(var c=a[b],d=document.body;(a=a.offsetParent)&&a!=d;)$.browser.msie&&"relative"===a.currentStyle.position||(c+=a[b]);return c}return this.each(function(){this.repeating=!1,this.spinCfg={min:a&&!isNaN(parseFloat(a.min))?Number(a.min):null,max:a&&!isNaN(parseFloat(a.max))?Number(a.max):null,step:a&&a.step?Number(a.step):1,stepfunc:a&&a.stepfunc?a.stepfunc:!1,page:a&&a.page?Number(a.page):10,upClass:a&&a.upClass?a.upClass:"up",downClass:a&&a.downClass?a.downClass:"down",reset:a&&a.reset?a.reset:this.value,delay:a&&a.delay?Number(a.delay):500,interval:a&&a.interval?Number(a.interval):100,_btn_width:20,_direction:null,_delay:null,_repeat:null,callback:a&&a.callback?a.callback:null},this.spinCfg.smallStep=a&&a.smallStep?a.smallStep:this.spinCfg.step/2,this.adjustValue=function(a){var b;b=isNaN(this.value)?this.spinCfg.reset:$.isFunction(this.spinCfg.stepfunc)?this.spinCfg.stepfunc(this,a):Number((Number(this.value)+Number(a)).toFixed(5)),null!==this.spinCfg.min&&(b=Math.max(b,this.spinCfg.min)),null!==this.spinCfg.max&&(b=Math.min(b,this.spinCfg.max)),this.value=b,$.isFunction(this.spinCfg.callback)&&this.spinCfg.callback(this)},$(this).addClass(a&&a.spinClass?a.spinClass:"spin-button").mousemove(function(a){var c=a.pageX||a.x,d=a.pageY||a.y,e=a.target||a.srcElement,f=svgEditor.tool_scale||1,g=$(e).height()/2,h=c>b(e,"offsetLeft")+e.offsetWidth*f-this.spinCfg._btn_width?d<b(e,"offsetTop")+g*f?1:-1:0;if(h!==this.spinCfg._direction){switch(h){case 1:$(this).removeClass(this.spinCfg.downClass).addClass(this.spinCfg.upClass);break;case-1:$(this).removeClass(this.spinCfg.upClass).addClass(this.spinCfg.downClass);break;default:$(this).removeClass(this.spinCfg.upClass).removeClass(this.spinCfg.downClass)}this.spinCfg._direction=h}}).mouseout(function(){$(this).removeClass(this.spinCfg.upClass).removeClass(this.spinCfg.downClass),this.spinCfg._direction=null,window.clearInterval(this.spinCfg._repeat),window.clearTimeout(this.spinCfg._delay)}).mousedown(function(a){if(0===a.button&&0!=this.spinCfg._direction){var b=this,c=a.shiftKey?b.spinCfg.smallStep:b.spinCfg.step,d=function(){b.adjustValue(b.spinCfg._direction*c)};d(),b.spinCfg._delay=window.setTimeout(function(){d(),b.spinCfg._repeat=window.setInterval(d,b.spinCfg.interval)},b.spinCfg.delay)}}).mouseup(function(){window.clearInterval(this.spinCfg._repeat),window.clearTimeout(this.spinCfg._delay)}).dblclick(function(){$.browser.msie&&this.adjustValue(this.spinCfg._direction*this.spinCfg.step)}).keydown(function(a){switch(a.keyCode){case 38:this.adjustValue(this.spinCfg.step);break;case 40:this.adjustValue(-this.spinCfg.step);break;case 33:this.adjustValue(this.spinCfg.page);break;case 34:this.adjustValue(-this.spinCfg.page)}}).keypress(function(a){if(this.repeating)switch(a.keyCode){case 38:this.adjustValue(this.spinCfg.step);break;case 40:this.adjustValue(-this.spinCfg.step);break;case 33:this.adjustValue(this.spinCfg.page);break;case 34:this.adjustValue(-this.spinCfg.page)}else this.repeating=!0}).keyup(function(a){switch(this.repeating=!1,a.keyCode){case 38:case 40:case 33:case 34:case 13:this.adjustValue(0)}}).bind("mousewheel",function(a){a.wheelDelta>=120?this.adjustValue(this.spinCfg.step):a.wheelDelta<=-120&&this.adjustValue(-this.spinCfg.step),a.preventDefault()}).change(function(){this.adjustValue(0)}),this.addEventListener&&this.addEventListener("DOMMouseScroll",function(a){a.detail>0?this.adjustValue(-this.spinCfg.step):a.detail<0&&this.adjustValue(this.spinCfg.step),a.preventDefault()},!1)})},$.fn.SpinButton=function(a){function b(a,b){for(var c=a[b],d=document.body;(a=a.offsetParent)&&a!=d;)$.browser.msie&&"relative"==a.currentStyle.position||(c+=a[b]);return c}return this.each(function(){this.repeating=!1,this.spinCfg={min:a&&!isNaN(parseFloat(a.min))?Number(a.min):null,max:a&&!isNaN(parseFloat(a.max))?Number(a.max):null,step:a&&a.step?Number(a.step):1,stepfunc:a&&a.stepfunc?a.stepfunc:!1,page:a&&a.page?Number(a.page):10,upClass:a&&a.upClass?a.upClass:"up",downClass:a&&a.downClass?a.downClass:"down",reset:a&&a.reset?a.reset:this.value,delay:a&&a.delay?Number(a.delay):500,interval:a&&a.interval?Number(a.interval):100,_btn_width:20,_direction:null,_delay:null,_repeat:null,callback:a&&a.callback?a.callback:null},this.spinCfg.smallStep=a&&a.smallStep?a.smallStep:this.spinCfg.step/2,this.adjustValue=function(a){a=isNaN(this.value)?this.spinCfg.reset:$.isFunction(this.spinCfg.stepfunc)?this.spinCfg.stepfunc(this,a):Number((Number(this.value)+Number(a)).toFixed(5)),null!==this.spinCfg.min&&(a=Math.max(a,this.spinCfg.min)),null!==this.spinCfg.max&&(a=Math.min(a,this.spinCfg.max)),this.value=a,$.isFunction(this.spinCfg.callback)&&this.spinCfg.callback(this)},$(this).addClass(a&&a.spinClass?a.spinClass:"spin-button").mousemove(function(a){var c=a.pageX||a.x,d=a.pageY||a.y;a=a.target||a.srcElement;var e=svgEditor.tool_scale||1,f=$(a).height()/2;if(c=c>b(a,"offsetLeft")+a.offsetWidth*e-this.spinCfg._btn_width?d<b(a,"offsetTop")+f*e?1:-1:0,c!==this.spinCfg._direction){switch(c){case 1:$(this).removeClass(this.spinCfg.downClass).addClass(this.spinCfg.upClass);break;case-1:$(this).removeClass(this.spinCfg.upClass).addClass(this.spinCfg.downClass);break;default:$(this).removeClass(this.spinCfg.upClass).removeClass(this.spinCfg.downClass)}this.spinCfg._direction=c}}).mouseout(function(){$(this).removeClass(this.spinCfg.upClass).removeClass(this.spinCfg.downClass),this.spinCfg._direction=null,window.clearInterval(this.spinCfg._repeat),window.clearTimeout(this.spinCfg._delay)}).mousedown(function(a){if(0===a.button&&0!=this.spinCfg._direction){var b=this,c=a.shiftKey?b.spinCfg.smallStep:b.spinCfg.step,d=function(){b.adjustValue(b.spinCfg._direction*c)};d(),b.spinCfg._delay=window.setTimeout(function(){d(),b.spinCfg._repeat=window.setInterval(d,b.spinCfg.interval)},b.spinCfg.delay)}}).mouseup(function(){window.clearInterval(this.spinCfg._repeat),window.clearTimeout(this.spinCfg._delay)}).dblclick(function(){$.browser.msie&&this.adjustValue(this.spinCfg._direction*this.spinCfg.step)}).keydown(function(a){switch(a.keyCode){case 38:this.adjustValue(this.spinCfg.step);break;case 40:this.adjustValue(-this.spinCfg.step);break;case 33:this.adjustValue(this.spinCfg.page);break;case 34:this.adjustValue(-this.spinCfg.page)}}).keypress(function(a){if(this.repeating)switch(a.keyCode){case 38:this.adjustValue(this.spinCfg.step);break;case 40:this.adjustValue(-this.spinCfg.step);break;case 33:this.adjustValue(this.spinCfg.page);break;case 34:this.adjustValue(-this.spinCfg.page)}else this.repeating=!0}).keyup(function(a){switch(this.repeating=!1,a.keyCode){case 38:case 40:case 33:case 34:case 13:this.adjustValue(0)}}).bind("mousewheel",function(a){a.wheelDelta>=120?this.adjustValue(this.spinCfg.step):a.wheelDelta<=-120&&this.adjustValue(-this.spinCfg.step),a.preventDefault()}).change(function(){this.adjustValue(0)}),this.addEventListener&&this.addEventListener("DOMMouseScroll",function(a){a.detail>0?this.adjustValue(-this.spinCfg.step):a.detail<0&&this.adjustValue(this.spinCfg.step),a.preventDefault()},!1)})};