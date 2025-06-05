/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 10:34:30
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator } from 'cc';

import { EnemyManager } from '../../Base/EnemyManager';
import {
  ENTITY_STATE_ENUM,
  EVENT_ENUM,
} from '../../Enums';
import { IEntity } from '../../Levels';
import DataManager from '../../Runtime/DataManager';
import EventManager from '../../Runtime/EventManager';
import { WoodenSkeletonMachine } from './WoodenSkeletonStateMachine';

const { ccclass, property } = _decorator;
  
  @ccclass('WoodenSkeletonManager')
  export class WoodenSkeletonManager extends EnemyManager {
  
  
    targetX:number = 0
    targetY:number = 0

    async init(params:IEntity){

        // 添加设置状态机
        this.fsm = this.addComponent(WoodenSkeletonMachine)
        await this.fsm.init()

        super.init(params)

   
        
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onAttack,this)
     

        
        this.onChangeDirection(true)
    }
    onDestroy() {
      super.onDestroy()
      
      EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.onAttack)

    }

   
    onAttack(){
      if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player){
        return
      } 

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
  
  
  