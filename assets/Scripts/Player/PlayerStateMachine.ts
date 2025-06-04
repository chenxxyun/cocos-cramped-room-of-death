/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-04 17:30:44
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Animation,
} from 'cc';

import { EntityManager } from '../../Base/EntityManager';
import {
  getInitParamsNumber,
  getInitParamsTrigger,
  StateMachine,
} from '../../Base/StateMachine';
import {
  ENTITY_STATE_ENUM,
  PARAMS_NAME_ENUM,
} from '../../Enums';
import BlockBacktSubStateMachine from './BlockBacktSubStateMachine';
import BlockFrontSubStateMachine from './BlockFrontSubStateMachine';
import BlockLefttSubStateMachine from './BlockLefttSubStateMachine';
import BlockRighttSubStateMachine from './BlockRighttSubStateMachine';
import BlockTurnLeftSubStateMachine from './BlockTurnLeftSubStateMachine';
import BlockTurnRightSubStateMachine from './BlockTurnRightSubStateMachine';
import DeathSubStateMAchine from './DeathSubStateMAchine';
import IdleSubStateMachine from './IdleSubStateMachine';
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine';
import TurnRightSubStateMachine from './TurnRightSubStateMachine';

const { ccclass, property } = _decorator;


    
@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {

    async init(){
        this.animationComponent =  this.addComponent(Animation)

        this.initParams()
        this.initStateMachine()
        this.initAnimationEvent()

        await Promise.all(this.waitingList)
    }


    initParams(){
        this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.TURNLEFT,getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.TURNRIGHT,getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.BLOCKFRONT,getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.BLOCKBACK,getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.BLOCKLEFT,getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.BLOCKRIGHT,getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT,getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT,getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.DEATH,getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.DIRECTION,getInitParamsNumber())
    }
    initStateMachine(){
        this.stateMachine.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.TURNLEFT, new TurnLeftSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.TURNRIGHT, new TurnRightSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKFRONT, new BlockFrontSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKBACK, new BlockBacktSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKLEFT, new BlockLefttSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKRIGHT, new BlockRighttSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT, new BlockTurnLeftSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT, new BlockTurnRightSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMAchine(this))
    
    }
    // 初始化动画事件
    initAnimationEvent() {
        
        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.animationComponent.defaultClip.name
            
            const whiteList = ['block','turn']
            if (whiteList.some(v=>name.includes(v))) {
                this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
            }
        })
    }

    run(){
        switch (this.currentState) {
            case this.stateMachine.get(PARAMS_NAME_ENUM.TURNLEFT):
            case this.stateMachine.get(PARAMS_NAME_ENUM.TURNRIGHT):
            case this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKFRONT):
            case this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKBACK):
            case this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKLEFT):
            case this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKRIGHT):
            case this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT):
            case this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT):
            case this.stateMachine.get(PARAMS_NAME_ENUM.IDLE):
            case this.stateMachine.get(PARAMS_NAME_ENUM.DEATH):
                if(this.params.get(PARAMS_NAME_ENUM.DEATH).value){
                    this.currentState  = this.stateMachine.get(PARAMS_NAME_ENUM.DEATH)
                }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKFRONT).value){
                    this.currentState  = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKFRONT)
                }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKBACK).value){
                    this.currentState  = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKBACK)
                }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKLEFT).value){
                    this.currentState  = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKLEFT)
                }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKRIGHT).value){
                    this.currentState  = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKRIGHT)
                }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT).value){
                    this.currentState  = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT)
                }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT).value){
                    this.currentState  = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT)
                }else if(this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value){
                    this.currentState  = this.stateMachine.get(PARAMS_NAME_ENUM.TURNLEFT)
                }else if(this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value){
                    this.currentState  = this.stateMachine.get(PARAMS_NAME_ENUM.TURNRIGHT)
                }else if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
                    this.currentState  = this.stateMachine.get(PARAMS_NAME_ENUM.IDLE)
                }else {
                    this.currentState  = this.currentState
                }
                break;
           
            default:
                this.currentState = (this.stateMachine.get(PARAMS_NAME_ENUM.IDLE))
                break;
        }
    
    }
}

    
    