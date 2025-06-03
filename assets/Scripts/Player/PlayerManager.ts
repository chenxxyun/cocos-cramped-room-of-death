/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-03 17:54:19
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator } from 'cc';

import { EntityManager } from '../../Base/EntityManager';
import {
  CONTROLLER_ENUM,
  DIRECTION_ENUM,
  ENTIIY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
} from '../../Enums';
import DataManager from '../../Runtime/DataManager';
import EventManager from '../../Runtime/EventManager';
import { PlayerStateMachine } from './PlayerStateMachine';

const { ccclass, property } = _decorator;
  
  @ccclass('PlayerManager')
  export class PlayerManager extends EntityManager {
  
  
    targetX:number = 0
    targetY:number = 0
    private readonly speed  = 1/10


    async init(){

        // 添加设置状态机
        this.fsm = this.addComponent(PlayerStateMachine)
        await this.fsm.init()
        // this.fsm.setParams(PARAMS_NAME_ENUM.IDLE, true)

        super.init({
            x:2,
            y:8,
            type:ENTITY_TYPE_ENUM.PLAYER,
            direction:DIRECTION_ENUM.TOP,
            state:ENTIIY_STATE_ENUM.IDLE
        })

        this.targetX = this.x
        this.targetY = this.y
        // 设置初始方向
        // this.direction = DIRECTION_ENUM.TOP
        // 设置初始状态
        // this.state = ENTIIY_STATE_ENUM.IDLE

        // 添加按钮控制事件
        EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL,this.inputHandle,this)
    }

    update(){
        this.updateXY()
        super.update()
    
    }

    updateXY(){

        if(this.targetX< this.x){
            this.x-=this.speed
        }else if(this.targetX > this.x){
            this.x+=this.speed
        }
        
        if(this.targetY < this.y){
            this.y-=this.speed
        }else if(this.targetY > this.y){
            this.y+=this.speed
        }

        if (Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1) {
            this.x = this.targetX
            this.y = this.targetY
        }

    }

    inputHandle(InputDeviceInfo:CONTROLLER_ENUM){
        if (this.willBlock(InputDeviceInfo)) {
            console.log('block');
            
            return
        }
        this.move(InputDeviceInfo)
    }

    move (InputDeviceInfo:CONTROLLER_ENUM){
        console.log(DataManager.Instance.tileInfo);
        
        if (InputDeviceInfo === CONTROLLER_ENUM.TOP) {
            this.targetY-=1
        }else if (InputDeviceInfo === CONTROLLER_ENUM.BOTTOM) {
            this.targetY+=1
        }else if (InputDeviceInfo === CONTROLLER_ENUM.LEFT) {
            this.targetX-=1
        }else if (InputDeviceInfo === CONTROLLER_ENUM.RIGHT) {
            this.targetX+=1
        }else if (InputDeviceInfo === CONTROLLER_ENUM.TURNLEFT) {
            
            if (this.direction === DIRECTION_ENUM.TOP) {
                this.direction = DIRECTION_ENUM.LEFT
            }else if (this.direction === DIRECTION_ENUM.LEFT) {
                this.direction = DIRECTION_ENUM.BOTTOM
            }else if (this.direction === DIRECTION_ENUM.BOTTOM) {
                this.direction = DIRECTION_ENUM.RIGHT
            }else if (this.direction === DIRECTION_ENUM.RIGHT) {
                this.direction = DIRECTION_ENUM.TOP
            }
            this.state = ENTIIY_STATE_ENUM.TURNLEFT
        }

    }
    willBlock(InputDeviceInfo:CONTROLLER_ENUM){
        const {targetX:x,targetY:y,direction} = this
        const {tileInfo} = DataManager.Instance

        if (InputDeviceInfo === CONTROLLER_ENUM.TOP) {
            if(direction === DIRECTION_ENUM.TOP){
                const playerNextY = y - 1
                const weaponNextY = y - 2
                if(playerNextY < 0){
                    this.state = ENTIIY_STATE_ENUM.BLOCKFRONT
                    return true
                }

                const playerTile = tileInfo[x][playerNextY]
                const weaponTile = tileInfo[x][weaponNextY]
                if (playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable)) {
                    
                }else{
                    this.state = ENTIIY_STATE_ENUM.BLOCKFRONT
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
                this.state = ENTIIY_STATE_ENUM.BLOCKTURNLEFT
                return true
            }

        }

        return false

    }
  }
  
  
  