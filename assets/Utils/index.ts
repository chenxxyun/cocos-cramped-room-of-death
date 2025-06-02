import {
  Layers,
  Node,
  UITransform,
} from 'cc';

export const createUINode = (name:string='')=>{
    const node = new Node(name)

    const transfrom = node.addComponent(UITransform)

    transfrom.setAnchorPoint(0,1)

    node.layer = Layers.Enum.UI_2D

    return node
}

export const randomByRange = (start:number,end:number)=>{
    return Math.floor(Math.random()*(end-start+1)+start)
}