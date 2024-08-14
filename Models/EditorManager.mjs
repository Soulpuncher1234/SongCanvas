import {Polygon} from './Polygon.mjs';
import {Rectangle} from './Rectangle.mjs';
import { ImageShape } from './ImageShape.mjs';
import { Logo } from './Logo.mjs';
import { Background } from './Background.mjs';
import { Lyrics } from './Lyrics.mjs';
import { Clockwise } from './Clockwise.mjs';
import { CounterClockwise } from './CounterClockwise.mjs';
import { AnimationStrategy } from './Strategy.mjs';
import { Bouncing } from './Bouncing.mjs';
import { Circular } from './Circular.mjs';
import { Overlay } from './Overlay.mjs';


//Determine if we are running on browser (true). Or testing using node (false)
if(Konva.isBrowser==true)
{
    var stage = new Konva.Stage({
        container: 'KonvaCanvas',
        width: 1050,
        height: 500, 
    });

    //Create and add layer to the stage
    var layer = new Konva.Layer();
    stage.add(layer);
}
else
{
    var stage = new Konva.Stage({
        width: 1050,
        height: 500, 
    });
    
    var layer = new Konva.Layer();
    stage.add(layer);
}


// ----------------------- Shapes ----------------------------------------

//Array to hold shapes user has added 
//let ShapeArray = []; //Holds the information of a shape and it's start time, end time, and animation
let ShapeArrayIndex = 0;

//let ShapeStartArray = []; //Used to keep track of the shapes from earliest start time to latest start time
let ShapeStartIndex = 0;

//let ShapeEndArray = []; //Used to keep track of the shapes from earliest end time to the latest end time
let ShapeEndIndex = 0;


// -------------------------- Background --------------------------------------

//let backgroundArray = [];
let backgroundArrayIndex = 0; //Keeps track of the current background were going to use

// ----------------------- Lyrics ----------------------------------------
let lyricArray = []; //Used to store the lines entered in pop-up
let indexVal = -1; //Start at the beggening of the array
var text; //= layer.find('#P1')[0]; //Used to find the text box and change it's attributes

//var textBack = layer.find('#textBackground')[0]; //Used to modify the attributes of a text background
var lyricsObj;


//EditorManager Class
export class EditorManager{

    constructor()
    {
        this.backgroundArray = [];

        this.ShapeArray = [];
        this.ShapeStartArray = [];
        this.ShapeEndArray = [];

        this.overlayArray=[];
        this.overlayStartArray=[];
        this.overlayEndArray=[];
    }

    //Obtain the stage in order to change width, height, and scale
    getStage()
    {
        return stage;
    }

    //Obtain layer for the stage. Used for testing out the multiple shapes feautre
    getLayer()
    {
        return layer;
    }

    //****************************************************Logo Functions and properites**********************************************
    createLogo(logoName, logoPic, logoWidth, logoHeight, logoX, logoY, logoOpacity){
        if(logoX >= 1050 && logoX <= 0) {
            alert(logoX + " cannot be added. Dimensions are out of range.");
        }
    
        if(logoY >= 500 && logoY <= 0) {
            alert(logoY + " cannot be added. Dimensions are out of range.");
        }
    
        //Create the logo object
        this.LogoObject = new Logo(logoName, logoPic, logoWidth, logoHeight, logoX, logoY, logoOpacity);
    
        //Add the new logo object to the stage
        layer.add(this.LogoObject.getKonvaLogo());

         //If applicable make sure that the logo and lyrics are at the top of the canvas
         if(this.lyricsObj != undefined)
         {
             this.lyricsObj.getKonvaTextBox().moveToTop();
         }
 
        this.LogoObject.getKonvaLogo().moveToTop();
    }

    saveLogoChanges(logoName, logoPic, logoWidth, logoHeight, logoX, logoY, logoOpacity)
    {
        //Modify the logo size
        this.LogoObject.getKonvaLogo().setAttr('height', logoHeight);
        this.LogoObject.getKonvaLogo().setAttr('width', logoWidth);

        //Modify the logo position
        this.LogoObject.getKonvaLogo().setAttr('x', logoX);
        this.LogoObject.getKonvaLogo().setAttr('y', logoY);

        //Modify the logo opcaity
        this.LogoObject.getKonvaLogo().setAttr('opacity', logoOpacity);

        //Modify the logoName
        this.LogoObject.getKonvaLogo().setAttr('name', logoName);
        

        //Modify the logo offset
        this.LogoObject.getKonvaLogo().setAttr('offset', {x: logoWidth/2, y: logoHeight/2});

        //Check if we need to assign new image
        if(logoPic!="")
        {
            var imageObj = new Image();

            this.LogoObject.getKonvaLogo().setAttr("image", imageObj);

            imageObj.src = logoPic;
        }
    }

