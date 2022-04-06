
import Inputs from "./entriesMethods/inputs";
import Utils from "./entriesMethods/utils";
import { Puppeteer } from "puppeteer-core";
import ConfirmEntry from "./entriesMethods/confirmEntry";
import Follow from "./entriesMethods/follow";
import Reg from "./entriesMethods/registration";
import TwitterTweet from "./entriesMethods/twitterTweet";
import namesList from "./namesLists/3";

const puppeteer = require('puppeteer-core');
const axios = require('axios').default;

const creds = new namesList();
const utils = new Utils();
const folow = new Follow();
const confirmEntry = new ConfirmEntry();

const regMethodId = 0;

const methods = [
    'twitterFollow', //'twitterFollow',
    'twitterFollow', //'twitterFollow',
    'telegramFollow',
    'telegramFollow',
    'telegramFollow',
    'refer'
];

const refLink = 'https://wn.nr/qkwhHf';

utils.setCaptchaSolvedTimes(0);
utils.setMaxCaptchaSolvedTimes(1);



const selectors = {
    firstMethodId: '#em6125606',
    nameSelector: " input[name='name']",
    emailSelector:  " input[name='email']",
    walletSelector: " input[name='field_2h333936w1u1x28191e1cw2f2p30302t38w1t2s2s362t3737']",
    telegramSelector: " input[name='your_telegram']",
};


(async () => {

    console.log(creds.antyUsername);

    const { data } = await axios.post('https://anty-api.com/auth/login', {
        username: creds.antyUsername,
        password: creds.antyPassword
    })
    console.log(data);

    var ids: number[] = [];


    await axios.get('https://anty-api.com/browser_profiles', {headers: {
        'Authorization': 'Bearer ' + data.token,
    }})
    .then(function(response:any) {
        for(let i=0; i<(response.data.data).length; i++ ){
            ids.push(response.data.data[i].id); 
        }
        console.log(ids);
    })


    var port;
    var wsEndpoint;

    for (let i=0; i<ids.length; i++){

        utils.setCaptchaSolvedTimes(0);

        await Utils.retry(async () => await axios.get('http://localhost:3001/v1.0/browser_profiles/'+ ids[i]+'/start?automation=1', {headers: {
        'Authorization': 'Bearer ' + data.token,
        }})
        .then(function(response:any) {

            port = response.data.automation.port; 
            wsEndpoint = response.data.automation.wsEndpoint;   
        }),1000);


        const browser = await puppeteer.connect({
        browserWSEndpoint: `ws://127.0.0.1:${port}${wsEndpoint}`
        });
        
        const page = await browser.newPage();
        await Utils.retry(async () => await page.goto(refLink, {waitUntil: 'load', timeout: 0}),1000);

        page.on('dialog', async (dialog:any) => {
            console.log(dialog.message());
            await dialog.dismiss();
        });

        page.bringToFront();


        const methodsId = await page.evaluate(
            () => Array.from(
              document.querySelectorAll('div[class*="entry-method"]'),
              a => '#' + a.getAttribute('id')
            )
          );
        console.log(methodsId)


        //Рега
        const classesRegs = await page.evaluate(
            () => Array.from(
              document.querySelectorAll('form[name="contestantForm"]'),
              function(a){ 
                  if(a != null) {
                    var classes:string|null = a.getAttribute('class');
                    console.log(classes);
                    if(classes!=null)
                        classes.split(" ");
                  }
                }
            )
          );
        console.log(classesRegs)

        await Utils.blockingWait(2);

        if(classesRegs.length > 1){
            console.log("registration")
            await Reg.registration(page, methodsId[regMethodId], i, creds, selectors); 
        }
        

        await Utils.blockingWait(2);

        for(let j=0;j<methodsId.length;j++){
            if(methods[j] == 'refer')
                continue;
            console.log(methodsId[j]);
            let classes = await Utils.getClasses(page,'div' + methodsId[j])
            console.log(classes[0].includes('completed-entry-method'));
            if(!classes[0].includes('completed-entry-method')){ 
                if(methods[j] == "twitterFollow"){
                    try{
                        await folow.twitter(page, browser, methodsId[j]);
                    }catch(e){
                        console.log(e)
                    }
                }
                else if(methods[j] == "twitterRetweet"){
                    try{
                        
                        await folow.twitter(page, browser, methodsId[j]);
                    }catch(e){console.log(e)}
                }
                else if(methods[j] == "telegramFollow"){
                    try{
                        await folow.telegram(page, methodsId[j], i, creds);
                    }catch(e){console.log(e)}
                }
                else if(methods[j] == "twitterTwit"){
                    try{
                        await TwitterTweet.twitterTweet(page, browser, methodsId[j]);
                    }catch(e){}
                } else if(methods[j] == "walletInput"){
                    try{
                        await Inputs.wallet(page, browser, methodsId[j], i,creds);
                    }catch(e){console.log(e)}
                }else if(methods[j] == "confirmEntry"){
                    try{
                        await confirmEntry.entry(page, browser, methodsId[j]);
                    }catch(e){console.log(e)}
                }else if(methods[j] == "telegramInput"){
                    try{
                        await Inputs.telegram(page, browser, methodsId[j], i, creds);
                }catch(e){console.log(e)}
                }else if(methods[j] == "emailInput"){
                    try{
                        await Inputs.email(page, browser, methodsId[j], i, creds);
                    }catch(e){console.log(e)}
                }
                await Utils.blockingWait(1);
            }
        }


        let canCloseBrowser = true;
        for(let j=0;j<methodsId.length;j++){
            if(methods[j] != 'refer' && methods[j] !=  'discord'){
                let classesCheckAfter:any;
                try{ classesCheckAfter = await Utils.getClasses(page,'div' + methodsId[j]); }
                catch(e){}

                if(!classesCheckAfter[0].includes('completed-entry-method')){
                    canCloseBrowser = false;
                } 
            }

        }
        await Utils.blockingWait(1);
        console.log("Can close browser: ", canCloseBrowser);

        if(canCloseBrowser){
            try{
                const pageList = await browser.pages();    
                console.log("NUMBER TABS:", pageList.length);
                
                for(let f=0;f<pageList.length;f++){
                    try{
                        await pageList[f].close();
                    }catch(e){
                        console.log(e)
                    }
                }
                try{
                    await browser.close();
                }catch(e){
                    console.log(e)
                }
            }
            catch(e){
                console.log(e)
            }
        }  

    }

    //switch tabs here
    // await page1.bringToFront();

    //   await browser.close();

//    // НЕПОСРЕДСТВЕННО ПОДКЛЮЧЕНИЕ
//    const browser = await chromium.connectOverCDP(`ws://127.0.0.1:${port}${wsEndpoint}`);

//    // С ЭТОГО МОМЕНТ АВТОМАТИЗИРУЕМ, ЧТО ХОТИМ
//    // НАПРИМЕР, СНИМАЕМ СКРИНШОТ С ГУГЛА
//     await browser.goto('https://wn.nr/zjxGDL');
// //    await page.screenshot({path: 'google.png'});
// //    await browser.close();


})();








