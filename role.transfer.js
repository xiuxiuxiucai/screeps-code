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
        if(!containerObject) {
            return;
        }
        // 更新工作状态
        publicMethod.setIsWork(creep);
        
		// 如果当前状态为工作，就把能量放到仓库
	    if(creep.memory.working) {
            roleTransfer.transferEnergy(creep);
        }else {
            // 前往容器获取能量，返回是否成功
            // 容器是否在蠕虫当前房间
            if(containerObject.room == creep.room) {
                var boolean = publicMethod.getPower(creep, containerObject);
            }
            // 如果容器不可用，寻找下一个
            if(!boolean) {
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
     * 采矿然后运输者
     */
    harvesterTransfer: function(creep) {
        // 更新工作状态
        publicMethod.setIsWork(creep);
        
		// 如果当前状态为工作
	    if(creep.memory.working) {
            // 前往自己房间
            if(creep.room.name == 'E51S9') {
                // 填充仓库
                roleTransfer.transferEnergy(creep);
            }else {
                creep.moveTo(new RoomPosition(3, 27, 'E51S9'), {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }
        }else {
            // 目标位置
			var destination = new RoomPosition(31, 39, 'E49S8');
            // 如果蠕虫不在目标上，则向目标移动
            if(!creep.pos.isEqualTo(destination)) {
                creep.moveTo(destination, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }else {
                var containerObject = Game.getObjectById('5bbcaff69099fc012e63b6e8');
                creep.harvest(containerObject);
            }
        }
    },

    /**
     * 外出运输能量者
     * 
     * storeCoord
     *      仓库房间坐标对象，仓库房间内的任意坐标（尽量靠近房间门）
     * energyCoord
     *      需要能量矿时前进的坐标，可以不是本房间内的
     */
    outTransferEnergy: function(creep, storeCoord, energyCoord, energyId) {
        // 更新工作状态
        publicMethod.setIsWork(creep);
        
		// 如果当前状态为工作
	    if(creep.memory.working) {
            // 如果当前房间为仓库房间
            if(creep.room.name == storeCoord.roomName) {
                // 调用填充仓库方法
                roleTransfer.transferEnergy(creep);
            }else {
                // console.log('B');
                creep.moveTo(storeCoord, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }
        }else {
            // 如果蠕虫不在目标上，则向目标移动
            if(!creep.pos.isEqualTo(energyCoord)) {
                creep.moveTo(energyCoord, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }else {
                var containerObject = Game.getObjectById(energyId);
                creep.harvest(containerObject);
            }
        }
    },

    /**
     * 外出偷盗者
     */
    outTransferSteal: function(creep) {
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
                creep.moveTo(destination, {visualizePathStyle: {stroke: creep.memory.pathColour}});
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
    },

    /**
     * 把能量放到离自己最近的一个仓库
     */
    transferEnergy: function(creep) {
        // 获取房间所有的符合条件的建筑物中离蠕虫最近的一个
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            // 判断所有房间类型
            filter: (structure) => {
                // 如果房间是出生点或者仓库，则判断其容量是否还有空余
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        // 没有任何仓库则回家
        if(target) {
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }
        }else {
            creep.moveTo(15, 45, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            return;
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