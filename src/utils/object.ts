/**
 * Update attribute in object even if its deep
 * If this attribute does not exist, creates it
 *
 * @param obj Object to be updated
 * @param deepAttr Attribute value to update. Form: "a.b.c"
 * @param value Value to assign to this attribute
 */
export function updateObjectAttribute(obj: any, deepAttr: string, value: any) {
    recursiveUpdateObjectAttribute(obj, deepAttr.split("."), value);
}

function recursiveUpdateObjectAttribute(obj: any, chainedAttrs: string[], value: any) {
    const attr = chainedAttrs.shift();

    if (!obj.hasOwnProperty(attr)) {
        // Create new object
        obj[attr] = {};
    }


    if (chainedAttrs.length === 0) {
        // No more attribute, apply value
        obj[attr] = value;
    } else {
        recursiveUpdateObjectAttribute(obj, chainedAttrs, value);
    }
}
