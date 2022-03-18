import { Page } from "puppeteer-core";

var captchaSolvedTimes:number;
var maxCaptchaSolvedTimes:number;
export class Utils{
    
    static async blockingWait(seconds:number) {
        //simple blocking technique (wait...)
        var waitTill = new Date(new Date().getTime() + seconds * 1000);
        while(waitTill > new Date()){}
    
    }

    setCaptchaSolvedTimes(newCaptchaSolvedTimes:number){
        captchaSolvedTimes = newCaptchaSolvedTimes;
    }
    setMaxCaptchaSolvedTimes(newMaxCaptchaSolvedTimes:number){
        maxCaptchaSolvedTimes = newMaxCaptchaSolvedTimes;
    }

    static async checkForCaptcha(page:Page){
        
        // console.log('checkForCaptcha');
    
        let captcha;
        let captchaSolveButton;
        let captchaSolveButton2;
    
        if(captchaSolvedTimes >= maxCaptchaSolvedTimes)
            return;
        let isSolved = false;
       
            try {
                captchaSolveButton = await page.waitForSelector(".captcha-solver", {timeout:1000});
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
                        await Utils.blockingWait(1)
                    }
                    else {
                        isSolved = true;
                        captchaSolvedTimes+=1;
                        console.log("Solved " + captchaSolvedTimes + " times");
                    }
                }
                await Utils.blockingWait(2);
            }
            else {
                // console.log('.captcha-solver not found');
            }
    }

    static async clear(page:Page, selector:string) {
        await page.evaluate(selector => {
          document.querySelector(selector).value = "";
        }, selector);
    }

    static async getClasses(page:Page, selector:string){
        let classesRegs = await page.evaluate(
            (selector) => Array.from(
            document.querySelectorAll(selector),
            a =>  a.getAttribute('class').split(" ")
            ), selector);
        console.log(classesRegs)
        return classesRegs;
    }
}
export default Utils;