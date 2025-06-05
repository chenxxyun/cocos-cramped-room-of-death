/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 10:49:16
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator } from 'cc';

import { EnemyManager } from '../../Base/EnemyManager';
import { IEntity } from '../../Levels';
import { IronSkeletonStateMachine } from './IronSkeletonStateMachine';

const { ccclass, property } = _decorator;
  
  @ccclass('IronSkeletonManager')
  export class IronSkeletonManager extends EnemyManager {

    async init(params:IEntity){

        console.log('IronSkeletonManager init');
        
        // 添加设置状态机
        this.fsm = this.addComponent(IronSkeletonStateMachine)

        await this.fsm.init()

        super.init(params)
        
        this.onChangeDirection(true)
    }
    onDestroy() {
      super.onDestroy()
      

    }



  }
  
  
  