let publicMethod = require('public.method');
let roleTransfer = require('role.transfer');
let gameConfigs = require('game.configs');

/**
 * 采矿者
 * harvester
 * 
 * 移动至当前房间的挖矿容器：
 * 需要目标数组，其中重要的排在前面
 * 检测脚下是不是旗帜数组其中一个，是，结束代码，不是，继续代码
 * 遍历目标数组
 * 检测数组第一个有没有虫，没有，前往，
 * 有虫则判断此虫是不是采矿者，不是就让此虫回家，自己前往，是采矿者则遍历目标数组下一个
 * 如果全部有虫，回家
 * 
 * 挖矿：
 * 一直不停的挖矿，因为没有存储，多余的矿会掉落
 * 
 */
let roleHarvester = {

    /**
     * 工作方法，即一直不停的挖矿
     * 
     * creep
     *      蠕虫对象
     */
    work: function(creep) {
        let containerSourceMap = Memory.xiuRooms[creep.room.name].xiuSources;
        // 蠕虫是否需要移动
        let isMoveTo = true;
        // 遍历
        // for(let containerId in containerSourceMap) {
        //     let  containerSourceMap[containerId];
        //     if(.pos.lookFor(LOOK_CREEPS).length == 0) {
        //         creep.moveTo();
        //         break;
        //     }
        // }
        // 遍历脚下建筑，查看是否有容器
        for(let structure of structures) {
            // 如果脚下有容器，并且容器是目标之一，开始工作
            if(structure.structureType == STRUCTURE_CONTAINER && containerSourceMap.get(structure.id)) {
                // 能量矿对象
                let nowSource = Game.getObjectById(containerSourceMap.get(structure.id));
                // 不用移动了
                isMoveTo = false;
                // 挖矿
                creep.harvest(nowSource);
            }
        }
		// 当前不在目标中的容器上，寻找目标并前往
		if(isMoveTo) {
            // 遍历容器判断其上面是否有虫，取第一个无虫的
			for(let container of containerSourceMap) {
				// 容器对象
                containerObject = Game.getObjectById(container[0]);
                if(!containerObject) {
                    return;
                }
                // 容器是否在蠕虫当前房间
                if(containerObject.room == creep.room) {
                    // 容器上面没有蠕虫才符合条件
                    if(containerObject.pos.lookFor(LOOK_CREEPS).length == 0) {
                        // 前往符合条件的容器
                        creep.moveTo(containerObject, {visualizePathStyle: {stroke: creep.memory.pathColour}});
                    }
                }
			}
		}
    },
    
    /**
     * 初始采矿者，有CARRY部件，自己将采集的能量运输至仓库或出生点
     * @param creep
     * @param targetCreeps 汇总所有虫子的目标，存入对象
     */
    firstHarvester: function(creep, targetCreeps) {
        // 更新工作状态
        publicMethod.setIsWork(creep);

        // 当前状态是否为工作
        if(creep.memory.isWorking) {
            // 把能量放到离自己最近的一个仓库
            roleTransfer.transferEnergy(creep);
        }else {
            // 判断有没有目标
            if(!creep.memory.targetId) {
                // 更新目标
                publicMethod.setSourcesTarget(creep, targetCreeps);
            }
            // 前往目标获取能量
            let targetSource = Game.getObjectById(creep.memory.targetId);
            if(targetSource.energy == 0 && !(Game.time % 10)) {
                // 如果目标能量为0，更新，为防止所有目标都为0，导致频繁计算，设置10t算一次
                publicMethod.setSourcesTarget(creep, targetCreeps);
            }
            if(creep.harvest(targetSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetSource, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }
        }
    }
};

module.exports = roleHarvester;