    getLogoObject()
    {
        return this.LogoObject;
    }

    changeLogoVisibility()
    {
        this.LogoObject.getKonvaLogo().setAttr("visible",!this.LogoObject.getKonvaLogo().getAttr("visible"));
    }

    deleteLogo()
    {
        //Remove logo object from stage
        this.LogoObject.getKonvaLogo().destroy();

        //Set logoObject to undefined
        this.LogoObject = undefined;
    }

    

    //Design Element functions and properties
    checkOutOfBounds(shapeX, shapeY)
    {
        if(shapeX > 1050 || shapeX < 0) {
            return true;
        }
        
        if(shapeY > 500 || shapeY < 0) {
            return true;
        }

        //Shape is not out of bounds
        return false;
    }

    /**************************************************Overlay Functions and properties*******************************************/
    createOverlay(name, opacity, overlayOption, startTime, endTime)
    {
        //Check if we there is an overlay object with a duplicate name
        //For every overlay in overlayArray check if there are any duplicates
        for(var i = 0; i < this.overlayArray.length; i++){

            //If the name is already existing 
            if(this.overlayArray[i].getName()==name)
            {
                return true; //Duplicate was found
            } 
        }

        //Create Overlay Object
        var overlayObject = new Overlay(name, opacity, overlayOption, startTime, endTime);

        this.overlayArray.push(overlayObject);

        //Add the shape to an array that sorted by start time
        this.overlayStartArray.push(overlayObject);

        this.overlayStartArray.sort(function (a, b) {
            return a.getStartTime().localeCompare(b.getStartTime());
        });
 
        //Add the shape to an array that is sorted by end time
        this.overlayEndArray.push(overlayObject);

        this.overlayEndArray.sort(function (a, b) {
            return a.getEndTime().localeCompare(b.getEndTime());
        });

        //Object created successfuly
        return false;
    }

    saveOverlayChanges(oldName, newName, opacity, overlayOption, startTime, endTime)
    {
        //Find the overlayObject
        var overlayObject = this.getOverlayObject(oldName);

        //Replace the values of overlayObject
        if(oldName != newName)
        {
            overlayObject.setName(newName);
        }

        overlayObject.setOpacity(opacity);
        overlayObject.setOverlayOption(overlayOption);
        overlayObject.setStartTime(startTime);
        overlayObject.setEndTime(endTime);

        //Update the arrays and make sure they are in order
        this.overlayStartArray.sort(function (a, b) {
            return a.getStartTime().localeCompare(b.getStartTime());
        });

        this.overlayEndArray.sort(function (a, b) {
            return a.getEndTime().localeCompare(b.getEndTime());
        });
    }

    deleteOverlay(name)
    {
        //Find the overlay object index
        var overlayIndex = this.overlayArray.findIndex(p=>p.getName()==name);
        var overlayStartIndex = this.overlayStartArray.findIndex(p=>p.getName()==name);
        var overlayEndIndex = this.overlayEndArray.findIndex(p=>p.getName()==name);

        //Remove from the arrays
        this.overlayArray.splice(overlayIndex, 1);
        this.overlayStartArray.splice(overlayStartIndex, 1);
        this.overlayEndArray.splice(overlayEndIndex, 1);
    }

    getOverlayObject(name)
    {
        for(var i=0; i < this.overlayArray.length; i++)
        {
            if(this.overlayArray[i].getName()==name)
            {
                return this.overlayArray[i];
            }
        }
    }

    getOverlayArray()
    {
        return this.overlayArray;
    }

    getOverlayStartArray()
    {
        return this.overlayStartArray;
    }

    getOverlayEndArray()
    {
        return this.overlayEndArray;
    }

