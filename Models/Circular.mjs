export class Circular{
    getAnimationObject(ShapeClassObject, layer)
    {
        var shape =  ShapeClassObject.getKonvaShape();

        var startingXLoc = shape.getAttr("x");
        var startingYLoc = shape.getAttr("y");

        var animationObject = new Konva.Animation(function (frame) {
            shape.x(100 * Math.sin((frame.time * 2 * Math.PI)/2000) + startingXLoc);
            shape.y(100 * Math.cos((frame.time * 2 * Math.PI)/2000) + startingYLoc);
        }, layer);

        ShapeClassObject.setAnimation(animationObject);
        return animationObject;
    }
}