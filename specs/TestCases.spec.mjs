import Konva from 'konva'; //Had to import this to avoid a konva is undefined error when runing the test command
import { Polygon } from '../Models/Polygon.mjs';
import { Rectangle } from '../Models/Rectangle.mjs';
import { EditorManager } from '../Models/EditorManager.mjs';
import {expect} from 'chai';

//Make a stage and layer for testing

describe("Design Element Logic Testing", function()
{
    //TC-06
    it("Determine if a shape will be created based on inputted values", function(){
        var EditorManagerObj = new EditorManager();

        //Create rectangle using create shape
        var duplicateFound = EditorManagerObj.createShape("bob", 100, 100, "red", "blue", 2, "50", "50", "", "Clockwise", 0.8, "00:01.0", "00:09.7", "Rectangle", "");
        
        //See if the function can determine a shapeName is unique
        expect(duplicateFound).to.be.equal(false);

        //Check if the rectangle is added to the arrays
        expect(EditorManagerObj.getShapeArray().length).to.be.equal(1);
        expect(EditorManagerObj.getShapeStartArray().length).to.be.equal(1);
        expect(EditorManagerObj.getShapeEndArray().length).to.be.equal(1);

        //##################################################################################
        //Create Polygon using an existing name
        duplicateFound = EditorManagerObj.createShape("bob", 100, 100, "red", "blue", 2, "50", "50", 7, "Clockwise", 0.8, "00:05.0", "00:06.7", "Polygon", 50);
        
        expect(duplicateFound).to.be.equal(true);

        //###################################################################################
        //Create Polgygon with unique name and see if it's added to the shapeArrays
        duplicateFound = EditorManagerObj.createShape("steve", 100, 100, "red", "blue", 2, "50", "50", 7, "Clockwise", 0.8, "00:05.0", "00:06.7", "Polygon", 50);
        //btw you have two variables that have the same name "duplicateFound"
        expect(EditorManagerObj.getShapeArray().length).to.be.equal(2);
        expect(EditorManagerObj.getShapeStartArray().length).to.be.equal(2);
        expect(EditorManagerObj.getShapeEndArray().length).to.be.equal(2);
    });
    
    //TC-17
    it("Checking range of x and y values for added shape", function(){
        var EditorManagerObj = new EditorManager();
        
        var result1 =  EditorManagerObj.createShape("rectangle", 100, 100, "red", "blue", 2, "600", "900", "", "Clockwise", 0.8, "00:01.0", "00:09.7", "Rectangle", "");

        expect(result1).to.be.equal(true);
        //#########################################################################################################

        var result2 = EditorManagerObj.createShape("rectangle", 100, 100, "red", "blue", 2, "0", "0", "", "Clockwise", 0.8, "00:01.0", "00:09.7", "Rectangle", "");
        expect(result2).to.be.equal(false);

        //#########################################################################################################

        var result3 = EditorManagerObj.createShape("rectangle3", 100, 100, "red", "blue", 2, "400", "400", "", "Clockwise", 0.8, "00:01.0", "00:09.7", "Rectangle", "");
        expect(result3).to.be.equal(false); 
        //#########################################################################################################

        var result4 = EditorManagerObj.createShape("rectangle", 100, 100, "red", "blue", 2, "700", "2000", "", "Clockwise", 0.8, "00:01.0", "00:09.7", "Rectangle", "");
        expect(result4).to.be.equal(true);
        
    });

    //TC-08
    it("Checking design element toggle", function(){
        var EditorManagerObj = new EditorManager();

        EditorManagerObj.createShape("Rectangle1", 100, 100, "red", "blue", 2, "400", "400", "", "Clockwise", 0.8, "00:01.0", "00:09.7", "Rectangle", "");
        var shapeName = EditorManagerObj.getShapeObject("Rectangle1").getName();
        
        //Toggle visibility to hide shape
        EditorManagerObj.modifyShapeSight(shapeName);
        
        expect(EditorManagerObj.getVisibility(shapeName)).to.be.equal(false);

        //Toggle visibility to display shape
        EditorManagerObj.modifyShapeSight(shapeName);
        
        expect(EditorManagerObj.getVisibility(shapeName)).to.be.equal(true);
    });

    //TC-07
    it("Test Shape Deletion", function(){
        var EditorManagerObj = new EditorManager();

        //Create a shape
        EditorManagerObj.createShape("bob", 100, 100, "red", "blue", 2, "50", "50", "", "Clockwise", 0.8, "00:01.0", "00:09.7", "Rectangle", "");

        //Check if the shape is in the array
        expect(EditorManagerObj.getShapeArray().length).to.be.equal(1);
        expect(EditorManagerObj.getShapeStartArray().length).to.be.equal(1);
        expect(EditorManagerObj.getShapeEndArray().length).to.be.equal(1);

        //Call delete function
        EditorManagerObj.deleteShape("bob");

        //Check if the shape is gone from the array
        expect(EditorManagerObj.getShapeArray().length).to.be.equal(0);
        expect(EditorManagerObj.getShapeStartArray().length).to.be.equal(0);
        expect(EditorManagerObj.getShapeEndArray().length).to.be.equal(0);
    });

    //TC-18
    it("Test if shape modification is working properly", function()
    {
        var EditorManagerObj = new EditorManager();

        //Create Rectangle
        EditorManagerObj.createShape("bob", 100, 100, "red", "blue", 2, "50", "50", "", "Clockwise", 0.8, "00:01.0", "00:09.7", "Rectangle", "");

        //Call shape modification
        EditorManagerObj.saveShapeChanges("bob", "Rectangle", "steve", 200, 300, "blue", "green", 5, "70", "80", "", "None", 0.6, "00:02.0", "00:07.0", "");

        // //Get the Shape and compare all the attributes
        var shape = EditorManagerObj.getShapeObject("steve").getKonvaShape();
        var shapeObj = EditorManagerObj.getShapeObject("steve");

        expect(shape.getAttr("name")).to.be.equal("steve");
        expect(shape.getAttr("width")).to.be.equal(200);
        expect(shape.getAttr("height")).to.be.equal(300);
        expect(shape.getAttr("x")).to.be.equal(70);
        expect(shape.getAttr("y")).to.be.equal(80);
        expect(shape.getAttr("fill")).to.be.equal("blue");
        expect(shape.getAttr("stroke")).to.be.equal("green");
        expect(shape.getAttr("strokeWidth")).to.be.equal(5);
        expect(shape.getAttr("opacity")).to.be.equal(0.6);
        expect(shapeObj.getAnimationType()).to.be.equal("None");
        expect(shapeObj.getStartTime()).to.be.equal("00:02.0");
        expect(shapeObj.getEndTime()).to.be.equal("00:07.0");

        //Create Polygon
        EditorManagerObj.createShape("rick", "", "", "red", "blue", 2, "50", "50", 7, "Clockwise", 0.8, "00:05.0", "00:06.7", "Polygon", 50);

        //Call the save changes function
        EditorManagerObj.saveShapeChanges("rick", "Polygon", "rob", "100", "100", "purple", "pink", 5, "90", "40", 9, "None", 0.3, "00:09.0", "00:27.0", 80);
        
        //Get the Shape and compare all the attributes
        shape = EditorManagerObj.getShapeObject("rob").getKonvaShape();
        shapeObj = EditorManagerObj.getShapeObject("rob");

        expect(shape.getAttr("name")).to.be.equal("rob");
        expect(shape.getAttr("x")).to.be.equal(90);
        expect(shape.getAttr("y")).to.be.equal(40);
        expect(shape.getAttr("fill")).to.be.equal("purple");
        expect(shape.getAttr("stroke")).to.be.equal("pink");
        expect(shape.getAttr("strokeWidth")).to.be.equal(5);
        expect(shape.getAttr("opacity")).to.be.equal(0.3);
        expect(shape.getAttr("sides")).to.be.equal(9);
        expect(shape.getAttr("radius")).to.be.equal(80);
        expect(shapeObj.getAnimationType()).to.be.equal("None");
        expect(shapeObj.getStartTime()).to.be.equal("00:09.0");
        expect(shapeObj.getEndTime()).to.be.equal("00:27.0");
    });
});

