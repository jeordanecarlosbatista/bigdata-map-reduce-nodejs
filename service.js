const fs = require('fs')
const path = require('path')
const dirname = path.join(__dirname, './')
const dirPath = path.join(__dirname, 'data/')
const filePath = path.join(__dirname, 'data/c0001')
const filenameResult = 'autores.txt'
let listAuthors;
function applyMapReduceAuthor(author, listAuthors) {
    let listResult = []
    if(listAuthors[author]) {
        let countedNames = listAuthors[author].reduce(function (allNames, name) {
            let term = name.replace('.', '')
            if (term in allNames) {
                allNames[term]++;
            }
            else {
                allNames[term] = 1;
            }
            return allNames;
        }, {});
    
        let objResult = {}
        listAuthors = []
        keysSorted = Object.keys(countedNames).sort(function (a, b) { return countedNames[b] - countedNames[a] })
        Object.keys(countedNames).sort(function (a, b) { return countedNames[b] - countedNames[a] }).forEach(function (k) { objResult[k] = countedNames[k] })
        for (var key in objResult) {
            listResult.push({word: key, count: objResult[key]})
        }
    }
    else {
        listResult = null;
    }
    
    return listResult;
}

module.exports.applyMapReduceFiles = function () {
    return new Promise(function (resolve, reject) {
        fs.writeFile(path.join(__dirname, `./${filenameResult}`), '', function (err) {
            if (err) reject(err)
            fs.readdir(dirPath, (err, files) => {
                if (err) reject(err)
                let result = []
                let countFile = 0
                files.forEach(file => {
                    fs.readFile(`${dirPath}${file}`, { encoding: 'utf-8' }, function (err, data) {
                        if (err) reject(err)

                        countFile++
                        let lines = data.split(/\r?\n/);
                        let resultAux = lines.map(function (value, index, array) {
                            if (value) {
                                let fileds = value.split(':::')
                                let result = fileds.map(function (value, index, array) {
                                    return value.split('::')
                                })
                                return result
                            }
                        })

                        let arrayMapAux = []
                        let resultTwoAux = resultAux.map(function (value, index, array) {
                            if (value) {
                                let elemAux = value[1].map(function (valueAux, index, array) {
                                    let listObra = value[2].map(function (value, index, array) { return value.split(' ') })
                                    var listObraReduzido = listObra.reduce(function (a, b) {
                                        return a.concat(b);
                                    });
                                    return {
                                        autor: valueAux,
                                        obra: listObraReduzido
                                    }
                                })
                                return elemAux
                            }
                        })

                        let resultTwoAuxReduce = resultTwoAux.reduce(function (a, b) {
                            return a.concat(b)
                        });

                        let countedNames = resultTwoAuxReduce.reduce(function (allNames, name) {
                            if (name) {
                                if (name.autor in allNames)
                                    allNames[name.autor] = allNames[name.autor].concat(name.obra)
                                else
                                    allNames[name.autor] = name.obra
                            }
                            return allNames;
                        }, {});

                        console.log(`reading the ${file} file`);
                        for (var key in countedNames) {
                            fs.appendFileSync(path.join(__dirname, `./${filenameResult}`), `${key}:::${countedNames[key].join(' ')}\r\n`, function (err) {
                                if (err) reject(err)
                            });
                        }
                        if (countFile === files.length) {
                            resolve(1)
                        }
                    })
                })
            })
        })
    })


}

module.exports.getWordsThatMostHappenByAuthor = function (author_name) {
    return new Promise(function(resolve, reject) {
        fs.readFile(`${dirname}${filenameResult}`, { encoding: 'utf-8' }, function (err, data) {
            if (err) reject(err)
            let lines = data.split(/\r?\n/);
            let resultAux = lines.map(function (value, index, array) {
                if (value) {
                    return value.split(':::')
                }
            })
            let countedNames = resultAux.reduce(function (allNames, name) {
                if (name) {
                    if (name[0] in allNames) {
                        allNames[name[0]] = allNames[name[0]].concat(name[1].split(' '));
                    }
                    else {
                        allNames[name[0]] = name[1].split(' ');
                    }
                }
                return allNames;
            }, {});
    
            let result = applyMapReduceAuthor(author_name, countedNames)
            resolve(result)
        })
    })
   
}

