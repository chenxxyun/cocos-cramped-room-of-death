/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:14:47
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 12:31:07
 * @FilePath: \cocos-cramped-room-of-death\assets\Levels\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import {
  DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  TILE_TYPE_ENUM,
} from '../Enums';
import level1 from './level1';
import level2 from './level2';

export interface IEntity {
  x: number,
  y: number,
  type: ENTITY_TYPE_ENUM,
  direction: DIRECTION_ENUM,
  state: ENTITY_STATE_ENUM

}

export interface ISpike {
  x: number,
  y: number,
  type: ENTITY_TYPE_ENUM,
  count: number,
}

export interface ITile {
  src: number | null,
  type: TILE_TYPE_ENUM | null,
}

export interface ILevel{
    mapInfo:Array<Array<ITile>>
}

const levels :Record<string,ILevel> = {
    level1,
    level2
}

export default levels;