// describe("Logo Element Logic Testing", function(){
//     //TC-11
//     it("Test if a logo element can be created with inputted values", function(){
//         var EditorManagerObj = new EditorManager();

//         //Create Logo object
//         EditorManagerObj.createLogo("Logo1", "/64_Logo_BIOS.jpg", 100, 100, 250, 250, 0.8);

//         //Check if Logo Object exists
//         var logo = EditorManagerObj.getLogoObject();

//         //Check if the logo object contains the specified attributes
//         expect(logo.getKonvaLogo().getAttr("name")).to.be.equal("Logo1");
//         expect(logo.getKonvaLogo().getAttr("width")).to.be.equal(100);
//         expect(logo.getKonvaLogo().getAttr("height")).to.be.equal(100);
//         expect(logo.getKonvaLogo().getAttr("x")).to.be.equal(250);
//         expect(logo.getKonvaLogo().getAttr("y")).to.be.equal(250);
//         expect(logo.getKonvaLogo().getAttr("opacity")).to.be.equal(0.8);
//     });

//     //TC-12
//     it("Test if the Logo element is able to toggle between hidden and showing", function(){
//         //Create Editor Manager
//         var EditorManagerObj = new EditorManager();

//         //Create logo object and check if visible
//         EditorManagerObj.createLogo("Logo1", "/64_Logo_BIOS.jpg", 100, 100, 250, 250, 0.8);

