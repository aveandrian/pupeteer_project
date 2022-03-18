import { Page, Puppeteer } from "puppeteer-core";
import Utils from "./utils";

export class Reg{
    static async registration(page:Page, methodId:string, i:number, creds:any, selectors:any){ 
        // let firstMethod;
        // try {
        //     firstMethod = await page.waitForSelector('div' + methodId, {visible:true});
        // }catch(e){}
        // if(firstMethod != null){
        //     await firstMethod.click();
        // }

        // await Utils.blockingWait(1)

        // await captcha.checkForCaptcha(page);

        await Utils.blockingWait(1)

        // let nameField;
        // try{
        //     nameField = await page.waitForSelector(methodId + selectors.nameSelector, {visible:true});
        // }catch(e){
        //     console.log("Name field not found");
        // }
        // if(nameField!=null){
        //     await Utils.clear(page, methodId + selectors.nameSelector)
        //     await page.type(methodId + selectors.nameSelector, creds.namesList[i]);
        // }

        // await Utils.blockingWait(1);

        // let emailField;
        // try{
        //     emailField = await page.waitForSelector(methodId + selectors.emailSelector, {visible:true});
        // }catch(e){
        //     console.log("Email field not found");
        // }
        // if(emailField!=null){
        //     await Utils.clear(page, methodId + selectors.emailSelector)
        //     await page.type(methodId + selectors.emailSelector, creds.emailsList[i]);
        // }

        // await Utils.blockingWait(1);


        let walletField;
        try{
            walletField = await page.waitForSelector(selectors.walletSelector, {visible:true});
        }catch(e){
            console.log("Wallet field not found");
        }
        if(walletField!=null){
            await Utils.clear(page,  selectors.walletSelector)
            await page.type(selectors.walletSelector, creds.walletsList[i]);
        }

        await Utils.blockingWait(1);

        let termsAgreeCheckbox;
        try{
            termsAgreeCheckbox = await page.waitForSelector(selectors.termsAgreeCheckboxSelector, {visible:true});
        }catch(e){
            console.log("terms agree check not found");
        }
        if(termsAgreeCheckbox!=null){
            await  termsAgreeCheckbox.click();
        }

        let agreeCheckbox;
        try{
            agreeCheckbox = await page.waitForSelector(selectors.agreeCheckboxSelector, {visible:true});
        }catch(e){
            console.log("agreee check not found");
        }
        if(agreeCheckbox!=null){
            await  agreeCheckbox.click();
        }

        // const telegramField = await page.waitForSelector(methodId + telegramSelector, {visible:true});
        // await clear(page, methodId + telegramSelector)
        // await page.type(methodId + telegramSelector, creds.telegramsList[i]);

        // await BlockingWait.blockingWait(1);
        let saveInfoButton;
        try{
            saveInfoButton = await page.waitForSelector("body > div > div > div > div.popup-blocks-container > div > div > div:nth-child(1) > div:nth-child(5) > div:nth-child(2) > div:nth-child(2) > div > form > div > span:nth-child(1) > button", {visible: true});
        }catch(e){
            console.log(e);
        }
        if(saveInfoButton!=null)
            saveInfoButton.click();

        // await BlockingWait.blockingWait(2);

        // const twitterLoging = await page.waitForSelector('a[title="Twitter"]', {visible:true});
        // await twitterLoging.click()

        await Utils.blockingWait(1);

        await Utils.checkForCaptcha(page);

        await Utils.blockingWait(1);

        // let firstMethod2;
        // try {
        //     firstMethod2 = await page.waitForSelector('div' + methodId, {visible:true});
        // }catch(e){}
        // if(firstMethod2 != null){
        //     await firstMethod2.click();
        // }

        // await BlockingWait.blockingWait(1)

    }

}
export default Reg;