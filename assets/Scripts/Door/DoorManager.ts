/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-04 19:06:22
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator } from 'cc';

import { EntityManager } from '../../Base/EntityManager';
import {
  DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
} from '../../Enums';
import DataManager from '../../Runtime/DataManager';
import EventManager from '../../Runtime/EventManager';
import { DoorStateMachine } from './DoorStateMachine';

const { ccclass, property } = _decorator;
  
  @ccclass('DoorManager')
  export class DoorManager extends EntityManager {
  
  
    targetX:number = 0
    targetY:number = 0

    async init(){

        // 添加设置状态机
        this.fsm = this.addComponent(DoorStateMachine)
        await this.fsm.init()

        super.init({
            x:7,
            y:8,
            type:ENTITY_TYPE_ENUM.DOOR,
            direction:DIRECTION_ENUM.TOP,
            state:ENTITY_STATE_ENUM.IDLE
        })

   
        EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN,this.onOpen,this)

    }
    onDestroy() {
      super.onDestroy()
      EventManager.Instance.off(EVENT_ENUM.DOOR_OPEN,this.onOpen)

    }

    onOpen(){
        if(DataManager.Instance.enemies.every(enemy => enemy.state === ENTITY_STATE_ENUM.DEATH) && this.state !==ENTITY_STATE_ENUM.DEATH) {
            this.state = ENTITY_STATE_ENUM.DEATH
        }
    }


  }
  
  
  