/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 12:39:40
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-02 17:16:57
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\Scence\BattleManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  animation,
  Animation,
  AnimationClip,
  Component,
  Sprite,
  SpriteFrame,
  UITransform,
} from 'cc';

import {
  CONTROLLER_ENUM,
  EVENT_ENUM,
} from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import ResourceManager from '../../Runtime/ResourceManager';
import {
  TILE_HEIGHT,
  TILE_WIDTH,
} from '../Tile/TileManager';

const ANIMATION_SPEED = 1/8 

const { ccclass, property } = _decorator;
  
  @ccclass('PlayerManager')
  export class PlayerManager extends Component {
  
    x:number = 0
    y:number = 0
    targetX:number = 0
    targetY:number = 0
    private readonly speed  = 1/10
    async init(){
        await this.render()

        EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL,this.move,this)
    }

    update(){
        this.updateXY()

        this.node.setPosition(this.x*TILE_WIDTH - 1.5*TILE_WIDTH,-this.y*TILE_HEIGHT + 1.5*TILE_HEIGHT)
    
    }

    updateXY(){

        if(this.targetX< this.x){
            this.x-=this.speed
        }else if(this.targetX > this.x){
            this.x+=this.speed
        }
        
        if(this.targetY < this.y){
            this.y-=this.speed
        }else if(this.targetY > this.y){
            this.y+=this.speed
        }

        if (Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1) {
            this.x = this.targetX
            this.y = this.targetY
        }

    }


    move (InputDeviceInfo:CONTROLLER_ENUM){
        if (InputDeviceInfo === CONTROLLER_ENUM.TOP) {
            this.targetY-=1
        }else if (InputDeviceInfo === CONTROLLER_ENUM.BOTTOM) {
            this.targetY+=1
        }else if (InputDeviceInfo === CONTROLLER_ENUM.LEFT) {
            this.targetX-=1
        }else if (InputDeviceInfo === CONTROLLER_ENUM.RIGHT) {
            this.targetX+=1
        }

    }

    async render(){
        const sprite = this.addComponent(Sprite)
        sprite.sizeMode = Sprite.SizeMode.CUSTOM

        const transform = this.getComponent(UITransform)
        transform.setContentSize(TILE_WIDTH*4,TILE_HEIGHT*4)

        const spriteFrames =await ResourceManager.Instance.loadDir('texture/player/idle/top')

        const animationComponent =  this.addComponent(Animation)

        const animationClip = new AnimationClip();

        const track  = new animation.ObjectTrack(); // 创建一个对象轨道
        track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame'); // 指定轨道路径，即指定目标对象为
        const frames : Array<[number,SpriteFrame]>=spriteFrames.map((item,index)=>[ANIMATION_SPEED*index,item]);

        
        track.channel.curve.assignSorted(frames);

        // 最后将轨道添加到动画剪辑以应用
        animationClip.addTrack(track);
        animationClip.duration = frames.length*ANIMATION_SPEED
        animationClip.wrapMode = AnimationClip.WrapMode.Loop;
        animationComponent.defaultClip = animationClip;
        animationComponent.play()

    }
  }
  
  
  