/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 14:18:43
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-02 15:10:58
 * @FilePath: \cocos-cramped-room-of-death\assets\Runtime\DataManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Singleton from '../Base/Singleton';

interface IItem{
    func:Function
    ctx:unknown
}


export default class EventManager extends Singleton{

    static get Instance(){
        return super.GetInstance<EventManager>()
    }

    private eventDic:Map<string,Array<IItem>> = new Map()

    on(eventName:string,func:Function,ctx?:unknown){
        if (this.eventDic.has(eventName)) {
            this.eventDic.get(eventName).push({func,ctx})
        }else{
            this.eventDic.set(eventName,[{func,ctx}])
        }
        
    }
    off(eventName:string,func:Function){
        if (this.eventDic.has(eventName)) {
            const index = this.eventDic.get(eventName).findIndex(i=>i.func===func)
            index > -1 && this.eventDic.get(eventName).splice(index,1)
        }
    }
    emit(eventName:string, ...params:unknown[]){
        if (this.eventDic.has(eventName)) {
            this.eventDic.get(eventName).forEach(({func,ctx}) => {
                ctx?func.apply(ctx, params):func(...params)
            });
        }
    }
    clear(){
        this.eventDic.clear()
    }
}

