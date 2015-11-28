/* eslint-disable no-console */
const CrawlKit = require('crawlkit');
const HtmlCsRunner = require('crawlkit-runner-htmlcs');

const crawler = new CrawlKit('http://www.google.com');
crawler.addRunner('htmlcs', new HtmlCsRunner());

crawler.crawl()
    .then((data) => {
        console.log(JSON.stringify(data.results, true, 2));
    });
