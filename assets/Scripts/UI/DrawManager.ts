/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 15:20:58
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-06 11:19:42
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\UI\ControllerManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  BlockInputEvents,
  Color,
  Component,
  game,
  Graphics,
  UITransform,
  view,
} from 'cc';

const { ccclass, property } = _decorator;

const SCREEN_WIDTH = view.getVisibleSize().width
const SCREEN_HEIGHT = view.getVisibleSize().height

enum FADE_STATE_ENUM{
    IDLE = 'IDLE',
    FADE_IN = 'FADE_IN',
    FADE_OUT = 'FADE_OUT',
}

export const FADE_DEFAULT_DURATION = 200

@ccclass('DrawManager')
export class DrawManager extends Component {
    private ctx: Graphics
    private state : FADE_STATE_ENUM = FADE_STATE_ENUM.IDLE
    private oldTime:number = 0
    private duration:number = 0
    private fadeResolve:(value:PromiseLike<null>)=>void
    private block:BlockInputEvents
    init(){
        this.block = this.node.addComponent(BlockInputEvents)

        this.ctx = this.addComponent(Graphics)

        const transform = this.node.addComponent(UITransform)
        transform.setAnchorPoint(0.5, 0.5)
        transform.setContentSize(SCREEN_WIDTH, SCREEN_HEIGHT)

        this.setAlpha(1)
        
    }

    setAlpha(percent:number){
        this.ctx.clear()
        this.ctx.rect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT)
        this.ctx.fillColor = new Color(0,0,0,255*percent)
        this.ctx.fill()

        this.block.enabled = percent ===1
    }

    update(dt: number): void {
        const percent = (game.totalTime - this.oldTime) / this.duration
        
        switch(this.state){
            case FADE_STATE_ENUM.IDLE:
                break
            case FADE_STATE_ENUM.FADE_IN:
                if (percent < 1) {
                    this.setAlpha(percent)
                }else {
                    this.setAlpha(1)
                    this.state = FADE_STATE_ENUM.IDLE
                    this.fadeResolve(null)
                }
                break
            case FADE_STATE_ENUM.FADE_OUT:
                if (percent < 1) {
                    this.setAlpha(1 - percent)
                }else {
                    this.setAlpha(0)
                    this.state = FADE_STATE_ENUM.IDLE
                }
                break

        }
    }

    fadeIn(duration:number = FADE_DEFAULT_DURATION){
        this.setAlpha(0)
        this.duration = duration
        this.oldTime = game.totalTime
        this.state = FADE_STATE_ENUM.FADE_IN
        return new Promise((resolve)=>{
            this.fadeResolve = resolve
        })
    }
    fadeOut(duration:number = FADE_DEFAULT_DURATION){
        this.setAlpha(1)
        this.duration = duration
        this.oldTime = game.totalTime
        this.state = FADE_STATE_ENUM.FADE_OUT
        return new Promise((resolve)=>{
            this.fadeResolve = resolve
        })
    }
    mask(){
        this.setAlpha(1)
        return new Promise((resolve)=>{
            setTimeout(resolve,FADE_DEFAULT_DURATION)
        })
    }

}


