/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-03 14:08:33
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Animation,
} from 'cc';

import {
  getInitParamsNumber,
  getInitParamsTrigger,
  StateMachine,
} from '../../Base/StateMachine';
import { PARAMS_NAME_ENUM } from '../../Enums';
import IdleSubStateMachine from './IdleSubStateMachine';
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine';

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
        this.params.set(PARAMS_NAME_ENUM.DIRECTION,getInitParamsNumber())
    }
    initStateMachine(){
        this.stateMachine.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
        this.stateMachine.set(PARAMS_NAME_ENUM.TURNLEFT, new TurnLeftSubStateMachine(this))
        // this.stateMachine.set(PARAMS_NAME_ENUM.TURNLEFT, new State(this,'texture/player/turnleft/top'))
    
    }
    initAnimationEvent() {
        console.log('initAnimationEvent');
        
        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.animationComponent.defaultClip.name

            const whiteList = ['turn']

            if (whiteList.some(v=>name.includes(v))) {
                
                this.setParams(PARAMS_NAME_ENUM.IDLE, true)
            }
        })
    }

    run(){
        switch (this.currentState) {
            case this.stateMachine.get(PARAMS_NAME_ENUM.TURNLEFT):
            case this.stateMachine.get(PARAMS_NAME_ENUM.IDLE):
                if(this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value){
                    this.currentState  = this.stateMachine.get(PARAMS_NAME_ENUM.TURNLEFT)
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

    
    