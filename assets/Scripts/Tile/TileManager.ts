/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-02 14:13:32
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

const { ccclass, property } = _decorator;

export const TILE_WIDTH = 55 ;
export const TILE_HEIGHT = 55;
  
@ccclass('TileManneger')
export class TileManneger extends Component {
    init(spriteFrame:SpriteFrame,i:number ,j:number) {
        // const node = new Node()
        const sprite = this.addComponent(Sprite)
        sprite.spriteFrame = spriteFrame

        const transfrom = this.getComponent(UITransform)
        transfrom.setContentSize(TILE_WIDTH,TILE_HEIGHT) 

        this.node.setPosition(i*TILE_WIDTH,-j*TILE_HEIGHT)
    }

   
}

  
  