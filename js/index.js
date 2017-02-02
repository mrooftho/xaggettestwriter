//dependancies
var requireDir = require('require-dir');
const strBuilder = require('./api/stringBuilder');
const appFs = require('./api/appFolder');
const xaggetBuilder = require('./api/xaggetBuilder');
const docBuilder = require('./api/docBuilder');
const jsonfile = require('jsonfile');
//clean xagget folder
appFs().cleanUp().then(function(){
    //load actions
    const actions = requireDir('../cfg/actions');
    //>  actions.remote["arrowDownInApp"].when;
    //load states
    const states = requireDir('../cfg/states');
    //for each test
    appFs().readTestsFolder().then(function(result){
        result.forEach(function(test) {
            let xaggetRepo = xaggetBuilder().createXaggetRepo(actions,states,require(test));
            //Save repo
            let filePath = './out/' + xaggetRepo.repo.replace(' ','_').toLowerCase() + '.json';
            jsonfile.writeFileSync(filePath, xaggetRepo, {spaces: 2});
            return;
        });
    });
    //states & actions documentation
    docBuilder().generateDocumentation(states,actions).then(function(result){
        return;
    });
});