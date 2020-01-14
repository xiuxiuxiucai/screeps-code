let publicMethod = require('public.method');
let gameConfigs = require('game.configs');

// 测试者
let roleTester = {

    // Game.spawns['S1'].spawnCreep( [WORK, CARRY, MOVE], 'tester', { memory: { role: 'tester', isWorking: false, pathColour: '#ffffff' } } );
    // Game.spawns['S1'].spawnCreep( [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 'tester', { memory: { role: 'tester', isWorking: 'fasle', pathColour: '#ffffff' } } );
    work: function(creep) {
        creep.say('喵！！');

	}
};

module.exports = roleTester;

/* 收藏代码
// 如果当前状态为工作，就去建造
	    if(creep.memory.isWorking) {
	        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			// 前往工地
            if(targets.length > 0) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: creep.memory.pathColour}});
                }
            }
        }

// 如果当前状态为工作，就去物流
        let targets = creep.room.find(FIND_STRUCTURES, {
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

// 占领新房间
    // 生成creep
    // Game.spawns['S1'].spawnCreep( [ CLAIM, MOVE, MOVE ], 'claimer', { memory: { role: 'claimer' } } );
    // 要占领房间的 nowCreep
    const nowCreep = Game.creeps['claimer']
    // 要占领的房间
    // 注意这一句有可能会获取不到 room 对象，下面会解释
    const room = Game.rooms['E49S8']
    // 如果该房间不存在就先往房间走
    if (!room) {
        nowCreep.moveTo(new RoomPosition(25, 25, 'E49S8'))
    }
    else {
        // 如果房间存在了就说明已经进入了该房间
        // 移动到房间的控制器并占领
        if (nowCreep.claimController(room.controller) == ERR_NOT_IN_RANGE) {
            nowCreep.moveTo(room.controller)
        }
    }

// 占领新房间后修建Spawn
    // 生成creep
    // Game.spawns['S1'].spawnCreep( [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 'tempBuild', { memory: { role: 'tempBuild', isWorking: false, pathColour: '#00FFFF' } } );
    // 要占领房间的 nowCreep
    const nowCreep = Game.creeps['tempBuild']
    // 能量矿对象
    const targetSource = Game.getObjectById('5bbcaff69099fc012e63b6e8')
    // 维修对象
    const targetObject = Game.getObjectById('5e0b6715e15215042b0db1a5')
    // 更新工作状态
    publicMethod.setIsWork(nowCreep);
    // 如果当前状态为工作，建造
    if(nowCreep.memory.isWorking) {
        // 前往工地
        if(nowCreep.build(targetObject) == ERR_NOT_IN_RANGE) {
            nowCreep.moveTo(targetObject);
        }
    }else {
        // 前往容器获取能量
        if(nowCreep.harvest(targetSource) == ERR_NOT_IN_RANGE) {
            nowCreep.moveTo(targetSource);
        }
    }
*/