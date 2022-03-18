import Utils from "./utils";
import { Browser, Page, Puppeteer } from "puppeteer-core";

export class Inputs {
    static async email(page:Page, browser:Browser, methodId:string, i:number, creds:any){
        console.log("Email input");

        let firstMethod;
        try{
            firstMethod = await page.waitForSelector(methodId, {timeout:1000});
        }catch(e){
            console.log('Method not found');
        }
        if(firstMethod!=null)
            await firstMethod.click()
        
        await Utils.checkForCaptcha(page);
        await Utils.blockingWait(1);


        const walletNameField = await page.waitForSelector(methodId + 'Details', {visible:true});
        await page.type(methodId + 'Details', creds.emailsList[i]);

        await Utils.blockingWait(1);

        let continueButton;
        try{
            continueButton = await page.waitForSelector(methodId +' .btn-primary', {visible:true});
        }catch(e){
            console.log('Continue button not found');
        }
        if(continueButton!=null)
            await continueButton.click();

        await Utils.checkForCaptcha(page);
        
        await Utils.blockingWait(1);
    }

    static async wallet(page:Page, browser:Browser, methodId:string, i:number, creds:any){
        console.log("Wallet input");

        let firstMethod;
        try{
            firstMethod = await page.waitForSelector(methodId, {timeout:1000});
        }catch(e){
            console.log('Method not found');
        }
        if(firstMethod!=null)
            await firstMethod.click()
        
        await Utils.checkForCaptcha(page);
        await Utils.blockingWait(1);


        const walletNameField = await page.waitForSelector(methodId + 'Details', {visible:true});
        await page.type(methodId + 'Details', creds.walletsList[i]);

        await Utils.blockingWait(1);

        let continueButton;
        try{
            continueButton = await page.waitForSelector(methodId +' .btn-primary', {visible:true});
        }catch(e){
            console.log('Continue button not found');
        }
        if(continueButton!=null)
            await continueButton.click();

        await Utils.blockingWait(1);

        await Utils.checkForCaptcha(page);
        
        await Utils.blockingWait(1);
    }

    static async telegram(page:Page, browser:Browser, methodId:string, i:number, creds:any){
        console.log("Telegram input");

        let firstMethod;
        try{
            firstMethod = await page.waitForSelector(methodId, {timeout:1000});
        }catch(e){
            console.log('Method not found');
        }
        if(firstMethod!=null)
            await firstMethod.click()
    
        await Utils.blockingWait(1);
        
        await Utils.checkForCaptcha(page);
        await Utils.blockingWait(1);
    
        const walletNameField = await page.waitForSelector(methodId + 'Details', {visible:true});
        await page.type(methodId + 'Details', creds.telegramsList[i]);
    
        await Utils.blockingWait(1);
    
        let continueButton;
        try{
            continueButton = await page.waitForSelector(methodId +' .btn-primary', {visible:true});
        }catch(e){
            console.log('Continue button not found');
        }
        if(continueButton!=null)
            await continueButton.click();
        
        await Utils.blockingWait(1);
    
        await Utils.checkForCaptcha(page)
    
        await Utils.blockingWait(1);
    }
}
export default Inputs;