define(["modules/default/defaultcontroller"],function(a){function b(){}return b.prototype=$.extend(!0,{},a),b.prototype.moduleInformation={moduleName:"Two dimensional list",description:"Display an array of data in 2 dimensions using a table",author:"Norman Pellet",date:"24.12.2013",license:"MIT"},b.prototype.references={cell:{label:"Data of the cell",type:"object"},list:{label:"The array of data to display",type:"array"}},b.prototype.events={onHover:{label:"Hovers a cell",refVariable:["cell"],refAction:["cell"]}},b.prototype.variablesIn=["list"],b.prototype.actionsIn={addElement:"Add an element"},b.prototype.configurationStructure=function(){return{groups:{group:{options:{type:"list"},fields:{fileuploadurl:{type:"text",title:"Upload URL"}}}}}},b.prototype.configAliases={fileuploadurl:["groups","group",0,"fileuploadurl",0]},b});