/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 15:20:58
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-04 16:36:27
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\UI\ControllerManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Component,
  EventKeyboard,
  input,
  Input,
  KeyCode,
} from 'cc';

import {
  CONTROLLER_ENUM,
  EVENT_ENUM,
} from '../../Enums';
import EventManager from '../../Runtime/EventManager';

const { ccclass, property } = _decorator;


@ccclass('ControllerManager')
export class ControllerManager extends Component {
    
    HandleCtrl(evt:Event,type:string) {
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL,type as CONTROLLER_ENUM);
    }

    onLoad () {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDestroy () {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown (event: EventKeyboard) {

      
      
        switch(event.keyCode) {
            case KeyCode.KEY_A:
              EventManager.Instance.emit(EVENT_ENUM.PLAYER_ON_KEYDOWN,CONTROLLER_ENUM.LEFT);
              break;
            case KeyCode.KEY_S:
              EventManager.Instance.emit(EVENT_ENUM.PLAYER_ON_KEYDOWN,CONTROLLER_ENUM.BOTTOM);
              break;
            case KeyCode.KEY_D:
              EventManager.Instance.emit(EVENT_ENUM.PLAYER_ON_KEYDOWN,CONTROLLER_ENUM.RIGHT);
              break;
            case KeyCode.KEY_W:
              EventManager.Instance.emit(EVENT_ENUM.PLAYER_ON_KEYDOWN,CONTROLLER_ENUM.TOP);
              break;
            case KeyCode.KEY_Q:
              EventManager.Instance.emit(EVENT_ENUM.PLAYER_ON_KEYDOWN,CONTROLLER_ENUM.TURNLEFT);
              break;
            case KeyCode.KEY_E:
              EventManager.Instance.emit(EVENT_ENUM.PLAYER_ON_KEYDOWN,CONTROLLER_ENUM.TURNRIGHT);
              break;
        }
    }

    
  }


