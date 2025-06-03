/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:11:05
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-03 12:23:47
 * @FilePath: \cocos-cramped-room-of-death\assets\Enums\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export enum TILE_TYPE_ENUM {
    WALL_ROW = 'WALL_ROW',
    WALL_COLUMN = 'WALL_COLUMN',
    WALL_LEFT_TOP = 'WALL_LEFT_TOP',
    WALL_RIGHT_TOP = 'WALL_RIGHT_TOP',
    WALL_LEFT_BOTTOM = 'WALL_LEFT_BOTTOM',
    WALL_RIGHT_BOTTOM = 'WALL_RIGHT_BOTTOM',
    FLOOR = 'FLOOR',
    CLIFF_LEFT = 'CLIFF_LEFT',
    CLIFF_CENTER = 'CLIFF_CENTER',
    CLIFF_RIGHT = 'CLIFF_RIGHT',
}

export enum EVENT_ENUM{
    NEXT_LEVEL = 'NEXT_LEVEL',
    PLAYER_CTRL = 'PLAYER_CTRL',
    PLAYER_MOVE_END = 'PLAYER_MOVE_END',
    ATTACK_PLAYER = 'ATTACK_PLAYER',
    ATTACK_ENEMY = 'ATTACK_ENEMY',
    SWORD_ATTACK = 'SWORD_ATTACK',
    ENEMY_DEAD = 'ENEMY_DEAD',
    DOOR_OPEN = 'DOOR_OPEN',
    SHOW_SWORD = 'SHOW_SWORD',
    SHOW_SHOES = 'SHOW_SHOES',
    SHOW_SMASH = 'SHOW_SMASH',
    RESTART_LEVEL = 'RESTART_LEVEL',
    OPEN_DOOR = 'OPEN_DOOR',
    MOVE_END = 'MOVE_END',
    SCREEN_SHAKE = 'SCREEN_SHAKE',
    RECORD_STEP = 'RECORD_STEP',
    REVOKE_STEP = 'REVOKE_STEP',
    UNDO = 'UNDO',
    RESTART_GAME = 'RESTART_GAME'

}

export enum CONTROLLER_ENUM{
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    TOP = 'TOP',
    BOTTOM = 'BOTTOM',
    TURNLEFT = 'TURNLEFT',
    TURNRIGHT = 'TURNRIGHT'

}


export enum FSM_PARAMS_TYPE_ENUM{
    TRIGGER= 'TRIGGER',
    NUMBER= 'NUMBER'
}

export enum PARAMS_NAME_ENUM{ 
    IDLE='IDLE',
    TURNLEFT='TURNLEFT',
    TURNRIGHT='TURNRIGHT',
    DIRECTION='DIRECTION'
   
}

export enum DIRECTION_ENUM{
    TOP = "TOP",
    BOTTOM = 'BOTTOM',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
}

export enum ENTIIY_STATE_ENUM{
    IDLE = 'IDLE',
    TURNLEFT='TURNLEFT',
}

export enum DIRECTIOMN_ORDER_ENUM{
    TOP = 0,
    BOTTOM = 1,
    LEFT = 2,
    RIGHT = 3
}