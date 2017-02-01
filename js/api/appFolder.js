
function appFolder(){
    return {
        cleanOutputFolder,
        readTestsFolder,
        cleanDocFolder,
        cleanUp
    };
    
    function cleanUp(){
        const promises = [cleanDocFolder,cleanOutputFolder];
        return Promise.all(promises);
    }

    function cleanDocFolder() {
        return new Promise(function (resolve, reject){
            var fs = require('fs');
            fs.readdir('./doc/',function(err, files){
                if (err){
                    reject(err);
                }
                files.forEach( function (file){
                    fs.unlink('./doc/' + file, function(err){
                        if (err){
                            reject(err);
                        }
                    });
                });
                resolve();
            });
        });
    }

    function cleanOutputFolder() {
        return new Promise(function (resolve, reject){
            var fs = require('fs');
            fs.readdir('./out/',function(err, files){
                if (err){
                    reject(err);
                }
                files.forEach( function (file){
                    fs.unlink('./out/' + file, function(err){
                        if (err){
                            reject(err);
                        }
                    });
                });
                resolve();
            });
        });
    }

    function readTestsFolder(){
        return new Promise(function (resolve, reject) {
           var fs = require('fs');
           fs.readdir('./cfg/tests/', function(err,files){
               let arr = [];
               files.forEach(function(element) {
                   arr.push('../cfg/tests/' + element);
               });
               
               resolve(arr);
           });
        });       
    }
}

module.exports = appFolder;