    //*************************************************Design Element Functions and properites******************************************
    createShape(shapeName, shapeWidth, shapeHeight, shapeFill_color, shapeStroke, shapeStrokeWidth, shapeX, shapeY, shapeSides, shapeAnimation_type, shapeOpacity, shapeStartTime, shapeEndTime, shapeType, shapeRadius, shapeFile)
    {
        //For every shape in ShapeArray check if there are any duplicates
        for(var i = 0; i < this.ShapeArray.length; i++){

            //If the name is already existing 
            if(this.ShapeArray[i].shapeName==shapeName)
            {
                return true;//duplicatNameFound=true;
            } 
        }

        //Check if the x and y are within the stage
        if(this.checkOutOfBounds(shapeX, shapeY)==true)
        {
            return true;
        }

        var shape;
        
        //Determine which type of shape user selected
        if(shapeType=="Polygon")
        {
            shape = new Polygon(shapeName, shapeType, shapeX, shapeY, shapeStartTime, shapeEndTime, shapeFill_color, shapeStroke, shapeStrokeWidth, shapeAnimation_type, shapeOpacity, shapeRadius, shapeSides);
        }
        else if(shapeType=="Rectangle")
        {
            shape = new Rectangle(shapeName, shapeType, shapeX, shapeY, shapeStartTime, shapeEndTime, shapeFill_color, shapeStroke, shapeStrokeWidth, shapeAnimation_type, shapeOpacity, shapeHeight, shapeWidth);
        }
        else if(shapeType=="Image")
        {
            console.log("ShapeImage selected");

            var isGIF=false; //USed to determine if the file we have is a gif or an image

            var shapeFileName = "" //Set to empty if we are loading exsisiting image

            var shapeFileInput = "";

            //Determine if we uploading a new file or using an exsiting file in user media folder
            if(typeof shapeFile == "object")
            {                
                isGIF = shapeFile.type.includes("gif");

                //Get the name of the file
                shapeFileName = shapeFile.name;

                //Store the shapeFile
                shapeFileInput = shapeFile;

                //Convert shapeFile to a url
                shapeFile = URL.createObjectURL(shapeFile);
            }
            else //File exsits in user media
            {
                isGIF = shapeFile.includes("gif");

                shapeFileName = shapeFile.split("_DE_")[1];
            }

            //Create imageShape object
            shape = new ImageShape(shapeName, shapeType, shapeX, shapeY, shapeStartTime, shapeEndTime, shapeAnimation_type, shapeOpacity, shapeWidth, shapeHeight, shapeFile, isGIF);

            //Set up the file name
            shape.setFileName(shapeFileName);

            //Set up the fileInput
            shape.setFileInput(shapeFileInput);

            //If the imageShape has a gif file assign a onDraw function for it
            if(isGIF==true)
            {
                var image = new Image();

                image.src = shapeFile;

                image.onload = function hi()
                {
                    //Get the size of the image
                    var baseWidth = image.width;
                    var baseHeight = image.height;

                    //Find the scale to shrink or expand image to fit canvas
                    var scale = Math.min((shapeWidth/baseWidth), (shapeHeight/baseHeight));

                    //Scale the properties
                    var scaledWidth = (shapeWidth/baseWidth) * baseWidth; //scale * baseWidth;
                    var scaledHeight = (shapeHeight/baseHeight) * baseHeight; //scale * baseHeight;

                    //call function
                    function onDrawFrame(ctx, frame) {

                        // Draw the frame onto the canvas
                        ctx.drawImage(frame.buffer, 0, 0, baseWidth, baseHeight, 0, 0, scaledWidth, scaledHeight);

                        // Redraw the Konva layer
                        layer.draw();
                    }
                        
                    gifler(shapeFile).frames(shape.getCanvasElement(), onDrawFrame);
                }
            }
        }

        var AnimationStrat;

        // assign animation to the shape based on user selection    
        if (shapeAnimation_type != "None") {

            //Determine if it's any of these options
            if (shapeAnimation_type == "Clockwise") {

                AnimationStrat = new AnimationStrategy(new Clockwise(), layer);
                AnimationStrat.getAnimationObjectStrategy(shape);
            }
            else if (shapeAnimation_type == "Counter-Clockwise") {
                
                AnimationStrat = new AnimationStrategy(new CounterClockwise(), layer);
                AnimationStrat.getAnimationObjectStrategy(shape);
            }
            else if (shapeAnimation_type == "Bouncing") {

                AnimationStrat = new AnimationStrategy(new Bouncing(), layer);
                AnimationStrat.getAnimationObjectStrategy(shape);
            }
            else if (shapeAnimation_type == "Circular") {
                AnimationStrat = new AnimationStrategy(new Circular(), layer);
                AnimationStrat.getAnimationObjectStrategy(shape);
            }
        }

        //Add the newly created shape to the canvas
        layer.add(shape.getKonvaShape());

        //Add the newly created shape to the array
        var newShape = {
            "shapeStartTime": shape.getStartTime(),
            "shapeEndTime": shape.getEndTime(),
            "shape": shape,
            "shapeAnimation": shapeAnimation_type,
            "shapeName": shapeName,
            "shapeType": shapeType,
        }

        //Save the shape to array that will be used to store to database 
        this.ShapeArray.push(newShape);

        //Add the shape to an array that sorted by start time
        this.ShapeStartArray.push(newShape);
        this.ShapeStartArray.sort(function (a, b) {
            return a.shape.getStartTime().localeCompare(b.shape.getStartTime());
        });

        //Add the shape to an array that is sorted by end time
        this.ShapeEndArray.push(newShape);
        this.ShapeEndArray.sort(function (a, b) {
            return a.shape.getEndTime().localeCompare(b.shape.getEndTime());
        });

        //If applicable make sure that the logo and lyrics are at the top of the canvas
        if(this.lyricsObj != undefined)
        {
            this.lyricsObj.getKonvaTextBox().moveToTop();
        }

        if(this.LogoObject!=undefined)
        {
            //Get the konva object for the logo and move it to top of the konva canvas
            this.LogoObject.getKonvaLogo().moveToTop();
        }
        
        return false;
    }

