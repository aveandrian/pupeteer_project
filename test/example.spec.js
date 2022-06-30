const { chromium } = require('playwright');
const { test, expect } = require('@playwright/test');


var myTOKEN;

test('asdasd',async ({ request }) => {
  const newIssue = await request.post(`https://anty-api.com/auth/login`, {
    data: {
      'username': '',
      'password': '',
    }
  });

  myTOKEN = (await newIssue.json());

  console.log(myTOKEN);

  const getProfiles = await request.get(`https://anty-api.com/browser_profiles`, {
    headers: {
      'Authorization': 'Bearer ' + myTOKEN.token
    },
  });

  var myProfiles = await getProfiles.json();

  console.log(myProfiles)

  const startProfile = await request.get(`http://localhost:3001/v1.0/browser_profiles/1703971/start?automation=1`, {
      headers: {
        'Authorization': 'Bearer ' + myTOKEN.token
      },
  });
  
  var myResp = await startProfile.json();
  
  console.log(myResp);
  
  });
  
