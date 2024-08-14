export class Shape {
    constructor(name, shapeType, startTime, endTime, animationType) {
        this.name = name;
        this.animationType = animationType;
        this.shapeType = shapeType;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    getKonvaShape() {}

    getName() {}

    getStartTime() {}

    getEndTime() {}

    getAnimationType() {}

    getShapeType() {}

    setAnimation() {}

    showKonvaShape() {}

    hideKonvaShape() {}
    
}