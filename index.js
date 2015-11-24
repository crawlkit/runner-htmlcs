'use strict'; // eslint-disable-line
const path = require('path');
const glob = require('glob');

class HtmlCsRunner {
    getCompanionFiles() {
        const htmlCsPath = require.resolve('HTML_CodeSniffer');
        const standards = glob.sync('**/*.js', {
            cwd: path.join(path.dirname(htmlCsPath), 'Standards/'),
            realpath: true,
        });

        return standards.concat([
            htmlCsPath,
            require.resolve('es6-promise'),
            require.resolve(path.join('css-selector-generator', 'build', 'css-selector-generator.js')),
        ]);
    }

    /* global HTMLCS:false, ES6Promise:false */
    getRunnable() {
        /* eslint-disable */
        return function htmlCsRunner() {
            var Promise = ES6Promise.Promise;
            var selectorGenerator = new CssSelectorGenerator();
            var messageCodeToString = [undefined, 'error', 'warning', 'notice'];
            var standards = ['WCAG2A', 'WCAG2AA', 'WCAG2AAA', 'Section508'];

            Promise.all(standards.map(function forStandard(standard) {
                return new Promise(function(resolve, reject) {
                    HTMLCS.process(standard, document, function success() {
                        resolve(HTMLCS.getMessages().map(function processMessage(message) {
                            message.selector = selectorGenerator.getSelector(message.element);
                            delete message.element;
                            message.type = messageCodeToString[message.type];
                            return message;
                        }));
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
module.exports = HtmlCsRunner;
