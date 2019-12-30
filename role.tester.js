var publicMethod = require('public.method');
// 1
// 测试者
var roleTester = {

    // Game.spawns['S1'].spawnCreep( [WORK, CARRY, MOVE], 'tester', { memory: { role: 'tester', working: false, pathColour: '#ffffff' } } );
    // Game.spawns['S1'].spawnCreep( [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 'tester', { memory: { role: 'tester', working: 'fasle', pathColour: '#ffffff' } } );
    work: function(creep) {
        creep.say('喵！！');
        
	}
};

module.exports = roleTester;

/* 收藏代码
// 如果当前状态为工作，就去建造
	    if(creep.memory.working) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			// 前往工地
            if(targets.length > 0) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: creep.memory.pathColour}});
                }
            }
        }

// 如果当前状态为工作，就去物流
        var targets = creep.room.find(FIND_STRUCTURES, {
            // 判断所有房间类型
            filter: (structure) => {
                // 如果房间是出生点或者仓库，则判断其容量是否还有空余
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
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
*/