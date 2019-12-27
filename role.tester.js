var publicMethod = require('public.method');
// 1
// 测试者
var roleTester = {

    // Game.spawns['S1'].spawnCreep( [WORK, CARRY, MOVE], 'tester', { memory: { role: 'tester', working: false, pathColour: '#ffffff' } } );
    // Game.spawns['S1'].spawnCreep( [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 'tester', { memory: { role: 'tester', working: 'fasle', pathColour: '#ffffff' } } );
    work: function(creep) {
        creep.say('喵！！');
        
        // 如果状态为工作则前往目标取货
        if(creep.memory.working) {
            // 目标坐标
            var destination = new RoomPosition(12, 11, 'E49S8');
            // 如果不在目标坐标则前往
            if(!creep.pos.isEqualTo(destination)) {
                creep.moveTo(destination, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }else {
                // 如果在目标坐标上则取货
                var containerObject = Game.getObjectById('5dcc8489473b076495a7fc7b');
                // 容器里是否有东西
                var containerBoolean = false;
                // 遍历容器所有货物
                for(var esyaStore in containerObject.store) {
                    // 除了能量之外取任意物品
                    if(esyaStore != RESOURCE_ENERGY) {
                        // 证明容器里还有东西
                        containerBoolean = true;
                        creep.withdraw(containerObject, esyaStore);
                        break;
                    }
                }
                // 如果蠕虫的剩余携带能力为0，或者容器没有东西，切换工作状态
                if(creep.store.getFreeCapacity() == 0 || !containerBoolean) {
                    creep.memory.working = false;
                }
            }
        }else {
			var homeObject = Game.getObjectById('5e0527f3384933911cadbaf9');
			var destination = new RoomPosition(33, 34, 'E51S9');
            if(!creep.pos.isEqualTo(destination)) {
                // console.log(creep.store);
                creep.moveTo(homeObject, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }else {
                // 蠕虫是否携带了任何东西
                var creepBoolean = false;
                for(var esyaStore in creep.store) {
                    creepBoolean = true;
                    creep.transfer(homeObject, esyaStore);
                    break;
                }
                // 如果蠕虫的携带数为0，切换工作状态
                if(!creepBoolean) {
                    creep.memory.working = true;
                }
            }
        }


        // // // 更新工作状态
        // publicMethod.setIsWork(creep);
        
	    // // // 如果当前状态为工作，就去偷窃
	    // if(creep.memory.working) {
        //     var targets = creep.room.find(FIND_STRUCTURES, {
        //         // 判断所有房间类型
        //         filter: (structure) => {
        //             // 如果房间是出生点或者仓库，则判断其容量是否还有空余
        //             return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
        //                 structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        //         }
        //     });
        //     // 选择其中一个有空余容量的房间，此处为倒序，因为希望优先填充仓库；没有任何房间则什么也不做
        //     if(targets.length > 0) {
        //         if(creep.transfer(targets[targets.length - 1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //             creep.moveTo(targets[targets.length - 1], {visualizePathStyle: {stroke: creep.memory.pathColour}});
        //         }
        //     }else if(targets.length == 0) {
        //         if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //             creep.moveTo(targets[0], {visualizePathStyle: {stroke: creep.memory.pathColour}});
        //         }
        //     }
	    // }
        // else {
        //     // 前往容器获取能量，如果容器不可用，哪凉快哪呆着
        //     containerObject = Game.getObjectById('5e021f3469b91b84f4242d36');
        //     if(!publicMethod.getPower(creep, containerObject)) {
                // creep.moveTo(15, 45);
        //     }
		// }
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