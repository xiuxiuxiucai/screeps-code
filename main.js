let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleRepairer = require('role.repairer');
let roleTransfer = require('role.transfer');
let roleTester = require('role.tester');

let structuresTower = require('structures.tower');

let publicMethod = require('public.method');
let gameStatistics = require('game.statistics');
let gameConfigs = require('game.configs');
let gameFree = require('game.free');


module.exports.loop = function () {
    console.log('**************************************');
    
	// 清除所有房间已死亡的蠕虫内存
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    /**************************************************************************** 更新数据 */
    gameStatistics.run();
    // gameFree.run();
    roleTransfer.coreTransfer();


    /**************************************************************************** 遍历房间 */
    // 所有的房间与其状态
    let xiuRooms = Memory.xiuRooms;
    for(let roomName in xiuRooms) {
        /************************************************************* 读取房间内部数据 */
        // 房间对象
        let roomObject = Game.rooms[roomName];
        // 各类蠕虫的数量，对象{类型名，对应蠕虫数量}
        let creepsNumber = Memory.xiuRooms[roomName].xiuCreepsNumber;

        /************************************************************* 孵化蠕虫 */
        // 根据状态获取房间的期望蠕虫数
        let expectCreepsNumber = gameConfigs[xiuRooms[roomName].xiuLevel].expectCreepsNumber;
        // 设置蠕虫数
        for(let creepType in expectCreepsNumber) {
            publicMethod.setRoleNumber(roomName, creepType, expectCreepsNumber[creepType]);
        }

        /************************************************************* 任务分配 */
        // 所有虫子的目标，存入对象{目标id，对应蠕虫数量}
        let targetCreeps = Memory.xiuRooms[roomName].xiuTargetCreeps;
        
        // 遍历蠕虫，分配任务
        for(let creepName of Memory.xiuRooms[roomName].xiuCreeps) {
            let creep = Game.creeps[creepName];

            // 采矿者
            // if(creep.memory.role == 'harvester') {
            //     roleHarvester.work(creep);
            // }
            // 运输者
            // if(creep.memory.role == 'transfer') {
            //     roleTransfer.work(creep, Game.getObjectById('5e09873aa67ca8a10c26322d'));
            // }
            // 升级者
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.work(creep, Game.getObjectById('5e098cdd556d4a9ec225ac7a'));
            }
            // 维修者
            if(creep.memory.role == 'repairer') {
                roleRepairer.work(creep, Game.getObjectById('5e09873aa67ca8a10c26322d'));
            }
            // 建造者
            if(creep.memory.role == 'builder') {
                roleBuilder.work(creep, Game.getObjectById('5e098cdd556d4a9ec225ac7a'), '5bbcb0139099fc012e63b8f0');
            }
            
            // 外出偷盗者
            if(creep.memory.role == 'outTransferSteal') {
                roleTransfer.outTransferSteal(creep);
            }
            // 外出运输者
            if(creep.memory.role == 'outTransferEnergy') {
                roleTransfer.outTransferEnergy(creep, new RoomPosition(3, 27, 'E51S9'), new RoomPosition(30, 30, 'E51S9'), '5bbcb0139099fc012e63b8ef');
            }
            // 实验者
            if(creep.memory.role == 'tester') {
                roleTester.work(creep);
            }
            // 初始采矿者
            if(creep.memory.role == 'firstHarvester') {
                roleHarvester.firstHarvester(creep, targetCreeps);
            }
            // 初始升级者
            if(creep.memory.role == 'firstUpgrader') {
                roleUpgrader.firstUpgrader(creep, targetCreeps);
            }
            // 初始建造者
            if(creep.memory.role == 'firstBuilder') {
                roleBuilder.firstBuilder(creep, targetCreeps);
            }
            // 初始建造者
            if(creep.memory.role == 'firstRepairer') {
                roleRepairer.firstRepairer(creep, targetCreeps);
            }
        }

        // 建筑物任务分配
        structuresTower.work(roomObject, 3000);



        /************************************************************* 基础建设 */
        // 建立采矿容器的地基
        // if(xiuRooms[roomName].xiuLevel == 'oneLevelRoom') {
        //     let roomSources = Memory.xiuRooms[roomName].xiuSources;
        //     for(let roomSourceId in roomSources) {
        //         if(!roomSources[roomSourceId]) {
        //             // 能量矿到出生点的最短路径的第一步就是建造容器的最佳位置
        //             let memoryPathSourceToSpawn = xiuRooms[roomName].xiuPathSourceToSpawn;
        //             if(memoryPathSourceToSpawn) {
        //                 let containerPos = memoryPathSourceToSpawn[roomSourceId][0];
        //                 roomObject.createConstructionSite(containerPos.x, containerPos.y, STRUCTURE_CONTAINER);
        //             }else {
        //                 // 建造容器
        //                 let sourceObject = Game.getObjectById(roomSourceId);
        //                 let spawnObject = Game.getObjectById(Memory.xiuRooms[roomName].xiuSpawns[0]);
        //                 let pathSourceToSpawn = roomObject.findPath(sourceObject.pos, spawnObject.pos, {'ignoreCreeps': true});
        //                 let containerPos = pathSourceToSpawn[0];
        //                 roomObject.createConstructionSite(containerPos.x, containerPos.y, STRUCTURE_CONTAINER);
        //                 // 将能量矿至出生点路径保存
        //                 memoryPathSourceToSpawn = {};
        //                 memoryPathSourceToSpawn[roomSourceId] = pathSourceToSpawn;
        //             }
        //         }
        //     }
        // }
        
        /************************************************************* 打印当前所有蠕虫数量 */
        if(gameConfigs.isPrintCreeps) {
            for(let expectCreepNumber of expectCreepsNumber) {
                let creepNumber = creepsNumber[expectCreepNumber[0]];
                if(!creepNumber) {
                    creepNumber = 0;
                }
                console.log(expectCreepNumber[0], expectCreepNumber[1], ' => ', creepNumber);
            }
        }
    }

    /**************************************************************************** 任务分配 */
    
}
