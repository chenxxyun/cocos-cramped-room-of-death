/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 10:40:43
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator } from 'cc';

import {
  DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  EVENT_ENUM,
} from '../Enums';
import { IEntity } from '../Levels';
import DataManager from '../Runtime/DataManager';
import EventManager from '../Runtime/EventManager';
import { EntityManager } from './EntityManager';

const { ccclass, property } = _decorator;
  
  @ccclass('EnemyManager')
  export class EnemyManager extends EntityManager {
  
  
    targetX:number = 0
    targetY:number = 0

    async init(params:IEntity){

        super.init(params)
   
        EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN,this.onChangeDirection,this)
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onChangeDirection,this)
        EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY,this.onDead,this)

        
        this.onChangeDirection(true)
    }
    onDestroy() {
      super.onDestroy()
      EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN,this.onChangeDirection)
      EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.onChangeDirection)
      EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY,this.onDead)
    }

    onChangeDirection(isInit=false){
      if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player){
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

   

    onDead(id:string){
      console.log(id,this.id);
      
      if (this.state === ENTITY_STATE_ENUM.DEATH) {
        return
      }
      if (this.id === id) {
        this.state = ENTITY_STATE_ENUM.DEATH
      }

    }
  }
  
  
  