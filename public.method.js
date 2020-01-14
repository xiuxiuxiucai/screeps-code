let gameConfigs = require('game.configs');

// 公共方法
let publicMethod = {

    /**
     * 孵化蠕虫
     * @param creepType 蠕虫类型
     * @param spawnsName 出生点名称
     * @param workObject 工作对象，可不传
     */
    life: function(creepType, spawnsName, workObject) {
        let newName = creepType + Game.time;
        let roomObject = Game.spawns[spawnsName].room;
        let roomName = roomObject.name;
        
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
        let creepBody = [];

        switch(creepType) {
            // 采矿者
            case 'harvester':
                if(roomEnergy >= 550) {
                    Game.spawns[spawnsName].spawnCreep( [WORK, WORK, WORK, WORK, WORK, MOVE], newName, 
                        { memory: { role: creepType, isWorking: false, fromRoomName: roomName, pathColour: '#FFFF00' } } );
                }else {
                    Game.spawns[spawnsName].spawnCreep( [WORK, WORK, MOVE], newName, 
                        { memory: { role: 'harvester', isWorking: false, fromRoomName: roomName, pathColour: '#FFFF00' } } );
                }
                break;
            // 小采矿者
            case 'smallHarvester':
                Game.spawns[spawnsName].spawnCreep( [WORK, WORK, MOVE], newName, 
                    { memory: { role: 'harvester', isWorking: false, fromRoomName: roomName, pathColour: '#FFFF00' } } );
                break;
            // 初始采矿者
            case 'firstHarvester':
                Game.spawns[spawnsName].spawnCreep( creepBasicsBody, newName, 
                    { memory: { role: 'firstHarvester', isWorking: false, fromRoomName: roomName, pathColour: '#FFFF00' } } );
                break;
            // 运输者
            case 'transfer':
                let creepTransferBodyNum = roomEnergy / 150;
                for(let i=1; i<=creepTransferBodyNum; i++) {
                    creepBody.push(CARRY, CARRY, MOVE);
                }
                Game.spawns[spawnsName].spawnCreep( creepBody, newName, 
                    { memory: { role: creepType, isWorking: false, fromRoomName: roomName, pathColour: '#00FF00', workObject: workObject } } );
                break;
            // 外出运输者
            // case 'transfer':
            //     Game.spawns[spawnsName].spawnCreep( [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, 
            //     { memory: { role: creepType, isWorking: false, fromRoomName: roomName, pathColour: '#FFFFFF' } } );
            //     break;
            // 小运输者
            case 'smallTransfer':
                Game.spawns[spawnsName].spawnCreep( [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], newName, 
                    { memory: { role: 'transfer', isWorking: false, fromRoomName: roomName, pathColour: '#00FF00' } } );
                break;
            // 升级者
            case 'upgrader':
                Game.spawns[spawnsName].spawnCreep( creepBasicsBody, newName, 
                    { memory: { role: creepType, isWorking: false, fromRoomName: roomName, pathColour: '#0000FF' } } );
                break;
            // 初始升级者
            case 'firstUpgrader':
                Game.spawns[spawnsName].spawnCreep( creepBasicsBody, newName, 
                    { memory: { role: creepType, isWorking: false, fromRoomName: roomName, pathColour: '#0000FF' } } );
                break;
            // 维修者
            case 'repairer':
                Game.spawns[spawnsName].spawnCreep( creepBasicsBody, newName, 
                    { memory: { role: creepType, isWorking: false, fromRoomName: roomName, pathColour: '#FFFFFF' } } );
                break;
            // 建造者
            case 'builder':
                Game.spawns[spawnsName].spawnCreep( creepBasicsBody, newName, 
                    { memory: { role: creepType, isWorking: false, fromRoomName: roomName, pathColour: '#00FFFF' } } );
                break;
            // 初始建造者
            case 'firstBuilder':
                Game.spawns[spawnsName].spawnCreep( creepBasicsBody, newName, 
                    { memory: { role: creepType, isWorking: false, fromRoomName: roomName, pathColour: '#00FFFF' } } );
                break;
            // 初始维修者
            case 'firstRepairer':
                Game.spawns[spawnsName].spawnCreep( creepBasicsBody, newName, 
                    { memory: { role: creepType, isWorking: false, fromRoomName: roomName, pathColour: '#00FFFF' } } );
                break;
			default:
                Game.spawns[spawnsName].spawnCreep( creepBasicsBody, newName, 
                    { memory: { role: creepType, isWorking: false, fromRoomName: roomName, pathColour: '#FFFFFF' } } );
        }
    },

    /**
     * 根据期望的蠕虫数量选择是否孵化蠕虫
     * roomName
     * creepType
     *      蠕虫类型 String
     * creepNumber
     *      期望数量 int
     */
    setRoleNumber: function(roomName, creepType, creepNumber) {
        /**
         * 此处应根据creepType选择不同的spawn，暂时未作处理
         */
        let roomSpawns = Memory.xiuRooms[roomName].xiuSpawns;
        // 当前数量
        let creepsTypeNumber = Memory.xiuRooms[roomName].xiuCreepsNumber[creepType];
        if(!creepsTypeNumber) {
            creepsTypeNumber = 0
        }
        // 孵化
        // 如果采矿者全部死亡，剩余能量不足孵化一个采矿者，容器能量又用尽了的话，能量就不会增长，就孵化小型采矿者
        if(creepType == 'harvester') {
            if(creepsTypeNumber== 0 && Game.rooms[roomName].energyAvailable < 550) {
                let containerObjectArray = Memory.xiuRooms[roomName].xiuContainers;
                // 查看所有容器，只要还剩点能量，就等待传输者的表演
                let boolean;
                for(let containerObject of containerObjectArray) {
                    if(Game.getObjectById(containerObject).store[RESOURCE_ENERGY] > 0) {
                        boolean = true
                    }
                }
                // 容器全空
                if(!boolean) {
                    publicMethod.life('smallHarvester', Game.getObjectById(roomSpawns[0]).name);
                }
                return;
            }
        }
        // 如果运输者全部死亡，剩余能量不足孵化一个运输者，能量就不会增长，就孵化小型运输者
        if(creepType == 'transfer') {
            if(creepsTypeNumber == 0 && Game.rooms[roomName].energyAvailable < 600) {
                publicMethod.life('smallTransfer', Game.getObjectById(roomSpawns[0]).name);
                return;
            }
        }
        if(creepsTypeNumber < creepNumber) {
            publicMethod.life(creepType, Game.getObjectById(roomSpawns[0]).name);
        }
    },

    /**
     * 为蠕虫设置一个能量矿类型的目标
     * @param creep
     * @param targetCreeps 汇总所有虫子的目标，存入对象
     * 
     * 找到房间内所有能量矿，并计算与其距离
     * 当前以这个能量矿为目标的虫子数的n倍 加上 距离 加上 能量矿已损失能量百分比除以n 等于此能量矿的费用
     * 将费用最小的一个能量矿作为目标写入内存
     */
    setSourcesTarget: function(creep, targetCreeps) {
        // 找到房间内所有能量矿，并计算其费用，取最小值
        let minSpendTarget;
        let minSpendNum = 1000;
        let sources = creep.room.find(FIND_SOURCES);
        for(let source of sources) {
            // 以此对象为目标的虫子个数
            let targetCreepsNum = targetCreeps[source.id];
            if(!targetCreepsNum) {
                targetCreepsNum = 0;
            }
            // 计算费用，取最小费用的对象
            let sourceEnergySpend;
            if(source.energy > 0) {
                sourceEnergySpend = (1 - source.energy / source.energyCapacity) / 0.03;
            }else {
                sourceEnergySpend = 100;
            }
            spendNum = creep.pos.findPathTo(source).length + 15 * targetCreepsNum + sourceEnergySpend;
            if(spendNum < minSpendNum) {
                minSpendNum = spendNum;
                minSpendTarget = source.id;
            }
        }
        // 更新蠕虫目标
        creep.memory.targetId = minSpendTarget;
    },

    /**
     * 为蠕虫设置一个容器类型的目标
     * @param creep
     * @param targetCreeps 汇总所有虫子的目标，存入对象
     * 
     * 找到房间内所有能量矿，并计算与其距离
     * 当前以这个能量矿为目标的虫子数的n倍 加上 距离 等于此能量矿的费用
     * 将费用最小的一个能量矿作为目标写入内存
     */
    setContainerTarget: function(creep, targetCreeps) {
        // 计算所有能量矿旁的容器的费用，取最小值
        let minSpendTarget;
        let minSpendNum = 1000;
        let sources = creep.room.find(FIND_SOURCES);
        for(let source of sources) {
            // 以此对象为目标的虫子个数
            let targetCreepsNum = targetCreeps[source.id];
            if(!targetCreepsNum) {
                targetCreepsNum = 0;
            }
            // 计算费用，取最小费用的对象
            spendNum = creep.pos.findPathTo(source).length + 15 * targetCreepsNum;
            if(spendNum < minSpendNum) {
                minSpendNum = spendNum;
                minSpendTarget = source.id;
            }
        }
        // 更新蠕虫目标
        creep.memory.targetId = minSpendTarget;
    },

    /** 
     * 前往容器获取能量，如果容器不可用，返回false
     * creep
     *      蠕虫
     * containerObject:
     *      容器对象，蠕虫会寻找此容器然后补充能量
     * return
     *      true代表找到了容器
     */
    getPower: function(creep, containerObject) {
        if(containerObject) {
            // 判断容器有没有能量
            if(containerObject.store[RESOURCE_ENERGY] > 0) {
                // 如果有能量，则前往容器
                if(creep.withdraw(containerObject, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containerObject, {visualizePathStyle: {stroke: creep.memory.pathColour}});
                    return true;
                }else {
                    return true;
                }
            }else {
                // 如果没有能量，判断矿工还在不在
                if(containerObject.pos.lookFor(LOOK_CREEPS).length > 0 && containerObject.pos.lookFor(LOOK_CREEPS)[0].memory.role == 'harvester') {
                    // 矿工在则等待出矿
                    return true;
                }else {
                    return false;
                }
            }
        }else {
            return false;
        }
    },
    
    /**
     * 工作状态检测
     */
    setIsWork: function(creep) {
        // 如果当前状态为工作并且携带能量为0，则当前状态转为不工作，即补充能量
        if(creep.memory.isWorking && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.isWorking = false;
            creep.memory.targetId = '';
            creep.say(publicMethod.speakStr('workEnd'));
	    }
		// 如果当前状态为补充能量并且剩余携带空间为0，则当前状态转为工作
	    if(!creep.memory.isWorking && creep.store.getFreeCapacity() == 0) {
	        creep.memory.isWorking = true;
            creep.memory.targetId = '';
	        creep.say(publicMethod.speakStr('workStar'));
        }
    },

    /**
     * 用于在游戏界面提醒错误
     */
    creepError: function(creep, errorText) {
        // 蠕虫诉苦
        let creepSay = creep.name + ':' + publicMethod.speakStr('error');
        creep.say(creepSay);
        // 控制台打印详情
        console.log(creep.name, ': ' + errorText);
    },
    
    /**
     * 语言系统
     */
    speakStr: function(speakType) {
        let speakString;
        switch(speakType) {
            case 'workEnd':
                speakString = ['能量用尽', '下班', '我走了', '不干了', '吃饭去', '好饿啊'];
                break;
            case 'workStar':
                speakString = ['充能完毕', '上班去', '我走了', '干活去', '我吃完了', '吃饱了'];
                break;
            case 'error':
                speakString = ['我出错了', '我错了', '我完了', 'warning!', 'I don\'t feel so good', '啊v分&十八s'];
                break;
        }
        return speakString[Math.floor(Math.random() * speakString.length)];
    }
};

module.exports = publicMethod;