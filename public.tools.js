/**
 * 工具类
 */
let publicTools = {
    /**
     * 获取随机整数
     * @param {*} min 
     * @param {*} max 
     */
    getRandom: function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
};

module.exports = publicTools;