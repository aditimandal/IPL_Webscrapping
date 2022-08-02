const request = require('request');
const jsdom =  require("jsdom");
const {JSDOM} =jsdom;

const link="https://www.espncricinfo.com/series/ipl-2021-1249214/chennai-super-kings-vs-delhi-capitals-2nd-match-1254059/full-scorecard";

request(link, cb);

function cb(error, response, html){
    if(error){
        console.log('error:' , error);
    }
    else{
        // console.log('body:', html);
        const dom= new JSDOM(html);
        const document= dom.window.document;
        let teamsName = document.querySelectorAll(".ds-flex.ds-flex-col.ds-mt-3.md:ds-mt-0.ds-mt-0.ds-mb-1 .ds-text-tight-l.ds-font-bold");
        console.log(teamsName[0].textContent);
        console.log(teamsName[1].textContent);

    }

}

