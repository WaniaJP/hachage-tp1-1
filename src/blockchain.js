import {createBlock, findBlock, findBlocks, verifBlocks} from "./blockchainStorage.js";
import {json} from "node:stream/consumers"

export async function liste(req, res, url) {
    return findBlocks()
}

export async function create(req, res) {
    return createBlock(await json(req))
}

export async function findOne(req, res) {
    return findBlock(await json(req))
}

export async function check(req, res, url) {
    return verifBlocks();
}

