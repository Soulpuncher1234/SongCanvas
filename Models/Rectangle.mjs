import { Shape } from "./Shape.mjs";

export class Rectangle extends Shape {

    constructor (name, shapeType, xLoc, yLoc, startTime, endTime, fillColor, borderColor, borderWidth, animationType, opacity, height, width) {

        super(name, shapeType, startTime, endTime, animationType);

        this.konvaShape = new Konva.Rect({
            name: name,
            width: width,
            height: height,
            fill: fillColor,
            stroke: borderColor,
            strokeWidth: Number(borderWidth),
            x: Number(xLoc), 
            y: Number(yLoc), 
            visible: true, // Shapes are invisible by default
            opacity: opacity,
            offset: { //Note the offset variable is used to center the animations 
                x: width/2,
                y: height/2,
            },
            draggable: true,
        });  
    }

    showKonvaShape() {
        this.konvaShape.show();
    }

    hideKonvaShape() {
        this.konvaShape.hide();
    }

    startAnimation() {
        this.animation.start();
    }

    stopAnimation() {
        this.animation.stop();
    }

    //----------------------------------------Setters------------------------------------------
    
    setStartTime(startTime){
        this.startTime = startTime;
    }
    
    setEndTime(endTime) {
        this.endTime = endTime;
    }

    setAnimation(animation) {
        this.animation = animation;
    }

    setAnimationType(animationType) {
        this.animationType = animationType;
    }

    setShapeName(name){
        this.name = name;
        this.konvaShape.setAttr('name', name);
    }

    setAnimation(animation) {
        this.animation = animation;
    }

    //----------------------------------------------------getters-----------------------------------------------
    
    getKonvaShape() {
        return this.konvaShape;
    }

    getStartTime() {
        return this.startTime;
    }

    getEndTime() {
        return this.endTime;
    }
    
    getAnimationType() {
        return this.animationType;
    }

    getAnimation(){
        return this.animation;
    }

    getShapeType() {
        return this.shapeType;
    }

    getName(){
        return this.name;
    }

}