/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 14:39:05
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-02 14:44:58
 * @FilePath: \cocos-cramped-room-of-death\assets\Base\Singleton.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default class Singleton{
    private static _instance:any = null;

    static GetInstance<T>():T{
        if(this._instance === null){
            this._instance = new this();
        }
        return this._instance;
    }
}