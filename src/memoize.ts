
const memoize = func => {
    const cache = {};
    return x => {
        if (x in cache === false) {
            cache[x] = func(x);
        }
        return cache[x];
    }
}

export default memoize;
