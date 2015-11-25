'use strict'; // eslint-disable-line
const HtmlCsRunner = require('../');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const CrawlKit = require('crawlkit');
const freeport = require('freeport');
const httpServer = require('http-server');
const path = require('path');

chai.should();
chai.use(chaiAsPromised);

describe('HTML Codesniffer runner', function main() {
    this.timeout(60 * 1000); // sniffing can take a while
    let server;
    let url;
    let port;
    const host = '0.0.0.0';

    before((done) => {
        freeport((err, p) => {
            if (err) {
                throw err;
            }
            port = p;
            server = httpServer.createServer({
                root: path.join(__dirname, 'fixtures', 'website'),
            });
            server.listen(port);
            url = `http://${host}:${port}`;
            done();
        });
    });

    after(() => {
        server.close();
    });

    it('should be able to sniff a website', () => {
        const crawler = new CrawlKit(url);
        crawler.addRunner('htmlcs', new HtmlCsRunner());

        const results = {};
        results[`${url}/`] = {
            runners: {
                htmlcs: {
                    result: require(path.join(__dirname, 'fixtures/results/index.json')),
                },
            },
        };
        return crawler.crawl().should.eventually.deep.equal({results});
    });

    describe('standards', () => {
        it('should be possible to pass a standard to test', () => {
            const crawler = new CrawlKit(url);
            crawler.addRunner('htmlcs', new HtmlCsRunner(), HtmlCsRunner.standard.WCAG2AA);

            const results = {};
            results[`${url}/`] = {
                runners: {
                    htmlcs: {
                        result: require(path.join(__dirname, 'fixtures/results/index.WCAG2AA.json')),
                    },
                },
            };
            return crawler.crawl().should.eventually.deep.equal({results});
        });

        it('should be possible to pass multiple standards to test', () => {
            const crawler = new CrawlKit(url);
            crawler.addRunner('htmlcs', new HtmlCsRunner(), [HtmlCsRunner.standard.Section508, HtmlCsRunner.standard.WCAG2A]);

            const results = {};
            results[`${url}/`] = {
                runners: {
                    htmlcs: {
                        result: require(path.join(__dirname, 'fixtures/results/index.WCAG2A.Section508.json')),
                    },
                },
            };
            return crawler.crawl().should.eventually.deep.equal({results});
        });
    });
});
