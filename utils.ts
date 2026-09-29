import { Coordinates } from "./types";

export async function sleep(ms: number)
{
    return new Promise(res => setTimeout(res, ms))
}

export function coordRange(from: Coordinates, to: Coordinates): Coordinates[]
{
    const coords = []
    for (let x = from.x; x < to.x + 1; x += (from.x <= to.x ? 1 : -1))
    {
        for (let y = from.y; y < to.y + 1; y += (from.y <= to.y ? 1 : -1))
            coords.push({ x, y })
    }
    return coords
}

export function indexOfMulti(array: Uint8Array, searchElements: number[], fromIndex: number): number
{
    fromIndex = fromIndex || 0;

    const index = Array.prototype.indexOf.call(array, searchElements[0], fromIndex);
    if (searchElements.length === 1 || index === -1)
    {
        // Not found or no other elements to check
        return index;
    }

    for (var i = index, j = 0; j < searchElements.length && i < array.length; i++, j++)
    {
        if (array[i] !== searchElements[j])
        {
            return indexOfMulti(array, searchElements, index + 1);
        }
    }

    return (i === index + searchElements.length) ? index : -1;
};

export function appendBuffer(buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer
{
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
}
