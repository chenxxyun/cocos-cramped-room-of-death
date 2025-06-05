/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 18:22:24
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
import FadeManager from '../../Runtime/FadeManager';
import { createUINode } from '../../Utils';
import { BurstManager } from '../Burst/BurstManager';
import { DoorManager } from '../Door/DoorManager';
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager';
import { PlayerManager } from '../Player/PlayerManager';
import { SmokeManager } from '../Smoke/SmokeManager';
import { SpikesManager } from '../Spikes/SpikesManager';
import {
  TILE_HEIGHT,
  TILE_WIDTH,
} from '../Tile/TileManager';
import { TileMapManneger } from '../Tile/TileMapManager';
import { ShakeManager } from '../UI/ShakeManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';

const { ccclass, property } = _decorator;

@ccclass('BetaleManneger')
export class BetaleManneger extends Component {

    level:ILevel;
    stage:Node;
    private smokeLayer:Node

    onLoad() {
        DataManager.Instance.levelIndex = 1
        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL,this.nextLevel,this);
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.checkArrived,this);
        EventManager.Instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke,this);
    }
    onDestroy() {
         EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL,this.nextLevel);
    }
    start() {
        this.generateStage();
        this.initLevel();
        
    }

    async initLevel(){
        this.clearlevel()
        const level = Levels[`level${DataManager.Instance.levelIndex}`];
        if (level) {
            await FadeManager.Instance.fadeIn()
            this.level = level;
            DataManager.Instance.MapInfo = this.level.mapInfo;
            DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0;
            DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0;

            await Promise.all([ 
                this.generateTileMap(),
                this.generateBurst(),
                this.generateSpikes(),
                this.generateSmokeLayer(),
                this.generateDoor(),
                this.generateEnemies(),
                this.generatePlayer()
            ]) 

            await FadeManager.Instance.fadeOut()
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
        this.stage.addComponent(ShakeManager)
        this.stage.getComponent(ShakeManager).init()
        
        
    }
    async generateTileMap() {
        const TileMap = new Node()
        TileMap.setParent(this.stage)
        const tileMapManager = TileMap.addComponent(TileMapManneger)
        await tileMapManager.init()
     
        this.adaptPos()
    }
    
    async generateSmokeLayer(){
        this.smokeLayer = createUINode()
        this.smokeLayer.setParent(this.stage)
    }
    async generateSmoke(x:number,y:number,direction:DIRECTION_ENUM){
        const item = DataManager.Instance.smokes.find(smoke => smoke.state === ENTITY_STATE_ENUM.DEATH)
        if (item) {
            console.log('smoke');
            
            item.x = x
            item.y = y
            item.direction = direction
            item.state = ENTITY_STATE_ENUM.IDLE
            item.node.setPosition(x*TILE_WIDTH - 1.5*TILE_WIDTH,-y*TILE_HEIGHT + 1.5*TILE_HEIGHT)
        }else{
            const smoke = createUINode()
            smoke.setParent(this.smokeLayer)
            const smokeManager = smoke.addComponent(SmokeManager)
            await smokeManager.init({
                x,
                y,
                direction,
                state: ENTITY_STATE_ENUM.IDLE,
                type: ENTITY_TYPE_ENUM.SMOKE
            })
            DataManager.Instance.smokes.push(smokeManager)
        }

      


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
        if (!DataManager.Instance.player || !DataManager.Instance.door) {
            return
        }
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

        this.stage.getComponent(ShakeManager).stop()

        this.stage.setPosition(-disX,disY)
    }
 
}


