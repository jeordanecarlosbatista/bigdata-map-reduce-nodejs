const fs = require('fs')
const path = require('path')
const dirname = path.join(__dirname, './')
const dirPath = path.join(__dirname, 'data/')
const filePath = path.join(__dirname, 'data/c0001')
const filenameResult = 'autores.txt'
let listAuthors;

let allStopWords = ['about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could', 'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is', 'isnt', 'it', 'its', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours ', 'ourselves', 'out', 'over', 'own', 'same', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that', 'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasnt', 'we', 'wed', 'well', 'were', 'weve', 'were', 'werent', 'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which', 'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll', 'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves']

function applyMapReduceAuthor(author, listAuthors) {
    let listResult = []
    if (listAuthors[author]) {
        let countedNames = listAuthors[author].filter(function (item) {
            let found = allStopWords.findIndex(function (elem, index) { return elem === item })
            return found === -1

        }).reduce(function (allNames, name) {
            let term = name.replace('.', '')
            if (term in allNames) {
                allNames[term]++;
            }
            else {
                allNames[term] = 1;
            }
            return allNames;
        }, {})

        let objResult = {}
        listAuthors = []
        keysSorted = Object.keys(countedNames).sort(function (a, b) { return countedNames[b] - countedNames[a] })
        Object.keys(countedNames).sort(function (a, b) { return countedNames[b] - countedNames[a] }).forEach(function (k) { objResult[k] = countedNames[k] })
        for (var key in objResult) {
            listResult.push({ word: key, count: objResult[key] })
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
    return new Promise(function (resolve, reject) {
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

