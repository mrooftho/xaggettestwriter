function docBuilder(){
    return {
        generateDocumentation
    };
   function generateDocumentation(states,actions) {
        const promises = [generateStateDocumentation(states),generateActionDocumentation(actions)];
        return Promise.all(promises);
    }

    function generateStateDocumentation(states){
        return new Promise(function (resolve, reject){
            let strStates = '<h1>Configured states</h1>\n';
            for (var p in states){
                if (states.hasOwnProperty(p)) {
                    strStates = strStates + '<h2>' + p + '</h2>\n';
                    strStates = strStates + states[p].name + ': ' + states[p].description + '\n';
                    strStates = strStates + '<h3>Sub-filters</h3>\n';
                    for (var s in states[p].states){
                        if (states[p].states.hasOwnProperty(s)){
                            strStates = strStates + s + ': ' + states[p].states[s].description + '\n';
                        }
                    }
                }
            }
            let fName = './doc/states.md';
            var fs = require("fs");
            fs.writeFile(fName, strStates,  function(err) {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }
    function generateActionDocumentation(actions){
        return new Promise(function (resolve, reject){
            let strActions = '<h1>Configured actions</h1>\n';
            for (var p in actions){
                if (actions.hasOwnProperty(p)) {
                    strActions = strActions + '<h2>' + p + '</h2>\n';
                    for (var s in actions[p]){
                        if (actions[p].hasOwnProperty(s) && s != 'name'){
                            strActions = strActions + s + ': ' + actions[p][s].when + '\n';
                        }
                    }
                }
            }
            let fName = './doc/actions.md';
            var fs = require("fs");
            fs.writeFile(fName, strActions,  function(err) {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });;
    }


}
module.exports = docBuilder;