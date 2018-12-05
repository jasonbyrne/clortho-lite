"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const keychain = require('keychain');
class OSX_Keychain {
    get(service, account) {
        return new Promise((resolve, reject) => {
            keychain.getPassword({ service, account }, (err, password) => {
                if (err) {
                    return reject(err.message);
                }
                return resolve({ username: account, password });
            });
        });
    }
    set(service, account, password) {
        return new Promise((resolve, reject) => {
            keychain.setPassword({ service, account, password }, err => {
                if (err) {
                    return reject(err.message);
                }
                return resolve({ username: account, password });
            });
        });
    }
    remove(service, account) {
        return new Promise((resolve, reject) => {
            keychain.deletePassword({ service, account }, err => {
                if (err) {
                    return reject(err.message);
                }
                return resolve();
            });
        });
    }
}
exports.OSX_Keychain = OSX_Keychain;
