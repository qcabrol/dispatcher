Pixastic.Actions.glow={process:function(a){var b=parseFloat(a.options.amount)||0,c=parseFloat(a.options.radius)||0;if(b=Math.min(1,Math.max(0,b)),c=Math.min(5,Math.max(0,c)),Pixastic.Client.hasCanvasImageData()){var d=a.options.rect,e=document.createElement("canvas");e.width=a.width,e.height=a.height;var f=e.getContext("2d");f.drawImage(a.canvas,0,0);var g=2,h=Math.round(a.width/g),i=Math.round(a.height/g),j=document.createElement("canvas");j.width=h,j.height=i;for(var k=Math.round(20*c),l=j.getContext("2d"),m=0;k>m;m++){var n=Math.max(1,Math.round(h-m)),o=Math.max(1,Math.round(i-m));l.clearRect(0,0,h,i),l.drawImage(e,0,0,a.width,a.height,0,0,n,o),f.clearRect(0,0,a.width,a.height),f.drawImage(j,0,0,n,o,0,0,a.width,a.height)}for(var p=Pixastic.prepareData(a),q=Pixastic.prepareData({canvas:e,options:a.options}),r=d.width*d.height,s=4*r,t=s+1,u=s+2;r--;)(p[s-=4]+=b*q[s])>255&&(p[s]=255),(p[t-=4]+=b*q[t])>255&&(p[t]=255),(p[u-=4]+=b*q[u])>255&&(p[u]=255);return!0}},checkSupport:function(){return Pixastic.Client.hasCanvasImageData()}};