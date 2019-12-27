var publicMethod = require('public.method');
// 1
// 建造者
var roleBuilder = {

    /**
     * transfer
     * 建造
     * 
     * creep
     *      蠕虫对象
     * containerObject:
     *      容器对象
     */
    work: function(creep, containerObject) {
        // 更新工作状态
        publicMethod.setIsWork(creep);
        
	    // 如果当前状态为工作，就去建造
	    if(creep.memory.working) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			// 前往工地
            if(targets.length > 0) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: creep.memory.pathColour}});
                }
            }else {
                creep.moveTo(15, 45, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }
	    }
        else {
            // 前往容器获取能量，如果容器不可用，哪凉快哪呆着
            if(!publicMethod.getPower(creep, containerObject)) {
                creep.moveTo(15, 45, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }
		}
	}
};

module.exports = roleBuilder;