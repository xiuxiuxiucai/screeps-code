/**
 * 配置项
 */
var printCreepsNum = true;

// 公共方法
// 1
var publicMethod = {

    /**
     * 孵化蠕虫
     * roleType
     *      蠕虫类型
     */
    life: function(roleType) {
        var newName = roleType + Game.time;
        switch(roleType) {
            // 采矿者
            case 'harvester':
                // Game.spawns['S1'].spawnCreep( [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], newName, 
                Game.spawns['S1'].spawnCreep( [WORK, WORK, WORK, WORK, WORK, MOVE], newName, 
                { memory: { role: roleType, working: false, pathColour: '#FFFF00' } } );
                break;
            // 小采矿者
            case 'smallHarvester':
                Game.spawns['S1'].spawnCreep( [WORK, WORK, MOVE], newName, 
                { memory: { role: 'harvester', working: false, pathColour: '#FFFF00' } } );
                break;
            // 运输者
            case 'transfer':
                // Game.spawns['S1'].spawnCreep( [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName, 
                Game.spawns['S1'].spawnCreep( [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName, 
                { memory: { role: roleType, working: false, pathColour: '#00FF00' } } );
                break;
            // 小运输者
            case 'smallTransfer':
                Game.spawns['S1'].spawnCreep( [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], newName, 
                { memory: { role: 'transfer', working: false, pathColour: '#00FF00' } } );
                break;
            // 升级者
            case 'upgrader':
                // Game.spawns['S1'].spawnCreep( [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, 
                Game.spawns['S1'].spawnCreep( [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, 
                { memory: { role: roleType, working: false, pathColour: '#0000FF' } } );
                break;
            // 维修者
            case 'repairer':
                // Game.spawns['S1'].spawnCreep( [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, 
                Game.spawns['S1'].spawnCreep( [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, 
                { memory: { role: roleType, working: false, pathColour: '#FFFFFF' } } );
                break;
            // 建造者
            case 'builder':
                // Game.spawns['S1'].spawnCreep( [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, 
                Game.spawns['S1'].spawnCreep( [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, 
                { memory: { role: roleType, working: false, pathColour: '#00FFFF' } } );
                break;
			default:
                // Game.spawns['S1'].spawnCreep( [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, 
                Game.spawns['S1'].spawnCreep( [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, 
                { memory: { role: roleType, working: false, pathColour: '#FFFFFF' } } );
				
        }
    },

    /**
     * 根据期望的蠕虫数量选择是否孵化蠕虫
     * roleType
     *      蠕虫类型
     * roleNumber
     *      期望数量
     */
    setRoleNumber: function(roleType, roleNumber) {
        var harvesterNumber = _.filter(Game.creeps, (creep) => creep.memory.role == roleType);
        // if(printCreepsNum) {
            // console.log(roleType, '数量:', harvesterNumber.length);
        // }

        if(harvesterNumber.length < roleNumber) {
            publicMethod.life(roleType);
        }
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
     * creep
     *      蠕虫
     */
    setIsWork: function(creep) {
		// 如果当前状态为工作并且携带能量为0，则当前状态转为不工作，即补充能量
        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say(publicMethod.speakStr('workEnd'));
	    }
		// 如果当前状态为补充能量并且剩余携带空间为0，则当前状态转为工作
	    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
	        creep.memory.working = true;
	        creep.say(publicMethod.speakStr('workStar'));
        }
    },

    /**
     * 直线距离计算
     */

    /**
     * 语言系统
     */
    speakStr: function(speakType) {
        var speakString;
        switch(speakType) {
            case 'workEnd':
                speakString = ['能量用尽', '下班', '我走了', '不干了', '吃饭去', '好饿啊'];
                break;
            case 'workStar':
                speakString = ['充能完毕', '上班去', '我走了', '干活去', '我吃完了', '吃饱了'];
                break;
        }
        return speakString[Math.floor(Math.random() * speakString.length)];
    }
};

module.exports = publicMethod;