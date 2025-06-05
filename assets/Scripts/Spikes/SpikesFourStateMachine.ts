import State from '../../Base/State';
import { StateMachine } from '../../Base/StateMachine';
import { SPIKES_COUNT_ENUM } from '../../Enums';
import SpikesSubStateMachine from './SpikesSubStateMachine';

/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-03 13:45:20
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 13:53:39
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Player\TurnLeftSubStateMachine.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * 
 */

const BASE_URL = 'texture/spikes/spikesfour'
export default class SpikesFourStateMachine extends SpikesSubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm)
        this.stateMachine.set(
            SPIKES_COUNT_ENUM.ZERO,
            new State(fsm, `${BASE_URL}/zero`)
        )
        this.stateMachine.set(
            SPIKES_COUNT_ENUM.ONE,
            new State(fsm, `${BASE_URL}/one`)
        )
        this.stateMachine.set(
            SPIKES_COUNT_ENUM.TWO,
            new State(fsm, `${BASE_URL}/two`)
        )
        this.stateMachine.set(
            SPIKES_COUNT_ENUM.THREE,
            new State(fsm, `${BASE_URL}/three`)
        )
        this.stateMachine.set(
            SPIKES_COUNT_ENUM.FOUR,
            new State(fsm, `${BASE_URL}/four`)
        )
        this.stateMachine.set(
            SPIKES_COUNT_ENUM.FIVE,
            new State(fsm, `${BASE_URL}/five`)
        )
    }


}