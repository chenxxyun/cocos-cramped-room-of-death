/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 14:19:06
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Component,
  Sprite,
  UITransform,
} from 'cc';

import { StateMachine } from '../../Base/StateMachine';
import {
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
  PARAMS_NAME_ENUM,
  SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM,
} from '../../Enums';
import { ISpike } from '../../Levels';
import DataManager from '../../Runtime/DataManager';
import EventManager from '../../Runtime/EventManager';
import { randomByLen } from '../../Utils';
import {
  TILE_HEIGHT,
  TILE_WIDTH,
} from '../Tile/TileManager';
import { SpikesStateMahine } from './SpikesStateMahine';

const { ccclass, property } = _decorator;
      
  @ccclass('SpikesManager')
  export class SpikesManager extends Component {
      id:string = randomByLen(12)
  
      x:number = 0
      y:number = 0
  
      fsm:StateMachine
      _count:number
      _totalCount:number
      type:ENTITY_TYPE_ENUM
  
      get count(){
          return this._count
      }
      set count(newCount){
          this._count = newCount
          this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT,newCount)
          
      }
      get totalCount(){
          return this._totalCount
      }
  
      set totalCount(newtotalCount){
          this._totalCount = newtotalCount
          this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT,newtotalCount)
      }
  
      async init(params:ISpike){
  
          const sprite = this.addComponent(Sprite)
          sprite.sizeMode = Sprite.SizeMode.CUSTOM
          const transform = this.getComponent(UITransform)
          transform.setContentSize(TILE_WIDTH*4,TILE_HEIGHT*4)
  
          this.fsm = this.addComponent(SpikesStateMahine)
          await this.fsm.init()
          
          this.x = params.x
          this.y = params.y
          this.type = params.type

          console.log(this.type);
          

          this.totalCount = SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[this.type]
          

          this.count = params.count

          EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onLoop,this)

  
      }
  
      update(){
  
          this.node.setPosition(this.x*TILE_WIDTH - 1.5*TILE_WIDTH,-this.y*TILE_HEIGHT + 1.5*TILE_HEIGHT)
      
      }
      onDestroy(){
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.onLoop)
      }
      onLoop(){
        if (this.count === this.totalCount) {
          this.count = 1
        }else{
          this.count++
        }
        this.onAttack()
      }
      
      backZero(){
          this.count = 0
      }
      onAttack(){
        if (!DataManager.Instance.player) {
          return
        }
        const {x:playerX,y:playerY } = DataManager.Instance.player
        if (this.x === playerX && this.y === playerY && this.count  === this.totalCount) {
          EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER,ENTITY_STATE_ENUM.DEATH)
        }
      }
  
  }
    
      
      