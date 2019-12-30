var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleTransfer = require('role.transfer');
var roleTester = require('role.tester');

var structuresTower = require('structures.tower');

var publicMethod = require('public.method');


module.exports.loop = function () {

    // Game.getObjectById('5e05e8c7d705e47b308da111').moveTo(32,33);

    // 期望蠕虫数量
    var expectCreepsNumber = new Map;
    // 采矿者
    expectCreepsNumber.set('harvester', 2);
    // 运输者
    expectCreepsNumber.set('transfer', 2);
    // 升级者
    expectCreepsNumber.set('upgrader', 4);
    // 维修者
    expectCreepsNumber.set('repairer', 1);
    // 建造者
    expectCreepsNumber.set('builder', 0);

    // 外出偷盗者
    expectCreepsNumber.set('outTransferSteal', 0);
    // 外出运输者
    expectCreepsNumber.set('outTransferEnergy', 3);


    /**************************************************************************** 统计当前蠕虫数量 */
	// 清除已死亡的蠕虫内存
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    // 遍历蠕虫，统计数量
    var creepsNumber = new Map;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var creepType = creep.memory.role;
        // 如果对象中没有这个key，添加
        if(!creepsNumber.get(creepType)) {
            creepsNumber.set(creepType, 1);
        }else {
            creepsNumber.set(creepType, creepsNumber.get(creepType) + 1);
        }
    }
    // 打印当前所有蠕虫数量
    if(0) {
        console.log('**************************************');
        for(var expectCreepNumber of expectCreepsNumber) {
            var creepNumber = creepsNumber.get(expectCreepNumber[0]);
            if(!creepNumber) {
                creepNumber = 0;
            }
            console.log(expectCreepNumber[0], expectCreepNumber[1], ' => ', creepNumber);
        }
    }

    
    /**************************************************************************** 设置蠕虫数量 */
    // 建造者
    publicMethod.setRoleNumber('builder', expectCreepsNumber.get('builder'));
    // 升级者
    publicMethod.setRoleNumber('upgrader', expectCreepsNumber.get('upgrader'));
    // 维修者
    publicMethod.setRoleNumber('repairer', expectCreepsNumber.get('repairer'));
    // 运输者
    roleTransfer.setNumber(expectCreepsNumber.get('transfer'), creepsNumber.get('transfer'), ['5dff4a8a393870967b61002f', '5e005420384933769aabc7d2']);
    // 采矿者
    roleHarvester.setNumber(Game.rooms['E51S9'], expectCreepsNumber.get('harvester'), ['5dff4a8a393870967b61002f', '5e005420384933769aabc7d2']);
    // 建造者
    publicMethod.setRoleNumber('builder', expectCreepsNumber.get('builder'));

    // 外出偷盗者
    publicMethod.setRoleNumber('outTransferSteal', expectCreepsNumber.get('outTransferSteal'));
    // 外出运输者
    publicMethod.setRoleNumber('outTransferEnergy', expectCreepsNumber.get('outTransferEnergy'));
    // 测试者



    /**************************************************************************** 任务分配 */
    // 遍历蠕虫，分配任务
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
            roleBuilder.work(creep, Game.getObjectById('5dff4a8a393870967b61002f'), '5bbcb0139099fc012e63b8f0');
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
    }

    // 建筑物任务分配
    structuresTower.work(Game.rooms['E51S9'], 3000);

}
