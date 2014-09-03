define(["modules/default/defaultcontroller"],function(a){function b(){}return b.prototype=$.extend(!0,{},a),b.prototype.moduleInformation={moduleName:"Hashmap display",description:"Displays a json element in a list",author:"Norman Pellet",date:"28.12.2013",license:"MIT",cssClass:"hashmap"},b.prototype.references={hashmap:{label:"Flat json object",type:"object"}},b.prototype.events={},b.prototype.variablesIn=["hashmap"],b.prototype.actionsIn={},b.prototype.configurationStructure=function(){var a=this.module.model.getjPath("hashmap");return{groups:{group:{options:{type:"list"},fields:{hideemptylines:{type:"checkbox",title:"Hide empty lines",options:{hide:"Hide empty lines"}}}},keys:{options:{type:"table",multiple:!0,title:"Fields to display"},fields:{jpath:{type:"combo",title:"J-Path",options:a},label:{type:"text",title:"Label"},printf:{type:"text",title:"printf"}}}}}},b.prototype.configAliases={keys:["groups","keys",0],hideemptylines:["groups","group",0,"hideemptylines",0]},b.prototype.configFunctions={hideemptylines:function(a){return"hide"==a[0]}},b});