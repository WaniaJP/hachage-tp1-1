import { readFile, writeFile } from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'node:crypto';
import {getDate, monSecret} from "./divers.js";

/* Chemin de stockage des blocks */
const path = './data/blockchain.json';

/**
 * Définition d'un bloc
 * @typedef { id: string, nom: string, don: number, date: string,hash: string} Block
 * @property {string} id
 * @property {string} nom
 * @property {number} don
 * @property {string} date
 * @property {string} string
 */

/**
 * Renvoie un tableau JSON de tous les blocs
 * @return {Promise<any>}
 */
export async function findBlocks() {
    try {
        const fileContent = await readFile(path, 'utf-8');
        return JSON.parse(fileContent) || [];
    } catch (error) {
        return [];
    }
}

/**
 * Trouve un bloc à partir de son id
 * @param partialBlock
 * @return {Promise<Block[]>}
 */
export async function findBlock(partialBlock) {
    try {
        const blocks = await findBlocks();
        const foundBlock = blocks.find((block) => block.id === partialBlock.id);

        if (!foundBlock) {
            return { error: true, message: "Le bloc n'a pas été trouvé." };
        }

        const index = blocks.indexOf(foundBlock);
        const blocksToCheck = blocks.slice(0, index + 1);

        if (!verifBlocks(blocksToCheck)) {
            return { error: true, message: "L'intégrité de la chaîne est compromise." };
        }

        return foundBlock;
    } catch (error) {
        return { error: true, message: `Erreur lors de la recherche du bloc : ${error.message}` };
    }
}

/**
 * Trouve le dernier block de la chaine
 * @return {Promise<Block|null>}
 */
export async function findLastBlock() {
    try {
        const blocks = await findBlocks();
        return blocks.length > 0 ? blocks[blocks.length - 1 ] : null;
    } catch (error) {
        return { error: true, message: `Erreur lors de la recherche du dernier bloc : ${error.message}` };
    }
}

/**
 * Création d'un block depuis le contenu json
 * @param contenu
 * @return {Promise<Block[]>}
 */
export async function createBlock(contenu) {
    try {
        const blocks = await findBlocks();
        const newBlock = {
            id: uuidv4(),
            nom: contenu.nom,
            don: contenu.don,
            date: getDate(),
            hash: blocks.length > 0 ? createHash('sha256').update(JSON.stringify(findLastBlock(blocks))).digest('hex') : createHash('sha256').update(monSecret).digest('hex'),
        };

        blocks.push(newBlock);
        await writeFile(path, JSON.stringify(blocks, null, 2), 'utf-8');
        return newBlock;
    } catch (error) {
        return { error: true, message: `Erreur lors de la création d'un nouveau bloc : ${error.message}` };
    }
}

/**
 * Vérifie l'intégrité de la chaîne en vérifiant les valeurs de hachage.
 * @return {Promise<boolean>} true si la chaîne est intègre, false sinon.
 */
export async function verifBlocks() {
    try {
        const blocks = await findBlocks();
        if (blocks.length > 1) {
            for (let i = 1; i < blocks.length; i++) {
                const prevBlockHashInput = JSON.stringify(blocks[i - 1]);
                const prevBlockHash = createHash('sha256').update(prevBlockHashInput).digest('hex');

                if (prevBlockHash !== blocks[i].hash) {
                    return { error: true, message: "L'intégrité de la chaîne est compromise. Les valeurs de hachage ne correspondent pas." };
                }
            }
        }
        return { error: false, message: "La chaîne est intègre. Les valeurs de hachage correspondent." };
    } catch (error) {
        return { error: true, message : "Erreur lors de la vérification de l'intégrité de la chaîne."};
    }
}



