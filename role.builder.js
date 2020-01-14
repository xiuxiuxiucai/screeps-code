let publicMethod = require('public.method');
let roleUpgrader = require('role.upgrader');
let gameConfigs = require('game.configs');

// 建造者
let roleBuilder = {

    /**
     * builder
     * 建造
     * 
     * creep
     *      蠕虫对象
     * containerObject:
     *      容器对象
     * energyId
     *      能量矿id，在容器消失时builder只能自己采矿然后建造容器
     */
    work: function(creep, containerObject, energyId) {
        // 更新工作状态
        publicMethod.setIsWork(creep);
        // 能量矿对象
        let energyObject = Game.getObjectById(energyId);
        
	    // 如果当前状态为工作，就去建造
	    if(creep.memory.isWorking) {
	        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
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
                // creep.moveTo(15, 45, {visualizePathStyle: {stroke: creep.memory.pathColour}});
                if(creep.harvest(energyObject) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energyObject);
                }
            }
		}
	},
    
    /**
     * 初始建造者，自己采集能量
     * @param creep
     * @param targetCreeps 汇总所有虫子的目标，存入对象
     */
    firstBuilder: function(creep, targetCreeps) {
        // 更新工作状态
        publicMethod.setIsWork(creep);

        // 当前状态是否为工作
        if(creep.memory.isWorking) {
	        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			// 前往工地
            if(targets.length > 0) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: creep.memory.pathColour}});
                }
            }else {
                // 暂时换升级者职业
                roleUpgrader.firstUpgrader(creep, targetCreeps);
            }
        }else {
            // 判断有没有能量矿目标
            if(!creep.memory.targetId) {
                // 更新目标
                publicMethod.setSourcesTarget(creep, targetCreeps);
            }
            // 前往目标获取能量
            let targetSource = Game.getObjectById(creep.memory.targetId);
            if(creep.harvest(targetSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetSource, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }
        }
    }
};

module.exports = roleBuilder;