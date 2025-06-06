/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 14:18:43
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-06 11:18:29
 * @FilePath: \cocos-cramped-room-of-death\assets\Runtime\DataManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import {
  director,
  RenderRoot2D,
} from 'cc';

import Singleton from '../Base/Singleton';
import {
  DrawManager,
  FADE_DEFAULT_DURATION,
} from '../Scripts/UI/DrawManager';
import { createUINode } from '../Utils';

export default class FadeManager extends Singleton{

    static get Instance(){
        return super.GetInstance<FadeManager>()
    }

    private _fader:DrawManager = null;

    get fader(){
        if(this._fader !== null){
           return this._fader
        }

        const root = createUINode()
        root.addComponent(RenderRoot2D)

        const fadeNode = createUINode()
        fadeNode.setParent(root)

        this._fader = fadeNode.addComponent(DrawManager)
        this._fader.init()

        
        director.addPersistRootNode(root)

        return this._fader
    }

    fadeIn(duration:number = FADE_DEFAULT_DURATION){
        return this.fader.fadeIn(duration)
    }

    fadeOut(duration:number = FADE_DEFAULT_DURATION){
        return this.fader.fadeOut(duration)
    }
    mask(){ 
        return this.fader.mask()
    }
   
}

