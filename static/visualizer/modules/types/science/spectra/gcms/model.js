define(["modules/default/defaultmodel","src/util/datatraversing"],function(a,b){function c(){}return c.prototype=$.extend(!0,{},a,{getValue:function(){return this.dataValue},getjPath:function(a){var c=[];switch(a){default:case"annotation":this.module.view.annotations&&(c=this.module.view.annotations[0])}var d=[];return b.getJPathsFromElement(c,d),d}}),c});