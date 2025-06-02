/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 14:18:43
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-02 14:50:54
 * @FilePath: \cocos-cramped-room-of-death\assets\Runtime\DataManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import {
  resources,
  SpriteFrame,
} from 'cc';

import Singleton from '../Base/Singleton';

export default class ResourceManager extends Singleton{

    static get Instance(){
        return super.GetInstance<ResourceManager>()
    }
    // 'texture/tile/tile'
    loadDir(path:string,type: typeof SpriteFrame = SpriteFrame)  {
        return new Promise<SpriteFrame[]>((resolve,reject)=>{
          resources.loadDir(path,type,function (err,assets) {
                if(err){
                    reject(err)
                    return
                }

                resolve (assets)
            })
            
        })
      
    }
}

