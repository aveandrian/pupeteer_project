const fs = require('fs');
let winningWallets, ourWallets;
try {
    const ourWalletsData = fs.readFileSync('ourWallets.csv', 'UTF-8');
    // read contents of the file
    const winningWalletsData = fs.readFileSync('results.csv', 'UTF-8');
    // split the contents by new line
    winningWallets = winningWalletsData.split(/\r?\n/);
    ourWallets = ourWalletsData.split(/\r?\n/);
    

    // print all lines
    // winningWallets.forEach((line) => {
    //     console.log(line);
    // });
} catch (err) {
    console.error(err);
}

ourWallets.forEach((line) => {
    if (winningWallets.includes(line)){
        console.log("Congrats! Wallets that won: " + line)
    }
})