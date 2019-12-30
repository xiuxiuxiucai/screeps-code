/**
 * 角色的方法
 */
var roleMethod = {

    /**
     * 移动至目标并获取容器物品
     * 
     * creep
     *      蠕虫，必传
     * targetId
     *      目标对象id，必传
     * targetPos
     *      目标对象坐标，必传
     * something
     *      要获取的物品，不必传
     */
    moveAndGet: function(creep, targetId, targetPos, something) {
        // 如果能获取到对象，使用能否获取对象物品作为是否移动的条件；获取不到对象，则说明此对象不在当前房间内，使用是否在目标对象坐标上作为移动条件
        var targetObject = Game.getObjectById(targetId);
        if(targetObject) {
            // 没有传对象物品就取对象中任意物品
            if(!something) {
                // 随机取对象的一个货物
                for(var esyaStore in targetObject.store) {
                    var something = esyaStore;
                    break;
                }
            }
            // 不能获取到对象物品就向对象移动
            if(creep.transfer(targetObject, something) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetObject, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }
        }else {
            // 如果不在目标坐标则前往
            if(!creep.pos.isEqualTo(targetPos)) {
                creep.moveTo(targetPos, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }else {
                // 如果在目标坐标上则报错，因为在目标对象坐标上，却获取不到目标对象
                publicMethod.creepError(creep, '我在目标对象坐标上，却获取不到目标对象');
            }
        }
    }

};

module.exports = roleMethod;