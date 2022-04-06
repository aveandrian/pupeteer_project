
import Utils from "./utils";
import { Browser, Page, Puppeteer } from "puppeteer-core";

export class Follow{
    async twitter(page: Page, browser:Browser, methodId:string){
        console.log("Twitter follow");
        let firstMethod;
        let classesFirst = await Utils.getClasses(page,'div' + methodId)
        // console.log(classesFirst[0].includes('expanded'));
        if(!classesFirst[0].includes('expanded')){ 
            
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

        await Utils.checkForCaptcha(page);

        await Utils.blockingWait(5)

        let classes = await Utils.getClasses(page,'div' + methodId)
        // console.log(classes[0].includes('completed-entry-method'));
        if(!classes[0].includes('completed-entry-method')){
            let twit;
            try{
                twit = await page.waitForSelector('div' + methodId + " .twitter-button:nth-child(1)", {visible:true, timeout:3000});
            }
            catch(e){
                console.log('Twitter button not found')
            }
            
            let href:any;
            
            if(twit!=null){
                href = await (await twit.getProperty('href')).jsonValue();
                await twit.focus();
                console.log(href)
                await twit.click();
            }

            await Utils.blockingWait(2)

            
            let newPage;
            let twitterPage;
            try{
                newPage = await browser.waitForTarget(target => target.url() === href + "&original_referer="+page.url(), {timeout:3000});
            }catch(e){ 
                console.log("New page not found");
                page.bringToFront();
            }

            if(newPage!=null){
                try{
                    // const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())))
                    twitterPage = await newPage.page();
                }catch(e){
                    console.log(e);
                }
            }

            await Utils.blockingWait(2)

            if(twitterPage!=null){
                let followButton;
                try{ 
                    followButton = await twitterPage.waitForXPath('//div[@data-testid="confirmationSheetConfirm"]', {timeout:3000});
                }
                catch(e){
                    console.log('Follow button not found')
                }
                if(followButton!=null)
                    await followButton.click()

                await Utils.blockingWait(2)

                try{
                    // const pageList = await browser.pages();    
                    // console.log("NUMBER TABS:", pageList.length);
                    // await blockingWait(2)
                    await page.bringToFront();
                }catch(e){
                    console.log("Couldn't bring page to front")
                }
            }
            await Utils.blockingWait(1)

            let continueButton;
            try {
                continueButton = await page.waitForSelector(methodId + " .form-actions .btn", {visible:true, timeout:3000});
            }catch(e){
                console.log('Continue button not found')
            }
            if(continueButton!=null)
                await continueButton.click()  

            await Utils.blockingWait(1)

            let isFollowed, isRetweeted;
            try{
                isFollowed = await page.waitForXPath('//div[contains(text(), "does not follow this user on Twitter")]', {timeout:3000});
                isRetweeted = await page.waitForXPath('//div[contains(text(), "has not retweeted this on Twitter)]', {timeout:3000});
            }catch(e){
                console.log("We're good");
            }
            if(isFollowed!=null && isRetweeted!=null && firstMethod!=null)
                await firstMethod.click();

            await Utils.checkForCaptcha(page);//"tooltip-inner ng-binding" div @SohnJnow does not follow this user on Twitter
            

            await Utils.blockingWait(1)
        }
    }

    async telegram(page:Page, methodId:string, i:number, creds:any){
        console.log("Telegram follow");
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
    
        // await Utils.blockingWait(1);
    
        await Utils.checkForCaptcha(page);
    
        await Utils.blockingWait(1);
        
        let teleg;
        try{
            teleg = await page.waitForSelector(methodId + " .entry_details a", {visible:true});
        }catch(e){
            console.log("Telegram input not found");
        }
        if(teleg!=null)
            await teleg.click()
    
        await Utils.blockingWait(1)
        
        try {
            await page.bringToFront();
        }catch(e){}
    
        await Utils.blockingWait(1);
            
        const telegramNameField = await page.waitForSelector(methodId + "Details", {visible:true});
        await page.type(methodId + "Details", creds.telegramsList[i]);
        await Utils.blockingWait(1);
        
        let continueButton;
        try{
            continueButton = await page.waitForSelector(methodId + " .form-actions .btn", {visible:true});
        }catch(e){
            console.log("Continue button not found");
        }
        if(continueButton!=null)
            await continueButton.click() 
    
        // await Utils.blockingWait(1);
    
        await Utils.checkForCaptcha(page);
    
        // await Utils.blockingWait(1);
    }
}
export default Follow;