/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 15:45:18
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator } from 'cc';

import { EntityManager } from '../../Base/EntityManager';
import { IEntity } from '../../Levels';
import { SmokeStateMachine } from './SmokeStateMachine';

const { ccclass, property } = _decorator;
  
  @ccclass('IronSkeletonManager')
  export class SmokeManager extends EntityManager {

    async init(params:IEntity){

        console.log('IronSkeletonManager init');
        
        // 添加设置状态机
        this.fsm = this.addComponent(SmokeStateMachine)

        await this.fsm.init()

        super.init(params)
        
    }
    onDestroy() {
      super.onDestroy()
      

    }



  }
  
  
  