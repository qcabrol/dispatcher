Pixastic.Actions.noise={process:function(a){var b=0,c=0,d=!1;"undefined"!=typeof a.options.amount&&(b=parseFloat(a.options.amount)||0),"undefined"!=typeof a.options.strength&&(c=parseFloat(a.options.strength)||0),"undefined"!=typeof a.options.mono&&(d=!(!a.options.mono||"false"==a.options.mono)),b=Math.max(0,Math.min(1,b)),c=Math.max(0,Math.min(1,c));var e=128*c,f=e/2;if(Pixastic.Client.hasCanvasImageData()){var g=Pixastic.prepareData(a),h=a.options.rect,i=h.width,j=h.height,k=4*i,l=j,m=Math.random;do{var n=(l-1)*k,o=i;do{var p=n+4*(o-1);if(m()<b){if(d)var q=-f+m()*e,r=g[p]+q,s=g[p+1]+q,t=g[p+2]+q;else var r=g[p]-f+m()*e,s=g[p+1]-f+m()*e,t=g[p+2]-f+m()*e;0>r&&(r=0),0>s&&(s=0),0>t&&(t=0),r>255&&(r=255),s>255&&(s=255),t>255&&(t=255),g[p]=r,g[p+1]=s,g[p+2]=t}}while(--o)}while(--l);return!0}},checkSupport:function(){return Pixastic.Client.hasCanvasImageData()}};