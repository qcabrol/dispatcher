define(["modules/types/client_interaction/code_editor/controller","src/util/debug"],function(CodeEditor,Debug){function controller(){}function getRequireStart(a){var b="( [ 'src/util/api'",c="function( API";if(a)for(var d=0;d<a.length;d++){var e=a[d];e.lib&&(b+=", '"+e.lib+"'",c+=", "+(e.alias||"required_anonymous_"+d))}return b+" ], "+c+" ){"}return controller.prototype=Object.create(CodeEditor.prototype),controller.prototype.moduleInformation={moduleName:"Script editor",description:"Write code for a filter and test it in real time",author:"Michaël Zasso",date:"04.02.2014",license:"MIT"},controller.prototype.references.dataobject={label:"Object to filter"},controller.prototype.references.filteredObject={label:"Filtered object"},controller.prototype.events={onButtonClick:{label:"Button was clicked / Incoming variable",refVariable:["filteredObject"]}},controller.prototype.variablesIn=["dataobject"],controller.prototype.actionsIn.doFilter="Trigger the filter",controller.prototype.configurationStructure=function(){return{groups:{group:{options:{type:"list"},fields:{script:{type:"jscode",title:"Code","default":"//When the result is ready, use resolve(result) to send it.\n//In case of an error, use reject(error)\nresolve(value);"}}},libs:{options:{type:"table",multiple:"true"},fields:{lib:{type:"text",title:"url"},alias:{type:"text",title:"alias"}}}}}},controller.prototype.configAliases={script:["groups","group",0,"script",0],libs:["groups","libs",0]},controller.prototype.onButtonClick=function(a,b){var c=this,d=this.executeFilter(a,b);d.then(function(a){"undefined"!=typeof a&&c.createDataFromEvent("onButtonClick","filteredObject",a)},function(a){console.error("Filter execution error : ",a)})},controller.prototype.executeFilter=function(filter,object){var neededLibs=this.module.getConfiguration("libs"),requireStart="require"+getRequireStart(neededLibs),requireBody="(function(value, resolve, reject){"+filter+"\n})(object, resolve, reject);",requireEnd="});",prom=new Promise(function(resolve,reject){eval(""+requireStart+requireBody+requireEnd)});return prom},controller.prototype.export=function(){var a=this.module.getConfiguration("libs"),b="define"+getRequireStart(a)+"\n    return {\n    filter: ",c="function( value, resolve, reject ) {\n            "+this.module.getConfiguration("script").replace(/(\r\n|\r|\n)/g,"\n            ")+"\n        }\n    };",d="\n});";return b+c+d},controller});