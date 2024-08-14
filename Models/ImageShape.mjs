import {Shape} from './Shape.mjs';

export class ImageShape extends Shape{

    constructor(name, shapeType, xLoc, yLoc, startTime, endTime, animationType, opacity, width, height, file, isGIF){
        super(name, shapeType, startTime, endTime, animationType);

        this.konvaShape = new Konva.Image({
            name: name,
            x: Number(xLoc),
            y: Number(yLoc),
            width: width,
            height: height,
            opacity: opacity,
            draggable: true,
            offset: {
                x: width/2,
                y: height/2,
            }
        });

        //Create image object. Used to acess the width and height of image
        this.imageObj = new Image();
        this.imageObj.src = file;

        //Check if the file is a gif 
        if(isGIF==true)
        {
            //Create canvas object
            this.canvas = document.createElement('canvas');

            this.canvas.width = width;
            this.canvas.height = height; 

            //Have konva image use canvas
            this.konvaShape.setAttr("image", this.canvas);
        }
        else //File is a static image
        {
            this.konvaShape.setAttr("image", this.imageObj);
        }
    }


    showKonvaShape(){
        this.konvaShape.show();
    }

    hideKonvaShape(){
        this.konvaShape.hide();
    }

    startAnimation() {
        this.animation.start();
    }

    stopAnimation() {
        this.animation.stop();
    }

    // ************************************** Setters ***************************
    setStartTime(startTime){
        this.startTime = startTime;
    }
    
    setEndTime(endTime) {
        this.endTime = endTime;
    }

    setFileName(fileName)
    {
        this.fileName = fileName;
    }

    setKonvaShape(shape)
    {
        this.konvaShape = shape;
    }

    setCanvas(){
        this.canvas = document.createElement('canvas');
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

    setFileInput(fileInput)
    {
        this.fileInput = fileInput;
    }

    // **************************************** Getters *********************************
    getKonvaShape() {
        return this.konvaShape;
    }

    getName() {
        return this.name;
    }

    getFileName()
    {
        return this.fileName;
    }

    getFileInput()
    {
        return this.fileInput;
    }


    getStartTime() {
        return this.startTime;
    }

    getShapeType()
    {
        return this.shapeType;
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

    getCanvasElement(){
        return this.canvas;
    }

    getImageObject(){
        return this.imageObj;
    }
}