    disableDraggingDE()
    {
        for(var i = 0; i < this.ShapeArray.length; i++){
            var shape = this.ShapeArray[i].shape.getKonvaShape();
            shape.setAttr("draggable", false);
        }
    }

    deleteShape(shapeName)
    {
        //Find the shape in the layer
        var shape;
        
        var ShapeClassObject; 
        //Do a for loop to find the shape based on shape name
        for(var i = 0; i < this.ShapeArray.length; i++){
            if(this.ShapeArray[i].shapeName == shapeName)
            {
                shape = this.ShapeArray[i].shape.getKonvaShape();
                ShapeClassObject = this.ShapeArray[i];
            }
        }

        //Delete entry relanted to shape in shapeArray, ShapeStarAarray, and ShapeEndArray
        var shapeIndex = this.ShapeArray.findIndex(p=>p.shapeName == shapeName);
        var shapeStartIndex = this.ShapeStartArray.findIndex(p=>p.shapeName == shapeName);
        var shapeEndIndex = this.ShapeEndArray.findIndex(p=>p.shapeName == shapeName);

        this.ShapeArray.splice(shapeIndex, 1);
        this.ShapeStartArray.splice(shapeStartIndex, 1);
        this.ShapeEndArray.splice(shapeEndIndex, 1);
        
        //Destory the shape
        shape.destroy();
    }

    modifyShapeSight(shapeName)
    {
        var shape = this.getShapeObject(shapeName).getKonvaShape();

        //Change the shape visibility
        shape.setAttr("visible",!shape.getAttr("visible"));
    }

    getVisibility(shapeName)
    {
        return this.getShapeObject(shapeName).getKonvaShape().getAttr("visible");
    }

    //Move a majority of this function to the controller since it's just polulating the fields of an existing shapes attributes. 
    // Should just return the shape from the for loop to the requestShowEditShapeSection in the Controller
    getShapeObject(shapeName)
    {
        //Grab the shape to access it's properites
        var ShapeClassObject;
        for(var i = 0; i < this.ShapeArray.length; i++){
            if(this.ShapeArray[i].shapeName == shapeName)
            {
                ShapeClassObject = this.ShapeArray[i].shape;
            }
        }
        
        return ShapeClassObject;
    }

