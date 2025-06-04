/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 13:58:04
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-04 11:41:49
 * @FilePath: \cocos-cramped-room-of-death\assets\Utils\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Layers,
  Node,
  SpriteFrame,
  UITransform,
} from 'cc';

export const createUINode = (name:string='')=>{
    const node = new Node(name)

    const transfrom = node.addComponent(UITransform)

    transfrom.setAnchorPoint(0,1)

    node.layer = Layers.Enum.UI_2D

    return node
}

export const randomByRange = (start:number,end:number)=>{
    return Math.floor(Math.random()*(end-start+1)+start)
}


const INDEX_REG = /\((\d+)\)/
const getNumberWithinString = (str: string) => parseInt(str.match(INDEX_REG)?.[1] || '0')

export const sortSpriteFrame = (spriteFrame: Array<SpriteFrame>) =>
spriteFrame.sort((a, b) => getNumberWithinString(a.name) - getNumberWithinString(b.name))
