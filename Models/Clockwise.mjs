export class Clockwise{
    getAnimationObject(ShapeClassObject, layer)
    {
        
        var animationObject = new Konva.Animation(function (frame) {
            ShapeClassObject.getKonvaShape().rotate(1.5);
        }, layer);

        ShapeClassObject.setAnimation(animationObject);
        return animationObject;
    }
}