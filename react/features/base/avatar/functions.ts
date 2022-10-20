import GraphemeSplitter from 'grapheme-splitter';
import _ from 'lodash';

const AVATAR_COLORS = [
    '#6A50D3',
    '#FF9B42',
    '#DF486F',
    '#73348C',
    '#B23683',
    '#F96E57',
    '#4380E2',
    '#2AA076',
    '#00A8B3'
];
const wordSplitRegex = (/\s+|\.+|_+|;+|-+|,+|\|+|\/+|\\+|"+|'+|\(+|\)+|#+|&+/);
const splitter = new GraphemeSplitter();

export const AVATAR_SETTINGS = {
    // eslint-disable-next-line max-len
    top: [ 'NoHair', 'Eyepatch', 'Hat', 'Hijab', 'Turban', 'WinterHat1', 'WinterHat2', 'WinterHat3', 'WinterHat4', 'LongHairBigHair', 'LongHairBob', 'LongHairBun', 'LongHairCurly', 'LongHairCurvy', 'LongHairDreads', 'LongHairFrida', 'LongHairFro', 'LongHairFroBand', 'LongHairNotTooLong', 'LongHairShavedSides', 'LongHairMiaWallace', 'LongHairStraight', 'LongHairStraight2', 'LongHairStraightStrand', 'ShortHairDreads01', 'ShortHairDreads02', 'ShortHairFrizzle', 'ShortHairShaggyMullet', 'ShortHairShortCurly', 'ShortHairShortFlat', 'ShortHairShortRound', 'ShortHairShortWaved', 'ShortHairSides', 'ShortHairTheCaesar', 'ShortHairTheCaesarSidePart' ]
};

/**
 * Generates the background color of an initials based avatar.
 *
 * @param {string?} initials - The initials of the avatar.
 * @param {Array<string>} customAvatarBackgrounds - Custom avatar background values.
 * @returns {string}
 */
export function getAvatarColor(initials: string | undefined, customAvatarBackgrounds: Array<string>) {
    const hasCustomAvatarBackgronds = customAvatarBackgrounds?.length;
    const colorsBase = hasCustomAvatarBackgronds ? customAvatarBackgrounds : AVATAR_COLORS;

    let colorIndex = 0;

    if (initials) {
        let nameHash = 0;

        for (const s of initials) {
            nameHash += Number(s.codePointAt(0));
        }

        colorIndex = nameHash % colorsBase.length;
    }

    return colorsBase[colorIndex];
}


/**
 * Generates the same setting name based on initials of the participant.
 *
 * @param {string?} initials - The initials of the avatar.
 * @param {Array<string>} settings - Custom avatar setting array.
 * @returns {string}
 */
export function getAvatarSettingName(initials: string, settings: []) {
    let index = 0;

    if (initials) {
        let nameHash = 0;

        for (const s of initials) {
            nameHash += Number(s.codePointAt(0));
        }

        index = nameHash % settings.length;
    }

    return settings[index];
}

/**
 * Returns the first grapheme from a word, uppercased.
 *
 * @param {string} word - The string to get grapheme from.
 * @returns {string}
 */
function getFirstGraphemeUpper(word: string) {
    if (!word?.length) {
        return '';
    }

    return splitter.splitGraphemes(word)[0].toUpperCase();
}

/**
 * Generates initials for a simple string.
 *
 * @param {string?} s - The string to generate initials for.
 * @returns {string?}
 */
export function getInitials(s?: string) {
    // We don't want to use the domain part of an email address, if it is one
    const initialsBasis = _.split(s, '@')[0];
    const [ firstWord, secondWord ] = initialsBasis.split(wordSplitRegex).filter(Boolean);

    return getFirstGraphemeUpper(firstWord) + getFirstGraphemeUpper(secondWord);
}

/**
 * Checks if the passed URL should be loaded with CORS.
 *
 * @param {string} url - The URL.
 * @param {Array<string>} corsURLs - The URL pattern that matches a URL that needs to be handled with CORS.
 * @returns {void}
 */
export function isCORSAvatarURL(url: string, corsURLs: Array<string> = []): boolean {
    return corsURLs.some(pattern => url.startsWith(pattern));
}
