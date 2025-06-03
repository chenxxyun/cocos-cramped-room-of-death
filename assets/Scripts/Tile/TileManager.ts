/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-03 16:13:39
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Component,
  Sprite,
  SpriteFrame,
  UITransform,
} from 'cc';

import { TILE_TYPE_ENUM } from '../../Enums';

const { ccclass, property } = _decorator;

export const TILE_WIDTH = 55 ;
export const TILE_HEIGHT = 55;
  
@ccclass('TileManneger')
export class TileManneger extends Component {

    type:TILE_TYPE_ENUM
    moveable:boolean
    turnable:boolean
    init(type:TILE_TYPE_ENUM,spriteFrame:SpriteFrame,i:number ,j:number) {

      this.type = type

      if (
        this.type === TILE_TYPE_ENUM.WALL_COLUMN || 
        this.type === TILE_TYPE_ENUM.WALL_ROW ||
        this.type === TILE_TYPE_ENUM.WALL_LEFT_BOTTOM ||
        this.type === TILE_TYPE_ENUM.WALL_LEFT_TOP ||
        this.type === TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM ||
        this.type === TILE_TYPE_ENUM.WALL_RIGHT_TOP 
      ) {
          this.moveable = false
          this.turnable = false
      }else if  (
        this.type === TILE_TYPE_ENUM.CLIFF_CENTER ||
        this.type === TILE_TYPE_ENUM.CLIFF_LEFT ||
        this.type === TILE_TYPE_ENUM.CLIFF_RIGHT
      ) { 
          this.moveable = false
          this.turnable = true
      }else if  (
        this.type === TILE_TYPE_ENUM.FLOOR 
      ) { 
          this.moveable = true
          this.turnable = true
      }

      
      // const node = new Node()
      const sprite = this.addComponent(Sprite)
      sprite.spriteFrame = spriteFrame

      const transfrom = this.getComponent(UITransform)
      transfrom.setContentSize(TILE_WIDTH,TILE_HEIGHT) 

      this.node.setPosition(i*TILE_WIDTH,-j*TILE_HEIGHT)
    }

   
}

  
  