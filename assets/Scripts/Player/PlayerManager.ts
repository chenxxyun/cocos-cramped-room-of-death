/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-04 18:27:10
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator } from 'cc';

import { EntityManager } from '../../Base/EntityManager';
import {
  CONTROLLER_ENUM,
  DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
} from '../../Enums';
import DataManager from '../../Runtime/DataManager';
import EventManager from '../../Runtime/EventManager';
import { PlayerStateMachine } from './PlayerStateMachine';

const { ccclass, property } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {


  targetX: number = 0
  targetY: number = 0
  isMoving: boolean = false
  private readonly speed = 1 / 10


  async init() {

    // 添加设置状态机
    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()
    // this.fsm.setParams(PARAMS_NAME_ENUM.IDLE, true)

    super.init({
      x: 2,
      y: 8,
      type: ENTITY_TYPE_ENUM.PLAYER,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE
    })

    this.targetX = this.x
    this.targetY = this.y
    // 设置初始方向
    // this.direction = DIRECTION_ENUM.TOP
    // 设置初始状态
    // this.state = ENTITY_STATE_ENUM.IDLE

    // 添加按钮控制事件
    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this)

    // EventManager.Instance.on(EVENT_ENUM.PLAYER_ON_KEYDOWN,this.inputHandle,this)

    EventManager.Instance.on(EVENT_ENUM.ATTACK_PLAYER, this.onDead, this)

  }

  update() {
    this.updateXY()
    super.update()

  }

  updateXY() {

    if (this.targetX < this.x) {
      this.x -= this.speed
    } else if (this.targetX > this.x) {
      this.x += this.speed
    }

    if (this.targetY < this.y) {
      this.y -= this.speed
    } else if (this.targetY > this.y) {
      this.y += this.speed
    }

    if (Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1 && this.isMoving) {
      this.isMoving = false

      this.x = this.targetX
      this.y = this.targetY

      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
    }



  }

  onDead(type: ENTITY_STATE_ENUM) {
    this.state = type

    console.log(type);

  }

  inputHandle(InputDeviceInfo: CONTROLLER_ENUM) {
    if (this.isMoving) return
    if (this.state === ENTITY_STATE_ENUM.DEATH || this.state === ENTITY_STATE_ENUM.AIRDEATH) return

    if ( this.willAttack(InputDeviceInfo) ) {
      return
    }

    if (this.willBlock(InputDeviceInfo)) {
      console.log('block');

      return
    }
    this.move(InputDeviceInfo)
  }

  move(InputDeviceInfo: CONTROLLER_ENUM) {
    // console.log(DataManager.Instance.tileInfo);

    if (InputDeviceInfo === CONTROLLER_ENUM.TOP) {
      this.targetY -= 1
      this.isMoving = true

    } else if (InputDeviceInfo === CONTROLLER_ENUM.BOTTOM) {
      this.targetY += 1
      this.isMoving = true
    } else if (InputDeviceInfo === CONTROLLER_ENUM.LEFT) {
      this.targetX -= 1
      this.isMoving = true
    } else if (InputDeviceInfo === CONTROLLER_ENUM.RIGHT) {
      this.targetX += 1
      this.isMoving = true
    } else if (InputDeviceInfo === CONTROLLER_ENUM.TURNLEFT) {

      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.TOP
      }
      this.state = ENTITY_STATE_ENUM.TURNLEFT
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)

    } else if (InputDeviceInfo === CONTROLLER_ENUM.TURNRIGHT) {

      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.TOP
      }
      this.state = ENTITY_STATE_ENUM.TURNRIGHT
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)

    }

  }

  willAttack(type: CONTROLLER_ENUM) {
    const enemise = DataManager.Instance.enemies
    for (let i = 0; i < enemise.length; i++) {
      const { x: enemyX, y: enemyY } = enemise[i]
      if (
        type === CONTROLLER_ENUM.TOP && 
        this.direction === DIRECTION_ENUM.TOP && 
        enemyX === this.x && 
        enemyY === this.targetY - 2
      ) {
        this.state = ENTITY_STATE_ENUM.ATTACK
        return true
      }else  if (
        type === CONTROLLER_ENUM.LEFT && 
        this.direction === DIRECTION_ENUM.LEFT && 
        enemyX === this.x - 2 && 
        enemyY === this.targetY
      ) {
        this.state = ENTITY_STATE_ENUM.ATTACK
        return true
      }else  if (
        type === CONTROLLER_ENUM.BOTTOM && 
        this.direction === DIRECTION_ENUM.BOTTOM && 
        enemyX === this.x  && 
        enemyY === this.targetY + 2
      ) {
        this.state = ENTITY_STATE_ENUM.ATTACK
        return true
      }else  if (
        type === CONTROLLER_ENUM.RIGHT && 
        this.direction === DIRECTION_ENUM.RIGHT && 
        enemyX === this.x + 2 && 
        enemyY === this.targetY
      ) {
        this.state = ENTITY_STATE_ENUM.ATTACK
        return true
      }

    }
    return false
  }


  /*  willBlock(InputDeviceInfo:CONTROLLER_ENUM){
       const {targetX:x,targetY:y,direction} = this
       const {tileInfo} = DataManager.Instance

       if (InputDeviceInfo === CONTROLLER_ENUM.TOP) {
           if(direction === DIRECTION_ENUM.TOP){
               const playerNextY = y - 1
               const weaponNextY = y - 2
               if(playerNextY < 0){
                   this.state = ENTITY_STATE_ENUM.BLOCKFRONT
                   return true
               }

               const playerTile = tileInfo[x][playerNextY]
               const weaponTile = tileInfo[x][weaponNextY]
               if (playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable)) {
                   
               }else{
                   this.state = ENTITY_STATE_ENUM.BLOCKFRONT
                   return true  
               }
           }
       }else if (InputDeviceInfo === CONTROLLER_ENUM.BOTTOM) {
           const playerNextY = y + 1
           const weaponNextY = y + 2
           const playerTile = tileInfo[x][playerNextY]
           const weaponTile = tileInfo[x][weaponNextY]
           if(direction === DIRECTION_ENUM.BOTTOM){
               if(playerNextY < 0){
                   return true
               }
               if (playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable)) {
                   
               }else{
                   return true  
               }
           }else if(direction === DIRECTION_ENUM.TOP){
               if (playerTile.moveable) {
                   
               }else{
                   return true  
               }
           }
       }else if(InputDeviceInfo === CONTROLLER_ENUM.TURNLEFT){
           let nextX: number
           let nextY: number

           if (direction === DIRECTION_ENUM.TOP) {
               nextX = x - 1
               nextY = y - 1
               
           }else if (direction === DIRECTION_ENUM.BOTTOM) {
               nextX = x + 1
               nextY = y + 1
               
           }else if (direction === DIRECTION_ENUM.LEFT) {
               nextX = x - 1
               nextY = y + 1
               
           }else if (direction === DIRECTION_ENUM.RIGHT) {
               nextX = x + 1
               nextY = y - 1
               
           }

           if(
               (!tileInfo[x][nextY] || tileInfo[x][nextY].turnable) &&
               (!tileInfo[nextX][y] || tileInfo[nextX][y].turnable) &&
               (!tileInfo[nextX][nextY] || tileInfo[nextX][nextY].turnable) 
           ){
           
           }else{
               this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT
               return true
           }

       }

       return false

   } */


  willBlock(type: CONTROLLER_ENUM) {
    const { targetX: x, targetY: y, direction } = this
    const { tileInfo: tileInfo } = DataManager.Instance


    const { mapRowCount: row, mapColumnCount: column } = DataManager.Instance

    //按钮方向——向上
    if (type === CONTROLLER_ENUM.TOP) {
      const playerNextY = y - 1

      //玩家方向——向上
      if (direction === DIRECTION_ENUM.TOP) {
        //判断是否超出地图
        if (playerNextY < 0) {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT
          return true
        }

        const weaponNextY = y - 2
        const nextPlayerTile = tileInfo[x]?.[playerNextY]
        const nextWeaponTile = tileInfo[x]?.[weaponNextY]



        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT
          return true
        }

        //玩家方向——向下
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        //判断是否超出地图
        if (playerNextY < 0) {
          this.state = ENTITY_STATE_ENUM.BLOCKBACK
          return true
        }

        const weaponNextY = y
        const nextPlayerTile = tileInfo[x]?.[playerNextY]
        const nextWeaponTile = tileInfo[x]?.[weaponNextY]



        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKBACK
          return true
        }

        //玩家方向——向左
      } else if (direction === DIRECTION_ENUM.LEFT) {
        //判断是否超出地图
        if (playerNextY < 0) {
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT
          return true
        }

        const weaponNextX = x - 1
        const weaponNextY = y - 1
        const nextPlayerTile = tileInfo[x]?.[playerNextY]
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]



        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT
          return true
        }

        //玩家方向——向右
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        //判断是否超出地图
        if (playerNextY < 0) {
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT
          return true
        }

        const weaponNextX = x + 1
        const weaponNextY = y - 1
        const nextPlayerTile = tileInfo[x]?.[playerNextY]
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]



        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT
          return true
        }
      }

      //按钮方向——向下
    } else if (type === CONTROLLER_ENUM.BOTTOM) {
      const playerNextY = y + 1

      //玩家方向——向上
      if (direction === DIRECTION_ENUM.TOP) {
        if (playerNextY > column - 1) {
          this.state = ENTITY_STATE_ENUM.BLOCKBACK

          return true
        }

        const weaponNextY = y
        const nextPlayerTile = tileInfo[x]?.[playerNextY]
        const nextWeaponTile = tileInfo[x]?.[weaponNextY]



        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKBACK
          return true
        }

        //玩家方向——向下
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        if (playerNextY > column - 1) {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT

          return true
        }

        const weaponNextY = y + 2
        const nextPlayerTile = tileInfo[x]?.[playerNextY]
        const nextWeaponTile = tileInfo[x]?.[weaponNextY]



        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT
          return true
        }

        //玩家方向——向左
      } else if (direction === DIRECTION_ENUM.LEFT) {
        if (playerNextY > column - 1) {
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT

          return true
        }

        const weaponNextX = x - 1
        const weaponNextY = y + 1
        const nextPlayerTile = tileInfo[x]?.[playerNextY]
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]



        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT
          return true
        }

        //玩家方向——向右
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        if (playerNextY > column - 1) {
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT

          return true
        }

        const weaponNextX = x + 1
        const weaponNextY = y + 1
        const nextPlayerTile = tileInfo[x]?.[playerNextY]
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]



        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT
          return true
        }
      }

      //按钮方向——向左
    } else if (type === CONTROLLER_ENUM.LEFT) {
      const playerNextX = x - 1

      //玩家方向——向上
      if (direction === DIRECTION_ENUM.TOP) {
        //判断是否超出地图
        if (playerNextX < 0) {
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT

          return true
        }

        const weaponNextX = x - 1
        const weaponNextY = y - 1
        const nextPlayerTile = tileInfo[playerNextX]?.[y]
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]



        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT
          return true
        }

        //玩家方向——向下
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        //判断是否超出地图
        if (playerNextX < 0) {
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT

          return true
        }

        const weaponNextX = x - 1
        const weaponNextY = y + 1
        const nextPlayerTile = tileInfo[playerNextX]?.[y]
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]



        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT
          return true
        }

        //玩家方向——向左
      } else if (direction === DIRECTION_ENUM.LEFT) {
        //判断是否超出地图
        if (playerNextX < 0) {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT

          return true
        }

        const weaponNextX = x - 2
        const nextPlayerTile = tileInfo[playerNextX]?.[y]
        const nextWeaponTile = tileInfo[weaponNextX]?.[y]



        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT
          return true
        }

        //玩家方向——向右
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        //判断是否超出地图
        if (playerNextX < 0) {
          this.state = ENTITY_STATE_ENUM.BLOCKBACK

          return true
        }

        const weaponNextX = x
        const nextPlayerTile = tileInfo[playerNextX]?.[y]
        const nextWeaponTile = tileInfo[weaponNextX]?.[y]


        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKBACK
          return true
        }
      }

      //按钮方向——向右
    } else if (type === CONTROLLER_ENUM.RIGHT) {
      const playerNextX = x + 1

      //玩家方向——向上
      if (direction === DIRECTION_ENUM.TOP) {
        if (playerNextX > row - 1) {
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT

          return true
        }

        const weaponNextX = x + 1
        const weaponNextY = y - 1
        const nextPlayerTile = tileInfo[playerNextX]?.[y]
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]



        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKRIGHT
          return true
        }

        //玩家方向——向下
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        if (playerNextX > row - 1) {
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT

          return true
        }

        const weaponNextX = x + 1
        const weaponNextY = y + 1
        const nextPlayerTile = tileInfo[playerNextX]?.[y]
        const nextWeaponTile = tileInfo[weaponNextX]?.[weaponNextY]



        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKLEFT
          return true
        }

        //玩家方向——向左
      } else if (direction === DIRECTION_ENUM.LEFT) {
        if (playerNextX > row - 1) {
          this.state = ENTITY_STATE_ENUM.BLOCKBACK

          return true
        }

        const weaponNextX = x
        const nextPlayerTile = tileInfo[playerNextX]?.[y]
        const nextWeaponTile = tileInfo[weaponNextX]?.[y]


        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKBACK
          return true
        }

        //玩家方向——向右
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        if (playerNextX > row - 1) {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT

          return true
        }

        const weaponNextX = x + 2
        const nextPlayerTile = tileInfo[playerNextX]?.[y]
        const nextWeaponTile = tileInfo[weaponNextX]?.[y]



        //最后判断地图元素
        if (nextPlayerTile && nextPlayerTile.moveable && (!nextWeaponTile || nextWeaponTile.turnable)) {
          // empty
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCKFRONT
          return true
        }
      }

      //按钮方向——左转
    } else if (type === CONTROLLER_ENUM.TURNLEFT) {
      let nextY, nextX
      if (direction === DIRECTION_ENUM.TOP) {
        //朝上左转的话，左上角三个tile都必须turnable为true，并且没有敌人
        nextY = y - 1
        nextX = x - 1
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        nextY = y + 1
        nextX = x + 1
      } else if (direction === DIRECTION_ENUM.LEFT) {
        nextY = y + 1
        nextX = x - 1
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        nextY = y - 1
        nextX = x + 1
      }



      //最后判断地图元素
      if (
        (!tileInfo[x]?.[nextY] || tileInfo[x]?.[nextY].turnable) &&
        (!tileInfo[nextX]?.[y] || tileInfo[nextX]?.[y].turnable) &&
        (!tileInfo[nextX]?.[nextY] || tileInfo[nextX]?.[nextY].turnable)
      ) {
        // empty
      } else {
        this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT
        return true
      }

      //按钮方向——右转
    } else if (type === CONTROLLER_ENUM.TURNRIGHT) {
      let nextX, nextY
      if (direction === DIRECTION_ENUM.TOP) {
        //朝上右转的话，右上角三个tile都必须turnable为true
        nextY = y - 1
        nextX = x + 1
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        nextY = y + 1
        nextX = x - 1
      } else if (direction === DIRECTION_ENUM.LEFT) {
        nextY = y - 1
        nextX = x - 1
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        nextY = y + 1
        nextX = x + 1
      }



      //最后判断地图元素
      if (
        (!tileInfo[x]?.[nextY] || tileInfo[x]?.[nextY].turnable) &&
        (!tileInfo[nextX]?.[y] || tileInfo[nextX]?.[y].turnable) &&
        (!tileInfo[nextX]?.[nextY] || tileInfo[nextX]?.[nextY].turnable)
      ) {
        // empty
      } else {
        this.state = ENTITY_STATE_ENUM.BLOCKTURNRIGHT
        return true
      }
    }

    return false
  }
}


