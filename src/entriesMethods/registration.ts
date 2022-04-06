import { Page, Puppeteer } from "puppeteer-core";
import Utils from "./utils";

export class Reg{
    static async registration(page:Page, methodId:string, i:number, creds:any, selectors:any){ 
        let firstMethod;
        try {
            firstMethod = await page.waitForSelector('div' + methodId, {visible:true});
        }catch(e){}
        if(firstMethod != null){
            await firstMethod.focus();
            await firstMethod.click();
        }

        await Utils.blockingWait(1)

        // await captcha.checkForCaptcha(page);

        await Utils.blockingWait(1)

        let nameField;
        try{
            nameField = await page.waitForSelector(methodId + selectors.nameSelector, {visible:true});
        }catch(e){
            console.log("Name field not found");
        }
        if(nameField!=null){
            await Utils.clear(page, methodId + selectors.nameSelector)
            await page.type(methodId + selectors.nameSelector, creds.namesList[i]);
        }

        await Utils.blockingWait(1);

        let emailField;
        try{
            emailField = await page.waitForSelector(methodId + selectors.emailSelector, {visible:true});
        }catch(e){
            console.log("Email field not found");
        }
        if(emailField!=null){
            await Utils.clear(page, methodId + selectors.emailSelector)
            await page.type(methodId + selectors.emailSelector, creds.emailsList[i]);
        }

        await Utils.blockingWait(1);


        let walletField;
        try{
            walletField = await page.waitForSelector(methodId + selectors.walletSelector, {visible:true});
        }catch(e){
            console.log("Wallet field not found");
        }
        if(walletField!=null){
            await Utils.clear(page, methodId + selectors.walletSelector)
            await page.type(methodId + selectors.walletSelector, creds.walletsList[i]);
        }

        await Utils.blockingWait(1);

        // const telegramField = await page.waitForSelector(methodId + telegramSelector, {visible:true});
        // await clear(page, methodId + telegramSelector)
        // await page.type(methodId + telegramSelector, creds.telegramsList[i]);

        // await BlockingWait.blockingWait(1);
        let saveInfoButton;
        try{
            saveInfoButton = await page.waitForSelector(methodId + " .btn", {visible: true});
        }catch(e){
            console.log(e);
        }
        if(saveInfoButton!=null){
            await saveInfoButton.focus();
            await saveInfoButton.click();
        }
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