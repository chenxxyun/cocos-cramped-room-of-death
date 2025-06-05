import { AnimationClip } from 'cc';

import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine';
import State, { ANIMATION_SPEED } from '../../Base/State';
import { StateMachine } from '../../Base/StateMachine';
import { DIRECTION_ENUM } from '../../Enums';

/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-03 13:45:20
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 16:22:20
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Player\TurnLeftSubStateMachine.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * 
 */

const BASE_URL = 'texture/smoke/idle'
export default class IdleSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm:StateMachine) {
        super(fsm)
        this.stateMachine.set(
            DIRECTION_ENUM.TOP, 
            new State(fsm,`${BASE_URL}/top`,AnimationClip.WrapMode.Normal,ANIMATION_SPEED/1.5)
        )
        this.stateMachine.set(
            DIRECTION_ENUM.BOTTOM, 
            new State(fsm,`${BASE_URL}/bottom`,AnimationClip.WrapMode.Normal,ANIMATION_SPEED/1.5)
        )
        this.stateMachine.set(
            DIRECTION_ENUM.LEFT, 
            new State(fsm,`${BASE_URL}/left`,AnimationClip.WrapMode.Normal,ANIMATION_SPEED/1.5)
        )
        this.stateMachine.set(
            DIRECTION_ENUM.RIGHT, 
            new State(fsm,`${BASE_URL}/right`,AnimationClip.WrapMode.Normal,ANIMATION_SPEED/1.5)
        )
    }

}