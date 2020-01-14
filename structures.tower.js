
/**
 * 防御塔
 */
let structuresTower = {

    /**
     * 防御塔工作方法
     * 
     * nowRoom
     *      房间
     * minEnergy
     *      防御塔最低能量，可不传（默认300），当防御塔低于此能量时不会去维修建筑物
     */
    work: function(nowRoom, minEnergy) {
        // 是否传了最低能量
        if(!minEnergy) {
            minEnergy = 300;
        }
        // 遍历房间所有建筑
        let structures = nowRoom.find(FIND_STRUCTURES);
        for(let tower of structures) {
            if(tower.structureType == STRUCTURE_TOWER) {
                // 获取房间内的攻击者
                let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                // 如果有攻击者，攻击攻击者
                if(closestHostile) {
                    tower.attack(closestHostile);
                }else {
                    // 自己能量大于300才会去修别人
                    if(tower.store.getCapacity(RESOURCE_ENERGY) > minEnergy) {
                        // 得到房间损坏率最大的建筑物对象
                        let maxHitsLessen = 0;
                        let maxLessenStruct;
                        // 判断所有建筑物类型
                        for(let structure of structures) {
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
                            tower.repair(maxLessenStruct);
                        }
                    }
                }
            }
        }
	}
};

module.exports = structuresTower;