//         var logo = EditorManagerObj.getLogoObject();
//         expect(logo.getKonvaLogo().getAttr("visible")).to.be.equal(true);

//         //Toggle logo to hidden and check visibility
//         EditorManagerObj.changeLogoVisibility();
//         expect(logo.getKonvaLogo().getAttr("visible")).to.be.equal(false);

//         //Toggle logo to visibile and check visibility
//         EditorManagerObj.changeLogoVisibility();
//         expect(logo.getKonvaLogo().getAttr("visible")).to.be.equal(true);
//     });
// });

describe("Overlay Element Logic Testing", function(){

    //TC-22
    it("Test if a overlay element can be created with inputted values", function(){
        //Create manager object
        var EditorManagerObj = new EditorManager();

        //create overlay object 
        EditorManagerObj.createOverlay("OverlayObj1", 0.7, "overlay1", "00:01.0", "00:09.5");

        //Check if the overlay object is in the overlayStartArray, overlayendArray, and overlayArray
        expect(EditorManagerObj.getOverlayArray().length).to.be.equal(1);
        expect(EditorManagerObj.getOverlayStartArray().length).to.be.equal(1);
        expect(EditorManagerObj.getOverlayEndArray().length).to.be.equal(1);

        //Check if the object has the specified values
        var overlayObject = EditorManagerObj.getOverlayObject("OverlayObj1");

        expect(overlayObject.getName()).to.be.equal("OverlayObj1");
        expect(overlayObject.getOpacity()).to.be.equal(0.7);
        expect(overlayObject.getOverlayOption()).to.be.equal("overlay1");
        expect(overlayObject.getStartTime()).to.be.equal("00:01.0");
        expect(overlayObject.getEndTime()).to.be.equal("00:09.5");
    });

    //TC-23
    it("Test if an overlay element can be deleted from project", function(){
        //Create manager object 
        var EditorManagerObj = new EditorManager();

        //Create overlay object
        EditorManagerObj.createOverlay("OverlayObj1", 0.7, "overlay1", "00:01.0", "00:09.5");

        //Check if the overlay arrays length to see if it was added
        expect(EditorManagerObj.getOverlayArray().length).to.be.equal(1);
        expect(EditorManagerObj.getOverlayStartArray().length).to.be.equal(1);
        expect(EditorManagerObj.getOverlayEndArray().length).to.be.equal(1);

        //Call remove overlay with the name of the overlay object
        EditorManagerObj.deleteOverlay("OverlayObj1");

        //Check if the length of the arrays is 0
        expect(EditorManagerObj.getOverlayArray().length).to.be.equal(0);
        expect(EditorManagerObj.getOverlayStartArray().length).to.be.equal(0);
        expect(EditorManagerObj.getOverlayEndArray().length).to.be.equal(0);
    });

    //TC-24
    it("Test if an overlay element can be modifed with new values", function(){
        //Create manager object
        var EditorManagerObj = new EditorManager();

        //Create overlay object
        EditorManagerObj.createOverlay("OverlayObj1", 0.7, "overlay1", "00:01.0", "00:09.5");

        //Call modify overlay with the new values
        EditorManagerObj.saveOverlayChanges('OverlayObj1', "OverlayObj2", 1, "overlay2", "00:50.0", "00:58.2");

        //Get the overlay object
        var overlayObject = EditorManagerObj.getOverlayObject("OverlayObj2");

        //Check if the overlay has the new values
        expect(overlayObject.getName()).to.be.equal("OverlayObj2");
        expect(overlayObject.getOpacity()).to.be.equal(1);
        expect(overlayObject.getOverlayOption()).to.be.equal("overlay2");
        expect(overlayObject.getStartTime()).to.be.equal("00:50.0");
        expect(overlayObject.getEndTime()).to.be.equal("00:58.2");
    });
});

