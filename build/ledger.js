"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require('crypto');
var fp_1 = __importDefault(require("lodash/fp"));
var SHA256 = function (text) { return crypto.createHash("sha256").update(text).digest("hex"); };
var getMerkleRootHash = function (leaves) {
    var tree = leaves.map(function (leave) { return SHA256(getTxString(leave)); });
    return getMerkleRootHashHelper(tree);
};
var getMerkleRootHashHelper = function (leaves) {
    if (leaves.length < 1)
        return '';
    if (leaves.length === 1)
        return leaves[0];
    if (leaves.length % 2 !== 0)
        return getMerkleRootHashHelper(__spreadArray(__spreadArray([], leaves), [leaves[leaves.length - 1]]));
    if (leaves.length % 2 === 0) {
        return fp_1.default.pipe(fp_1.default.chunk(2), fp_1.default.map(function (_a) {
            var a = _a[0], b = _a[1];
            return SHA256(a + b);
        }), getMerkleRootHashHelper)(leaves);
    }
    return '';
};
var getBlockHash = function (target) {
    return SHA256('');
};
var getTxHash = function (target) {
    return SHA256('');
};
var getTxString = function (target) {
    return target.from + target.to + target.amount;
};
var txs = [
    { from: 'address1', to: 'address2', amount: '100', signature: 'zeb' },
    { from: 'address1', to: 'address3', amount: '300', signature: 'zeb' },
    { from: 'address1', to: 'address4', amount: '300', signature: 'zeb' },
    { from: 'address1', to: 'address5', amount: '300', signature: 'zeb' },
    { from: 'address1', to: 'address6', amount: '300', signature: 'zeb' }
];
console.log(getMerkleRootHash(txs));
