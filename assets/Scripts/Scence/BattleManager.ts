/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 11:55:36
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Component,
  Node,
} from 'cc';

import {
  DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
} from '../../Enums';
import Levels, { ILevel } from '../../Levels';
import DataManager from '../../Runtime/DataManager';
import EventManager from '../../Runtime/EventManager';
import { createUINode } from '../../Utils';
import { BurstManager } from '../Burst/BurstManager';
import { DoorManager } from '../Door/DoorManager';
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager';
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
            this.generateBurst()
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
        await playerManager.init({
            x: 2,
            y: 8,
            type: ENTITY_TYPE_ENUM.PLAYER,
            direction: DIRECTION_ENUM.TOP,
            state: ENTITY_STATE_ENUM.IDLE
          })
        DataManager.Instance.player = playerManager

        EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN,true)
    }
    async generateBurst(){
        const burst = createUINode()
        burst.setParent(this.stage)
        const burstManager = burst.addComponent(BurstManager)
        await burstManager.init({
            x: 2,
            y: 6,
            type: ENTITY_TYPE_ENUM.BURST,
            direction: DIRECTION_ENUM.TOP,
            state: ENTITY_STATE_ENUM.IDLE
          })
        DataManager.Instance.bursts.push(burstManager)
    }
    async generateEnemies(){
        const enemiy = createUINode()
        enemiy.setParent(this.stage)
        const woodenSkeletonManager = enemiy.addComponent(WoodenSkeletonManager)
        await woodenSkeletonManager.init({
            x:2,
            y:2,
            type:ENTITY_TYPE_ENUM.SKELETON_WOODEN,
            direction:DIRECTION_ENUM.TOP,
            state:ENTITY_STATE_ENUM.IDLE
        })
        DataManager.Instance.enemies.push(woodenSkeletonManager)

        const enemiy2 = createUINode()
        enemiy2.setParent(this.stage)
        const woodenSkeletonManager2 = enemiy2.addComponent(IronSkeletonManager)
        await woodenSkeletonManager2.init({
            x:2,
            y:5,
            type:ENTITY_TYPE_ENUM.SKELETON_IRON,
            direction:DIRECTION_ENUM.TOP,
            state:ENTITY_STATE_ENUM.IDLE
        })
        DataManager.Instance.enemies.push(woodenSkeletonManager2)
    }
    async generateDoor(){
        const door = createUINode()
        door.setParent(this.stage)
        const doorManager = door.addComponent(DoorManager)
        await doorManager.init({
            x:7,
            y:8,
            type:ENTITY_TYPE_ENUM.DOOR,
            direction:DIRECTION_ENUM.TOP,
            state:ENTITY_STATE_ENUM.IDLE
        })
        DataManager.Instance.door = doorManager
    }

    adaptPos(){
        const {mapColumnCount,mapRowCount} = DataManager.Instance
        const disX = (TILE_WIDTH * mapRowCount) / 2
        const disY = (TILE_HEIGHT * mapColumnCount) / 2 + 80

        this.stage.setPosition(-disX,disY)
    }
 
}


