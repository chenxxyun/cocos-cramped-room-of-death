/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-04 18:43:43
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
  DIRECTION_ENUM,
  DIRECTION_ORDER_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  PARAMS_NAME_ENUM,
} from '../Enums';
import { IEntity } from '../Levels';
import {
  TILE_HEIGHT,
  TILE_WIDTH,
} from '../Scripts/Tile/TileManager';
import { randomByLen } from '../Utils';
import { StateMachine } from './StateMachine';

const { ccclass, property } = _decorator;
    
@ccclass('EntityManager')
export class EntityManager extends Component {
    id:string = randomByLen(12)

    x:number = 0
    y:number = 0

    fsm:StateMachine
    private _direction:DIRECTION_ENUM
    private _state:ENTITY_STATE_ENUM

    type:ENTITY_TYPE_ENUM

    get direction(){
        return this._direction
    }
    set direction(newDirection){
        this._direction = newDirection
        this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION,DIRECTION_ORDER_ENUM[this._direction])
        
    }
    get state(){
        return this._state
    }

    set state(newState){
        this._state = newState
        this.fsm.setParams(newState,true)
    }

    init(params:IEntity){

        const sprite = this.addComponent(Sprite)
        sprite.sizeMode = Sprite.SizeMode.CUSTOM
        const transform = this.getComponent(UITransform)
        transform.setContentSize(TILE_WIDTH*4,TILE_HEIGHT*4)

        
        this.x = params.x
        this.y = params.y
        this.type = params.type

        // 设置初始方向
        this.direction = params.direction
        // 设置初始状态
        this.state = params.state

    }

    update(){

        this.node.setPosition(this.x*TILE_WIDTH - 1.5*TILE_WIDTH,-this.y*TILE_HEIGHT + 1.5*TILE_HEIGHT)
    
    }
    onDestroy(){
        
    }


}
  
    
    