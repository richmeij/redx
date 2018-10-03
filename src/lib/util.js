/**
 * Count number of occurences for a property with a specific value in an object
 * @param {Object} source       Object to search
 * @param {string} propName     Property name to look for
 * @param {string} propVal      Property value to look for
 * @param {number} [maxDepth=-1]        Max depth to traverse. -1 is no maximum depth.
 * @param {number} [currentDepth=0]    The current depth
 * @param {number} [counter=0]         The number of occurences found so far
 * @returns {number} The number of occurences found
 */
/* eslint-disable no-param-reassign */
export function findProperty(source, propName, propVal, currentDepth = 0, maxDepth = -1, counter = 0) {
    return Object.keys(source).reduce((counter, key) => {
        const val = source[key];
        if (typeof val === 'object' && (currentDepth < maxDepth || maxDepth === -1)) {
            counter += findProperty(val, propName, propVal, currentDepth + 1, maxDepth, counter);
        } else {
            if (key === propName && val === propVal) { // eslint-disable-line no-lonely-if
                counter++;
            }
        }
        return counter;
    }, counter);
}
/* eslint-enable no-param-reassign */

export function lowerCamelCase(sourceString) {
    return `${sourceString[0].toLowerCase()}${sourceString.slice(1)}`;
}

export function isEmptyObject(sourceObject) {
    return sourceObject &&
        sourceObject.constructor === Object
        && !objectHasValues(sourceObject);
}

export function objectHasValues(sourceObject) {
    return Object.keys(sourceObject).reduce((hasValues, key) => {
        return hasValues || (sourceObject[key] !== undefined);
    }, false);
}
