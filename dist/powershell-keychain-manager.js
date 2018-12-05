"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const js_string_escape_1 = require("js-string-escape");
const run_powershell_1 = require("./run-powershell");
const credManPath = path.resolve(__dirname, '../CredMan.ps1');
const runCredMan = (cmd, opts) => run_powershell_1.runPowershell(Object.keys(opts).reduce((cmd, k) => cmd + ` -${k} '${js_string_escape_1.jsStringEscape(opts[k])}'`, `"${credManPath}" -${cmd}`), true);
const passwordLineRE = /^[\s\t]*Password[\s\t]*:[\s\t]?'(.*)'/;
const createTargetName = (service, account) => `${service};user=${account}`;
class PowershellKeychainManager {
    get(service, account) {
        return runCredMan('GetCred', {
            Target: createTargetName(service, account)
        }).then(res => {
            if (res.match(/was not found\.$/)) {
                throw new Error(`Could not find ${service} password for ${account}`);
            }
            let pwl = res.split('\n').find(l => !!l.match(passwordLineRE));
            if (!pwl) {
                throw new Error(`Unknown error finding ${service} password for ${account}.`);
            }
            return { username: account, password: pwl.match(passwordLineRE)[1] };
        });
    }
    set(service, account, password) {
        return runCredMan('AddCred', {
            Target: createTargetName(service, account),
            User: account,
            Pass: password
        }).then(res => {
            if (res.indexOf('Successfully') !== 0) {
                throw new Error('Unknown error saving to keychain');
            }
            return { username: account, password: password };
        });
    }
    remove(service, account) {
        return runCredMan('DelCred', {
            Target: createTargetName(service, account)
        }).then(res => {
            if (res.indexOf('Successfully') !== 0) {
                throw new Error('Unknown error removing from keychain');
            }
        });
    }
}
exports.PowershellKeychainManager = PowershellKeychainManager;
