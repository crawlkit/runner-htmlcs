'use strict'; // eslint-disable-line
const path = require('path');
const glob = require('glob');
const keyMirror = require('keymirror');

class HtmlCsRunner {
    getCompanionFiles() {
        return new Promise((resolve, reject) => {
            const htmlCsPath = require.resolve('HTML_CodeSniffer');
            glob('**/*.js', {
                cwd: path.join(path.dirname(htmlCsPath), 'Standards/'),
                realpath: true,
            }, (error, standards) => {
                if (error) {
                    return reject(error);
                }
                resolve(standards.concat([
                    // ah, the things your eyes have seen now...
                    path.join(__dirname, 'amd.undefine.js'),
                    require.resolve(path.join('html-context', 'dist')),
                    htmlCsPath,
                    require.resolve('es6-promise'),
                    require.resolve('css-selector-generator'),
                    path.join(__dirname, 'amd.redefine.js'),
                ]));
            });
        });
    }

    getRunnable() {
        /* global HTMLCS:false, ES6Promise:false, CssSelectorGenerator:false, htmlContext:false */
        return function htmlCsRunner(standardsToTest, levelThreshold) {
            /* eslint-disable no-var, vars-on-top, no-console */
            var Promise = ES6Promise.Promise;
            var selectorGenerator = new CssSelectorGenerator();
            var messageCodeToString = [undefined, 'error', 'warning', 'notice'];
            var standards = ['WCAG2A', 'WCAG2AA', 'WCAG2AAA', 'Section508'];

            if (standardsToTest instanceof Array) {
                var validStandardsToTest = standardsToTest.filter(function filterUnknown(standard) {
                    return standards.indexOf(standard) !== -1;
                });
                if (validStandardsToTest.length) {
                    standards = validStandardsToTest;
                }
            } else if (standards.indexOf(standardsToTest) !== -1) {
                standards = [standardsToTest];
            }

            Promise.all(standards.map(function forStandard(standard) {
                return new Promise(function standardPromise(resolve, reject) {
                    HTMLCS.process(standard, document, function success() {
                        var result = HTMLCS.getMessages();
                        if (levelThreshold) {
                            result = result.filter(function levelThresholdFilter(message) {
                                return message.type <= levelThreshold;
                            });
                        }
                        result = result.map(function processMessage(message) {
                            message.selector = selectorGenerator.getSelector(message.element);
                            message.type = messageCodeToString[message.type];
                            message.context = null;
                            try {
                                message.context = htmlContext(message.element, { maxLength: 255 });
                            } catch (e) {
                                console.error(e);
                            }
                            delete message.element;
                            return message;
                        });
                        resolve(result);
                    }, function error() {
                        reject('HTMLCS (' + standard + ') failed');
                    });
                });
            })).then(function success(results) {
                var ret = {};
                results.forEach(function eachResult(result, index) {
                    ret[standards[index]] = result;
                });
                window.callPhantom(null, ret);
            }, function error(err) {
                window.callPhantom(err, null);
            });
        };
    }
}

HtmlCsRunner.standard = keyMirror({
    WCAG2A: null,
    WCAG2AA: null,
    WCAG2AAA: null,
    Section508: null,
});

HtmlCsRunner.level = {
    ERROR: 1,
    WARNING: 2,
    NOTICE: 3,
};

module.exports = HtmlCsRunner;
