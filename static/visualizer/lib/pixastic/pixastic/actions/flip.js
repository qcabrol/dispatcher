Pixastic.Actions.flip={process:function(a){var b=a.options.rect,c=document.createElement("canvas");c.width=b.width,c.height=b.height,c.getContext("2d").drawImage(a.image,b.left,b.top,b.width,b.height,0,0,b.width,b.height);var d=a.canvas.getContext("2d");return d.clearRect(b.left,b.top,b.width,b.height),"horizontal"==a.options.axis?(d.scale(-1,1),d.drawImage(c,-b.left-b.width,b.top,b.width,b.height)):(d.scale(1,-1),d.drawImage(c,b.left,-b.top-b.height,b.width,b.height)),a.useData=!1,!0},checkSupport:function(){return Pixastic.Client.hasCanvas()}};