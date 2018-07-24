
// REDUX UTIL
export const combineStores = (...stores) => {
    return stores.reduce((acc, cur) => {
        acc[cur.storeName] = cur;
        return acc;
    }, {});
};
