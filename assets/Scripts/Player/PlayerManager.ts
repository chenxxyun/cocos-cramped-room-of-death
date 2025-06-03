/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-03 14:20:04
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Component,
  Sprite,
  UITransform,
} from 'cc';

import {
  CONTROLLER_ENUM,
  DIRECTIOMN_ORDER_ENUM,
  DIRECTION_ENUM,
  ENTIIY_STATE_ENUM,
  EVENT_ENUM,
  PARAMS_NAME_ENUM,
} from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import {
  TILE_HEIGHT,
  TILE_WIDTH,
} from '../Tile/TileManager';
import { PlayerStateMachine } from './PlayerStateMachine';

const { ccclass, property } = _decorator;
  
  @ccclass('PlayerManager')
  export class PlayerManager extends Component {
  
    x:number = 0
    y:number = 0
    targetX:number = 0
    targetY:number = 0
    private readonly speed  = 1/10

    fsm:PlayerStateMachine

    private _direction:DIRECTION_ENUM

    private _state:ENTIIY_STATE_ENUM

    get direction(){
        return this._direction
    }
    set direction(newDirection){
        this._direction = newDirection
        this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION,DIRECTIOMN_ORDER_ENUM[this._direction])
       
    }
    get state(){
        return this._state
    }

    set state(newState){
        this._state = newState
        this.fsm.setParams(newState,true)
    }

    async init(){

        const sprite = this.addComponent(Sprite)
        sprite.sizeMode = Sprite.SizeMode.CUSTOM
        const transform = this.getComponent(UITransform)
        transform.setContentSize(TILE_WIDTH*4,TILE_HEIGHT*4)

        

        // 添加设置状态机
        this.fsm = this.addComponent(PlayerStateMachine)
        await this.fsm.init()
        this.fsm.setParams(PARAMS_NAME_ENUM.IDLE, true)

        // 设置初始方向
        this.direction = DIRECTION_ENUM.TOP
        // 设置初始状态
        this.state = ENTIIY_STATE_ENUM.IDLE

        // 添加按钮控制事件
        EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL,this.move,this)
    }

    update(){
        this.updateXY()

        this.node.setPosition(this.x*TILE_WIDTH - 1.5*TILE_WIDTH,-this.y*TILE_HEIGHT + 1.5*TILE_HEIGHT)
    
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


    move (InputDeviceInfo:CONTROLLER_ENUM){
        if (InputDeviceInfo === CONTROLLER_ENUM.TOP) {
            this.targetY-=1
        }else if (InputDeviceInfo === CONTROLLER_ENUM.BOTTOM) {
            this.targetY+=1
        }else if (InputDeviceInfo === CONTROLLER_ENUM.LEFT) {
            this.targetX-=1
        }else if (InputDeviceInfo === CONTROLLER_ENUM.RIGHT) {
            this.targetX+=1
        }else if (InputDeviceInfo === CONTROLLER_ENUM.TURNLEFT) {
            // this.fsm.setParams(PARAMS_NAME_ENUM.TURNLEFT,true)
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
  }
  
  
  