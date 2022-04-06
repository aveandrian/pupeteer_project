import { Browser, Page } from "puppeteer-core";
import Utils from "./utils";
export class ConfirmEntry{
    async entry(page:Page, browser:Browser, methodId:string){
        console.log("confirm entry");

        let firstMethod;
            try{
                firstMethod = await page.waitForSelector('div' + methodId, {visible:true});
            }catch(e){
                console.log("Method not found")
            }
            if(firstMethod!=null)
                await firstMethod.click();

        await Utils.checkForCaptcha(page)
        await Utils.blockingWait(1);
    }

    async entryAndContinue(page:Page, browser:Browser, methodId:string){
        console.log("confirm entry");
        let classesFirst = await Utils.getClasses(page,'div' + methodId)
        console.log(classesFirst[0].includes('expanded'));
        if(!classesFirst[0].includes('expanded')){ 
            let firstMethod;
                try{
                    firstMethod = await page.waitForSelector('div' + methodId, {visible:true});
                }catch(e){
                    console.log("Method not found")
                }
                if(firstMethod!=null){
                    await firstMethod.focus();
                    await firstMethod.click();
                }
        }
        await Utils.checkForCaptcha(page)
        

        let teleg;
        try{
            teleg = await page.waitForSelector(methodId + " .entry_details a", {visible:true});
        }catch(e){
            console.log("Telegram input not found");
        }
        if(teleg!=null)
            await teleg.click()

        try {
            await page.bringToFront();
        }catch(e){}
        await Utils.checkForCaptcha(page)
        let continueButton;
        try{
            continueButton = await page.waitForSelector(methodId + " .form-actions .btn", {visible:true});
        }catch(e){
            console.log("Continue button not found");
        }
        if(continueButton!=null){
            await continueButton.focus();
            await continueButton.click() 
        }

        await Utils.blockingWait(1);
    }
    async entryWithTimeout(page:Page, browser:Browser, methodId:string){
        console.log("confirm entry");
        let classesFirst = await Utils.getClasses(page,'div' + methodId)
        console.log(classesFirst[0].includes('expanded'));
        if(!classesFirst[0].includes('expanded')){ 
            let firstMethod;
                try{
                    firstMethod = await page.waitForSelector('div' + methodId, {visible:true});
                }catch(e){
                    console.log("Method not found")
                }
                if(firstMethod!=null)
                    await firstMethod.click();
        }
        await Utils.checkForCaptcha(page)
        

        let teleg;
        try{
            teleg = await page.waitForSelector(methodId + " .entry_details a", {visible:true});
        }catch(e){
            console.log("Telegram input not found");
        }
        if(teleg!=null)
            await teleg.click()

        Utils.blockingWait(16)

        try {
            await page.bringToFront();
        }catch(e){}


        await Utils.checkForCaptcha(page)
        let continueButton;
        try{
            continueButton = await page.waitForSelector(methodId + " .form-actions .btn", {visible:true});
        }catch(e){
            console.log("Continue button not found");
        }
        if(continueButton!=null)
            await continueButton.click() 

        await Utils.blockingWait(1);
    }
}
export default ConfirmEntry;