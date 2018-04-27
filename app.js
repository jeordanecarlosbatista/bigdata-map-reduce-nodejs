const readline = require('readline');
const service = require('./service');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Start application with ENTER', async (answer) => {

    // apply mapreduce to all files in the date directory
    console.log('Starting to read files...')
    let result = await service.applyMapReduceFiles()
    console.log('Completed!')
    rl.close();

    const rl2 = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl2.question('The two words that repeat the most for the author:', async (authorname) => {
        let result = await service.getWordsThatMostHappenByAuthor(authorname)
        if (result) {
            console.log('Author Name: ' + authorname)
            console.log('1º: ' + result[0].count + ' ' + result[0].word)
            console.log('2º: ' + result[1].count + ' ' + result[1].word)
        }
        else {
            console.log('Author ' + authorname +  ' not found')
        }
        rl2.close();
        recursiveAsyncReadLine()
    })

});

var recursiveAsyncReadLine = function () {
    const rl2 = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl2.question('The two words that repeat the most for the author:', async (authorname) => {
        let result = await service.getWordsThatMostHappenByAuthor(authorname)
        if (result) {
            console.log('Author Name: ' + authorname)
            console.log('1º: ' + result[0].count + ' ' + result[0].word)
            console.log('2º: ' + result[1].count + ' ' + result[1].word)
        }
        else {
            console.log('Author ' + authorname +  ' not found')
        }
        rl2.close();
        recursiveAsyncReadLine();
    })
};

