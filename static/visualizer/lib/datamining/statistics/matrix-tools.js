define(function(){function a(a,b){"undefined"==typeof b&&(b=0);for(var c=0,d=a.length,e=a[0].length,f=0;d>f;f++)for(var g=0;e>g;g++)c+=a[f][g]*Math.log(a[f][g]+b);return-c}function b(a,b){"undefined"==typeof b&&(b=0);var c,d=a.length,e=a[0].length;if(-1===b){c=[0];for(var f=d*e,g=0;d>g;g++)for(var h=0;e>h;h++)c[0]+=a[g][h];c[0]/=f}else if(0===b){c=new Array(e);for(var f=d,h=0;e>h;h++){c[h]=0;for(var g=0;d>g;g++)c[h]+=a[g][h];c[h]/=f}}else{if(1!==b)throw"Invalid dimension.";c=new Array(d);for(var f=e,h=0;d>h;h++){c[h]=0;for(var g=0;e>g;g++)c[h]+=a[h][g];c[h]/=f}}return c}function c(a,b,c){for(var e=d(a,b,c),f=e.length,g=0;f>g;g++)e[g]=Math.sqrt(e[g]);return e}function d(a,c,d){"undefined"==typeof d&&(d=!0),"undefined"==typeof c&&(c=b(a));var e=a.length;if(0===e)return[];for(var f=a[0].length,g=new Array(f),h=0;f>h;h++){for(var i=0,j=0,k=0,l=0;e>l;l++)k=a[l][h]-c[h],i+=k,j+=k*k;g[h]=d?(j-i*i/e)/(e-1):(j-i*i/e)/e}return g}function e(a){for(var b=a.length,c=a[0].length,d=new Array(c),e=0;c>e;e++){for(var f=new Array(b),g=0;b>g;g++)f[g]=a[g][e];f.sort();var h=f.length;d[e]=h%2===0?.5*(f[h/2]+f[h/2-1]):f[Math.floor(h/2)]}return d}function f(a){for(var b=a.length,c=a[0].length,d=new Array(c),e=0;c>e;e++){for(var f=new Array(b),g=0;b>g;f[g++]=0);for(var h=new Array(b),i=0,j=0;b>j;j++){var k=h.indexOf(a[j][e]);k>=0?f[k]++:(h[i]=a[j][e],f[i]=1,i++)}for(var l=0,m=0,j=0;i>j;j++)f[j]>l&&(l=f[j],m=j);d[e]=h[m]}return d}function g(a,c){"undefined"==typeof c&&(c=!0);for(var d=b(a),e=a.length,f=d.length,g=new Array(f),h=0;f>h;h++){for(var i=0,j=0,k=0;e>k;k++){var l=a[k][h]-d[h];i+=l*l,j+=l*l*l}var m=i/e,n=j/e,o=n/Math.pow(m,1.5);if(c){var p=Math.sqrt(e*(e-1)),q=e-2;g[h]=p/q*o}else g[h]=o}return g}function h(a,c){"undefined"==typeof c&&(c=!0);for(var d=b(a),e=a.length,f=a[0].length,g=new Array(f),h=0;f>h;h++){for(var i=0,j=0,k=0;e>k;k++){var l=a[k][h]-d[h];i+=l*l,j+=l*l*l*l}var m=i/e,n=j/e;if(c){var o=i/(e-1),p=e*(e+1)/((e-1)*(e-2)*(e-3)),q=j/(o*o),r=(e-1)*(e-1)/((e-2)*(e-3));g[h]=p*q-3*r}else g[h]=n/(m*m)-3}return g}function i(a){for(var b=a.length,d=c(a),e=d.length,f=new Arrray(e),g=Math.sqrt(b),h=0;e>h;h++)f[h]=d[h]/g;return f}function j(a,b){return k(a,void 0,b)}function k(a,c,d){"undefined"==typeof d&&(d=0),"undefined"==typeof c&&(0===d?c=a.length-1:1===d&&(c=a[0].length-1));var e=b(a,d),f=a.length;if(0===f)return[[]];var g,h=a[0].length;if(0===d){g=new Array(h);for(var i=0;h>i;g[i++]=new Array(h));for(var i=0;h>i;i++)for(var j=i;h>j;j++){for(var k=0,l=0;f>l;l++)k+=(a[l][j]-e[j])*(a[l][i]-e[i]);k/=c,g[i][j]=k,g[j][i]=k}}else{if(1!==d)throw"Invalid dimension.";g=new Array(f);for(var i=0;f>i;g[i++]=new Array(f));for(var i=0;f>i;i++)for(var j=i;f>j;j++){for(var k=0,l=0;h>l;l++)k+=(a[j][l]-e[j])*(a[i][l]-e[i]);k/=c,g[i][j]=k,g[j][i]=k}}return g}function l(a){for(var d=b(a),e=c(a,!0,d),f=m(a,d,e),g=a.length,h=a[0].length,i=new Array(h),j=0;h>j;i[j++]=new Array(h));for(var j=0;h>j;j++)for(var k=j;h>k;k++){for(var l=0,n=0,o=f.length;o>n;n++)l+=f[n][k]*f[n][j];l/=g-1,i[j][k]=l,i[k][j]=l}return i}function m(a,d,e){return"undefined"==typeof d&&(d=b(a)),"undefined"==typeof e&&(e=c(a,!0,d)),o(n(a,d,!1),e,!0)}function n(a,c,d){"undefined"==typeof c&&(c=b(a)),"undefined"==typeof d&&(d=!1);var e=a;if(!d){var f=a.length;e=new Array(f);for(var g=0;f>g;g++)e[g]=new Array(a[g].length)}for(var g=0;f>g;g++)for(var h=e[g],i=0,j=h.length;j>i;i++)h[i]=a[g][i]-c[i];return e}function o(a,b,d){"undefined"==typeof b&&(b=c(a)),"undefined"==typeof d&&(d=!1);var e=a,f=a.length;if(!d){e=new Array(f);for(var g=0;f>g;g++)e[g]=new Array(a[g].length)}for(var g=0;f>g;g++)for(var h=e[g],i=a[g],j=0,k=h.length;k>j;j++)0===b[j]||isNaN(b[j])||(h[j]=i[j]/b[j]);return e}function p(a,c){var d=b(a),e=a.length;if(0===e)return[];for(var f=a[0].length,g=new Array(f),h=0;f>h;h++){for(var i=0,j=0,k=0,l=0;e>l;l++){var m=a[l][h]-d[h],n=c[l];i+=n*m*m,k+=n,j+=n*n}g[h]=i*(k/(k*k-j))}return g}function q(a,b,c){"undefined"==typeof c&&(c=0);var d=a.length;if(0===d)return[];var e,f=a[0].length;if(0===c){e=new Array(f);for(var g=0;f>g;e[g++]=0);for(var g=0;d>g;g++)for(var h=a[g],i=b[g],j=0;f>j;j++)e[j]+=h[j]*i}else{if(1!==c)throw"Invalid dimension.";e=new Array(d);for(var g=0;d>g;e[g++]=0);for(var j=0;d>j;j++)for(var h=a[j],i=b[j],g=0;f>g;g++)e[j]+=h[g]*i}var k=t(b);if(0!==k)for(var g=0,l=e.length;l>g;g++)e[g]/=k;return e}function r(a,b,c,d){"undefined"==typeof d&&(d=0),"undefined"==typeof c&&(c=q(a,b,d));for(var e=0,f=0,g=0,h=b.length;h>g;g++)e+=b[g],f+=b[g]*b[g];var i=e/(e*e-f);return s(a,b,c,i,d)}function s(a,b,c,d){"undefined"==typeof dimension&&(dimension=0),"undefined"==typeof c&&(c=q(a,b,dimension)),"undefined"==typeof d&&(d=1);var e=a.length;if(0===e)return[[]];var f,g=a[0].length;if(0===dimension){f=new Array(g);for(var h=0;g>h;f[h++]=new Array(g));for(var h=0;g>h;h++)for(var i=h;g>i;i++){for(var j=0,k=0;e>k;k++)j+=b[k]*(a[k][i]-c[i])*(a[k][h]-c[h]);f[h][i]=j*d,f[i][h]=j*d}}else{if(1!==dimension)throw"Invalid dimension";f=new Array(e);for(var h=0;e>h;f[h++]=new Array(e));for(var h=0;e>h;h++)for(var i=h;e>i;i++){for(var j=0,k=0;g>k;k++)j+=b[k]*(a[i][k]-c[i])*(a[h][k]-c[h]);f[h][i]=j*d,f[i][h]=j*d}}return f}function t(a){for(var b=0,c=a.length,d=0;c>d;d++)b+=a[d];return b}return{entropy:a,mean:b,standardDeviation:c,variance:d,median:e,mode:f,skewness:g,kurtosis:h,standardError:i,covariance:j,scatter:k,correlation:l,zScores:m,center:n,standardize:o,weightedVariance:p,weightedMean:q,weightedCovariance:r,weightedScatter:s}});