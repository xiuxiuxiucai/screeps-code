var publicMethod = require('public.method');
// 1
// 升级者
var roleUpgrader = {

    /**
     * transfer
     * 升级控制器
     * 
     * creep
     *      蠕虫对象
     * containerObject:
     *      容器对象
     */
    work: function(creep, containerObject) {
        // 更新工作状态
        publicMethod.setIsWork(creep);
        
	    // 如果当前状态为工作，就去升级控制器
	    if(creep.memory.working) {
			// 前往控制器
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }
        }else {
            // 前往容器获取能量，如果容器不可用，哪凉快哪呆着
            if(!publicMethod.getPower(creep, containerObject)) {
                creep.moveTo(15, 45, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }
        }
	}
};

module.exports = roleUpgrader;