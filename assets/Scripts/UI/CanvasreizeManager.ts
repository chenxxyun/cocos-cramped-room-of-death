/*
 * @Author: 尘韵 2443492647@qq.com
 * @Date: 2025-06-02 15:20:58
 * @LastEditors: 尘韵 2443492647@qq.com
 * @LastEditTime: 2025-06-06 12:22:52
 * @FilePath: \cocos-cramped-room-of-death\assets\Scripts\UI\ControllerManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  _decorator,
  Component,
  Node,
  ResolutionPolicy,
  sys,
  view,
  Widget,
} from 'cc';

const { ccclass, property } = _decorator;
    
    
@ccclass('CanvasreizeManager')
export class CanvasreizeManager extends Component {
    @property(Node)
    pcBg: Node = null;
 
    onLoad() {
 
        let design = view.getDesignResolutionSize(); // 设计分辨率，。就是设置的 750 1334 根据不同端做适配
        if(!sys.isMobile)
        {// pc端
            view.setDesignResolutionSize(design.width, design.height, ResolutionPolicy.FIXED_HEIGHT);
        }
        else
        {// 手机端
            view.setDesignResolutionSize(design.width, design.height, ResolutionPolicy.FIXED_WIDTH);
        }
 
        this.updateSizeFit();
        let _this = this;
        // 监听浏览器窗口大小变化
        view.setResizeCallback(function () {
            _this.updateSizeFit();
            // rect.left, rect.top, rect.width, rect.height (像素值)
        });
    }
     // 根据浏览器窗口变化适配
     updateSizeFit() {
        var rect = view.getVisibleSize();// 获取实际显示的尺寸
        var design = view.getDesignResolutionSize();// 获取设计分辨率
        let wi = this.node.getComponent(Widget);
        // 设置手机端和pc端canvas的显示位置，在pc是横屏的，但是canvas应该是中间的手机位置。所以要左右减 
        //  实际屏幕宽度的一半减去手机屏宽的一半，就是pcBg距离Canvas左侧的距离
        if (!sys.isMobile) { // pc端加背景图，实现中间显示手机界面
            wi.right = rect.width/2-(rect.height*design.width/design.height)/2;
            wi.left = rect.width/2-(rect.height*design.width/design.height)/2;
            wi.top = 0;
            wi.bottom = 0;
            wi.updateAlignment();
        }
        else
        { // 手机端 屏幕宽度高，就是canvas的宽高。，距离是0就可以
            wi.right = 0;
            wi.left = 0;
            wi.top = 0;
            wi.bottom = 0;
            wi.updateAlignment();
        }
        // pc大背景全屏显示，大背景图平铺到pc上，相对于canvas 左右都是负的宽的的一半
        var widget = this.pcBg.getComponent(Widget)
        widget.right = -rect.width/2;
        widget.left = -rect.width/2;
        widget.top = 0;
        widget.bottom = 0;
        widget.target = this.node;
        widget.updateAlignment();
    }

}


    