
const puppeteer = require('puppeteer-core');
const https = require('https');
const axios = require('axios');

const fs = require('fs');
const creds = require('./namesList2');
const ourWallet = require('./ourWallets');
const { addAbortSignal } = require('stream');

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

const refLink = 'https://nftpad.fi/pool/deadknight';

let captchaSolvedTimes = 0;
let maxCaptchaSolvedTimes = 1;
const firstMethodId = '#em6125606';
const nameSelector = " input[name='name']";
const emailSelector =  " input[name='email']";
const walletSelector = " input[name='bep20_address']";
const telegramSelector = " input[name='your_telegram']";



(async () => {

    console.log(antyUsername);

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

        let wallletInput;
        try{
            wallletInput = await page.waitForSelector("div>input[type='search']")
        }catch(e){
            console.log(e);
        }
        if(wallletInput!=null){
            for(i=0;i<ourWallets.length;i++){

                await clear(page, "div>input[type='search']");
                blockingWait(0.5);

                await page.type("div>input[type='search']", ourWallets[i]);
                blockingWait(0.5);

                let wlList;
                let isWl;
                try{
                    wlList = await page.waitForSelector("div.overflow-scroll > div");
                }catch(e){
                    console.log(e);
                }
                if(wlList!=null)
                    isWl = await (await wlList.getProperty('innerText')).jsonValue();
                
                blockingWait(0.5);

                if(isWl != "Not whitelisted")
                    console.log(ourWallets[i]);
            
        }
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


  function somethn(){

  }
  somtins4 = () =>{

  }
  someting3 = () => addAbortSignal;

//   something2 = (){
//       asfsddf=1
//   }