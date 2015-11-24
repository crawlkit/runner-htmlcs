# HTML Codesniffer runner for CrawlKit
[![Build status](https://img.shields.io/travis/crawlkit/runner-htmlcs/master.svg)](https://travis-ci.org/crawlkit/runner-htmlcs)
[![npm](https://img.shields.io/npm/v/crawlkit-runner-htmlcs.svg)](https://www.npmjs.com/package/crawlkit-runner-htmlcs)
[![npm](https://img.shields.io/npm/l/crawlkit-runner-htmlcs.svg)]()
[![David](https://img.shields.io/david/crawlkit/runner-htmlcs.svg)]()
[![node](https://img.shields.io/node/v/crawlkit-runner-htmlcs.svg)]()

This runner can be used with [CrawlKit](https://github.com/crawlkit/crawlkit) in order to audit a website with the [HTML Codesniffer](https://github.com/squizlabs/HTML_CodeSniffer).

## Install
```console
npm install crawlkit-runner-htmlcs --save
```

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
