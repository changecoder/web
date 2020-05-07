const { refTypes } = require('../constants/type')

const deepCopy = (source) => {
    let result;
    if (Array.isArray(source)) {
        result = [];
        source.forEach((item, index) => {
            result[index] = deepCopy(item);
        });
    } else if (isRefObject(source)) {
        result = {};
        Object.keys(source).forEach(key => {
            result[key] = deepCopy(source[key]);
        });
    } else {
        result = source;
    }
    return result;
}

const isEmptyObject = (obj) => {

}

const isRefObject = (obj) => {
    const typeS = Object.prototype.toString.call(obj).replace(/[\[\]]/g, '').split(' ')[1];
    return refTypes.indexOf(typeS) > -1;
}

module.exports = {
  isRefObject,
  deepCopy,
  isEmptyObject
}