    saveShapeChanges(shapeName, shapeType, newShapeName, shapeWidth, shapeHeight, shapeFill_color, shapeStroke, shapeStrokeWidth, shapeX, shapeY, shapeSides, shapeAnimation_type, shapeOpacity, shapeStartTime, shapeEndTime, shapeRadius, shapeFile)
    {
        var ShapeClassObject; 

        //Do a for loop to find the shape based on shape name
        for(var i = 0; i < this.ShapeArray.length; i++){
            if(this.ShapeArray[i].shapeName == shapeName)
            {
                ShapeClassObject = this.ShapeArray[i].shape;
            }
        }
        
        //Determine what type of shape we're acessing
        if(shapeType == "Rectangle")
        {
            //Modify the konva shape values 
            ShapeClassObject.getKonvaShape().setAttr('width', shapeWidth);
            ShapeClassObject.getKonvaShape().setAttr('height', shapeHeight);

            //Update the offset tof the konva shape to ensure it still amintains it's center point
            ShapeClassObject.getKonvaShape().setAttr("offset", {x: shapeWidth/2, y: shapeHeight/2});
        }
        else if(shapeType == "Polygon")
        {
            ShapeClassObject.getKonvaShape().setAttr("sides", shapeSides);
            ShapeClassObject.getKonvaShape().setAttr("radius", shapeRadius);
        }
        else if(shapeType== "Image")
        {
            //Set up the image if applicable and rescale it
            if(shapeFile!="")
            {
                //Get the file extension
                var isGif = shapeFile.type.includes("gif");

                //Store the new file name
                ShapeClassObject.setFileName(shapeFile.name);

                //Set up the fileInput
                ShapeClassObject.setFileInput(shapeFile);

                //Convert shapeFile into a url
                shapeFile = URL.createObjectURL(shapeFile);

                //Used to store image upload
                var image=new Image();

                if(isGif==true) //Image uploaded is a gif
                {
                    //Create a new canvas element and overwite the old canvas if available
                    var newCanvas = document.createElement('canvas');

                    //Have the canvas cover the entire konva image
                    newCanvas.width = shapeWidth;
                    newCanvas.height = shapeHeight; 
   
                    //Have the konva image use the canvas element
                    ShapeClassObject.getKonvaShape().setAttr("image", newCanvas);

                    image.src = shapeFile;

                    image.onload = function scale()
                    {
                        //Get the size of the image
                        var baseWidth = image.width;
                        var baseHeight = image.height;

                        //Get the width and height scale
                        var scaledWidth = (shapeWidth/baseWidth) * baseWidth;
                        var scaledHeight = (shapeHeight/baseHeight) * baseHeight;
                        
                        //Use this function to render gif on screen
                        function onDrawFrame(ctx, frame)
                        {
                            // Draw the frame onto the canvas
                            ctx.drawImage(frame.buffer, 0, 0, baseWidth, baseHeight, 0, 0, scaledWidth, scaledHeight);

                            // Redraw the Konva layer
                            layer.draw();
                        }

                        gifler(shapeFile).frames(newCanvas, onDrawFrame);
                    }
                }
                else //Image uploaded is not a gif
                {
                    image.src = shapeFile;
                    ShapeClassObject.getKonvaShape().setAttr("image", image);
                }
            }
            //Make the fill value set to ""
            shapeFill_color = "";

            //Make the border color set to ""
            shapeStroke = "";

            //Update the shape width, height, and offset 
            ShapeClassObject.getKonvaShape().setAttr("width", shapeWidth);
            ShapeClassObject.getKonvaShape().setAttr("height", shapeHeight);
            ShapeClassObject.getKonvaShape().setAttr("offset", {x: shapeWidth/2, y: shapeHeight/2});
        }

        //Handle the rest of the common attributes

        ShapeClassObject.setShapeName(newShapeName);

        ShapeClassObject.getKonvaShape().setAttr("fill", shapeFill_color);
        
        ShapeClassObject.getKonvaShape().setAttr("stroke", shapeStroke);

        ShapeClassObject.getKonvaShape().setAttr("strokeWidth", Number(shapeStrokeWidth));

        ShapeClassObject.getKonvaShape().setAttr("x", Number(shapeX));

        ShapeClassObject.getKonvaShape().setAttr("y", Number(shapeY));

        ShapeClassObject.getKonvaShape().setAttr("opacity", shapeOpacity);

        // Get the selected animation type from the dropdown
        const shapeAnimationType = shapeAnimation_type;

        // Apply animation based on the selected type
            let animationObject;
            let AnimationStrat;

            if(ShapeClassObject.getAnimationType()!="None")
                ShapeClassObject.stopAnimation();

            if (shapeAnimationType == "Clockwise") {

                AnimationStrat = new AnimationStrategy(new Clockwise(), layer);

                AnimationStrat.getAnimationObjectStrategy(ShapeClassObject);

                ShapeClassObject.setAnimationType("Clockwise");
            } else if (shapeAnimationType == "Counter-Clockwise") {

                AnimationStrat = new AnimationStrategy(new CounterClockwise(), layer);
                AnimationStrat.getAnimationObjectStrategy(ShapeClassObject); 

                ShapeClassObject.setAnimationType("Counter-Clockwise");
            } 
            else if (shapeAnimationType == "Bouncing"){
                AnimationStrat = new AnimationStrategy(new Bouncing, layer);
                AnimationStrat.getAnimationObjectStrategy(ShapeClassObject); 

                ShapeClassObject.setAnimationType("Bouncing");
            }
            else if(shapeAnimationType == "Circular"){
                AnimationStrat = new AnimationStrategy(new Circular(), layer);
                AnimationStrat.getAnimationObjectStrategy(ShapeClassObject);

                ShapeClassObject.setAnimationType("Circular");
            }
            else if (shapeAnimationType == "None") { //When the animatiion type is none
                //If the current shape is using clockwise, ccw, bouncing, circular call stop
                if(ShapeClassObject.getAnimationType()!="None")
                    ShapeClassObject.getAnimation().stop();

                ShapeClassObject.setAnimationType("None");
            }
        
            // Start the animation
            if(ShapeClassObject.getAnimationType()!="None")
                ShapeClassObject.getAnimation().start();

        ShapeClassObject.setStartTime(shapeStartTime);
        ShapeClassObject.setEndTime(shapeEndTime);
        

        //Update the startTime, EndTime, and name for the shapeArray, shapeStartArray, and shapeEndArray
        var shapeIndex = this.ShapeArray.findIndex(p=>p.shapeName == shapeName);
        var shapeStartIndex = this.ShapeStartArray.findIndex(p=>p.shapeName == shapeName);
        var shapeEndIndex = this.ShapeEndArray.findIndex(p=>p.shapeName == shapeName);

        this.ShapeArray[shapeIndex].shapeName = newShapeName;
        this.ShapeArray[shapeIndex].shapeStartTime = shapeStartTime;
        this.ShapeArray[shapeIndex].shapeEndTime = shapeEndTime;
        this.ShapeArray[shapeIndex].shapeAnimation = shapeAnimationType;

        this.ShapeStartArray[shapeStartIndex].shapeName = newShapeName;
        this.ShapeStartArray[shapeStartIndex].shapeStartTime = shapeStartTime;
        this.ShapeStartArray[shapeStartIndex].shapeEndTime = shapeEndTime;
        this.ShapeStartArray[shapeStartIndex].shapeAnimation = shapeAnimationType;

        this.ShapeEndArray[shapeEndIndex].shapeName = newShapeName;
        this.ShapeEndArray[shapeEndIndex].shapeStartTime = shapeStartTime;
        this.ShapeEndArray[shapeEndIndex].shapeEndTime = shapeEndTime;
        this.ShapeEndArray[shapeEndIndex].shapeAnimation = shapeAnimationType;
    }

