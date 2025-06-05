/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 15:20:58
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-05 18:46:15
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\UI\ControllerManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Component,
  game,
} from 'cc';

import {
  EVENT_ENUM,
  SHAKE_TYPE_ENUM,
} from '../../Enums';
import EventManager from '../../Runtime/EventManager';

const { ccclass, property } = _decorator;


@ccclass('ShakeManager')
export class ShakeManager extends Component {

    private isShaking:boolean = false
    private oldTime:number = 0
    private oldPos:{x:number,y:number} = {x:0,y:0}
    private type : SHAKE_TYPE_ENUM

    init(){
        
        EventManager.Instance.on(EVENT_ENUM.SCREEN_SHAKE,this.onShake,this)
    }

    protected onDestroy(): void {
        EventManager.Instance.off(EVENT_ENUM.SCREEN_SHAKE,this.onShake)
    }
    onShake(type:SHAKE_TYPE_ENUM){
        
        if (this.isShaking) {
            return
        } 
        this.type = type
        this.oldTime = game.totalTime
        this.isShaking = true
        this.oldPos.x = this.node.position.x
        this.oldPos.y = this.node.position.y
    }

    stop(){
        this.isShaking = false
    }
    update(){
        if (this.isShaking) {
            const duration = 200
            const amount = 16
            const frequency = 12
            const curSecond = (game.totalTime - this.oldTime) / 1000
            const totalSecond = duration / 1000
            const offset = amount  * Math.sin((frequency * Math.PI) * totalSecond)

            if (this.type === SHAKE_TYPE_ENUM.TOP) {
                this.node.setPosition(this.oldPos.x ,this.oldPos.y + offset)
            }else if (this.type === SHAKE_TYPE_ENUM.BOTTOM) {
                this.node.setPosition(this.oldPos.x ,this.oldPos.y - offset)
            }else if (this.type === SHAKE_TYPE_ENUM.LEFT) {
                this.node.setPosition(this.oldPos.x - offset ,this.oldPos.y )
            }else if (this.type === SHAKE_TYPE_ENUM.RIGHT) {
                this.node.setPosition(this.oldPos.x + offset ,this.oldPos.y)
            }
            
            
            if (curSecond > totalSecond) {
                this.isShaking = false
                this.node.setPosition(this.oldPos.x,this.oldPos.y)
            }

        }
    }


}


