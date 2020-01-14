let publicMethod = require('public.method');
let gameStatistics = require('game.statistics');
let gameConfigs = require('game.configs');

/**
 * 随便写
 * 
 */
let gameFree = {

    run: function() {
        gameFree.S2GooutCreep();
    },
    
    /**
     * 使用维修者开采第二个房间左边的外矿
     */
    S2GooutCreep: function() {
        let roomName = 'E49S8';
        let creepNum = Memory.xiuRooms[roomName].xiuCreepsNumber.S2GooutRepairer;
        // 工作
        if(creepNum && creepNum > 0) {
            for(let creepName of Memory.xiuRooms[roomName].xiuCreeps) {
                let creep = Game.creeps[creepName];

                if(Memory.xiuRooms[roomName].xiuCreeps[creepName].memory.role != 'S2GooutRepairer') {
                    continue;
                }
                creep.say('喵！')
                // 更新工作状态
                publicMethod.setIsWork(creep);
        
                // 当前状态是否为工作
                if(creep.memory.isWorking) {
                    // 30t换一次工作对象
                    if(!(Game.time % 30)) {
                        // 获取新的工作对象
                        // 得到房间损坏率最大的建筑物对象
                        let maxHitsLessen = 0;
                        let maxLessenStruct;
                        // 判断所有建筑物类型
                        for(let structure of creep.room.find(FIND_STRUCTURES)) {
                            // 获取建筑最大生命值（肯定会刷墙）
                            let realHitsMax = structure.hitsMax;
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
                            // 工作
                            if(creep.repair(maxLessenStruct) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(maxLessenStruct, {visualizePathStyle: {stroke: creep.memory.pathColour}});
                            }
                        }else {
                            // 当没有建筑是损坏了的时候，maxLessenStruct会为null，此时回家
                            creep.moveTo(15, 45, {visualizePathStyle: {stroke: creep.memory.pathColour}});
                        }
                    }else {
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
                            return;
                        }
                    }
                }else {
                    // 前往目标获取能量
                    if(!Game.getObjectById('5bbcafe39099fc012e63b563')) {
                        creep.moveTo(constructor(47, 35, 'E49S8'));
                    }else {
                        let targetSource = Game.getObjectById('5bbcafe39099fc012e63b563');
                        if(creep.harvest(targetSource) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targetSource, {visualizePathStyle: {stroke: creep.memory.pathColour}});
                        }
                    }
                }
            }
        }
        // 外出虫子需要再造不
        if(!creepNum || creepNum < 4) {
            let roomObject = Game.rooms[roomName];
            /**
             * 造虫子
             */
            // 计算房间能够造出的最优部件（基础版）
            let roomEnergy;
            // 每个房间等级都有对应的核心成员
            let coreCreep = gameConfigs[Memory.xiuRooms[roomName].xiuLevel].coreCreeps.harvester;
            if(Memory.xiuRooms[roomName].xiuCreepsNumber[coreCreep]) {
                // 如果有矿工，房间能量为容量上限
                roomEnergy = roomObject.energyCapacityAvailable;
            }else {
                // 如果无矿工，房间能量为当前容量
                roomEnergy = roomObject.energyAvailable;
            }
            let creepBasicsBodyNum = roomEnergy / 200;
            let creepBasicsBody = [];
            for(let i=1; i<=creepBasicsBodyNum; i++) {
                creepBasicsBody.push(WORK, CARRY, MOVE);
            }
            let newName = 'S2GooutRepairer' + Game.time;
            Game.spawns['S2'].spawnCreep( creepBasicsBody, newName, 
                { memory: { role: 'S2GooutRepairer', isWorking: false, fromRoomName: roomName, pathColour: '#FFFF00' } } );
        }
    }
};

module.exports = gameFree;