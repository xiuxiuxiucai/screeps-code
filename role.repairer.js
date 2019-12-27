var publicMethod = require('public.method');
// 1
/**
 * 维修者
 * transfer
 * 随机维修一个需要维修的建筑物，随机概率由建筑损坏率决定
 */
var roleRepairer = {

    /**
     * 维修
     * 
     * creep
     *      蠕虫对象
     * containerObject:
     *      容器对象
     */
    work: function(creep, containerObject) {
        // 确定工作对象之后会持续10T
        var workObjectTime = 10;

        // 更新工作状态
        publicMethod.setIsWork(creep);
        
		// 如果当前状态为工作，就去维修
	    if(creep.memory.working) {
            // 判断上一个工作对象的工作时间
            if(creep.memory.workObjectTime > 0) {
                // 时间减一
                creep.memory.workObjectTime -= 1;
                // 获取工作对象
                var workObject = Game.getObjectById(creep.memory.workObjectId);
                if(!workObject) {
                    creep.moveTo(15, 45, {visualizePathStyle: {stroke: creep.memory.pathColour}});
                    return;
                }
                // 判断工作对象是否满血，如果满血，换对象
                if(workObject.hits < workObject.hitsMax) {
                    // 工作
                    if(creep.repair(workObject) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(workObject, {visualizePathStyle: {stroke: creep.memory.pathColour}});
                    }
                }else {
                    creep.memory.workObjectTime = 0;
                    return;
                }
            }else {
                // 获取新的工作对象
                // 得到房间损坏率最大的建筑物对象
                var maxHitsLessen = 0;
                var maxLessenStruct;
                // 判断所有建筑物类型
                for(var structure of creep.room.find(FIND_STRUCTURES)) {
                    // 获取建筑最大生命值，如果等于墙或域，不需要满血
                    if(structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) {
                        var realHitsMax = 1000000;
                    }else {
                        var realHitsMax = structure.hitsMax;
                    }
                    // 判断建筑是否损坏
                    if(structure.hits < realHitsMax) {
                        // 计算损坏率
                        var hitsLessen = (realHitsMax - structure.hits) / realHitsMax;
                        // 取损坏率最大的
                        if(hitsLessen > maxHitsLessen) {
                            // 更新损坏率
                            maxHitsLessen = hitsLessen;
                            // 更新对象
                            maxLessenStruct = structure;
                        }
                    }
                }
                // 维修
                if(maxLessenStruct) {
                    // 记录新的工作对象
                    creep.memory.workObjectId = maxLessenStruct.id;
                    // 刷新合同时间
                    creep.memory.workObjectTime = workObjectTime;
                    // 工作
                    if(creep.repair(maxLessenStruct) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(maxLessenStruct, {visualizePathStyle: {stroke: creep.memory.pathColour}});
                    }
                }else {
                    // 当没有建筑是损坏了的时候，maxLessenStruct会为null，此时回家
                    creep.moveTo(15, 45, {visualizePathStyle: {stroke: creep.memory.pathColour}});
                }


                // // 记录房间损坏率的map
                // var hitsLessenMap = new Map();
                // // 损坏率之和
                // var hitsLessenSum = 0;
                // // 判断所有建筑物类型
                // for(var structure of creep.room.find(FIND_STRUCTURES)) {
                //     // 获取建筑最大生命值，如果等于墙或域，不需要满血
                //     if(structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) {
                //         var realHitsMax = 1000000;
                //     }else {
                //         var realHitsMax = structure.hitsMax;
                //     }
                //     // 判断建筑是否损坏
                //     if(structure.hits < realHitsMax) {
                //         // 计算损坏率
                //         var hitsLessen = (realHitsMax - structure.hits) / realHitsMax;
                //         // 存入map
                //         hitsLessenMap.set(structure, hitsLessen);
                //         // 求和
                //         hitsLessenSum += hitsLessen;
                //     }
                // }
                // // 如果没有任何损坏的建筑物
                // if(hitsLessenMap.size < 1) {
                //     creep.moveTo(15, 45, {visualizePathStyle: {stroke: creep.memory.pathColour}});
                //     return;
                // }
                // // 在0至损坏率和之间随机取一个数
                // var randNumber = Math.random() * hitsLessenSum;
                // // console.log(randNumber);
                // // 遍历损坏率map，得到随机数对应的建筑
                // var i = 0;
                // var hitsLessenSum = 0;
                // for(var hitsLessen of hitsLessenMap) {
                //     // 求和
                //     hitsLessenSum += hitsLessen[1];
                //     // 判断
                //     if(hitsLessenSum > randNumber) {
                //         // 记录新的工作对象
                //         creep.memory.workObjectId = hitsLessen[0].id;
                //         // 刷新合同时间
                //         creep.memory.workObjectTime = workObjectTime;
                //     }
                // }
            }
            // var targets = creep.room.find(FIND_STRUCTURES, {
            //     // 判断所有建筑物类型
            //     filter: (structure) => {
            //         // 如果房间是墙或域，则判断其大小是否是1M
            //         if(structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_WALL && structure.hits < 1000000) {
            //             return true;
            //         }else {
            //             return structure.id == '5e021f3469b91b84f4242d36';
            //         }
            //     }
            // });
			// // 取前面得到的所有有空余容量的建筑物的第一个
            // if(targets.length > 0) {
            //     if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(targets[0], {visualizePathStyle: {stroke: creep.memory.pathColour}});
            //     }
            // }
        }
        else {
            // 前往容器获取能量，如果容器不可用，哪凉快哪呆着
            if(!publicMethod.getPower(creep, containerObject)) {
                creep.moveTo(15, 45, {visualizePathStyle: {stroke: creep.memory.pathColour}});
            }
        }
    },
    
    /**
     * 获取建筑最大生命值
     * 
     * creep
     *      蠕虫对象
     * containerObject:
     *      容器对象
     */
    // realHitsMax: function(structureType) {
    // }
};

module.exports = roleRepairer;