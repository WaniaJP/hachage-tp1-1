/**
 * @description Definie la variable pour le hash du premier bloc
 * @type {string}
 */
export const monSecret = "nuée";

/**
 * @description Retourne un timestamp au format aaaammjj-hh:mm:ss
 * @return {string}
 */
export function getDate() {
    return new Date().toString();
}