/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-04 19:10:50
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Component,
  Node,
} from 'cc';

import { EVENT_ENUM } from '../../Enums';
import Levels, { ILevel } from '../../Levels';
import DataManager from '../../Runtime/DataManager';
import EventManager from '../../Runtime/EventManager';
import { createUINode } from '../../Utils';
import { DoorManager } from '../Door/DoorManager';
import { PlayerManager } from '../Player/PlayerManager';
import {
  TILE_HEIGHT,
  TILE_WIDTH,
} from '../Tile/TileManager';
import { TileMapManneger } from '../Tile/TileMapManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';

const { ccclass, property } = _decorator;

@ccclass('BetaleManneger')
export class BetaleManneger extends Component {

    level:ILevel;
    stage:Node;

    onLoad() {
        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL,this.nextLevel,this);
    }
    onDestroy() {
         EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL,this.nextLevel);
    }
    start() {
        this.generateStage();
        this.initLevel();
        
    }

    initLevel(){
        this.clearlevel()
        const level = Levels[`level${DataManager.Instance.levelIndex}`];
        if (level) {
            this.level = level;
            DataManager.Instance.MapInfo = this.level.mapInfo;
            DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0;
            DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0;
        
            this.generateTileMap()
            this.generatePlayer()
            this.generateDoor()
            this.generateEnemies()
        }
    }

    nextLevel(){
        DataManager.Instance.levelIndex++
        this.initLevel()
    }
    clearlevel(){
        this.stage.destroyAllChildren()
        DataManager.Instance.reset()
    }

    generateStage(){
        this.stage = createUINode()
        this.stage.setParent(this.node)
    }
    async generateTileMap() {
        // const stage = new Node()
        // stage.setParent(this.node)
        const TileMap = new Node()
        TileMap.setParent(this.stage)
        const tileMapManager = TileMap.addComponent(TileMapManneger)
        await tileMapManager.init()
     
        this.adaptPos()
    }
    async generatePlayer(){
        const player = createUINode()
        player.setParent(this.stage)
        const playerManager = player.addComponent(PlayerManager)
        await playerManager.init()
        DataManager.Instance.player = playerManager

        EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN,true)
    }
    async generateEnemies(){
        const enemiy = createUINode()
        enemiy.setParent(this.stage)
        const enemiyManager = enemiy.addComponent(WoodenSkeletonManager)
        await enemiyManager.init()
        DataManager.Instance.enemies.push(enemiyManager)
    }
    async generateDoor(){
        const door = createUINode()
        door.setParent(this.stage)
        const doorManager = door.addComponent(DoorManager)
        await doorManager.init()
        DataManager.Instance.door = doorManager
    }

    adaptPos(){
        const {mapColumnCount,mapRowCount} = DataManager.Instance
        const disX = (TILE_WIDTH * mapRowCount) / 2
        const disY = (TILE_HEIGHT * mapColumnCount) / 2 + 80

        this.stage.setPosition(-disX,disY)
    }
 
}


