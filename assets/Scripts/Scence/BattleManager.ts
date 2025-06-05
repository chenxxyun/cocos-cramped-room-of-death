/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 14:38:04
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Component,
  Node,
} from 'cc';

import {
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
import { SpikesManager } from '../Spikes/SpikesManager';
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
        DataManager.Instance.levelIndex = 1
        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL,this.nextLevel,this);
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.checkArrived,this);
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
            this.generateEnemies()
            this.generateBurst()
            this.generateSpikes()
            this.generateDoor()
            this.generatePlayer()

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
        await playerManager.init(this.level.player)
        DataManager.Instance.player = playerManager

        EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN,true)
    }
    async generateBurst(){
      
        const promise = []
        for (let i = 0; i < this.level.bursts.length; i++) {
            const burst = this.level.bursts[i];
            // const Manager = burst.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN  ? WoodenSkeletonManager : IronSkeletonManager
            const node = createUINode()
            node.setParent(this.stage)
            const burstManager = node.addComponent(BurstManager)
            promise.push(burstManager.init(burst))
            DataManager.Instance.bursts.push(burstManager)
    
        }
        await Promise.all(promise)
    }
    async generateEnemies(){
        const promise = []
        for (let i = 0; i < this.level.enemies.length; i++) {
            const enemy = this.level.enemies[i];
            const Manager = enemy.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN  ? WoodenSkeletonManager : IronSkeletonManager
            const node = createUINode()
            node.setParent(this.stage)
            const woodenSkeletonManager = node.addComponent(Manager)
            promise.push(woodenSkeletonManager.init(enemy))
            DataManager.Instance.enemies.push(woodenSkeletonManager)
    
        }
        await Promise.all(promise)
      
    }
    async generateDoor(){
        const door = createUINode()
        door.setParent(this.stage)
        const doorManager = door.addComponent(DoorManager)
        await doorManager.init(this.level.door)
        DataManager.Instance.door = doorManager
    }

    async generateSpikes(){
        
        const promise = []
        for (let i = 0; i < this.level.spikes.length; i++) {
            const spikes = this.level.spikes[i];
            const node = createUINode()
            node.setParent(this.stage)
            const spikesManager = node.addComponent(SpikesManager)
            promise.push(spikesManager.init(spikes))
            DataManager.Instance.spikes.push(spikesManager)
    
        }
        await Promise.all(promise)
    }

    checkArrived(){
        const {x:PlayerX,y:PlayerY} = DataManager.Instance.player
        const {x:DoorX,y:DoorY,state:doorState} = DataManager.Instance.door

        if (PlayerX===DoorX && PlayerY===DoorY && doorState === ENTITY_STATE_ENUM.DEATH) {
            EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
        }
    }
    adaptPos(){
        const {mapColumnCount,mapRowCount} = DataManager.Instance
        const disX = (TILE_WIDTH * mapRowCount) / 2
        const disY = (TILE_HEIGHT * mapColumnCount) / 2 + 80

        this.stage.setPosition(-disX,disY)
    }
 
}


