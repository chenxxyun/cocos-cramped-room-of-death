import { AnimationClip } from 'cc';

import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine';
import State from '../../Base/State';
import { StateMachine } from '../../Base/StateMachine';
import { DIRECTION_ENUM } from '../../Enums';

/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-03 13:45:20
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-04 13:12:38
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Player\TurnLeftSubStateMachine.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * 
 */

const BASE_URL = 'texture/woodenskeleton/idle'
export default class IdleSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm:StateMachine) {
        super(fsm)
        this.stateMachine.set(
            DIRECTION_ENUM.TOP, 
            new State(fsm,`${BASE_URL}/top`,AnimationClip.WrapMode.Loop)
        )
        this.stateMachine.set(
            DIRECTION_ENUM.BOTTOM, 
            new State(fsm,`${BASE_URL}/bottom`,AnimationClip.WrapMode.Loop)
        )
        this.stateMachine.set(
            DIRECTION_ENUM.LEFT, 
            new State(fsm,`${BASE_URL}/left`,AnimationClip.WrapMode.Loop)
        )
        this.stateMachine.set(
            DIRECTION_ENUM.RIGHT, 
            new State(fsm,`${BASE_URL}/right`,AnimationClip.WrapMode.Loop)
        )
    }

}