/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-03 14:33:55
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-03 14:35:21
 * @FilePath: \cocos-cramped-room-of-death\assets\Base\DirectionSubStateMachine.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  DIRECTIOMN_ORDER_ENUM,
  PARAMS_NAME_ENUM,
} from '../Enums';
import { SubStateMachine } from './SubStateMachine';

export default class DirectionSubStateMachine extends SubStateMachine {
   
    run(){
        const value = this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION)
        this.currentState = this.stateMachine.get(DIRECTIOMN_ORDER_ENUM[value as number])
    }
}