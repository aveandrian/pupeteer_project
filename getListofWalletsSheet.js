
const puppeteer = require('puppeteer-core');
const https = require('https');
const axios = require('axios');

const fs = require('fs');
const creds = require('./namesList2');

const wallets = require('./ourWallets2')

const methods = [
    'refer', //twitterFollow
    'refer', //twitterFollow
    'refer', //twitterFollow
    'telegramFollow',
    'telegramFollow',
    'telegramFollow',
    'telegramFollow',
    'telegramFollow',
    'refer'
];

const refLink = 'https://docs.google.com/spreadsheets/d/1a7qnjtl3Z_f2soyMkJgdmkfCGK5usFtwq7Xc_q2RFmE/edit#gid=0';

let captchaSolvedTimes = 0;
let maxCaptchaSolvedTimes = 1;
const firstMethodId = '#em6125606';
const nameSelector = " input[name='name']";
const emailSelector =  " input[name='email']";
const walletSelector = " input[name='bep20_address']";
const telegramSelector = " input[name='your_telegram']";



(async () => {

    console.log(antyUsername);
    // console.log(wallets)
    // console.log(ourWallets)

    const { data } = await axios.post('https://anty-api.com/auth/login', {
        username: antyUsername,
        password: antyPassword
    })
    console.log(data);

    var ids = [];


    await axios.get('https://anty-api.com/browser_profiles', {headers: {
        'Authorization': 'Bearer ' + data.token,
    }})
    .then(response => {
        for(i=0; i<(response.data.data).length; i++ ){
            ids.push(response.data.data[i].id); 
        }

        console.log(ids);
    })


    var port;
    var wsEndpoint;

    for (i=0; i<1; i++){

        captchaSolvedTimes = 0;

        await axios.get('http://localhost:3001/v1.0/browser_profiles/'+ ids[i]+'/start?automation=1', {headers: {
        'Authorization': 'Bearer ' + data.token,
        }})
        .then(response => {

        port = response.data.automation.port; 
        wsEndpoint = response.data.automation.wsEndpoint;   
        })


        const browser = await puppeteer.connect({
        browserWSEndpoint: `ws://127.0.0.1:${port}${wsEndpoint}`
        });
        

        
      
        const page = await browser.newPage();
        await page.goto(refLink, {waitUntil: 'load', timeout: 0});

        page.on('dialog', async (dialog) => {
            console.log(dialog.message());
            await dialog.dismiss();
        });

        page.bringToFront();

        
        for(i=0;i<ourWallets.length;i++){
            const wallNumber = ourWallets[i];
            const found = (await page.content()).match(/thank/gi)
            // const finding = await page.evaluate((wallNumber) => await window.find(wallNumber), wallNumber);
            if(finding!=null)
                console.log(ourWallets[i])

            blockingWait(0.5)
            
        }
    


        
        // const methodsId = await page.evaluate(
        //     () => Array.from(
        //       document.querySelectorAll('.RowInfo_node__3kZFW a'),
        //       a => a.getProperty('innerText')
        //     )
        //   );
        // console.log(methodsId)
        await browser.close();

    }

    //switch tabs here
    // await page1.bringToFront();

    

//    // НЕПОСРЕДСТВЕННО ПОДКЛЮЧЕНИЕ
//    const browser = await chromium.connectOverCDP(`ws://127.0.0.1:${port}${wsEndpoint}`);

//    // С ЭТОГО МОМЕНТ АВТОМАТИЗИРУЕМ, ЧТО ХОТИМ
//    // НАПРИМЕР, СНИМАЕМ СКРИНШОТ С ГУГЛА
//     await browser.goto('https://wn.nr/zjxGDL');
// //    await page.screenshot({path: 'google.png'});
// //    await browser.close();


})();

async function blockingWait(seconds) {
    //simple blocking technique (wait...)
    var waitTill = new Date(new Date().getTime() + seconds * 1000);
    while(waitTill > new Date()){}

}

async function clear(page, selector) {
    await page.evaluate(selector => {
      document.querySelector(selector).value = "";
    }, selector);
  }