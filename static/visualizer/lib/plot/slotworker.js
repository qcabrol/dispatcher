onmessage=function(a){var b=a.data.data,c=a.data.slotNumber,d=a.data.slot,e=a.data.flip,f=a.data.max,g=a.data.min,h=d/(f-g),i=0,j=1;e&&(i=1,j=0),this.slotsData=[];for(var k=0,l=b.length;l>k;k++)for(var m=0,n=b[k].length;n>m;m+=2)slotNumber=Math.floor((b[k][m]-g)*h),this.slotsData[slotNumber]=this.slotsData[slotNumber]||{min:b[k][m+j],max:b[k][m+j],start:b[k][m+j],stop:!1,x:b[k][m+i]},this.slotsData[slotNumber].stop=b[k][m+j],this.slotsData[slotNumber].min=Math.min(b[k][m+j],this.slotsData[slotNumber].min),this.slotsData[slotNumber].max=Math.max(b[k][m+j],this.slotsData[slotNumber].max);postMessage({slotNumber:c,slot:d,data:this.slotsData})};