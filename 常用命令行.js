/**
 * 蠕虫的属性
 * 
 * role
 *      字符串，蠕虫类型
 * isWorking
 *      true表示在工作
 * targetId
 *      目标
 * fromRoomName
 *      来自哪一个房间，String
 * pathColour
 *      路线颜色
 */
Game.spawns['S1'].spawnCreep( [WORK, CARRY, MOVE], 'tester', { memory: { role: 'tester', isWorking: true, pathColour: '#ffffff' } } );

/**
 * 蠕虫需要获取能量时
 * 优先从容器取能量
 * 没有的话，找到房间内所有能量矿，并计算与其距离
 * 距离加上（当前去这个能量矿的虫子数的五倍）等于此能量矿的消耗值
 * 前往耗值最小的一个能量矿（写入内存，能量取满前不会重置）
 * 
 */

// 所有角色
    /**
     * 采矿者
     * harvester
     * 
     * 移动至挖矿容器：
     * 需要目标旗帜数组，其中重要的排在前面
     * 遍历目标旗帜数组
     * 检测脚下是不是旗帜数组第一个，是，结束代码，不是，继续代码
     * 检测旗帜数组第一个有没有虫，没有，前往，
     * 有虫则判断此虫是不是采矿者，不是就让此虫回家，自己前往，是采矿者则遍历目标旗帜数组下一个
     * 如果全部有虫，回家
     * 
     * 挖矿：
     * 一直不停的挖矿，因为没有存储，多余的矿会掉落
     * 
     */
    
    /**
     * 运输者
     * transfer
     * 
     * 补充容器的能量：
     * 需要目标旗帜
     * 检测
     * 
     * 运送到目标：
     * 必须学会送至最近的目标而不是随机的
     * 
     */
    transfer
    // 升级者
    upgrader
    /**
     * 维修者
     * 
     * 永远先修损耗率最大的那个
     */
    repairer
    // 建造者
    builder

    // 临时工
    temper
    // 实验者
    tester



// 孵化相关
    /**
     * 孵化方法
     * 需要在公共属性中定义好每种角色的属性
     * 
     * 孵化逻辑
     * 
     * 蠕虫孵化顺序
     * 首先+1采矿者（每次增加采矿者或运输者都要根据房间内剩余的角色、能量判断是小的还是大的）
     * 然后+n运输者（n等于设定的值）（每次增加采矿者或运输者都要根据房间内剩余的角色、能量判断是小的还是大的）
     * 然后+n采矿者（n等于挖矿的容器减1）
     * 然后+2维修者，赶紧修修，防止建筑消失
     * 然后+n维修者（n等于设定的值）
     */


    /**
     * 寻找工作对象，返回所有的需要员工的工作对象
     * 
     * 找到所有特定类别的建筑
     * 计算每个建筑的损耗率并降序排列，得到建筑数组
     * 得到所有可以修复此类建筑损耗率的蠕虫数组（此处默认多次取蠕虫id得到的数组顺序是相同的）
     * 蠕虫数组的第一个去修复建筑数组的第一个，以此类推，直到蠕虫用完（如果建筑数组先用完则再次遍历一遍建筑数组）（此处还可优化）
     * 
     * room
     *      房间对象
     */

console.log('输出内容:', name);


// 自杀
Game.creeps['Harvester13900993'].suicide()

// 安全模式
Game.spawns['Spawn1'].room.controller.activateSafeMode();



// 从矿物拿能量
harvest
// 从地上捡
pickup
// 从仓库、废墟拿能量
withdraw



// WORK(100, 负载1),CARRY(50, 负载1),MOVE9(50, 平地能力1，道路能力2)



// 打印对象
for(let temp in targetCreeps) {
    console.log(temp, '=>', targetCreeps[temp]);
}







/**delay一下 */
        // 如果容器生命值过低，修一下
        if(containerObject.hits < 230000) {
            let creepDelay = creep.memory.delay;
            if(creepDelay > 0) {
                creep.memory.delay = creepDelay - 1;
            }else {
                creep.memory.delay = 3;
                creep.repair(containerObject);
            }
        }