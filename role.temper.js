// 1
// 临时工
var roleTemper = {

    /** @param {Creep} creep **/
    work: function(creep) {
		// 如果当前状态为工作并且携带能量为0，则当前状态转为不工作，即补充能量
        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('能量用尽', creep.memory.role);
	    }
		// 如果当前状态为补充能量并且剩余携带空间为0，则当前状态转为工作
	    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
	        creep.memory.working = true;
	        creep.say('充能完毕', creep.memory.role);
        }
        
		// 如果当前状态为工作
	    if(creep.memory.working) {
            var targets = Game.rooms['E51S9'].find(FIND_STRUCTURES, {
                // 判断所有房间类型
                filter: (structure) => {
                    // 如果房间是出生点或者仓库，则判断其容量是否还有空余
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
			// 选择其中一个有空余容量的房间，此处为倒序，因为希望优先填充仓库；没有任何房间则什么也不做
            if(targets.length > 0) {
                if(creep.transfer(targets[targets.length - 1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[targets.length - 1], {visualizePathStyle: {stroke: creep.memory.pathColour}});
                }
            }else if(targets.length == 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: creep.memory.pathColour}});
                }
            }
        }
        else {
            // 找到房间内所有能量矿
			var destination = new RoomPosition(31, 39, 'E49S8');
            // 如果蠕虫不在目标上，则向目标移动
            if(!creep.pos.isEqualTo(destination)) {
                creep.moveTo(destination, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }else {
                var containerObject = Game.getObjectById('5bbcaff69099fc012e63b6e8');
                console.log(creep.harvest(containerObject));
            }
        }
	}
};

module.exports = roleTemper;