describe("Lyric Element Logic Testing", function(){
    //TC-13
    it("Test if a lyrics element can be created with inputted values", function(){
        var EditorManagerObj = new EditorManager();

        //Create Lyrics object
        var lyricsContent = "Hello there\nWassup\n~~~\nHowdy";
        EditorManagerObj.createLyrics(lyricsContent, "red", "blue", 34, "Arial");
        
        //Get the text, background and lyric array and see if the values are created
        var textObj = EditorManagerObj.getTextObject();

        expect(EditorManagerObj.getLyricArray().length).to.be.equal(2);
        expect(textObj.getAttr("fontFamily")).to.be.equal("Arial");
        expect(textObj.getAttr("fontSize")).to.be.equal(34);
        expect(textObj.getAttr("fill")).to.be.equal("blue");
        expect(EditorManagerObj.getLyricObject().getKonvaBackground().getAttr("fill")).to.be.equal("red");
    });

    //TC-14
    it("Test if the Lyrics element is able to toggle between hidden and showing", function(){
        var EditorManagerObj = new EditorManager();

        //Create Lyrics object
        var lyricsContent = "Hello there\nWassup\n~~~\nHowdy";
        EditorManagerObj.createLyrics(lyricsContent, "red", "blue", 34, "Arial");

        //Get the textbox and see if the object is visible
        var TextBox = EditorManagerObj.getLyricsTextBox();
        expect(TextBox.getAttr("visible")).to.be.equal(true);

        //Have the textbox set to hidden and check if visible is false
        EditorManagerObj.changeLyricVisibility();
        expect(TextBox.getAttr("visible")).to.be.equal(false);

        //Flip textbox back to visible and check if it's true
        EditorManagerObj.changeLyricVisibility();
        expect(TextBox.getAttr("visible")).to.be.equal(true);
    });

    //TC-20
    it("Test if the lyrics element is able to be deleted from project", function(){
        var EditorManagerObj = new EditorManager();

        //Create lyrics object
        var lyricsContent = "Hello there\nWassup\n~~~\nHowdy";
        EditorManagerObj.createLyrics(lyricsContent, "red", "blue", 34, "Arial");

        //Check if lyrics object exists
        expect(EditorManagerObj.getLyricObject()!=undefined).to.be.equal(true);

        //Call delete lyrics function
        EditorManagerObj.removeLyrics();

        //Check if the lyrics object still exists
        expect(EditorManagerObj.getLyricObject()!=undefined).to.be.equal(false);
    });

    //TC-21
    it("Test if the lyrics element is able to be modified", function(){
        //Create Editor Manager
        var EditorManagerObj = new EditorManager();

        //Create lyrics object
        var lyricsContent = "Hello there\nWassup\n~~~\nHowdy";
        EditorManagerObj.createLyrics(lyricsContent, "red", "blue", 34, "Arial");

        //Call the modify function for lyrics
        EditorManagerObj.saveLyricChanges("yellow", "Sans", "Line1 Line1\n~~~\nLine2\n~~~\nLine3\n~~~\nLine 4", 72, false, "green");
        
        //Check if the lyrics object has the new changes
        var lyricsText = EditorManagerObj.getTextObject();

        expect(lyricsText.getAttr("fontFamily")).to.be.equal("Sans");
        expect(lyricsText.getAttr("fontSize")).to.be.equal(72);
        expect(lyricsText.getAttr("fill")).to.be.equal("yellow");
        expect(EditorManagerObj.getLyricArray().length).to.be.equal(4);
        expect(EditorManagerObj.getLyricObject().getKonvaBackground().getAttr("fill")).to.be.equal("green");
        
    });
});

