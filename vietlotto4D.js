const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const fetch = require('node-fetch');
const baseUrl =
	"https://vietlott.vn/ajaxpro/Vietlott.PlugIn.WebParts.GameMax4DCompareWebPart,Vietlott.PlugIn.WebParts.ashx"; // the website url to start scrapping from
var parsedResults = [];
const outputFile = "logvietlotto.txt";
var saved = false; // Added this for monitoring if the scrapped data was saved if an error is thrown
var indexPage = 1;
var totalPages = 1;

const getWebsiteContent = async (url) => {
	try {
		fetch(
			"https://vietlott.vn/ajaxpro/Vietlott.PlugIn.WebParts.GameMax4DCompareWebPart,Vietlott.PlugIn.WebParts.ashx",
			{
				method: "POST",
				headers: {
					Connection: "keep-alive",
					Pragma: "no-cache",
					"Cache-Control": "no-cache",
					"X-AjaxPro-Method": "ServerSideDrawResult",
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36",
					"Content-Type": "text/plain; charset=UTF-8",
					Accept: "*",
					Referer:
						"https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-max-4d",
					"Accept-Language":
						"en-US,en;q=0.9,vi-VN;q=0.8,vi;q=0.7,fr-FR;q=0.6,fr;q=0.5",
				},
				body: JSON.stringify({
					ORenderInfo: {
						SiteId: "main.frontend.vi",
						SiteAlias: "main.vi",
						UserSessionId: "",
						SiteLang: "vi",
						IsPageDesign: false,
						ExtraParam1: "",
						ExtraParam2: "",
						ExtraParam3: "",
						SiteURL: "",
						WebPage: null,
						SiteName: "Vietlott",
						OrgPageAlias: null,
						PageAlias: null,
						FullPageAlias: null,
						RefKey: null,
						System: 1,
					},
					GameId: "2",
					GameDrawId: "",
					number: "",
					CheckMulti: 0,
					PageIndex: 1,
				}),
			}
		).then((res) => console.log(JSON.stringify(res)));

		// indexPage++; // Increment to the next page

		// if (indexPage == totalPages) {
		//     exportResults(parsedResults)    // If we have surpassed the total pages we export the result to CSV
		//     return false
		// }

		// const nextPageLink = baseUrl + '......' + indexPage;

		// Add a little  timeout to avoid getting banned by the server
		// setTimeout(() => {
		//     getWebsiteContent(nextPageLink); // Call itself
		//   }, 3000);
	} catch (error) {
		console.log(error);
	} finally {
		// If results were written successfully to file the end else write whats in memory
		if (!saved) {
			exportResults(parsedResults);
		}
	}
};

// Get the pagination
function getTotalpages(data) {
	// Extract the total number of pages available and return it as an integer
}

//function for export to csv file
const exportResults = (parsedResults) => {
	fs.appendFile(outputFile, JSON.stringify(parsedResults, null, 4), (err) => {
		if (err) {
			console.log(err);
		}
		console.log(
			`\n ${parsedResults.length} Results exported successfully to ${outputFile}\n`
		);
		saved = true;
	});
};

getWebsiteContent(baseUrl);
