import { SubStateMachine } from '../../Base/SubStateMachine';
import {
  PARAMS_NAME_ENUM,
  SPIKES_COUNT_MAP_NUMBER_ENUM,
} from '../../Enums';

/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-03 13:45:20
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 12:54:14
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Player\TurnLeftSubStateMachine.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * 
 */

export default class SpikesSubStateMachine extends SubStateMachine {

    run() {
        const value = this.fsm.getParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT)
        this.currentState = this.stateMachine.get(SPIKES_COUNT_MAP_NUMBER_ENUM[value as number])
    }

}