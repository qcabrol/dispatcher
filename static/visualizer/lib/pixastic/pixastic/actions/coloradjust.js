Pixastic.Actions.coloradjust={process:function(a){var b=parseFloat(a.options.red)||0,c=parseFloat(a.options.green)||0,d=parseFloat(a.options.blue)||0;if(b=Math.round(255*b),c=Math.round(255*c),d=Math.round(255*d),Pixastic.Client.hasCanvasImageData()){for(var e,f,g,h,i,j=Pixastic.prepareData(a),k=a.options.rect,l=k.width*k.height,m=4*l;l--;)m-=4,b&&(j[m]=(g=j[m]+b)<0?0:g>255?255:g),c&&(j[e]=(h=j[e=m+1]+c)<0?0:h>255?255:h),d&&(j[f]=(i=j[f=m+2]+d)<0?0:i>255?255:i);return!0}},checkSupport:function(){return Pixastic.Client.hasCanvasImageData()}};