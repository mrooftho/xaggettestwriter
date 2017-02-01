function xaggetBuilder(){
    return {
        createXaggetRepo
    };
   function createXaggetRepo(actions,states,test) {
       let xagget = {};
       xagget.repo = test.name;
       xagget.info = '';
       xagget.testlist = [];
       test.teststeps.forEach(function(step) {
           xagget.testlist.push(createXaggetTeststep(actions,states,test,step));
       });
       return xagget;
    }

    function createXaggetTeststep(actions,states,test,step){
        let xaggetStep = {};
        xaggetStep.name = getTeststepName(test,step);
        xaggetStep.weight = getTeststepWeight(test,step);
        xaggetStep.description = getTeststepDescription(step,states,actions);
        xaggetStep.tags = test.tags;
        xaggetStep.metadata = {};
        xaggetStep.metadata.author = getCurrentUsername();
        xaggetStep.metadata.story = test.reference;
        xaggetStep.metadata.bug = getBugIdentification(test,step);
        xaggetStep.metadata.sourceScreen = getSourceScreen(step,states);
        xaggetStep.metadata.targetScreen = getTargetScreen(step,states);
        xaggetStep.metadata.buttons = '';
        xaggetStep.metadata.testStepType = '';
        xaggetStep.loadstate = getLoadstate(step,states);
        xaggetStep.requirements = extractXaggetCheckList(step.given,states,'initialState');
        xaggetStep.actions = extractXaggetActionsList(step,actions)
        xaggetStep.checks = extractXaggetCheckList(step.then,states,'currentState');
        return xaggetStep;
    }

    function extractXaggetCheckList(locator,states,stateType){
        let stateList = extractStateList(locator,states);
        let reqList = [];
        stateList.forEach(function(e) {
           e.criteria.forEach(function(c){
                let rq = c.replace('state.', stateType + '.');
                if (!reqList.includes(rq)){
                    reqList.push(rq);
                }                
           });
        });
        return reqList;
    }

    function extractStateList(loc,states){
        const strBuilder = require('../api/stringBuilder');
        let stateLocators = strBuilder().statePathToJsonLocators(loc);
        let rArr = [];
        stateLocators.forEach(function(locator) {
           let state =  eval(locator);
           rArr.push(state);
        });
        return rArr;
    }

    function extractActionList(loc,actions){
        const strBuilder = require('../api/stringBuilder');
        let actionLocators = strBuilder().actionPathToJsonLocators(loc);
        let rArr = [];
        actionLocators.forEach(function(locator) {
           let act =  eval(locator);
           rArr.push(act);
        });
        return rArr;
    }

    
    function extractXaggetActionsList(step,actions){
        let actionList = extractActionList(step.when,actions);
        
        let rList = [];
        actionList.forEach(function(e) {
           e.actions.forEach(function(c){
                rList.push(c);
           });
        });
        return rList;
    }


    function getCurrentUsername(){
        var path = require('path');
        var y =process.env['USERPROFILE'];
        var userName = process.env['USERPROFILE'].split(path.sep)[2];
        return userName;
    }

    function getTeststepName(test,step){
        return test.name + ': ' + step.name;
    }

    function getTeststepDescription(step,states,actions){
        let rStr = '';
        //'Given ... AND ...'
        let givenStateMeta = getStateName(step.given,states);
        let givenList = extractStateList(step.given,states);
        let givenDescription = '';
        if (givenStateMeta.name != ''){
            givenDescription = 'Given ' + givenStateMeta.description;
            let f = true;
            givenList.forEach(function(e) {
                if (f){
                    f = false;
                    givenDescription = givenDescription + ' ' + e.description;                
                } else {
                    givenDescription = givenDescription + ' AND ' + e.description;                
                }
            });
            rStr = givenDescription;
        }
        //'When ... AND ...'
        let whenDescription = '';
        let whenList = extractActionList(step.when,actions);        
        if (whenList.length > 0){
            let f = true;            
            whenList.forEach(function(e) {
                if (f){
                    f = false;
                    whenDescription = 'When ' + e.when;
                } else {
                    whenDescription =  whenDescription + ' AND ' + e.when;
                    
                }
            });
            if (rStr != ''){
                rStr = rStr + '\N';    
            }
            rStr = rStr  + whenDescription; 
        }
        //'Then ... AND ...'
        let thenStateMeta = getStateName(step.then,states);
        let thenList = extractStateList(step.then,states);
        let thenDescription = '';
        if (thenStateMeta.name != ''){
            thenDescription = 'Then ' + thenStateMeta.description;
            let f = true;
            thenList.forEach(function(e) {
                if (f){
                    f = false;
                    thenDescription = thenDescription + ' ' + e.description;                
                } else {
                    thenDescription = thenDescription + ' AND ' + e.description;                
                }
            });
            if (rStr != ''){
                rStr = rStr + '\N';    
            }
            rStr = rStr  + thenDescription;
        }
        return rStr;
    }

    function getTeststepWeight(test,step){
        if (step.weight){
            return step.weight;
        }
        if (test.weight){
            return test.weight;        
        }
        return 10;
    }

    function getSourceScreen(step,states){
        return getStateName(step.given,states).description;
    }

    function getTargetScreen(step,states){
        return getStateName(step.then,states).description;
    }    

    function getStateName(locator,states){
        const strBuilder = require('../api/stringBuilder');
        let rObj = {};
        rObj.name = '';
        rObj.description = '';
        let stateName = strBuilder().stateNameFromPath(locator);
        if (stateName){
            rObj.name = stateName;
            if (stateName != ''){
                rObj.description = states[stateName].description;
            }
        }
        return rObj;
    }

    function getBugIdentification(test,step){
        if (step.bug){
            return step.bug;
        }
        if (test.bug){
            return test.bug;        
        }
        return '';
    }

    function getLoadstate(step,states){
        let rArr = [];
        let items = []; 
        let x = extractXaggetCheckList(step.given,states,'state');
        x.forEach(function(element) {
            items.push(element);   
        });
        x = extractXaggetCheckList(step.then,states,'state');
        x.forEach(function(element) {
            items.push(element);   
        });
        items.forEach(function(e) {
            let item = extractStateObjectCollection(e);
            if (item){
                if (!rArr.includes(item)){
                    rArr.push(item);
                }
            }
        });

        return rArr;
    }

    function extractStateObjectCollection(item){
        //"readUI([{item:'channelbar.channelnumber',check:{read: state.channelInfo.channelLineUp.lastChannel.channelNumber}}])"
        if (item.includes('state.')){
            let t = item.split('state.');
            t = t[1].split('.');
            return t[0];
        }
        return null;
    }



}
module.exports = xaggetBuilder;