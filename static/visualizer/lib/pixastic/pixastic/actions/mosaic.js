Pixastic.Actions.mosaic={process:function(a){var b=Math.max(1,parseInt(a.options.blockSize,10));if(Pixastic.Client.hasCanvasImageData()){var c=a.options.rect,d=c.width,e=c.height,f=e,g=a.canvas.getContext("2d"),h=document.createElement("canvas");h.width=h.height=1;var i=h.getContext("2d"),j=document.createElement("canvas");j.width=d,j.height=e;var k=j.getContext("2d");k.drawImage(a.canvas,c.left,c.top,d,e,0,0,d,e);for(var f=0;e>f;f+=b)for(var l=0;d>l;l+=b){var m=b,n=b;m+l>d&&(m=d-l),n+f>e&&(n=e-f),i.drawImage(j,l,f,m,n,0,0,1,1);var o=i.getImageData(0,0,1,1).data;g.fillStyle="rgb("+o[0]+","+o[1]+","+o[2]+")",g.fillRect(c.left+l,c.top+f,b,b)}return a.useData=!1,!0}},checkSupport:function(){return Pixastic.Client.hasCanvasImageData()}};