    getShapeArray()
    {
        return this.ShapeArray;
    }

    getShapeStartArray()
    {
        return this.ShapeStartArray;
    }

    getShapeEndArray()
    {
        return this.ShapeEndArray;
    }

    hideAllShapes()
    {
        for(var i = 0; i < this.ShapeArray.length; i++){
            
            //shape = ShapeArray[i].shape.getKonvaShape();
            this.ShapeArray[i].shape.getKonvaShape().setAttr("visible", false);
        }
    }

    updateShapeZIndex(shapeName, index, rowsLength)
    {
        //Find the shape in the array
        var shape;

        for(var i = 0; i < this.ShapeArray.length; i++){
            if(this.ShapeArray[i].shapeName == shapeName)
            {
                shape = this.ShapeArray[i].shape;
            }
        }

        //Set the z-index to the position the row index is at
        var position = (rowsLength -1) - index;
        shape.getKonvaShape().setZIndex(position);
    }
    
    //*****************************Lyrics functions and properties************************************************
    createLyrics(lyricsTextAreaStuff, lyricBackgroundColor, FontColor, FontSize, FontType, lyricsX, lyricsY){
        //Add the lines to the table
        lyricArray = lyricsTextAreaStuff.split('\n~~~\n');
    
        //Create the Lyrics
        this.lyricsObj = new Lyrics(lyricBackgroundColor, FontColor, FontType, FontSize, lyricsX, lyricsY);
    
        //Add lyrics to the stage and get the text object
        layer.add(this.lyricsObj.getKonvaTextBox());
        text = this.lyricsObj.getKonvaText();

        //If applicable make sure that the logo and lyrics are at the top of the canvas
        this.lyricsObj.getKonvaTextBox().moveToTop();
         
        if(this.LogoObject!=undefined)
        {
            //Get the konva object for the logo and move it to top of the konva canvas
            this.LogoObject.getKonvaLogo().moveToTop();
        }
    }

