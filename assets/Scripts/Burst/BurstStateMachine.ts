/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 11:23:20
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Animation,
} from 'cc';

import State from '../../Base/State';
import {
  getInitParamsNumber,
  getInitParamsTrigger,
  StateMachine,
} from '../../Base/StateMachine';
import { PARAMS_NAME_ENUM } from '../../Enums';

const BASE_URL = 'texture/burst'
const { ccclass, property } = _decorator;
    
    
    
    @ccclass('BurstStateMachine')
    export class BurstStateMachine extends StateMachine {
    
        async init() {
            this.animationComponent = this.addComponent(Animation)
    
            this.initParams()
            this.initStateMachine()
            this.initAnimationEvent()
    
            await Promise.all(this.waitingList)
        }
    
    
        initParams() {
            this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
            this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger())
            this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
            this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
        }
        initStateMachine() {
            this.stateMachine.set(PARAMS_NAME_ENUM.IDLE, new State(this,`${BASE_URL}/idle`))
            this.stateMachine.set(PARAMS_NAME_ENUM.ATTACK, new State(this,`${BASE_URL}/attack`))
            this.stateMachine.set(PARAMS_NAME_ENUM.DEATH, new State(this,`${BASE_URL}/death`))
    
        }
        // 初始化动画事件
        initAnimationEvent() {
            
          //   this.animationComponent.on(Animation.EventType.FINISHED, () => {
          //         const name = this.animationComponent.defaultClip.name
    
          //         console.log(name);
                  
          //         const whiteList = ['attack']
          //         if (whiteList.some(v=>name.includes(v))) {
          //             this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
          //         }
          //   })
        }
    
        run() {
            switch (this.currentState) {
                
                case this.stateMachine.get(PARAMS_NAME_ENUM.IDLE):
                case this.stateMachine.get(PARAMS_NAME_ENUM.ATTACK):
                case this.stateMachine.get(PARAMS_NAME_ENUM.DEATH):
                    if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
                        this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.DEATH)
                    } else if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
                        this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.ATTACK)
                    } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                        this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.IDLE)
                    } else {
                        this.currentState = this.currentState
                    }
                    break;
    
                default:
                    this.currentState = (this.stateMachine.get(PARAMS_NAME_ENUM.IDLE))
                    break;
            }
    
        }
    }
    
    
    