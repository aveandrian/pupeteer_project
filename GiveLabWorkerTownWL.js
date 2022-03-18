
const puppeteer = require('puppeteer-core');
const https = require('https');
const axios = require('axios');

const creds = require('./namesList2');

const methods = [
    'walletInput', //'twitterFollow',
    'refer', //'twitterFollow',
    'refer', //'twitterFollow',
    'refer', //'twitterFollow',
    'refer',
    'refer',
    'refer',
    'refer', //'twitterFollow',
    'refer', //'twitterFollow',
    'refer', //'twitterFollow',
    'refer',
    'refer',
];

const refLink = 'https://giv.gg/r/9GpJlH-zMI0GR';

let captchaSolvedTimes = 0;
let maxCaptchaSolvedTimes = 1;
const firstMethodId = '#em6125606';
const firstNameSelector = "#first_name";
const lastNameSelector = "#last_name";
const emailSelector =  " input[name='email']";
const walletSelector = " input[name='field_2h333936w1u1x28191e1cw2f2p30302t38w1t2s2s362t3737']";
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

    for (i=0; i<ids.length; i++){

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


        //Рега
        const classesRegs = await page.evaluate(
            () => Array.from(
              document.querySelectorAll('span.entry'),
              a => a.getAttribute('data-sid')
            )
          );
        console.log(classesRegs)

        
        await blockingWait(1);

        if(classesRegs[0] == 'auth'){
            console.log("registration")
            await registration(page, browser,i); 
        }

        const stepsArray = await page.evaluate(
            () => Array.from(
              document.querySelectorAll('div.step'),
              a => a.getAttribute('class')
            )
          );
        console.log(stepsArray)

        const methodsId = await page.evaluate(
            () => Array.from(
              document.querySelectorAll('span.entry'),
              a => a.getAttribute('data-pid')
            )
          );
        console.log(methodsId)
        

        await blockingWait(2);

        for(let j=0;j<stepsArray.length;j++){
            if(methods[j] == 'refer')
                continue;
            console.log(methodsId[j]);
            // let classes = await getClasses(page,'span[data-pid=\'' + methodsId[j]+'\']');
            // console.log(classes[0].includes('completed-entry-method'));
            if(!stepsArray[j].includes('finished')){ 
                if(methods[j] == "twitterFollow"){
                    try{
                        await twitterFollow(page, browser, methodsId[j]);
                    }catch(e){}
                }
                else if(methods[j] == "twitterRetweet"){
                    try{
                        await twitterFollow(page, browser, methodsId[j]);
                    }catch(e){}
                }
                else if(methods[j] == "telegramFollow"){
                    try{
                        await telegramFollow(page, methodsId[j]);
                    }catch(e){}
                }
                else if(methods[j] == "twitterTwit"){
                    try{
                        await twitterTweet(page, browser, methodsId[j]);
                    }catch(e){}
                } else if(methods[j] == "walletInput"){
                    try{
                        await inputWallet(page, browser, methodsId[j]);
                    }catch(e){}
                }else if(methods[j] == "confirmEntry"){
                    try{
                        await confirmEntry(page, browser, methodsId[j]);
                    }catch(e){}
                }else if(methods[j] == "telegramInput"){
                    try{
                        await telegramInput(page, browser, methodsId[j]);
                }catch(e){}
                }else if(methods[j] == "emailInput"){
                    try{
                        await inputEmail(page, browser, methodsId[j]);
                    }catch(e){}
                }
                await blockingWait(1);
            }
        }

        const stepsArray2 = await page.evaluate(
            () => Array.from(
              document.querySelectorAll('div.step'),
              a => a.getAttribute('class')
            )
          );
        console.log(stepsArray2)

        let canCloseBrowser = true;
        for(let j=0;j<stepsArray2.length;j++){
            if(methods[j] != 'refer' && methods[j] !=  'discord'){
                // let classesCheckAfter;
                // try{ classesCheckAfter = await getClasses(page,'div' + methodsId[j]); }
                // catch(e){}

                if(!stepsArray2[j].includes('finished')){
                    canCloseBrowser = false;
                } 
            }

        }


        

        await blockingWait(1);
        console.log("Can close browser: ", canCloseBrowser);

        if(canCloseBrowser){
            try{
                const pageList = await browser.pages();    
                console.log("NUMBER TABS:", pageList.length);
                
                for(let f=0;f<pageList.length;f++){
                    try{
                        await pageList[f].close();
                    }catch(e){}
                }
                try{
                    await browser.close();
                }catch(e){}
            }
            catch(e){}
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


async function checkForCaptcha(page){
    console.log('checkForCaptcha');

    let captcha;
    let captchaSolveButton;
    let captchaSolveButton2;

    if(captchaSolvedTimes >= maxCaptchaSolvedTimes)
        return;
    let isSolved = false;
   
        try {
            captchaSolveButton = await page.waitForSelector(".captcha-solver", {timeout:2000});
        } catch(e){}
   
        if (captchaSolveButton != null){
            await captchaSolveButton.click();
            console.log("Solving....");
            while(!isSolved){
                try{
                    captchaSolveButton2 = await page.waitForSelector(".captcha-solver", {timeout:1000});
                }catch(e){}
                if (captchaSolveButton2 != null){
                    
                    console.log("Solving....");
                    captchaSolveButton2 = null;
                    await blockingWait(1)
                }
                else {
                    isSolved = true;
                    captchaSolvedTimes+=1;
                    console.log("Solved " + captchaSolvedTimes + " times");
                }
            }
            await blockingWait(2);
        }
        else {
            console.log('.captcha-solver not found');
        }
}


async function confirmEntry(page, browser, methodId){
    console.log("confirm entry");
    const firstMethod = await page.waitForSelector(methodId, {timeout:1000});
    await firstMethod.click()
    await checkForCaptcha(page)
    await blockingWait(1);

}
async function telegramInput(page, browser, methodId){
    console.log("Telegram input");
    const firstMethod = await page.waitForSelector(methodId, {timeout:1000});
    await firstMethod.click()

    await blockingWait(1);
    
    await checkForCaptcha(page);
    await blockingWait(1);


    const walletNameField = await page.waitForSelector(methodId + 'Details', {visible:true});
    await page.type(methodId + 'Details', telegramsList[i]);

    await blockingWait(1);

    const continueButton = await page.waitForSelector(methodId +' .btn-primary', {visible:true});
    await continueButton.click();
    
    await blockingWait(1);

    await checkForCaptcha(page)

    await blockingWait(1);
}

async function inputEmail(page, browser, methodId){
    console.log("Email input");
    const firstMethod = await page.waitForSelector(methodId, {timeout:1000});
    await firstMethod.click()
    
    await checkForCaptcha(page);
    await blockingWait(1);


    const walletNameField = await page.waitForSelector(methodId + 'Details', {visible:true});
    await page.type(methodId + 'Details', emailsList[i]);

    await blockingWait(1);

    const continueButton = await page.waitForSelector(methodId +' .btn-primary', {visible:true});
    await continueButton.click();

    await checkForCaptcha(page);
    
    await blockingWait(1);
}

async function inputWallet(page, browser, methodId){
    console.log("Wallet input");

    let firstMethod;
    try{
        
        firstMethod = await page.waitForSelector('span[data-pid=\'' + methodId+'\']', {timeout:1000});
    }catch(e){}
    if(firstMethod != null)
        await firstMethod.click()
    
    // await checkForCaptcha(page);
    await blockingWait(1);

    let walletNameField;
    try{
     walletNameField = await page.waitForSelector('input[placeholder="Enter your address"]', {visible:true});
    }catch(e){}
    if(walletNameField!=null)
        await page.type('input[placeholder="Enter your address"]', walletsList[i]);

    await blockingWait(1);

    let continueButton;
    try{
        continueButton = await page.waitForSelector('body > section > div.bg-image > div > div > div.left-col > div.entries-container.is-open > div.embed.text-center > button', {visible:true});
    }catch(e){}
    if(continueButton!=null)
        await continueButton.click();

    await blockingWait(1);

    // await checkForCaptcha(page);
    
    await blockingWait(1);
}

async function getClasses(page, selector){
    let classesRegs = await page.evaluate(
        (selector) => Array.from(
          document.querySelectorAll(selector),
          a =>  a.getAttribute('class').split(" ")
        ), selector);
    console.log(classesRegs)
    return classesRegs;
}

function twitterRetweet(){
    return;
}

async function registration(page, browser, i){ 

    let firstMethod;
    try {
        firstMethod = await page.waitForSelector('.step:nth-child(1) > .two > .entry', {visible:true});
    }catch(e){}
    if(firstMethod != null){
        await firstMethod.click();
    }

    await blockingWait(1)

    const newPagePromise = new Promise(x => page.once('popup', x));

    let twitterLogin;
    try {
        twitterLogin = await page.waitForSelector('a[class=\'twitter auth btn\']', {visible:true});
    }catch(e){}
    if(twitterLogin != null){
        await twitterLogin.click();
    }

    const newPage = await newPagePromise;

    console.log(newPage)

    await newPage.bringToFront()

    await blockingWait(2)

    let twitterAlllow;
    try {
        twitterAlllow = await newPage.waitForSelector('#allow', {timeout:3000});
    }catch(e){
        console.log("allow button not found")
    }
    if(twitterAlllow != null){
        await twitterAlllow.click();
    }

    await blockingWait(7)

    await page.bringToFront()


    // // await checkForCaptcha(page);

    // await blockingWait(1)

    // const nameField = await page.waitForSelector(methodId + nameSelector, {visible:true});
    // await clear(page, methodId + nameSelector)
    // await page.type(methodId + nameSelector, namesList[i]);

    // await blockingWait(1);

    // const emailField = await page.waitForSelector(methodId + emailSelector, {visible:true});
    // await clear(page, methodId + emailSelector)
    // await page.type(methodId + emailSelector, emailsList[i]);

    // await blockingWait(1);

    // const walletField = await page.waitForSelector(methodId + walletSelector, {visible:true});
    // await clear(page, methodId + walletSelector)
    // await page.type(methodId + walletSelector, walletsList[i]);

    // await blockingWait(1);

    // const telegramField = await page.waitForSelector(methodId + telegramSelector, {visible:true});
    // await clear(page, methodId + telegramSelector)
    // await page.type(methodId + telegramSelector, telegramsList[i]);

    // await blockingWait(1);

    // const saveInfoButton = await page.waitForSelector(methodId + " .btn", {visible: true});
    // saveInfoButton.click();

    // // await blockingWait(2);

    // const twitterLoging = await page.waitForSelector('a[title="Twitter"]', {visible:true});
    // await twitterLoging.click()

    // await blockingWait(1);

    // await checkForCaptcha(page);

    // await blockingWait(1);

    // let firstMethod2;
    // try {
    //     firstMethod2 = await page.waitForSelector('div' + methodId, {visible:true});
    // }catch(e){}
    // if(firstMethod2 != null){
    //     await firstMethod2.click();
    // }

    // await blockingWait(1)

}

async function twitterFollow(page, browser, methodId){
    console.log("Twitter follow");

    let classesFirst = await getClasses(page,'div' + methodId)
    console.log(classesFirst[0].includes('expanded'));
    if(!classesFirst[0].includes('expanded')){ 
        const firstMethod = await page.waitForSelector('div' + methodId, {visible:true});
        await firstMethod.click();
    }


    await checkForCaptcha(page);


    await blockingWait(2)

    let classes = await getClasses(page,'div' + methodId)
    console.log(classes[0].includes('completed-entry-method'));
    if(!classes[0].includes('completed-entry-method')){ 
                        
        const twit = await page.waitForSelector('div' + methodId + " .twitter-button:nth-child(1)", {visible:true});
        await blockingWait(2)
        const href = await page.$eval('div' + methodId + ' .twitter-button:nth-child(1)', (elm) => elm.href);
        await twit.click()
        console.log(href);

        await blockingWait(2)
        
        const newPage = await browser.waitForTarget(target => target.url() === href+ "&original_referer="+page.url());
            // const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())))
        const twitterPage = await newPage.page();

        await blockingWait(2)


        const followButton = await twitterPage.waitForXPath('//div[@data-testid="confirmationSheetConfirm"]');
        await followButton.click()

        await blockingWait(2)

        try{
            // const pageList = await browser.pages();    
            // console.log("NUMBER TABS:", pageList.length);
            // await blockingWait(2)
            await page.bringToFront();
        }catch(e){}

       

        await blockingWait(1)

        const continueButton = await page.waitForSelector(methodId + " .form-actions .btn", {visible:true});
        await continueButton.click()  

        await blockingWait(1)


        await checkForCaptcha(page);


        await blockingWait(1)
    }
}

async function twitterTweet(page, browser, methodId){
    console.log("Twitter tweet");
    const firstMethod = await page.waitForSelector('div' + methodId, {visible:true});
    await firstMethod.click();

    await blockingWait(2)

    let alreadyTweetedButton;
    try {
        alreadyTweetedButton = await page.waitForSelector(methodId + ' > div > div > div > div > div.form-compact__part.center.ng-scope > a', {timeout:1000});
    } catch(e){}
    if (alreadyTweetedButton != null)
         await alreadyTweetedButton.click() 

    await blockingWait(2)

    let classes = await getClasses(page,'div' + methodId)
    console.log(classes[0].includes('completed-entry-method'));
    if(!classes[0].includes('completed-entry-method')){ 
                        
        const twit = await page.waitForSelector('div' + methodId + " .twitter-button:nth-child(1)", {visible:true});
        await blockingWait(2)
        const href = await page.$eval('div' + methodId + ' .twitter-button:nth-child(1)', (elm) => elm.href);
        await twit.click()
        console.log(href);

        await blockingWait(2)
        
        let newPage;
        let twitterPage;
        try{
            newPage = await browser.waitForTarget(target => target.url() === href+ "&original_referer="+page.url());
        } catch(e){

        }
        
        try {
            twitterPage = await newPage.page();
        }catch(e){
        }

        await blockingWait(2)

        
        let closeAdsPopup;
        try{
            closeAdsPopup = await twitterPage.waitForXPath('//*[@id="layers"]/div[3]/div/div/div/div/div/div[2]/div[2]/div/div/div/div[2]/div[2]/div[2]', {timeout:1000});
        }
        catch(e){}

        if(closeAdsPopup !=null){
            await closeAdsPopup.click()
        }
        

        await blockingWait(1)

        const followButton = await twitterPage.waitForXPath('//div[@data-testid="tweetButton"]');
        await followButton.click()

        await blockingWait(2)

        try{
            // const pageList = await browser.pages();    
            // console.log("NUMBER TABS:", pageList.length);
            // await blockingWait(2)
            await page.bringToFront();
        }catch(e){}

        await blockingWait(2)


        let continueButton;
        
        
        try{
            continueButton = await page.waitForSelector(methodId + " .form-actions .btn", {timeout:1000});
        }catch(e){

        }
        if(continueButton != null)
            await continueButton.click() 
        
        try {
            alreadyTweetedButton = await page.waitForSelector(methodId + ' > div > div > div > div > div.form-compact__part.center.ng-scope > a', {timeout:1000});
        } catch(e){}
        if (alreadyTweetedButton != null)
             await alreadyTweetedButton.click() 
    }
}

async function telegramFollow(page, methodId){
    console.log("Telegram follow");
    let classesFirst = await getClasses(page,'div' + methodId)
    console.log(classesFirst[0].includes('expanded'));
    if(!classesFirst[0].includes('expanded')){ 
        const firstMethod = await page.waitForSelector('div' + methodId, {visible:true});
        await firstMethod.click();
    }

    await blockingWait(1);

    await checkForCaptcha(page);

    await blockingWait(1);

    const teleg = await page.waitForSelector(methodId + " .entry_details a", {visible:true});
    await teleg.click()

    await blockingWait(4)
    
    try {
        await page.bringToFront();
    }catch(e){}

    await blockingWait(1);
        
    const telegramNameField = await page.waitForSelector(methodId + "Details", {visible:true});
    await page.type(methodId + "Details", telegramsList[i]);
    await blockingWait(1);

    const continueButton = await page.waitForSelector(methodId + " .form-actions .btn", {visible:true});
    await continueButton.click() 

    await blockingWait(1);

    await checkForCaptcha(page);

    await blockingWait(1);
}

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