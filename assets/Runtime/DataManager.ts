/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 14:18:43
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-03 16:14:45
 * @FilePath: \cocos-cramped-room-of-death\assets\Runtime\DataManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Singleton from '../Base/Singleton';
import { ITile } from '../Levels';
import { TileManneger } from '../Scripts/Tile/TileManager';

export default class DataManager extends Singleton{

    static get Instance(){
        return super.GetInstance<DataManager>()
    }
    MapInfo:Array<Array<ITile>> = []
    tileInfo:Array<Array<TileManneger>> = []
    MapRowCount:number = 0
    MapColumCount:number = 0
    levelIndex:number = 1

    reset(){
        this.MapInfo = []
        this.tileInfo = []
        this.MapRowCount = 0
        this.MapColumCount = 0
    }
}

