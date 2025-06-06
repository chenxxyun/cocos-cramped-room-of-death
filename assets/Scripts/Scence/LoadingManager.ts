/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-06 11:44:27
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Component,
  director,
  ProgressBar,
  resources,
} from 'cc';

import { SCENE_ENUM } from '../../Enums';

const { ccclass, property } = _decorator;
    
    @ccclass('LoadingManager')
    export class LoadingManager extends Component {
        @property(ProgressBar)
        bar:ProgressBar = null;
       onLoad() {
          resources.preloadDir("texture", (cur,total) => {
            // director.loadScene(SCENE_ENUM.Start)
            this.bar.progress = cur/total
          },()=>{
            director.loadScene(SCENE_ENUM.Start)
          })
      }
  
     
    
    }
    
    
    