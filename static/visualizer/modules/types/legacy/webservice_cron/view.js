define(["modules/default/defaultview"],function(a){function b(){}return b.prototype=$.extend(!0,{},a,{init:function(){this.dom=$("<div></div>"),this.module.getDomContent().html(this.dom)},log:function(a,b){var c=new Date;this.dom.prepend("<div>["+c.toLocaleString()+"] - "+(a?"Ok":"Error")+"; Variable: "+b+"</div>")},blank:function(){this.domTable.empty(),this.table=null},update:{},buildElement:function(){},getDom:function(){return this.dom},typeToScreen:{}}),b});