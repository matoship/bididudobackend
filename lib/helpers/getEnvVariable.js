"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvVar = getEnvVar;
/**
 * return key from .env
 *
 * @param   {string}  key
 *
 * @return  {string}
 */
function getEnvVar(key) {
    const value = process.env[key];
    console.log(value);
    if (value === undefined) {
        throw new Error(`Environment variable ${key} is not set.`);
    }
    return value;
}
//# sourceMappingURL=getEnvVariable.js.map