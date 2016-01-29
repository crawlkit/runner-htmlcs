# HTML Codesniffer runner for CrawlKit
[![Build status](https://img.shields.io/travis/crawlkit/runner-htmlcs/master.svg)](https://travis-ci.org/crawlkit/runner-htmlcs)
[![npm](https://img.shields.io/npm/v/crawlkit-runner-htmlcs.svg)](https://www.npmjs.com/package/crawlkit-runner-htmlcs)
[![npm](https://img.shields.io/npm/l/crawlkit-runner-htmlcs.svg)](https://opensource.org/licenses/MIT)
[![David](https://img.shields.io/david/crawlkit/runner-htmlcs.svg)](https://david-dm.org/crawlkit/runner-htmlcs)
![node](https://img.shields.io/node/v/crawlkit-runner-htmlcs.svg)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

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
    }, (err) => console.error(err));
```

### Only testing certain standards
The HTML Codesniffer runner supports a parameter where you can limit the standards to test for.

By default all standards are tested.

Supported standards are: `WCAG2A`, `WCAG2AA`, `WCAG2AAA`, `Section508`.

Use one:
```javascript
// Test only WCAG2AA
crawler.addRunner('htmlcs', new HtmlCsRunner(), HtmlCsRunner.standard.WCAG2AA);
```
or multiple:
```javascript
// Test WCAG2AA & Section508
crawler.addRunner('htmlcs', new HtmlCsRunner(), [HtmlCsRunner.standard.WCAG2AA, HtmlCsRunner.standard.Section508]);
```

### Excluding messages
If you are not interested in all levels of findings, you can set a level threshold:

```javascript
// Only interested in warnings & errors (notices are below the threshold)
crawler.addRunner('htmlcs', new HtmlCsRunner(), null, HtmlCsRunner.level.WARNING);
```
Valid thresholds are `NOTICE`, `WARNING` and `ERROR` (use the constants in `HtmlCsRunner.level`).


This project is in no way affiliated with squizlabs.
