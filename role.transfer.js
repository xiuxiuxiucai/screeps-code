var publicMethod = require('public.method');
// 1
// 运输者
var roleTransfer = {

    /**
     * transfer
     * 传输能量
     * 
     * creep
     *      蠕虫对象
     * containerObject:
     *      容器对象
     */
    work: function(creep, containerObject) {
        // 更新工作状态
        publicMethod.setIsWork(creep);
        
		// 如果当前状态为工作，就把能量放到仓库
	    if(creep.memory.working) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                // 判断所有房间类型
                filter: (structure) => {
                    // 如果房间是出生点或者仓库，则判断其容量是否还有空余
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
			// 选择其中一个有空余容量的房间，此处为倒序，因为希望优先填充仓库；没有任何房间则回家
            if(targets.length > 0) {
                if(creep.transfer(targets[targets.length - 1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[targets.length - 1], {visualizePathStyle: {stroke: creep.memory.pathColour}});
                }
            }else if(targets.length == 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: creep.memory.pathColour}});
                }
            }else {
                creep.moveTo(15, 45, {visualizePathStyle: {stroke: creep.memory.pathColour}});
                return;
            }
        }else {
            // 前往容器获取能量，如果容器不可用，寻找下一个
            if(!publicMethod.getPower(creep, containerObject)) {
                // 遍历所有建筑
                var sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        // 判断建筑是否为容器，并且不能等于上面代码测过的那个容器
                        return structure.structureType == STRUCTURE_CONTAINER && structure.id != containerObject.id;
                    }
                });
                for(var sourcesObject of sources) {
                    // 如果找到合适的容器了，就不用再找了
                    if(publicMethod.getPower(creep, sourcesObject)) {
                        var boolean = true;
                        break;
                    }
                }
                // 没有活干了，歇着去
                if(!boolean) {
                    creep.moveTo(15, 45, {visualizePathStyle: {stroke: creep.memory.pathColour}});
                }
            }
        }
	},
    
    /**
     * 保持此类蠕虫数量
     * 
     * roleNumber
     *      期望数量
     * containerIdArray
     *      由容器id组成的数组（矿工使用的容器）
     */
    setNumber: function(roleNumber, containerIdArray) {
        // 如果运输者全部死亡，剩余能量不足孵化一个运输者，能量就不会增长，就孵化小型运输者
        var harvesterNumber = _.filter(Game.creeps, (creep) => creep.memory.role == 'transfer');
        if(harvesterNumber.length == 0 && Game.rooms['E51S9'].energyAvailable < 600) {
            publicMethod.life('smallTransfer');
        }else {
            publicMethod.setRoleNumber('transfer', roleNumber);
        }
    }
};

module.exports = roleTransfer;