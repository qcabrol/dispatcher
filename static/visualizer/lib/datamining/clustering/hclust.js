define(["./../math/comparator"],function(a){function b(b,f,g){for(var h=a(b,g),i=h.clone(),j=[],k=0,l=b.length;l>k;k++)j[k]=(new c).add(new d(b[k],k));for(;j.length>1;){var m=new c,n=e(i),o=n.row,p=n.column,q=p-1;i.removeRow(o),i.removeColumn(o),m.distance=n.v,m.addChild(j[o]).addChild(j[p]),j.splice(o,1),j.splice(q,1,m);for(var r=new Array(j.length),k=0;k<j.length;k++)k===q&&(r[k]=0),r[k]=f(m.elements,j[k].elements,h);i.setRow(q,r),i.setColumn(q,r)}return j[0]}function c(){this.elements=[],this.children=[],this.distance=0}function d(a,b){this.data=a,this.index=b}function e(a){for(var b=1/0,c={},d=0,e=a.rows;e>d;d++)for(var f=d+1,g=a.columns;g>f;f++)a[d][f]<b&&(b=a[d][f],c.row=d,c.column=f);return c.v=b,c}function f(a,b,c){for(var d=1/0,e=0,f=a.length;f>e;e++)for(var g=a[e].index,h=0,i=b.length;i>h;h++){var j=c[g][b[h].index];d>j&&(d=j)}return d}function g(a,b,c){for(var d=-1/0,e=0,f=a.length;f>e;e++)for(var g=a[e].index,h=0,i=b.length;i>h;h++){var j=c[g][b[h].index];j>d&&(d=j)}return d}function h(a,b,c){for(var d=0,e=a.length,f=b.length,g=0;e>g;g++)for(var h=a[g].index,i=0;f>i;i++)d+=c[h][b[i].index];return d/(e*f)}return c.prototype.add=function(a){return this.elements=this.elements.concat(a),this},c.prototype.addChild=function(a){return this.children.push(a),this.elements=this.elements.concat(a.elements),this},{compute:b,methods:{singleLinkage:f,completeLinkage:g,upgma:h,averageLinkage:h}}});