let publicMethod = require('public.method');
let gameConfigs = require('game.configs');

// 升级者
let roleUpgrader = {

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
	    if(creep.memory.isWorking) {
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
	},

    /**
     * 外出运输能量来升级控制器
     */
    outTransferEnergy: function(creep) {
        // 更新工作状态
        publicMethod.setIsWork(creep);
        
		// 如果当前状态为工作
	    if(creep.memory.isWorking) {
			// 前往控制器
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }
        }
        else {
            // 目标位置
			let destination = new RoomPosition(31, 39, 'E49S8');
            // 如果蠕虫不在目标上，则向目标移动
            if(!creep.pos.isEqualTo(destination)) {
                creep.moveTo(destination, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }else {
                // 如果在目标上，获取目标对象
                let containerObject = Game.getObjectById('5bbcaff69099fc012e63b6e8');
                // 取能量
                creep.harvest(containerObject);
            }
        }
    },

    /**
     * 初始升级者，有WORK部件，自己采集能量然后去升级
     * @param creep
     * @param targetCreeps 汇总所有虫子的目标，存入对象
     */
    firstUpgrader: function(creep, targetCreeps) {
        // 更新工作状态
        publicMethod.setIsWork(creep);

        // 当前状态是否为工作
        if(creep.memory.isWorking) {
			// 前往控制器升级
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }
        }else {
            // 判断有没有目标
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

module.exports = roleUpgrader;