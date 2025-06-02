/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-02 16:21:02
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
import { PlayerManager } from '../Player/PlayerManager';
import {
  TILE_HEIGHT,
  TILE_WIDTH,
} from '../Tile/TileManager';
import { TileMapManneger } from '../Tile/TileMapManager';

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
        this.generatePlayer()
    }

    initLevel(){
        this.clearlevel()
        const level = Levels[`level${DataManager.Instance.levelIndex}`];
        if (level) {
            this.level = level;
            DataManager.Instance.MapInfo = this.level.mapInfo;
            DataManager.Instance.MapRowCount = this.level.mapInfo.length || 0;
            DataManager.Instance.MapColumCount = this.level.mapInfo[0].length || 0;

            this.generateTileMap()
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
    generateTileMap() {
        // const stage = new Node()
        // stage.setParent(this.node)
        const TileMap = new Node()
        TileMap.setParent(this.stage)
        const tileMapManager = TileMap.addComponent(TileMapManneger)
        tileMapManager.init()

        this.adaptPos()
    }
    generatePlayer(){
        const player = createUINode()
        player.setParent(this.stage)
        const playerManager = player.addComponent(PlayerManager)
        playerManager.init()
    }

    adaptPos(){
        const {MapColumCount,MapRowCount} = DataManager.Instance
        const disX = (TILE_WIDTH * MapRowCount) / 2
        const disY = (TILE_HEIGHT * MapColumCount) / 2 + 80

        this.stage.setPosition(-disX,disY)
    }
 
}


