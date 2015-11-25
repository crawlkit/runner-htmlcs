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
                    htmlCsPath,
                    require.resolve('es6-promise'),
                    require.resolve('css-selector-generator'),
                ]));
            });
        });
    }

    /* global HTMLCS:false, ES6Promise:false */
    getRunnable() {
        /* eslint-disable */
        return function htmlCsRunner(standardsToTest, levelThreshold) {
            var Promise = ES6Promise.Promise;
            var selectorGenerator = new CssSelectorGenerator();
            var messageCodeToString = [undefined, 'error', 'warning', 'notice'];
            var standards = ['WCAG2A', 'WCAG2AA', 'WCAG2AAA', 'Section508'];

            if (standardsToTest instanceof Array) {
                standardsToTest = standardsToTest.filter(function filterUnknown(standard) {
                    return standards.indexOf(standard) !== -1;
                });
                if (standardsToTest.length) {
                    standards = standardsToTest;
                }
            } else if(standards.indexOf(standardsToTest) !== -1) {
                standards = [standardsToTest];
            }

            Promise.all(standards.map(function forStandard(standard) {
                return new Promise(function(resolve, reject) {
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

                            delete message.element;
                            return message;
                        });
                        resolve(result);
                    }, function error() {
                        reject('HTMLCS ('+standard+') failed');
                    });
                });
            })).then(function success(results) {
                var ret = {};
                results.forEach(function(result, index) {
                    ret[standards[index]] = result;
                });
                window.callPhantom(null, ret);
            }, function error(error) {
                window.callPhantom(error, null);
            });
        };
        /* eslint-enable */
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
