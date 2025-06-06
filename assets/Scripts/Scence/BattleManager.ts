/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-06 11:35:06
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Component,
  director,
  Node,
} from 'cc';

import {
  DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
} from '../../Enums';
import Levels, { ILevel } from '../../Levels';
import DataManager, { IRecord } from '../../Runtime/DataManager';
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

    level: ILevel;
    stage: Node;
    private smokeLayer: Node
    private inited: boolean = false;


    onLoad() {
        DataManager.Instance.levelIndex = 1
        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this);
        EventManager.Instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this);
        EventManager.Instance.on(EVENT_ENUM.RECORD_STEP, this.record, this);
        EventManager.Instance.on(EVENT_ENUM.REVOKE_STEP, this.revoke, this);
        EventManager.Instance.on(EVENT_ENUM.RESTART_LEVEL, this.restartLevel, this);
        EventManager.Instance.on(EVENT_ENUM.QUIT_BATTLE, this.quitBattle, this);
    }
    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel);
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived);
        EventManager.Instance.off(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke);
        EventManager.Instance.off(EVENT_ENUM.RECORD_STEP, this.record);
        EventManager.Instance.off(EVENT_ENUM.REVOKE_STEP, this.revoke);
        EventManager.Instance.off(EVENT_ENUM.RESTART_LEVEL, this.restartLevel);
        EventManager.Instance.off(EVENT_ENUM.QUIT_BATTLE, this.quitBattle);
    }
    start() {
        this.generateStage();
        this.initLevel();

    }


    async initLevel() {
        this.clearlevel()
        const level = Levels[`level${DataManager.Instance.levelIndex}`];
        if (level) {
            if (this.inited) {
                await FadeManager.Instance.fadeIn()
            }else{
                await FadeManager.Instance.mask()

            }
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
        }else{
            this.quitBattle()
        }
    }

    async restartLevel(){
        await FadeManager.Instance.fadeIn()
        this.initLevel()
    }
    async quitBattle(){
        await FadeManager.Instance.fadeIn()
        director.loadScene('Start')
    }

    nextLevel() {
        DataManager.Instance.levelIndex++
        this.initLevel()
    }
    clearlevel() {
        this.stage.destroyAllChildren()
        DataManager.Instance.reset()
    }

    generateStage() {
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

    async generateSmokeLayer() {
        this.smokeLayer = createUINode()
        this.smokeLayer.setParent(this.stage)
    }
    async generateSmoke(x: number, y: number, direction: DIRECTION_ENUM) {
        const item = DataManager.Instance.smokes.find(smoke => smoke.state === ENTITY_STATE_ENUM.DEATH)
        if (item) {
            console.log('smoke');

            item.x = x
            item.y = y
            item.direction = direction
            item.state = ENTITY_STATE_ENUM.IDLE
            item.node.setPosition(x * TILE_WIDTH - 1.5 * TILE_WIDTH, -y * TILE_HEIGHT + 1.5 * TILE_HEIGHT)
        } else {
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
    async generatePlayer() {
        const player = createUINode()
        player.setParent(this.stage)
        const playerManager = player.addComponent(PlayerManager)
        await playerManager.init(this.level.player)
        DataManager.Instance.player = playerManager

        EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true)
    }
    async generateBurst() {

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
    async generateEnemies() {
        const promise = []
        for (let i = 0; i < this.level.enemies.length; i++) {
            const enemy = this.level.enemies[i];
            const Manager = enemy.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN ? WoodenSkeletonManager : IronSkeletonManager
            const node = createUINode()
            node.setParent(this.stage)
            const woodenSkeletonManager = node.addComponent(Manager)
            promise.push(woodenSkeletonManager.init(enemy))
            DataManager.Instance.enemies.push(woodenSkeletonManager)

        }
        await Promise.all(promise)

    }
    async generateDoor() {
        const door = createUINode()
        door.setParent(this.stage)
        const doorManager = door.addComponent(DoorManager)
        await doorManager.init(this.level.door)
        DataManager.Instance.door = doorManager
    }

    async generateSpikes() {

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

    checkArrived() {
        if (!DataManager.Instance.player || !DataManager.Instance.door) {
            return
        }
        const { x: PlayerX, y: PlayerY } = DataManager.Instance.player
        const { x: DoorX, y: DoorY, state: doorState } = DataManager.Instance.door

        if (PlayerX === DoorX && PlayerY === DoorY && doorState === ENTITY_STATE_ENUM.DEATH) {
            EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
        }
    }
    adaptPos() {
        const { mapColumnCount, mapRowCount } = DataManager.Instance
        const disX = (TILE_WIDTH * mapRowCount) / 2
        const disY = (TILE_HEIGHT * mapColumnCount) / 2 + 80

        this.stage.getComponent(ShakeManager).stop()

        this.stage.setPosition(-disX, disY)
    }

    record() {
        const item: IRecord = {
            player: {
                x: DataManager.Instance.player.x,
                y: DataManager.Instance.player.y,
                direction: DataManager.Instance.player.direction,
                state: DataManager.Instance.player.state === ENTITY_STATE_ENUM.IDLE ||
                DataManager.Instance.player.state === ENTITY_STATE_ENUM.AIRDEATH ||
                DataManager.Instance.player.state === ENTITY_STATE_ENUM.DEATH ?
                DataManager.Instance.player.state : ENTITY_STATE_ENUM.IDLE,
                type: DataManager.Instance.player.type
            },
            door: {
                x: DataManager.Instance.door.x,
                y: DataManager.Instance.door.y,
                direction: DataManager.Instance.door.direction,
                state: DataManager.Instance.door.state,
                type: DataManager.Instance.door.type
            },
            enemies: DataManager.Instance.enemies.map(({ x, y, state, direction, type }) => {
                return {
                  x,
                  y,
                  state,
                  direction,
                  type,
                }
              }),
              spikes: DataManager.Instance.spikes.map(({ x, y, count, type }) => {
                return {
                  x,
                  y,
                  count,
                  type,
                }
              }),
              bursts: DataManager.Instance.bursts.map(({ x, y, state, direction, type }) => {
                return {
                  x,
                  y,
                  state,
                  direction,
                  type,
                }
              }),

        }

        DataManager.Instance.records.push(item)
    }
    revoke() {
        const item = DataManager.Instance.records.pop()
        if (item) {
            DataManager.Instance.player.x = DataManager.Instance.player.targetX = item.player.x
            DataManager.Instance.player.y = DataManager.Instance.player.targetY = item.player.y
            DataManager.Instance.player.state = item.player.state
            DataManager.Instance.player.direction = item.player.direction

            DataManager.Instance.door.x = item.door.x
            DataManager.Instance.door.y = item.door.y
            DataManager.Instance.door.state = item.door.state
            DataManager.Instance.door.direction = item.door.direction


            for (let i = 0; i < DataManager.Instance.enemies.length; i++) {
                const enemy = item.enemies[i];
                DataManager.Instance.enemies[i].state = enemy.state
                DataManager.Instance.enemies[i].direction = enemy.direction
                DataManager.Instance.enemies[i].x = enemy.x
                DataManager.Instance.enemies[i].y = enemy.y

            }
            for (let i = 0; i < DataManager.Instance.bursts.length; i++) {
                const burst = item.bursts[i];
                DataManager.Instance.bursts[i].state = burst.state
                DataManager.Instance.bursts[i].x = burst.x
                DataManager.Instance.bursts[i].y = burst.y

            }
            for (let i = 0; i < DataManager.Instance.spikes.length; i++) {
                const spike = item.spikes[i];
                DataManager.Instance.spikes[i].type = spike.type
                DataManager.Instance.spikes[i].count = spike.count
                DataManager.Instance.spikes[i].x = spike.x
                DataManager.Instance.spikes[i].y = spike.y

            }
        }

    }

}


