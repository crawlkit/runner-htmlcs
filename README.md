# HTML Codesniffer runner for CrawlKit [![Build Status](https://travis-ci.org/crawlkit/runner-htmlcs.svg?branch=master)](https://travis-ci.org/crawlkit/runner-htmlcs)

This runner can be used with [CrawlKit](https://github.com/crawlkit/crawlkit) in order to audit a website with the [HTML Codesniffer](https://github.com/squizlabs/HTML_CodeSniffer).

## Example
```javascript
const CrawlKit = require('crawlkit');
const HtmlCsRunner = require('crawlkit-runner-htmlcs');

const crawler = new CrawlKit('http://your/page');
// You could add a finder here in order to audit a whole network of pages
crawler.addRunner('htmlcs', new HtmlCsRunner());

crawler.crawl()
    .then((data) => {
        console.log(JSON.stringify(data.results, true, 2));
    });
```

This project is in no way affiliated with squizlabs.
