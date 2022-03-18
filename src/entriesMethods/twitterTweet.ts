import Utils from "./utils";
import { Page, Browser } from "puppeteer-core";

export class TwitterTweet{
    static async twitterTweet(page:Page, browser:Browser, methodId:string){
        console.log("Twitter tweet");
        let firstMethod;
        try {
            firstMethod = await page.waitForSelector('div' + methodId, {visible:true});
        }catch(e){}
        if(firstMethod != null){
            await firstMethod.click();
        }

        await Utils.blockingWait(2)

        let alreadyTweetedButton;
        try {
            alreadyTweetedButton = await page.waitForSelector(methodId + ' > div > div > div > div > div.form-compact__part.center.ng-scope > a', {timeout:1000});
        } catch(e){}
        if (alreadyTweetedButton != null)
            await alreadyTweetedButton.click() 

        await Utils.blockingWait(2)

        let classes = await Utils.getClasses(page,'div' + methodId)
        console.log(classes[0].includes('completed-entry-method'));
        if(!classes[0].includes('completed-entry-method')){ 
                            
            const twit = await page.waitForSelector('div' + methodId + " .twitter-button:nth-child(1)", {visible:true});
            await Utils.blockingWait(2)

            const href = await page.evaluate(
                () => Array.from(
                  document.querySelectorAll('div' + methodId + ' .twitter-button:nth-child(1)'),
                  function(a){ 
                      if(a != null) {
                        var classes:string|null = a.getAttribute('href');
                        if(classes!=null)
                            classes.split(" ");
                      }
                    }
                )
              );
            console.log(href)

            if(twit!=null)
                await twit.click()
            console.log(href);

            await Utils.blockingWait(2)
            
            let newPage;
            let twitterPage;
            try{
                newPage = await browser.waitForTarget(target => target.url() === href+ "&original_referer="+page.url());
            } catch(e){
                console.log(e);
            }

            if(newPage!=null){
                try {
                    twitterPage = await newPage.page();
                }catch(e){
                    console.log(e)
                }
            }

            await Utils.blockingWait(2)

            if(twitterPage!=null){
                let closeAdsPopup;
                try{
                    closeAdsPopup = await twitterPage.waitForXPath('//*[@id="layers"]/div[3]/div/div/div/div/div/div[2]/div[2]/div/div/div/div[2]/div[2]/div[2]', {timeout:1000});
                }
                catch(e){}
            
                if(closeAdsPopup !=null){
                    await closeAdsPopup.click()
                }
                
            
                 await Utils.blockingWait(1)

                let followButton;
                try{
                    followButton = await twitterPage.waitForXPath('//div[@data-testid="tweetButton"]');
                }catch(e){
                    console.log(e);
                }
                if(followButton!=null)
                    await followButton.click()
            }
            await Utils.blockingWait(2)         

            try{
                // const pageList = await browser.pages();    
                // console.log("NUMBER TABS:", pageList.length);
                // await BlockingWait.blockingWait(2)
                await page.bringToFront();
            }catch(e){}

            await Utils.blockingWait(2)


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
}
export default TwitterTweet;