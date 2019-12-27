var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleTransfer = require('role.transfer');
var roleTemper = require('role.temper');
var roleTester = require('role.tester');

var publicMethod = require('public.method');
// 1
module.exports.loop = function () {

    // publicMethod.getPower(Game.getObjectById('5e00b413c25ca43b320e9936'), '5dff4a8a393870967b61002f');
    // roleTransfer.work(Game.getObjectById('5e00e5ee5055cf07d7092c5f'), Game.getObjectById('5dff4a8a393870967b61002f'));

    // var containerObject = Game.getObjectById('5dcc8489473b076495a7fc7b');

    // if(publicMethod.printCreepsNum) {
    //     console.log('**************************************');
    // }

	// 清除已死亡的蠕虫内存
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // 设置蠕虫数量
    // 建造者
    publicMethod.setRoleNumber('builder', 0);
    // 升级者
    publicMethod.setRoleNumber('upgrader', 3);
    // 测试者
    publicMethod.setRoleNumber('tester', 4);
    // 临时工
    publicMethod.setRoleNumber('temper', 3);
    // 维修者
    publicMethod.setRoleNumber('repairer', 1);
    // 运输者
    roleTransfer.setNumber(2, ['5dff4a8a393870967b61002f', '5e005420384933769aabc7d2']);
    // 采矿者
    roleHarvester.setNumber(2, ['5dff4a8a393870967b61002f', '5e005420384933769aabc7d2']);



    /**任务分配 */
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
		// 采矿者
        if(creep.memory.role == 'harvester') {
            var map = new Map();
            map.set('5e005420384933769aabc7d2', '5bbcb0139099fc012e63b8f0');
            map.set('5dff4a8a393870967b61002f', '5bbcb0139099fc012e63b8ef');
            roleHarvester.work(creep, map);
        }
		// 运输者
        if(creep.memory.role == 'transfer') {
            roleTransfer.work(creep, Game.getObjectById('5dff4a8a393870967b61002f'));
        }
		// 升级者
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.work(creep, Game.getObjectById('5e005420384933769aabc7d2'));
        }
		// 维修者
        if(creep.memory.role == 'repairer') {
            roleRepairer.work(creep, Game.getObjectById('5e005420384933769aabc7d2'));
        }
		// 建造者
        if(creep.memory.role == 'builder') {
            roleBuilder.work(creep, Game.getObjectById('5dff4a8a393870967b61002f'));
        }
        
		// 临时工
        if(creep.memory.role == 'temper') {
            roleTemper.work(creep);
            // creep.memory.role = 'upgrader';
        }
		// 实验者
        if(creep.memory.role == 'tester') {
            roleTester.work(creep);
        }
    }

    var structures = creep.room.find(FIND_STRUCTURES);
    for(var tower of structures) {
        if(tower.structureType == STRUCTURE_TOWER) {
            // 获取房间内的攻击者
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            // 如果有攻击者，攻击攻击者
            if(closestHostile) {
                tower.attack(closestHostile);
            }else {
                // 自己能量大于300才会去修别人
                if(tower.store.getCapacity(RESOURCE_ENERGY) > 3000) {
                    // 得到房间损坏率最大的建筑物对象
                    var maxHitsLessen = 0;
                    var maxLessenStruct;
                    // 判断所有建筑物类型
                    for(var structure of structures) {
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
                        tower.repair(maxLessenStruct);
                    }
                }
            }
        }
    }

    // /**自动重生 */
    // // 获取当前采矿者数量与每一个采矿者的位置
    // var harvesters = 0;
    // var harvesterMoveTo = new Array();
    // for(var name in Game.creeps) {
    //     var creep = Game.creeps[name];
    //     if(creep.memory.role == 'harvester') {
    //         harvesters++;
    //         // 使用数组将每个采矿者的位置记录
    //         if(creep.memory.moveToSign) {
    //             harvesterMoveTo[creep.memory.moveToSign] = true;
    //         }
    //     }
    // }
	// console.log('采矿者数量:', harvesters);
    // var transfers = _.filter(Game.creeps, (creep) => creep.memory.role == 'transfer');
	// console.log('运输者数量:', transfers.length);
    // var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
	// console.log('升级者数量:', upgraders.length);
    // var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    // console.log('建造者数量:', builders.length);
    // var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
	// console.log('维修者数量:', repairers.length);
	// // 维修者重生
    // if(repairers.length < 2) {
	// 	var newName = 'Repairer' + Game.time;
	// 	Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, 
	// 		{memory: {role: 'repairer'}});
    // }
    // // 建造者重生
    // if(builders.length < 0) {
    //     var newName = 'Builder' + Game.time;
    //     Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, 
    //         {memory: {role: 'builder'}});
    // }
	// // 升级者重生
    // if(upgraders.length < 7) {
    //     var newName = 'Upgrader' + Game.time;
    //     Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, 
    //         {memory: {role: 'upgrader'}});
    // }
	// // 运输者重生
    // if(transfers.length < 3) {
    //     // 运输者全部死亡还是部分死亡
    //     if(transfers.length == 0 && Game.rooms['E51S9'].energyAvailable < 600) {
    //         // Game.creeps[Object.keys(Game.creeps)[0]].memory.role = 'transfer';
    //         Game.spawns['S1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'transfer', 
    //             {memory: {role: 'transfer'}});
    //     }else {
    //         var newName = 'Transfer' + Game.time;
    //         Game.spawns['S1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName, 
    //             {memory: {role: 'transfer'}});
    //     }
    // }
	// // 采矿者重生
    // if(harvesters < 2) {
    //     // 采矿者全部死亡还是部分死亡
    //     if(harvesters == 0 && Game.rooms['E51S9'].energyAvailable < 550) {
    //         Game.spawns['S1'].spawnCreep([WORK, WORK, MOVE], 'harvester', 
    //             {memory: {role: 'harvester', moveToSign : 0}});
    //     }else {
    //         // 找到房间内所有能量矿
    //         var sources = creep.room.find(FIND_SOURCES);
    //         for(var i=0; i<sources.length; i++) {
    //             // 如果某一能量矿没有矿工
    //             if(!harvesterMoveTo[i]) {
    //                 var moveToSignNum = i;
    //             }
    //         }
    //         var newName = 'Harvester' + Game.time;
    //         Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE], newName, 
    //             {memory: {role: 'harvester', moveToSign : moveToSignNum}});
    //     }
    // }
    

    /**任务分配 */
    // for(var name in Game.creeps) {
    //     var creep = Game.creeps[name];
	// 	// 采矿者
    //     if(creep.memory.role == 'harvester') {
    //         roleHarvester.run(creep);
    //     }
	// 	// 运输者
    //     if(creep.memory.role == 'transfer') {
    //         roleTransfer.run(creep);
    //         // creep.moveTo(30, 39);
    //     }
	// 	// 升级者
    //     if(creep.memory.role == 'upgrader') {
    //         roleUpgrader.run(creep);
    //     }
	// 	// 维修者
    //     if(creep.memory.role == 'repairer') {
    //         roleRepairer.run(creep);
    //     }
	// 	// 建造者
    //     if(creep.memory.role == 'builder') {
    //         roleBuilder.run(creep);
    //     }
        
	// 	// 临时工
    //     if(creep.memory.role == 'temper') {
    //         // roleTemper.run(creep);
    //         creep.memory.role = 'upgrader';
    //     }
	// 	// 实验者
    //     if(creep.memory.role == 'tester') {
    //         roleTester.run(creep);
    //     }
    // }
    
    // 移动
    // Game.getObjectById('5e00902dece8186420c05dd1').moveTo(30, 30);
    
    // 打印
    // console.log('输出内容:', name);
    
    // 自杀
    // Game.creeps['transfer'].suicide()
    
    // 安全模式
    // Game.spawns['Spawn1'].room.controller.activateSafeMode();
    
    // 更改职业
    // Game.creeps[Object.keys(Game.creeps)[0]].memory.role = 'harvester';
}