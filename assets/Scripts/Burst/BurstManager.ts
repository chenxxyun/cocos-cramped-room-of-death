/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 11:54:19
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  UITransform,
} from 'cc';

import { EnemyManager } from '../../Base/EnemyManager';
import {
  ENTITY_STATE_ENUM,
  EVENT_ENUM,
} from '../../Enums';
import { IEntity } from '../../Levels';
import DataManager from '../../Runtime/DataManager';
import EventManager from '../../Runtime/EventManager';
import {
  TILE_HEIGHT,
  TILE_WIDTH,
} from '../Tile/TileManager';
import { BurstStateMachine } from './BurstStateMachine';

const { ccclass, property } = _decorator;
  
  @ccclass('BurstManager')
  export class BurstManager extends EnemyManager {
  
  
    targetX:number = 0
    targetY:number = 0

    async init(params:IEntity){
        // 添加设置状态机
        this.fsm = this.addComponent(BurstStateMachine)
        await this.fsm.init()

        super.init(params)

        const transform = this.getComponent(UITransform)
        transform.setContentSize(TILE_WIDTH,TILE_HEIGHT)

   
        
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onBurst,this)
     

        
    }

    update(): void {
        this.node.setPosition(this.x * TILE_WIDTH,-this.y * TILE_HEIGHT)
    }
    onDestroy() {
      super.onDestroy()
      EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.onBurst)
    }

   
    onBurst(){
      if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player){
        return
      } 

      const {x:playerX,y:playerY } = DataManager.Instance.player

      if (this.x === playerX && this.y === playerY&&this.state === ENTITY_STATE_ENUM.IDLE) {
        this.state = ENTITY_STATE_ENUM.ATTACK
      }else if (this.state === ENTITY_STATE_ENUM.ATTACK) {
        console.log('onBurst');
        
        this.state = ENTITY_STATE_ENUM.DEATH
        if (this.x===playerX && this.y===playerY) {
            EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER,ENTITY_STATE_ENUM.AIRDEATH,this)
        }
      }
      
    }


  }
  
  
  