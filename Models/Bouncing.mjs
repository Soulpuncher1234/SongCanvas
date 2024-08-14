export class Bouncing{
    getAnimationObject(ShapeClassObject, layer)
    {
        var xVelocity = 3; 
        var yVelocity = 3; 
        var shape = ShapeClassObject.getKonvaShape(); 

        //Find the height and width of a shape
        var shapeWidth;
        var shapeHeight;


        //find out if the shape is a rect or polygon
        if(shape.getAttr("radius")!=undefined && shape.getAttr("radius")>0) //Shape is a polygon
        {
            shapeWidth = shape.getAttr("radius");
            shapeHeight = shape.getAttr("radius");
        }
        else //Shape is a Rectangle
        {
            shapeWidth = shape.getAttr("width")/2;
            shapeHeight = shape.getAttr("height")/2;
        }
            
        var animationObject = new Konva.Animation(function (frame) {
            const dist = xVelocity;
            const yDist = yVelocity;

            shape.move({x: dist, y : yDist});

            if (shape.y() < shapeHeight || shape.y() > 500 - shapeHeight) //-20
            {
                yVelocity *= -1;
            }

            if(shape.x() < shapeWidth || shape.x() > 1050 - shapeWidth) //-20
            {
                xVelocity *=-1;
            }

        }, layer);

        ShapeClassObject.setAnimation(animationObject);

        return animationObject;
    }
}