    saveLyricChanges(fontColor, fontStyle, lyricContent, fontSize, bgOption, bgColor)
    {
        //Set the values for font color, style, size
        this.lyricsObj.getKonvaText().setAttr("fill", fontColor);
        this.lyricsObj.getKonvaText().setAttr("fontFamily", fontStyle);
        this.lyricsObj.getKonvaText().setAttr("fontSize", fontSize);

        //Check if background option was selected
        if(bgOption==false)
        {
            this.lyricsObj.getKonvaBackground().setAttr("fill", bgColor);
        }
        else
        {
            this.lyricsObj.getKonvaBackground().setAttr("fill", "");
        }

        //Overwrite old lyric content with new lyrics
        lyricArray = lyricContent.split('\n~~~\n');
    }

    removeLyrics()
    {
        //Delete the text box from the stage
        this.lyricsObj.getKonvaTextBox().destroy();

        //Set the lyric array to empty
        lyricArray = [];

        this.lyricsObj = undefined;
    }

    updateTextBoxOffset()
    {
        //Get the width and height of Text box
        var lyricsWidth = this.lyricsObj.getKonvaTextBox().getAttr("width");

        var lyricsHeight = this.lyricsObj.getKonvaTextBox().getAttr("height");

        //Modify the offset
        this.lyricsObj.getKonvaTextBox().setAttr("offset", {x: lyricsWidth/2, y: lyricsHeight/2});
    }

    changeLyricVisibility()
    {
        this.lyricsObj.getKonvaTextBox().setAttr("visible",! this.lyricsObj.getKonvaTextBox().getAttr("visible"));
    }

    getLyricArray()
    {
        return lyricArray;
    }

    getTextObject()
    {
        return text;
    }

    getLyricsTextBox()
    {
        return this.lyricsObj.getKonvaTextBox();
    }

    getLyricObject()
    {
        return this.lyricsObj;
    }

    //*********************************************Background functions and properties******************************************
    createBackground(BackgroundFileInput, fileName, backgroundStartTime){
        var backgroundObject = new Background(BackgroundFileInput, fileName, backgroundStartTime);
        
        this.backgroundArray.push(backgroundObject.getBackgroundObject());
    
        //Add the shape to an array that sorted by start time
        
        this.backgroundArray.sort(function (a, b) {
            return a.backgroundStartTime.localeCompare(b.backgroundStartTime);
        });
    }

    deleteBackground(fileName) {
        //Loop through bacround array to find the object that contains file name and delete it
        for(var i = 0; i < this.backgroundArray.length; i++)
        {
            //compare the current element's filename with the parameter if true delete the object at the index
            if(this.backgroundArray[i].fileName==fileName)
            {
                //console.log("Found filename");
                this.backgroundArray.splice(i, 1);
            }
        }
    }

    getBackgroundObject(fileName)
    {
        //Find the background object to update
        for(var i=0; i < this.backgroundArray.length; i++)
        {
            if(this.backgroundArray[i].fileName==fileName)
                return this.backgroundArray[i];
        }
    }

    getBackgroundArray()
    {
        return this.backgroundArray;
    }

    saveBackgroundChanges(fileName, backgroundStartTime, backgroundFileInput, backgroundFileInputName, FileInputlength){
        var backgroundObjectFound;
    
        
        //Find the background object to update
        for(var i=0; i < this.backgroundArray.length; i++)
        {
            if(this.backgroundArray[i].fileName==fileName)
            {
                backgroundObjectFound = this.backgroundArray[i];
            }
        }
    
        //Change the background objects attributes with the input fieds from the properites panel
        backgroundObjectFound.backgroundStartTime = backgroundStartTime;
    
        if(FileInputlength != 0) //If the user has selected a file then don't chnage the objexts propties for the file 
        {
            //Update the background object's file 
            backgroundObjectFound.contentFile = backgroundFileInput;

            backgroundObjectFound.fileName = backgroundFileInputName;
        }
    }
}
