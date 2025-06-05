/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 12:23:36
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
  StateMachine,
} from '../../Base/StateMachine';
import {
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  PARAMS_NAME_ENUM,
  SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM,
} from '../../Enums';
import SpikesOneStateMachine from './SpikesOneStateMachine';

const { ccclass, property } = _decorator;



@ccclass('SpikesStateMahine')
export class SpikesStateMahine extends StateMachine {

    async init() {
        this.animationComponent = this.addComponent(Animation)

        this.initParams()
        this.initStateMachine()
        this.initAnimationEvent()

        await Promise.all(this.waitingList)
    }


    initParams() {
        this.params.set(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, getInitParamsNumber())
        this.params.set(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, getInitParamsNumber())
    }
    initStateMachine() {
        this.stateMachine.set(ENTITY_TYPE_ENUM.SPIKES_ONE, new SpikesOneStateMachine(this))

    }
    // 初始化动画事件
    initAnimationEvent() {

        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.animationComponent.defaultClip.name


            const whiteList = ['attack']
            if (whiteList.some(v => name.includes(v))) {
                this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
            }
        })
    }

    run() {
        const value = this.params.get(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT).value
        switch (this.currentState) {

            case this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_ONE):
                if (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE) {
                    this.currentState = this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
                } else {
                    this.currentState = this.currentState
                }
                break;

            default:
                this.currentState = (this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_ONE))
                break;
        }

    }
}