describe("Background Element Logic Testing", function(){

    //TC-09
    it("Test if background element can be created with inputted values", function(){
        var EditorManagerObj = new EditorManager();

        //Create background element
        EditorManagerObj.createBackground("./EditorMedia/AmongUs.jpg", "AmoungUs.jpg", "00:01.5");

        //Check if the element has been added to the background array
        var BackgroundObj = EditorManagerObj.getBackgroundObject("AmoungUs.jpg")

        expect(EditorManagerObj.getBackgroundArray().length).to.be.equal(1);
        expect(BackgroundObj.backgroundStartTime).to.be.equal("00:01.5");
        expect(BackgroundObj.fileName).to.be.equal("AmoungUs.jpg");
        expect(BackgroundObj.contentFile).to.be.equal("./EditorMedia/AmongUs.jpg");
    });

    //TC-10
    it("Test if Background element can be deleted by it's fileName", function(){
        var EditorManagerObj = new EditorManager();

        //Create background element
        EditorManagerObj.createBackground("./EditorMedia/AmongUs.jpg", "AmoungUs.jpg", "00:01.5");

        //Check if the object was added to the array
        expect(EditorManagerObj.getBackgroundArray().length).to.be.equal(1);

        //Delete the background element
        EditorManagerObj.deleteBackground("AmoungUs.jpg");

        //Check if the array is empty
        expect(EditorManagerObj.getBackgroundArray().length).to.be.equal(0);
    });

    //TC-19
    it("Test if Background object is able to change it's values", function(){
        var EditorManagerObj = new EditorManager();

        //Create background element
        EditorManagerObj.createBackground("./EditorMedia/AmongUs.jpg", "AmoungUs.jpg", "00:01.5");

        //Update the object to new values
        EditorManagerObj.saveBackgroundChanges("AmoungUs.jpg", "00:31.5", "./EditorMedia/CarrieUnderwood.mp4", "CarrieUnderwood.mp4", 1);

        //Get background object and start comparing values
        var BackgroundObj = EditorManagerObj.getBackgroundObject("CarrieUnderwood.mp4");

        expect(BackgroundObj.backgroundStartTime).to.be.equal("00:31.5");
        expect(BackgroundObj.fileName).to.be.equal("CarrieUnderwood.mp4");
        expect(BackgroundObj.contentFile).to.be.equal("./EditorMedia/CarrieUnderwood.mp4");
    });
});


describe("Design Element Shape Inheritance Testing", function(){
    it("Polygon Inheritance Test", function(){
        //Create Polygon Object
        var polygon = new Polygon("joe", "Polygon","20", "20", "00:01.0", "00:02.0", "red", "blue", 2, "None", 0.8, 30, 5);

        //Test the inherited functions of shape class
        expect(polygon.getName()).to.be.equal("joe");
        expect(polygon.getShapeType()).to.be.equal("Polygon");
        expect(polygon.getEndTime()).to.be.equal("00:02.0");
        expect(polygon.getStartTime()).to.be.equal("00:01.0");
        expect(polygon.getAnimationType()).to.be.equal("None");
    });

    it("Rectangle Inheritance Test", function(){
        //Create Rectangle Object
        var rectangle = new Rectangle("phil", "Rectangle", "100", "200", "00:25.1", "00:27.3", "green", "purple", 3, "None", 1, 100, 40);

        //Test the inherited functions of shape class
        expect(rectangle.getName()).to.be.equal("phil");
        expect(rectangle.getShapeType()).to.be.equal("Rectangle");
        expect(rectangle.getEndTime()).to.be.equal("00:27.3");
        expect(rectangle.getStartTime()).to.be.equal("00:25.1");
        expect(rectangle.getAnimationType()).to.be.equal("None");
    });
});

