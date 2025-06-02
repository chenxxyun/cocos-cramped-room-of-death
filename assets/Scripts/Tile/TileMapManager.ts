/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-02 14:59:01
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Component,
} from 'cc';

import DataManager from '../../Runtime/DataManager';
import ResourceManager from '../../Runtime/ResourceManager';
import {
  createUINode,
  randomByRange,
} from '../../Utils';
import { TileManneger } from './TileManager';

const { ccclass, property } = _decorator;
  
    
  @ccclass('TileMapManneger')
  export class TileMapManneger extends Component {
      async init() {
         
          const spriteFrames =await ResourceManager.Instance.loadDir('texture/tile/tile')
        //   console.log(spriteFrames);
          const mapInfo = DataManager.Instance.MapInfo
  
          for (let i = 0; i < mapInfo.length; i++) {
              const column = mapInfo[i];
              for (let j = 0; j < column.length; j++) {
                  const item = column[j];
                  
                  if (item.src===null||item.type===null) {
                      continue
                  }
                  const node = createUINode()


                  let number = item.src
                  if ((number===1||number===5||number===9)&&(i%2===0&&j%2===0)) {
                    number += randomByRange(0,3)
                  }

                  const imgSrc =  `tile (${number})`
                  const spriteFrame = spriteFrames.find(item=>item.name===imgSrc)||spriteFrames[0]

                  const tileManneger = node.addComponent(TileManneger)
                  tileManneger.init(spriteFrame,i,j)
  
  
                  node.setParent(this.node)
              }
          }
  
          
  
      }
  }
  
    
    