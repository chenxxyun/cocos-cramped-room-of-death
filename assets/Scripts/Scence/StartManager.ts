/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-06 11:28:10
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Component,
  director,
  Node,
} from 'cc';

import { SCENE_ENUM } from '../../Enums';
import FadeManager from '../../Runtime/FadeManager';

const { ccclass, property } = _decorator;
  
  @ccclass('StartManager')
  export class StartManager extends Component {
     onLoad() {
        FadeManager.Instance.fadeOut(1000);
        this.node.once(Node.EventType.TOUCH_END,this.handleStart,this)
    }

    async handleStart(){
        await FadeManager.Instance.fadeIn(1000)
        director.loadScene(SCENE_ENUM.Battle)
    }
   
  
  }
  
  
  