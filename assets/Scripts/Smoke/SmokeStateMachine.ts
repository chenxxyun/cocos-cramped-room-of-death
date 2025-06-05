/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 16:17:27
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
import DeathSubStateMachine from './DeathSubStateMachine';
import IdleSubStateMachine from './IdleSubStateMachine';

const { ccclass, property } = _decorator;
    
    
    
    @ccclass('IronSkeletonStateMachine')
    export class SmokeStateMachine extends StateMachine {
    
        async init() {
            this.animationComponent = this.addComponent(Animation)
    
            this.initParams()
            this.initStateMachine()
            this.initAnimationEvent()
    
            await Promise.all(this.waitingList)
        }
    
    
        initParams() {
            this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
            this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
            this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
        }
        initStateMachine() {
            this.stateMachine.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
            this.stateMachine.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this))
    
        }
        // 初始化动画事件
        initAnimationEvent() {
            this.animationComponent.on(Animation.EventType.FINISHED, () => {
                const name = this.animationComponent.defaultClip.name
                
                const whiteList = ['idle']
                if (whiteList.some(v=>name.includes(v))) {
                    this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.DEATH
                    // this.node.getComponent(EntityManager).destroy()
                }
            })
        }
    
        run() {
            switch (this.currentState) {
                
                case this.stateMachine.get(PARAMS_NAME_ENUM.IDLE):
                case this.stateMachine.get(PARAMS_NAME_ENUM.DEATH):
                    if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
                        this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.DEATH)
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
    
    
    