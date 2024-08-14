export class AnimationStrategy {
    constructor(ShapeClassObject, layer) {
        this.ShapeClassObject = ShapeClassObject;
        this.layer=layer;
    }

    getAnimationObjectStrategy(ShapeClassObject)
    {
        this.ShapeClassObject.getAnimationObject(ShapeClassObject, this.layer);
    }
}