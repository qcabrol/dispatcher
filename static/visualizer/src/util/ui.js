define(["src/util/debug"],function(){var a;return{confirm:function(b){return new Promise(function(c){a||(a=$("<div/>"),$("body").append(a)),b&&a.html(b),a.dialog({modal:!0,buttons:{Cancel:function(){c(!1),$(this).dialog("close")},Ok:function(){c(!0),$(this).dialog("close")}},close:function(){c(!1)},width:400})})}}});