/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 14:18:43
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 11:59:07
 * @FilePath: \cocos-cramped-room-of-death\assets\Runtime\DataManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { EnemyManager } from '../Base/EnemyManager';
import Singleton from '../Base/Singleton';
import { ITile } from '../Levels';
import { BurstManager } from '../Scripts/Burst/BurstManager';
import { DoorManager } from '../Scripts/Door/DoorManager';
import { PlayerManager } from '../Scripts/Player/PlayerManager';
import { TileManneger } from '../Scripts/Tile/TileManager';

export default class DataManager extends Singleton{

    static get Instance(){
        return super.GetInstance<DataManager>()
    }
    MapInfo:Array<Array<ITile>> = []
    tileInfo:Array<Array<TileManneger>> = []
    mapRowCount:number = 0
    mapColumnCount:number = 0
    levelIndex:number = 1
    player:PlayerManager
    door:DoorManager
    enemies:EnemyManager[]
    bursts:BurstManager[]

    reset(){
        this.MapInfo = []
        this.tileInfo = []
        this.mapRowCount = 0
        this.mapColumnCount = 0
        this.player = null
        this.door = null
        this.enemies = []
        this.bursts = []
    }
}

