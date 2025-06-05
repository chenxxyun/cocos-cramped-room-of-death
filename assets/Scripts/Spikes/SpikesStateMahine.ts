/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 14:12:37
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Animation,
} from 'cc';

import {
  getInitParamsNumber,
  StateMachine,
} from '../../Base/StateMachine';
import {
  ENTITY_TYPE_ENUM,
  PARAMS_NAME_ENUM,
  SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM,
} from '../../Enums';
import SpikesFourStateMachine from './SpikesFourStateMachine';
import { SpikesManager } from './SpikesManager';
import SpikesOneStateMachine from './SpikesOneStateMachine';
import SpikesThreeStateMachine from './SpikesThreeStateMachine';
import SpikesTwoStateMachine from './SpikesTwoStateMachine';

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
        this.params.set(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, getInitParamsNumber())
        this.params.set(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, getInitParamsNumber())
    }
    initStateMachine() {
        this.stateMachine.set(ENTITY_TYPE_ENUM.SPIKES_ONE, new SpikesOneStateMachine(this))
        this.stateMachine.set(ENTITY_TYPE_ENUM.SPIKES_TWO, new SpikesTwoStateMachine(this))
        this.stateMachine.set(ENTITY_TYPE_ENUM.SPIKES_THREE, new SpikesThreeStateMachine(this))
        this.stateMachine.set(ENTITY_TYPE_ENUM.SPIKES_FOUR, new SpikesFourStateMachine(this))

    }
    // 初始化动画事件
    initAnimationEvent() {

        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.animationComponent.defaultClip.name

            const value = this.getParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)

            if (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE && name.includes('spikesone/two') || 
                value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE && name.includes('spikestwo/three') ||
                value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE && name.includes('spikesthree/four') ||
                value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE && name.includes('spikesfive/five')) {
                this.node.getComponent(SpikesManager).backZero()
            }
        })
    }

    run() {

        const { value } = this.params.get(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)

        switch (this.currentState) {

            case this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_ONE):
            case this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_TWO):
            case this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_THREE):
            case this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_FOUR):
                if (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE) {
                    this.currentState = this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
                } else if (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_TWO) {
                    this.currentState = this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_TWO)
                } else if (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_THREE) {
                    this.currentState = this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_THREE)
                } else if (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_FOUR) {
                    this.currentState = this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_FOUR)
                } else {
                    this.currentState = this.currentState
                }
                break;

            default:
                this.currentState = this.stateMachine.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
                break;
        }

    }
}


