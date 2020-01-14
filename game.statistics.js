let publicMethod = require('public.method');
let gameConfigs = require('game.configs');

// 测试者
let gameStatistics = {

    run: function() {
        // 建立基础的内存结构
        gameStatistics.setMemoryStructure();

        // 蠕虫数量统计
        gameStatistics.setCreepsConfig();
        // 房间能量矿统计
        gameStatistics.setRoomSources();
        // 房间容器统计
        gameStatistics.setRoomContainers();
        // 房间spawn统计
        gameStatistics.setRoomSpawns();
        // 检测房间当前状态，level，linkSources
        gameStatistics.setRoomLevel();
    },

    /**
     * 建立基础的内存结构
     */
    setMemoryStructure: function() {
        
        if(!Memory.xiuRooms) {
            Memory.xiuRooms = {};
        }
        for(let roomName in Game.rooms) {
            let wantMemory = {
                /*************************************************************** 各房间内容，Memory.xiuRooms[roomName].containerSources */
                // 各房间各类蠕虫的数量，对象{类型名，对应蠕虫数量}
                xiuCreepsNumber: {},
                // 各房间的蠕虫，数组[蠕虫名称]
                xiuCreeps: [],

                // 汇总所有目标与对应虫子的数量，对象{目标id，对应蠕虫数量}
                xiuTargetCreeps: {},
            
                // 各房间状态，String 状态标识
                xiuLevel: '',
                // 各房间的能量矿，对象{能量矿id，容器id}
                xiuSources: {},
                // 各房间的容器，数组[容器id]
                xiuContainers: [],
                // 各房间的spawns，数组[spawnsId]
                xiuSpawns: [],
            
                // 冷门
                // 房间内所有2范围内有link的能量矿，数组[linkId]
                xiuLinkSources: [],

                // 房间内所有能量矿到spawn[0]的路径，对象{能量矿id，路径对象}
                xiuPathSourceToSpawn: {},
                /**
                 * 未完成：
                 * - 不能每次都刷新内存，应每次使用时检测对应的值与内存路径，没有再建立
                 */
                
            };

            Memory.xiuRooms[roomName] = wantMemory;
        }
    },

    /**
     * 蠕虫数量统计
     * 
     * Memory.xiuRooms[roomName].xiuTargetCreeps
     *      汇总所有虫子的目标，存入对象{目标id，对应蠕虫数量}
     * Memory.xiuRooms[roomName].xiuCreepsNumber
     *      统计各类蠕虫的数量，存入对象{类型名，对应蠕虫数量}
     * Memory.xiuRooms[roomName].xiuCreeps
     *      统计各房间的所有蠕虫，存入数组[蠕虫名称]
     */
    setCreepsConfig: function() {
        let allCreeps = Game.creeps;
        for(creepName in allCreeps) {
            // 房间
            let creepRoomName = allCreeps[creepName].memory.fromRoomName;

            // 汇总所有虫子的目标，存入对象{目标id，对应蠕虫数量}
            let targetCreeps = Memory.xiuRooms[creepRoomName].xiuTargetCreeps;
            let target = allCreeps[creepName].memory.targetId;
            if(target) {
                if(targetCreeps[target]) {
                    targetCreeps[target] += 1;
                }else {
                    targetCreeps[target] = 1;
                }
            }
            // 统计各类蠕虫的数量，存入对象{类型名，对应蠕虫数量}
            let creepsNumber = Memory.xiuRooms[creepRoomName].xiuCreepsNumber;
            let creepType = allCreeps[creepName].memory.role;
            if(creepType) {
                if(creepsNumber[creepType]) {
                    creepsNumber[creepType] += 1;
                }else {
                    creepsNumber[creepType] = 1;
                }
            }
            // 统计各房间的蠕虫，数组[蠕虫name]
            Memory.xiuRooms[creepRoomName].xiuCreeps.push(creepName);
        }
    },

    /**
     * 房间能量矿统计
     * 
     * Memory.xiuRooms[roomName].xiuSources
     *      各房间的能量矿对象，数组 [能量矿对象]
     */
    setRoomSources: function() {
        let gameRooms = Game.rooms;
        for(let roomName in gameRooms) {
            let sourcesId = gameRooms[roomName].find(FIND_SOURCES).map(s => s.id);
            for(let sourceId of sourcesId) {
                Memory.xiuRooms[roomName].xiuSources[sourceId] = '';
            }
        }
    },

    /**
     * 房间容器统计
     * 
     * Memory.xiuRooms[roomName].xiuContainers
     *      各房间的能量矿对象，数组 [能量矿id]
     */
    setRoomContainers: function() {
        let gameRooms = Game.rooms;
        for(let roomName in gameRooms) {
            Memory.xiuRooms[roomName].xiuContainers = [];
            let roomStructures = gameRooms[roomName].find(FIND_STRUCTURES);
            for(let roomStructure of roomStructures) {
                if(roomStructure.structureType == STRUCTURE_CONTAINER) {
                    Memory.xiuRooms[roomName].xiuContainers.push(roomStructure.id);
                }
            }
        }
    },

    /**
     * 房间spawn统计
     * 
     * Memory.xiuRooms[roomName].xiuSpawns
     *      各房间的spawn对象，对象{房间名，数组[spawn对象]}
     */
    setRoomSpawns: function() {
        // 遍历所有 spawn
        for (const spawnName in Game.spawns) {
            const spawn = Game.spawns[spawnName]
            // 向 xiuRooms 中的指定房间推入 spawn 的 id
            Memory.xiuRooms[spawn.room.name].xiuSpawns.push(spawn.id)
        }

    },

    /**
     * 检测房间当前状态
     * 
     * Memory.xiuRooms[roomName].xiuLevel
     *      房间当前状态，String 状态标识
     * 
     * zeroLevelRoom：  无spawn
     * oneLevelRoom：   有spawn，所有能量矿1范围内无容器
     * twoLevelRoom：   有spawn，所有能量矿1范围内有容器，能量矿2范围内无link
     * threeLevelRoom： 有spawn，所有能量矿2范围内有link
     * 
     */
    setRoomLevel: function() {
        // 遍历房间，根据房间分级确定蠕虫数量
        let gameRooms = Game.rooms;
        for(let roomName in gameRooms) {
            // 默认为1级
            Memory.xiuRooms[roomName].xiuLevel = 'oneLevelRoom';
            // 无spawn为0级
            let nowRoomSpawns = Memory.xiuRooms[roomName].xiuSpawns;
            // 顺便统计能量矿旁的容器
            let containerSources = {};
            if(!nowRoomSpawns || nowRoomSpawns.length == 0) {
                Memory.xiuRooms[roomName].xiuLevel = 'zeroLevelRoom';
                continue;
            }
            // 2，3级判断（遍历能量矿，有容器containerArray+1，有link则linkArray+1，最后根据结果值与能量矿数组的长度可判断房间等级）
            let sources = Memory.xiuRooms[roomName].xiuSources;
            for(let sourceId in sources) {
                // 查找能量矿周围建筑
                var sourcePos = Game.getObjectById(sourceId).pos;
                let containerStructures = sourcePos.findInRange(FIND_STRUCTURES, 1);
                let linkStructures = sourcePos.findInRange(FIND_STRUCTURES, 2);
                // 能量矿旁有无link
                for(let structure of linkStructures) {
                    if(structure.structureType == STRUCTURE_LINK) {
                        // 有link为3级
                        Memory.xiuRooms[roomName].xiuLinkSources.push(sourceId);
                        // 有多个link只计入一个
                        break;
                    }
                }
                // 房间内能量矿旁有无容器
                for(let structure of containerStructures) {
                    if(structure.structureType == STRUCTURE_CONTAINER) {
                        // 有容器为2级
                        containerSources[sourceId] = structure.id;
                        // 有多个容器只计入一个
                        break;
                    }
                }
            }
            // 房间内能量矿数量
            let sourceNum = Object.keys(sources).length;
            // 是否每个能量矿都有link
            if(Memory.xiuRooms[roomName].xiuLinkSources.length == sourceNum) {
                Memory.xiuRooms[roomName].xiuLevel = 'threeLevelRoom';
                continue;
            }
            // 是否每个能量矿都有容器
            if(Object.keys(containerSources).length == sourceNum) {
                Memory.xiuRooms[roomName].xiuLevel = 'oneLevelRoom';
                continue;
            }
            // 更新能量矿内存数据
            for(let sourcesId in containerSources) {
                Memory.xiuRooms[roomName].xiuSources[sourcesId] = containerSources[sourcesId];
            }
        }
    },
};

module.exports = gameStatistics;