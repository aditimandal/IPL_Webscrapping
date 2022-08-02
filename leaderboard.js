const request = require("request");
const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let xlsx = require("json-as-xlsx")

const link = "https://www.espncricinfo.com/series/ipl-2021-1249214/match-results";

request(link, cb);
let leaderboard = [];
let counter = 0;

function cb(error, response, html) {
    if (error) {
        console.log(error);

    } else {
        const dom = new JSDOM(html);
        const document = dom.window.document;
        // let allScorecardTags =document.querySelectorAll(".ds-flex.ds-mx-4");

        let allScorecardTags = document.querySelectorAll(".ds-border-b.ds-border-line");
        // console.log(allScorecardTags.length);
        for (let i = 0; i < 60; i++) {
            let anchorTagAll = allScorecardTags[i].querySelectorAll("a");

            // console.log(anchorTagAll);
            let link = anchorTagAll[2].href;
            let completeLink = "https://www.espncricinfo.com" + link;
            // console.log(completeLink);
            request(completeLink, cb2);
            counter++;
        }
    }
}

function cb2(error, response, html) {
    if (error) {
        console.log(error);
    }
    else {
        const dom = new JSDOM(html);
        const document = dom.window.document;
        let batsmenRow = document.querySelectorAll(".ds-w-full.ds-table.ds-table-xs.ds-table-fixed.ci-scorecard-table tbody tr");
        for (let i = 0; i < batsmenRow.length; i++) {
            let cells = batsmenRow[i].querySelectorAll("td");
            if (cells.length == 8) {
                let name = cells[0].textContent;
                let runs = cells[2].textContent;
                let balls = cells[3].textContent;
                let fours = cells[5].textContent;
                let sixes = cells[6].textContent;
                // console.log("Name:", name, "Runs:", runs, "Balls:", balls,"Fours:", fours,"Sixes:",sixes);
                processPlayer(name, runs, balls, fours, sixes);
            }
        }
        counter--;
        if (counter == 0) {
            // console.log(leaderboard);
            let data = JSON.stringify(leaderboard);
            fs.writeFileSync('BatsmenStates.json', data);

            

            let dataExcel = [
                {
                    sheet: "IPL Stats",
                    columns: [
                        { label: "Name", value: "Name" }, // Top level data
                        { label: "Innings", value: "Innings" }, // Custom format
                        { label: "Runs", value: "Runs" }, // Run functions
                        { label: "Balls", value: "Balls" },
                        { label: "Fours", value: "Fours" },
                        { label: "Sixes", value: "Sixes" }
                    ],
                    content: leaderboard
                },
            ]

            let settings = {
                fileName: "BatsmanDetails", // Name of the resulting spreadsheet
                extraLength: 3, // A bigger number means that columns will be wider
                writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
            }

            xlsx(dataExcel, settings) // Will download the excel file
        }
    }
}

// processPlayer('Rohit','40' ,'20','1','2','4');
// console.log(leaderboard);

function processPlayer(name, runs, balls, fours, sixes) {
    runs = Number(runs);
    balls = Number(balls);
    fours = Number(fours);
    sixes = Number(sixes);

    for (let i = 0; i < leaderboard.length; i++) {
        let playerObj = leaderboard[i];
        if (playerObj.Name == name) {
            playerObj.Runs += runs;
            playerObj.Innings += 1;
            playerObj.Balls += balls;
            playerObj.Fours += fours;
            playerObj.Sixes += sixes;
            return;
        }
    }

    let obj = {
        Name: name,
        Innings: 1,
        Runs: runs,
        Balls: balls,
        Fours: fours,
        Sixes: sixes,

    }
    leaderboard.push(obj);
}