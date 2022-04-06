const fs = require('fs');
const readline = require('readline');


let parsedLineData:string[], ourWallets;
try {
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream('accounts.txt')
      });
      
      lineReader.on('line', function (line:string) {
        parsedLineData = line.split(':');

        try {
            fs.writeFileSync('./names.csv', parsedLineData[0]+"\n",{ flag: 'a+' })
            fs.writeFileSync('./cookie.csv',  parsedLineData[6] +"\n",{ flag: 'a+' })
            fs.writeFileSync('./useragent.csv', parsedLineData[5]+"\n",{ flag: 'a+' })
            //file written successfully
          } catch (err) {
            console.error(err)
          }
          
        // console.log('Line from file:', line);
      });

    // const rawData = fs.readFileSync('accounts.txt', 'UTF-8');
    // parsedData = rawData.split(':');
    // console.log(parsedData);
    // // const ourWalletsData = fs.readFileSync('ourWallets.csv', 'UTF-8');
    // // read contents of the file
    // const winningWalletsData = fs.readFileSync('results.csv', 'UTF-8');
    // // split the contents by new line
    // winningWallets = winningWalletsData.split(/\r?\n/);
    // ourWallets = ourWalletsData.split(/\r?\n/);
    

    // print all lines
    // winningWallets.forEach((line) => {
    //     console.log(line);
    // });
} catch (err) {
    console.error(err);
}

// ourWallets.forEach((line) => {
//     if (winningWallets.includes(line)){
//         console.log("Congrats! Wallets that won: " + line)
//     }
// })