Pixastic.Actions.unsharpmask={process:function(a){var b=parseFloat(a.options.amount)||0,c=parseFloat(a.options.radius)||0,d=parseFloat(a.options.threshold)||0;b=Math.min(500,Math.max(0,b))/2,c=Math.min(5,Math.max(0,c))/10,d=Math.min(255,Math.max(0,d)),d--;var e=-d;if(b*=.016,b++,Pixastic.Client.hasCanvasImageData()){var f=a.options.rect,g=document.createElement("canvas");g.width=a.width,g.height=a.height;var h=g.getContext("2d");h.drawImage(a.canvas,0,0);var i=2,j=Math.round(a.width/i),k=Math.round(a.height/i),l=document.createElement("canvas");l.width=j,l.height=k;for(var m=Math.round(20*c),n=l.getContext("2d"),o=0;m>o;o++){var p=Math.max(1,Math.round(j-o)),q=Math.max(1,Math.round(k-o));n.clearRect(0,0,j,k),n.drawImage(g,0,0,a.width,a.height,0,0,p,q),h.clearRect(0,0,a.width,a.height),h.drawImage(l,0,0,p,q,0,0,a.width,a.height)}var r=Pixastic.prepareData(a),s=Pixastic.prepareData({canvas:g,options:a.options}),t=f.width,u=f.height,v=4*t,w=u;do{var x=(w-1)*v,y=t;do{var z=x+(4*y-4),A=r[z]-s[z];if(A>d||e>A){var B=s[z];B=b*A+B,r[z]=B>255?255:0>B?0:B}var C=r[z+1]-s[z+1];if(C>d||e>C){var D=s[z+1];D=b*C+D,r[z+1]=D>255?255:0>D?0:D}var E=r[z+2]-s[z+2];if(E>d||e>E){var F=s[z+2];F=b*E+F,r[z+2]=F>255?255:0>F?0:F}}while(--y)}while(--w);return!0}},checkSupport:function(){return Pixastic.Client.hasCanvasImageData()}};