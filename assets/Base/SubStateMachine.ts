/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-03 14:10:20
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Component,
} from 'cc';

import State from './State';
import { StateMachine } from './StateMachine';

const { ccclass, property } = _decorator;
    
    type ParamsValueType = boolean | number
    

        
    @ccclass('SubStateMachine')
    export abstract class SubStateMachine extends Component {
    
        private _currentState:State = null 
        
        stateMachine: Map<string,State> = new Map();

        constructor(public fsm:StateMachine) {
            super();
        }
   
        get currentState(){
            return this._currentState
        }
    
    
        set currentState(newState:State){
        
            this._currentState = newState
            this._currentState.run()
            
        }
    
  
    
        // abstract init() :void
    
  
    
        abstract run() :void
    }
    
        
        