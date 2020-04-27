/* tslint no-var-requires:0 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const semver = require("semver");
const actions = require("../actions");
const formatError = require("../actions/formatError");
const showLicense = require("../actions/showLicense");
const normalizations = require("./normalizations");
const validations = require("./validations");
// tslint:disable-next-line:no-var-requires
const $package = require("../../package.json");
function presentError(e) {
    process.stderr.write(formatError(e) + "\n");
    process.exit(1);
}
/* istanbul ignore if  */
if (!semver.satisfies(process.versions.node, $package.engines.node)) {
    process.stderr.write(`\nERROR: your node version (${process.versions.node}) is not recent enough.\n`);
    process.stderr.write(`       ${$package.name} needs a version of node ${$package.engines.node}\n\n`);
    /* eslint no-process-exit: 0 */
    process.exit(1);
}
try {
    program
        /* tslint:disable-next-line */
        .version(require("../../package.json").version)
        .option("-T --output-type <type>", validations.validOutputTypeRE, (pOutputType) => validations.validOutputType(pOutputType))
        .option("-I --input-type <type>", validations.validInputTypeRE, validations.validInputType)
        .option("-i --input-from <file>", "File to read from. use - for stdin.")
        .option("-o --output-to <file>", "File to write to. use - for stdout.")
        .option("-p --parser-output", "Print parsed msc output")
        .option("-s --css <string>", "Additional styles to use. Experimental")
        .option("-n --named-style <style>", validations.validNamedStyleRE, (pNamedStyle) => validations.validNamedStyle(pNamedStyle))
        .option("-m --mirror-entities", `Repeat the entities on the chart's
                                 bottom`)
        .option("-v --vertical-alignment <align>", `Vertical alignment of labels on regular
                                 arcs. Experimental
                                 ${validations.validVerticalAlignmentRE}`, validations.validVerticalAlignment, "middle")
        .option("--puppeteer-options <file>", `(advanced) pass puppeteer launch options
                                 see README.md for details`, validations.validPuppeteerOptions)
        .option("-l --license", "Display license and exit", () => {
        process.stdout.write(showLicense());
        process.exit(0);
    })
        .arguments("[infile]")
        .parse(process.argv);
    validations
        .validateArguments(normalizations.normalize(program.args[0], program))
        .then(actions.transform)
        .catch(presentError);
}
catch (pError) {
    presentError(pError);
}
