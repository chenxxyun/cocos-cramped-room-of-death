/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-04 16:39:27
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Animation,
  Component,
  SpriteFrame,
} from 'cc';

import { FSM_PARAM_TYPE_ENUM } from '../Enums';
import State from './State';
import { SubStateMachine } from './SubStateMachine';

const { ccclass, property } = _decorator;
  
  type ParamsValueType = boolean | number
  
  export interface IParamsValue{
      type:FSM_PARAM_TYPE_ENUM,
      value:ParamsValueType
  
  }
  
  export const getInitParamsTrigger = ()=>{
      return {
          type:FSM_PARAM_TYPE_ENUM.TRIGGER,
          value:false
      }
  }
  export const getInitParamsNumber = ()=>{
      return {
          type:FSM_PARAM_TYPE_ENUM.NUMBER,
          value:0
      }
  }
      
  @ccclass('StateMachine')
  export abstract class StateMachine extends Component {
  
      private _currentState:State | SubStateMachine = null 
      params:Map<string,IParamsValue> = new Map();
      stateMachine: Map<string,State | SubStateMachine> = new Map();
      animationComponent:Animation 
  
      waitingList:Array<Promise<SpriteFrame[]>> = []
  
      getParams(paramsName:string){
          if(this.params.has(paramsName)){
              return this.params.get(paramsName).value
          }
      }
  
      setParams(paramsName:string,value:ParamsValueType){
          if (this.params.has(paramsName)) {
              this.params.get(paramsName).value = value
              this.run()
              this.resetTrigger()
          }
      }
      get currentState(){
          return this._currentState
      }
  
  
      set currentState(newState:State | SubStateMachine){
      
          this._currentState = newState
          this._currentState.run()
          
      }
  
      resetTrigger(){
          for (const [_,value] of this.params) {
              if(value.type === FSM_PARAM_TYPE_ENUM.TRIGGER){
                  value.value = false
              }
          }
      
      }
  
      abstract init() :void
  

  
      abstract run() :void
  }
  
      
      