/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-04 17:27:09
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
import { WoodenSkeletonMachine } from './WoodenSkeletonStateMachine';

const { ccclass, property } = _decorator;
  
  @ccclass('WoodenSkeletonManager')
  export class WoodenSkeletonManager extends EntityManager {
  
  
    targetX:number = 0
    targetY:number = 0

    async init(){

        // 添加设置状态机
        this.fsm = this.addComponent(WoodenSkeletonMachine)
        await this.fsm.init()
        // this.fsm.setParams(PARAMS_NAME_ENUM.IDLE, true)

        super.init({
            x:2,
            y:4,
            type:ENTITY_TYPE_ENUM.PLAYER,
            direction:DIRECTION_ENUM.TOP,
            state:ENTITY_STATE_ENUM.IDLE
        })

   
        EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN,this.onChangeDirection,this)
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onChangeDirection,this)
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onAttack,this)

        
        this.onChangeDirection(true)
    }

    onChangeDirection(isInit=false){
      
      if (!DataManager.Instance.player) {
        return
      }
      const {x:playerX,y:playerY} = DataManager.Instance.player

      const disX = Math.abs(this.x - playerX)
      const disY = Math.abs(this.y - playerY)

      if (disX === disY&&isInit) {
        return
      }

     //第一象限
      if (playerX >= this.x && playerY <= this.y) {
        this.direction = disX >= disY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.TOP

        //第二象限
      } else if (playerX <= this.x && playerY <= this.y) {
        this.direction = disX >= disY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.TOP

        //第三象限
      } else if (playerX <= this.x && playerY >= this.y) {
        this.direction = disX >= disY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.BOTTOM

        //第四象限
      } else if (playerX >= this.x && playerY >= this.y) {
        this.direction = disX >= disY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.BOTTOM
      }
      
    }
    onAttack(){
      const {x:playerX,y:playerY ,state:playerState} = DataManager.Instance.player

      if (((this.x === playerX && Math.abs(this.y - playerY) <= 1) || 
        (this.y === playerY && Math.abs(this.x - playerX) <= 1) )&& 
        playerState!== ENTITY_STATE_ENUM.DEATH &&  
        playerState!== ENTITY_STATE_ENUM.AIRDEATH
      ) {
        this.state = ENTITY_STATE_ENUM.ATTACK
        console.log(ENTITY_STATE_ENUM.DEATH);
        
        EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER,ENTITY_STATE_ENUM.DEATH)
      }else{
        this.state = ENTITY_STATE_ENUM.IDLE
      }
      
    }

    

  }
  
  
  