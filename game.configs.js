
let gameConfigs = {
    // 是否打印期望蠕虫与对应实际蠕虫数量
    isPrintCreeps: false,
    // isPrintCreeps: true,

    // 各类房间设置
    oneLevelRoom: {
        // 期望蠕虫数量
        expectCreepsNumber: {
            // 初始建造者
            firstBuilder: 1,
            // 初始维修者
            firstRepairer: 1,
            // 初始升级者
            firstUpgrader: 3,
            // 初始采矿者
            firstHarvester: 2,
        },
        // 核心成员（采矿者和运输者）
        coreCreeps: {
            harvester: 'firstHarvester',
            transfer: '',
        }
    },
    twoLevelRoom: {
        // 期望蠕虫数量
        expectCreepsNumber: {
            // 建造者
            builder: 0,
            // 外出偷盗者
            outTransferSteal: 0,
            // 外出运输者
            outTransferEnergy: 0,
            // 维修者
            repairer: 1,
            // 升级者
            upgrader: 5,
            // 运输者
            transfer: 1,
            // 采矿者
            harvester: 2,
        },
        // 核心成员（采矿者和运输者）
        coreCreeps: {
            harvester: 'harvester',
            transfer: 'transfer',
        }
    },
};

/**
 * 此类仅仅为了展示游戏内存可能存在的数据，请按照此字典使用内存，禁止使用此类！
 */
let gameMemory = {
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
     * - 不能每次都刷新内存，应每t检测下路径是否存在，补全路径；然后就是只在某一项的数据会发生变化的时候更新对应的数据
     */
    
};

module.exports = gameConfigs;