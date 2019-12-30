var publicMethod = require('public.method');
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
var roleHarvester = {

    /**
     * 工作方法，即一直不停的挖矿
     * 
     * creep
     *      蠕虫对象
     * containerSourceMap
     *      容器：能量矿的map
     */
    work: function(creep, containerSourceMap) {
        // 蠕虫当前位置的所有建筑
        var structures = creep.pos.lookFor(LOOK_STRUCTURES);
        // 蠕虫是否需要移动
        var isMoveTo = true;
        // 遍历建筑，查看是否有容器
        for(var structure of structures) {
            // 如果脚下有容器，并且容器是目标之一，开始工作
            if(structure.structureType == STRUCTURE_CONTAINER && containerSourceMap.get(structure.id)) {
                // 能量矿对象
                var nowSource = Game.getObjectById(containerSourceMap.get(structure.id));
                // 不用移动了
                isMoveTo = false;
                // 挖矿
                creep.harvest(nowSource);
            }
        }
		// 当前不在目标中的容器上，寻找目标并前往
		if(isMoveTo) {
            // 遍历容器判断其上面是否有虫，取第一个无虫的
			for(var container of containerSourceMap) {
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
     * 保持此类蠕虫数量
     * 
     * nowRoom
     *      房间对象
     * nowRoleNumber
     *      当前数量
     * roleNumber
     *      期望数量
     * containerIdArray
     *      由容器id组成的数组（矿工使用的容器）
     */
    setNumber: function(nowRoom, nowRoleNumber, roleNumber, containerIdArray) {
        for(var creep of nowRoom.find(FIND_CREEPS)) {
            // 如果采矿者全部死亡，剩余能量不足孵化一个采矿者，容器能量又用尽了的话，能量就不会增长，就孵化小型采矿者
            if(nowRoleNumber== 0 && Game.rooms['E51S9'].energyAvailable < 550) {
                // 查看所有容器，只要还剩点能量，就等待传输者的表演
                for(var containerId of containerIdArray) {
                    if(Game.getObjectById(containerId).store[RESOURCE_ENERGY] > 0) {
                        var boolean = true
                    }
                }
                // 容器全空
                if(!boolean) {
                    publicMethod.life('smallHarvester');
                }
            }else {
                publicMethod.setRoleNumber('harvester', roleNumber);
            }
        }
    }
};

module.exports = roleHarvester;