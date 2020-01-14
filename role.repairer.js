let publicMethod = require('public.method');
let gameConfigs = require('game.configs');

/**
 * 维修者
 * transfer
 * 随机维修一个需要维修的建筑物，随机概率由建筑损坏率决定
 */
let roleRepairer = {

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
        let workObjectTime = 20;

        // 更新工作状态
        publicMethod.setIsWork(creep);
        
		// 如果当前状态为工作，就去维修
	    if(creep.memory.isWorking) {
            // 判断上一个工作对象的工作时间
            if(creep.memory.workObjectTime > 0) {
                // 时间减一
                creep.memory.workObjectTime -= 1;
                // 获取工作对象
                let workObject = Game.getObjectById(creep.memory.workObjectId);
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
                let maxHitsLessen = 0;
                let maxLessenStruct;
                // 判断所有建筑物类型
                for(let structure of creep.room.find(FIND_STRUCTURES)) {
                    // 获取建筑最大生命值，如果等于墙或域，不需要满血
                    if(structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) {
                        let realHitsMax = 1000000;
                    }else {
                        let realHitsMax = structure.hitsMax;
                    }
                    // 判断建筑是否损坏
                    if(structure.hits < realHitsMax) {
                        // 计算损坏率
                        let hitsLessen = (realHitsMax - structure.hits) / realHitsMax;
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
                // let hitsLessenMap = new Map();
                // // 损坏率之和
                // let hitsLessenSum = 0;
                // // 判断所有建筑物类型
                // for(let structure of creep.room.find(FIND_STRUCTURES)) {
                //     // 获取建筑最大生命值，如果等于墙或域，不需要满血
                //     if(structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) {
                //         let realHitsMax = 1000000;
                //     }else {
                //         let realHitsMax = structure.hitsMax;
                //     }
                //     // 判断建筑是否损坏
                //     if(structure.hits < realHitsMax) {
                //         // 计算损坏率
                //         let hitsLessen = (realHitsMax - structure.hits) / realHitsMax;
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
                // let randNumber = Math.random() * hitsLessenSum;
                // // console.log(randNumber);
                // // 遍历损坏率map，得到随机数对应的建筑
                // let i = 0;
                // let hitsLessenSum = 0;
                // for(let hitsLessen of hitsLessenMap) {
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
            // let targets = creep.room.find(FIND_STRUCTURES, {
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
     * 初始维修者，自己采集能量
     * @param creep
     * @param targetCreeps 汇总所有虫子的目标，存入对象
     */
    firstRepairer: function(creep, targetCreeps) {
        // 确定工作对象之后会持续10T
        let workObjectTime = 20;
        // 更新工作状态
        publicMethod.setIsWork(creep);

        // 当前状态是否为工作
        if(creep.memory.isWorking) {
            // 判断上一个工作对象的工作时间
            if(creep.memory.workObjectTime > 0) {
                // 时间减一
                creep.memory.workObjectTime -= 1;
                // 获取工作对象
                let workObject = Game.getObjectById(creep.memory.workObjectId);
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
                let maxHitsLessen = 0;
                let maxLessenStruct;
                // 判断所有建筑物类型
                for(let structure of creep.room.find(FIND_STRUCTURES)) {
                    // 获取建筑最大生命值，如果等于墙或域，不需要满血
                    let realHitsMax;
                    if(structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) {
                        realHitsMax = 1000000;
                    }else {
                        realHitsMax = structure.hitsMax;
                    }
                    // 判断建筑是否损坏
                    if(structure.hits < realHitsMax) {
                        // 计算损坏率
                        let hitsLessen = (realHitsMax - structure.hits) / realHitsMax;
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

module.exports = roleRepairer;