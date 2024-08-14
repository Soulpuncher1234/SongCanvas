import {EditorManager} from './EditorManager.mjs';

//Create Manager Object
var EditorManagerObj = new EditorManager();

//Create event listener for key presses
createKeyboardListener();


// ---------------------- Logo ------------------------------------------
var addLogoToScreenButton = document.getElementById("logoSubmit");
addLogoToScreenButton.addEventListener("click", requestCreateLogo);


function requestCreateLogo(){

    let logoName = document.getElementById("logoName").value;
    let logoPic = document.getElementById("logoInput").files[0];
    let logoWidth = document.getElementById("logoWidth").value;
    let logoHeight = document.getElementById("logoHeight").value;
    let logoX = 1050/2;
    let logoY = 500/2;
    let logoOpacity = document.getElementById("logoOpacity").value;

    //Have manager create logo
    EditorManagerObj.createLogo(logoName, URL.createObjectURL(logoPic), logoWidth, logoHeight, logoX, logoY, logoOpacity);

    EditorManagerObj.getLogoObject().setLogoFile(logoPic);

    EditorManagerObj.getLogoObject().setLogoFileName(logoPic.name);

    //Create Logo row
    let table = document.getElementById("logoHierarchy");
    
    let template = `
        <tr id="addedLogoRow">
            <td id="addedLogoName" style="border: 1px solid black;"> 
                <button class="addedLogoNameButton" onclick="requestShowEditLogoSection()" style="background-color: white; border: none;">Logo</button>
            </td>
            <td id="addedLogoVisibility" style="border: 1px solid black;">
                <button class="addedLogoVisibilityButton" onclick="toggleLogoVisibility()" style="background-color: white; border: none;"><img style="width: 26px;
                height: 26px;" src='/LoginMedia/EyeShow.png' ></button>
            </td>
            <td id="deleteLogo" style="border: 1px solid black;">
                <button class="deleteLogoButton" onclick="requestDeleteLogo()" style="background-color: white; border: none;" ><img src='/EditorMedia/TrashCan.png' style="width: 26px;
                height: 26px; "></button>
            </td>
            </tr>
    `;    
    table.innerHTML += template;

    //Hide the plus button for logo to prevent
    document.getElementById("logoPlusButton").style.setProperty("visibility", "hidden");
}

export function requestShowEditLogoSection()
{
    //Hide the other pop-ups if showing
    document.getElementById("editBackgroundPopUp").style.setProperty("display", "none"); 
    document.getElementById("lyricEditPopUp").style.setProperty("display", "none");
    document.getElementById("editShapePopUp").style.setProperty("display", "none");
    document.getElementById("overlayPopUp").style.setProperty("display", "none");

    //Display the logo pop-up
    document.getElementById("editLogoPopUp").style.setProperty("display", "block");

    //Move width and height sliders to the right position
    document.querySelector('.editLogoHeightRange').value = EditorManagerObj.getLogoObject().getKonvaLogo().getAttr('height');
    document.querySelector('.editLogoWidthRange').value = EditorManagerObj.getLogoObject().getKonvaLogo().getAttr('width');

    //Empty the input field
    document.getElementById('EditLogoInput').value = '';

    //Poplulate the fields
    document.getElementById("EditLogoWidth").value = EditorManagerObj.getLogoObject().getKonvaLogo().getAttr('width');
    document.getElementById("EditLogoHeight").value = EditorManagerObj.getLogoObject().getKonvaLogo().getAttr('height');
    document.getElementById("EditLogoOpacity").value = EditorManagerObj.getLogoObject().getKonvaLogo().getAttr('opacity');
    document.getElementById("editLogoName").value = EditorManagerObj.getLogoObject().getKonvaLogo().getAttr('name');
    document.getElementById("EditLogoOpacityValue").innerText = EditorManagerObj.getLogoObject().getKonvaLogo().getAttr('opacity');
}

export function requestSaveLogoChanges()
{
    //Obtain values from fields
    let logoWidth = document.getElementById("EditLogoWidth").value;
    let logoHeight = document.getElementById("EditLogoHeight").value;
    let logoOpacity = document.getElementById("EditLogoOpacity").value;
    let logoName =  document.getElementById("editLogoName").value;
    let logoFileLength = document.getElementById('EditLogoInput');
    let logoFileInput = "";
    let logoX = EditorManagerObj.getLogoObject().getKonvaLogo().getAttr('x');
    let logoY = EditorManagerObj.getLogoObject().getKonvaLogo().getAttr('y');

    //Check if the file has been selected
    if(logoFileLength.files.length==1)
    {
        //Create url object
        logoFileInput = URL.createObjectURL(logoFileLength.files[0]);

        //Store the file name user inputted
        EditorManagerObj.getLogoObject().setLogoFileName(logoFileLength.files[0].name);

        EditorManagerObj.getLogoObject().setLogoFile(logoFileLength.files[0]);
    }

    //Call manager object
    EditorManagerObj.saveLogoChanges(logoName, logoFileInput, logoWidth, logoHeight, logoX, logoY, logoOpacity);

}

export function requestDeleteLogo()
{
    //Call editor manager
    EditorManagerObj.deleteLogo();

    //Remove row
    document.getElementById("logoHierarchy").deleteRow(1);

    //Unhide plus button for logo
    document.getElementById("logoPlusButton").style.setProperty("visibility", "visible");
}

export function toggleLogoVisibility()
{
    //Call Editor manager function
    EditorManagerObj.changeLogoVisibility();
}

// ----------------------- Shapes ----------------------------------------

//Function deticated to creating shapes based on user input
var addShapeToScreenButton = document.getElementById("shapeSubmit");
addShapeToScreenButton.addEventListener("click", requestCreateShape);

var ShapeArray=[];

var ShapeStartArray=[];
var ShapeStartIndex=0;;

var ShapeEndArray=[];
var ShapeEndIndex=0;

function requestCreateShape()
{
    //Grab all the values from the input fields in the pop-up
    let shapeName = document.getElementById("shapeName").value;
    let shapeWidth = document.getElementById("shapeWidth").value;
    let shapeHeight = document.getElementById("shapeHeight").value;
    let shapeFill_color = document.getElementById("shapeFill").value;
    let shapeStroke = document.getElementById("shapeStroke").value;
    let shapeStrokeWidth = document.getElementById("shapeStrokeWidth").value;
    let shapeX = 1050/2;
    let shapeY = 500/2;
    let shapeSides = document.getElementById("shapeSides").value;
    let shapeAnimation_type = document.getElementById("shapeAnimation").value;
    let shapeOpacity = document.getElementById("shapeOpacity").value;
    let shapeStartTime = document.getElementById("shapeStart-Time").value;
    let shapeEndTime = document.getElementById("shapeEnd-Time").value;
    let shapeType = document.getElementById("shapeType").value;
    let shapeRadius = document.getElementById("shapeRadius").value;
    let shapeAmount = document.getElementById("shapeAmount").value;
    let shapeFile = "";

    if(shapeType=="Image" && document.getElementById("shapeImage").files[0]!=undefined)
    {
        shapeFile = document.getElementById("shapeImage").files[0];
    }

    //Create for loop based on amount
    for(var i=0; i<shapeAmount; i++)
    {
        var shapeNameInput; 

        //Generate Name
        if(i!=0) //Shapes will now have number next to original name
        {
            shapeNameInput = shapeName + "-" + i;   
        }
        else //First shape will have the origanl name with no number
        {
            shapeNameInput = shapeName;
        }

        //Call create shape
        var errorFound = EditorManagerObj.createShape(shapeNameInput, shapeWidth, shapeHeight, shapeFill_color, shapeStroke, shapeStrokeWidth, shapeX, shapeY, shapeSides, shapeAnimation_type, shapeOpacity, shapeStartTime, shapeEndTime, shapeType, shapeRadius, shapeFile);

        if(errorFound != true)
        {
            let table = document.getElementById("shapeTableBody"); //document.getElementById("shapeHierarchy");

            let template = `
                <tr id="addedShapeRow${shapeNameInput}" >
                    <td id="editShape " style="border: 1px solid black;">
                        <button id="editShapeButton${shapeNameInput}" style="background-color: transparent; border: none; max-width: 50px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" onclick="showEditShapeSection(this.parentNode.parentNode, '${shapeNameInput}', '${shapeType}')" style="background-color: white; border: none;">${shapeNameInput}</button>
                    </td>
                    <td id="addedShapeVisible" style="border: 1px solid black;">
                        <button id="addedShapeNameButton${shapeNameInput}" onclick="requestShapeVisibility('${shapeNameInput}')" style="background-color: transparent; border: none;"><img style="width: 26px;
                        height: 26px;" src='/LoginMedia/EyeShow.png' ></button>
                    </td>
                    <td id="deleteShape" style="border: 1px solid black;">
                        <button id="deleteShapeButton${shapeNameInput}" onclick="requestDeleteShape('${shapeNameInput}')" style="background-color: transparent; border: none;"><img src='/EditorMedia/TrashCan.png' style="width: 26px;
                        height: 26px; "></button>
                    </td>
                </tr>
            `;

            table.innerHTML = template + table.innerHTML;

            ShapeArray= EditorManagerObj.getShapeArray();
            ShapeStartArray = EditorManagerObj.getShapeStartArray();
            ShapeEndArray = EditorManagerObj.getShapeEndArray();
        }
        else
        {
            alert('Duplicate found:' + shapeNameInput +'. Use a different name.');
        }
    }
}

export function requestDeleteShape(shapeName)
{
    EditorManagerObj.deleteShape(shapeName);

    document.getElementById("shapeHierarchy").deleteRow(document.getElementById("addedShapeRow"+shapeName).rowIndex);

    ShapeArray = EditorManagerObj.getShapeArray();
    ShapeStartArray = EditorManagerObj.getShapeStartArray();
    ShapeEndArray = EditorManagerObj.getShapeEndArray();
}

export function requestShapeVisibility(shapeName)
{
    var shape = EditorManagerObj.getShapeObject(shapeName).getKonvaShape();

    EditorManagerObj.modifyShapeSight(shapeName);
}

let activeRow = null;

// requests the shape object from the Model, then shows the properties section accordingly
export function showEditShapeSection(row, shapeName, shapeType)
{
    if (activeRow) {
        activeRow.style.backgroundColor = "";
    }

    row.style.backgroundColor = "lightblue";

    activeRow = row;

    //Find the ShapeObject given the shapeNAme
    var ShapeObject = EditorManagerObj.getShapeObject(shapeName);

    //The Konva shape
    var shape = ShapeObject.getKonvaShape();

    //Hid any other pop ups in the properties section
    document.getElementById("editBackgroundPopUp").style.setProperty("display", "none"); 
    document.getElementById("lyricEditPopUp").style.setProperty("display", "none");
    document.getElementById("editLogoPopUp").style.setProperty("display", "none");
    document.getElementById("overlayPopUp").style.setProperty("display", "none");

    //Display the edit popup if not already
    document.getElementById("editShapePopUp").style.setProperty("display", "block");

    //Empty the input field for imageShape
    document.getElementById('editShapeFile').value = '';

    //Check what type of shape we selected
    if(ShapeObject.getShapeType()=="Rectangle")
    {
        //Hide the section not being used if not already (Polygon and Image)
        document.getElementById("editPolygonValues").style.setProperty("display", "none");
        document.getElementById("imageValues").style.setProperty("display", "none");

        //Load the values into the exclusive rectangle inputs and display them
        document.getElementById("editShapeWidth").value = shape.getAttr("width");
        document.getElementById("editShapeHeight").value = shape.getAttr("height");

        //Set the width and height sliders to the right postion
        document.querySelector('.editShapeWidthRange').value = shape.getAttr("width");
        document.querySelector('.editShapeHeightRange').value = shape.getAttr("height");

        document.getElementById("editRectangleValues").style.setProperty("display", "block");

        //Display the border and fill options
        document.getElementById("editBorder&FillColors").style.setProperty("display", "block");
    }
    else if(ShapeObject.getShapeType()=="Polygon")
    {
        //Hide the section not being used if not already (Rectangle and Image)
        document.getElementById("editRectangleValues").style.setProperty("display", "none");
        document.getElementById("imageValues").style.setProperty("display", "none");

        //Load the values into the exclusive polygon inputs and display them
        document.getElementById("editShapeSides").value = shape.getAttr("sides");
        document.getElementById("editShapeRadius").value = shape.getAttr("radius");

        document.getElementById("editPolygonValues").style.setProperty("display", "block");

        //Set the radius slider to the right postion
        document.querySelector('.editShapeRadiusRange').value = shape.getAttr("radius");

        //Display the border and fill options
        document.getElementById("editBorder&FillColors").style.setProperty("display", "block");
    }
    else if(ShapeObject.getShapeType()=="Image")
    {
        //Hide the section not being used if not already (Polygon and Border/Fill Color)
        document.getElementById("editPolygonValues").style.setProperty("display", "none");
        document.getElementById("editBorder&FillColors").style.setProperty("display", "none");

        document.getElementById("editShapeWidth").value = shape.getAttr("width");
        document.getElementById("editShapeHeight").value = shape.getAttr("height");

        //Set the width and height sliders to the right postion
        document.querySelector('.editShapeWidthRange').value = shape.getAttr("width");
        document.querySelector('.editShapeHeightRange').value = shape.getAttr("height");

        document.getElementById("editRectangleValues").style.setProperty("display", "block");
        document.getElementById("imageValues").style.setProperty("display", "block");

        //Show the fileInput
    }

    //Populate and display the rest of the other inputs
    document.getElementById("editShapeName").value = shape.getAttr("name");

    if(shapeType != "Image")
    {
        document.getElementById("editShapeFill").value = shape.getAttr("fill");
        document.getElementById("editShapeStroke").value = shape.getAttr("stroke");
        document.getElementById("editShapeStrokeWidth").value = shape.getAttr("strokeWidth");
    }
    
    document.getElementById("editShapeX").value = Math.round(shape.getAttr("x"));

    document.getElementById("editShapeY").value = Math.round(shape.getAttr("y"));

    document.getElementById("editShapeOpacity").value = shape.getAttr("opacity");

    //Select the anim type of the current shape in selection
    var optionsList = document.getElementById('editShapeAnimation').options; //Iterate though anim options list to find the value
    for(let i=0; i < optionsList.length; i++)
    {
        if(optionsList[i].value==ShapeObject.getAnimationType())
        {
            document.getElementById('editShapeAnimation').selectedIndex = i;
        }
    }

    //Update the opcaity label to mathc the slider vlaue
    const shapeEditOpacityOutput = document.getElementById("editShapeOpacityValue");
    const shapeEditOpacityInput = document.getElementById("editShapeOpacity");

    //Have label display the starting value
    shapeEditOpacityOutput.innerText = shapeEditOpacityInput.value;

    // When you move to a diffrent value in the range update the label to current value
    shapeEditOpacityInput.addEventListener("input", (event) => {
        shapeEditOpacityOutput.innerText = event.target.value;
    });

    document.getElementById("editShapeStartTime").value = ShapeObject.getStartTime();//ShapeArray[ShapeArray.findIndex(p=>p.shapeName == shapeName)].shapeStartTime;
    document.getElementById("editShapeEndTime").value = ShapeObject.getEndTime();//ShapeArray[ShapeArray.findIndex(p=>p.shapeName == shapeName)].shapeEndTime;

    //Have the time sliders move to right posistion based on timestamps
    document.getElementById("editShapeStartTimeSlider").value = convertTimestampToSeconds(ShapeObject.getStartTime());
    document.getElementById("editShapeEndTimeSlider").value = convertTimestampToSeconds(ShapeObject.getEndTime());
    
    //Have a save button
    document.getElementById("saveChangeButton").onclick = function() {
        row.parentNode.parentNode.style.backgroundColor = ""; 
        requestSaveShapeChanges(ShapeObject.getName(), shapeType)
    };
}



function convertTimestampToSeconds(timeStamp)
{
    //Get the Mins
    var minutes = timeStamp.slice(0,2);
    minutes = parseInt(minutes);

    //Get Seconds
    var seconds = timeStamp.slice(3, 5);
    seconds = parseInt(seconds);
    
    //Get deci-seconds
    var deciSeconds = timeStamp.slice(6,7);
    deciSeconds = parseInt(deciSeconds);

    var totalTime = (60 * minutes) + seconds + (deciSeconds * 0.1);

    return totalTime;
}

export function requestSaveShapeChanges(shapeName, shapeType)
{
    //Pass all the attributes entered in the text fileds to EditorManagerObj.saveShapeChanges
    let newShapeName = document.getElementById("editShapeName").value
    let shapeWidth = document.getElementById("editShapeWidth").value;
    let shapeHeight = document.getElementById("editShapeHeight").value;
    let shapeFill_color = document.getElementById("editShapeFill").value;
    let shapeStroke = document.getElementById("editShapeStroke").value;
    let shapeStrokeWidth = document.getElementById("editShapeStrokeWidth").value;
    let shapeX = document.getElementById("editShapeX").value;
    let shapeY = document.getElementById("editShapeY").value;
    let shapeSides = document.getElementById("editShapeSides").value;
    let shapeAnimation_type = document.getElementById("editShapeAnimation").value;
    let shapeOpacity = document.getElementById("editShapeOpacity").value;
    let shapeStartTime = document.getElementById("editShapeStartTime").value;
    let shapeEndTime = document.getElementById("editShapeEndTime").value;
    let shapeRadius = document.getElementById("editShapeRadius").value;
    let shapeFile = "";

    //Check if shapeFile is reciving new file input
    if(shapeType=="Image" && document.getElementById("editShapeFile").files[0]!=undefined)
        shapeFile = document.getElementById("editShapeFile").files[0];

    EditorManagerObj.saveShapeChanges(shapeName, shapeType, newShapeName, shapeWidth, shapeHeight, shapeFill_color, shapeStroke, shapeStrokeWidth, shapeX, shapeY, shapeSides, shapeAnimation_type, shapeOpacity, shapeStartTime, shapeEndTime, shapeRadius, shapeFile);

    //Update the name in the row
    document.getElementById("editShapeButton" + shapeName).innerHTML = document.getElementById("editShapeName").value;
    document.getElementById("addedShapeRow" + shapeName).id = "addedShapeRow" + document.getElementById("editShapeName").value;

    //Reasign the onclick and id of editShapeButton to the new name of the shape 
    document.getElementById("editShapeButton" + shapeName).setAttribute("onClick", `showEditShapeSection(this.parentNode.parentNode,'${document.getElementById("editShapeName").value}','${shapeType}')`);
    document.getElementById("editShapeButton" + shapeName).id = "editShapeButton" + document.getElementById("editShapeName").value;

    //Reassign the new name to the shapeVisibilitybutton
    document.getElementById("addedShapeNameButton" + shapeName).setAttribute("onClick", `requestShapeVisibility('${document.getElementById("editShapeName").value}')`);
    document.getElementById("addedShapeNameButton" + shapeName).id = "addedShapeNameButton" + document.getElementById("editShapeName").value;

    //Reassign the new name to the delete button
    document.getElementById("deleteShapeButton" + shapeName).setAttribute("onClick", `requestDeleteShape('${document.getElementById("editShapeName").value}')`);
    document.getElementById("deleteShapeButton" + shapeName).id = "deleteShapeButton" + document.getElementById("editShapeName").value;

    ShapeArray = EditorManagerObj.getShapeArray();
    ShapeStartArray = EditorManagerObj.getShapeStartArray();
    ShapeEndArray = EditorManagerObj.getShapeEndArray();
}



// ----------------------- Lyrics ----------------------------------------
//Function dedicated to creating shapes based on user input
var addLyrics = document.getElementById("lyricSubmit");
addLyrics.addEventListener("click", requestCreateLyrics);

var lyricArray=[];
var text;
var indexVal = -1;

//Populates the array with what the user has typed in and changes the text's properties
function requestCreateLyrics () {
    //Grab the values from the text area in the pop-up
    let lyricsTextAreaStuff = document.getElementById("lyricsTextArea").value;
    let lyricBackgroundColor = "";

    var lyricsX = 1050/2;
    var lyricsY = 500/2;
    var FontType = document.getElementById("lyricFontType").value;
    var FontSize = document.getElementById("lyricFontSize").value;
    var FontColor = document.getElementById("lyricFontColor").value;
    var lyricsBackgroundSelection = document.getElementsByName("lyricBackground");

    //Grab the radio buttons and check if the user had selected a colored background
    if(lyricsBackgroundSelection[1].checked)
        lyricBackgroundColor = document.getElementById("lyricbackgroundColor").value;

    //Call Editor manager to create Lyrics object
    EditorManagerObj.createLyrics(lyricsTextAreaStuff, lyricBackgroundColor, FontColor, FontSize, FontType, lyricsX, lyricsY);

    //Create Row in hierarchy
    let table = document.getElementById("lyricHierarchy");
    
    let template = `
        <tr id="addedLyricRow">
            <td id="addedLyricName" style="border: 1px solid black;">
                <button id="showLyricButton" onclick="requestShowEditLyricSection()" style="background-color: white; border: none; white-space: nowrap; overflow: hidden;">Lyrcis</button>
            </td>
            <td id="addedLyricVisible" style="border: 1px solid black;">
                <button class="addedLyricNameButton" onclick="modifyLyricSight()" style="background-color: white; border: none;"><img style="width: 26px;
                height: 26px;" src='/LoginMedia/EyeShow.png' ></button>
            </td>
            <td id="deleteLyric" style="border: 1px solid black;">
                <button id="deleteLyricButton" onclick="requestDeleteLyric()" style="background-color: white; border: none;"><img src='/EditorMedia/TrashCan.png' style="width: 26px;
                height: 26px; "></button>
            </td>
        </tr>
    `;
    
    table.innerHTML += template;

    //Obtain values related to lyrics object
    lyricArray = EditorManagerObj.getLyricArray();
    text = EditorManagerObj.getTextObject();
    indexVal=-1;
}

export function requestSaveLyricsChanges()
{
    //Obtain all the values in the lyric edit pop-up
    let editFontColor = document.getElementById("editlyricFontColor").value;
    let editFontStyle = document.getElementById("editlyricFontType").value;
    let editLyricContent = document.getElementById("editLyricsTextArea").value;
    let editFontSize = document.getElementById("editlyricFontSize").value;
    let editBackgroundColorOption = document.getElementsByName("lyricEditBackground")[0].checked;  
    let editBackgroundColor = document.getElementById("lyricEditBackgroundColor").value;

    //Call function
    EditorManagerObj.saveLyricChanges(editFontColor, editFontStyle, editLyricContent, editFontSize, editBackgroundColorOption, editBackgroundColor);

    //Grab the new values for lyric array from editor manager
    lyricArray = EditorManagerObj.getLyricArray();
}

export function requestShowEditLyricSection()
{
    //Hide other pop-ups if applicable
    document.getElementById("editShapePopUp").style.setProperty("display", "none");
    document.getElementById("editBackgroundPopUp").style.setProperty("display", "none");
    document.getElementById("editLogoPopUp").style.setProperty("display", "none");
    document.getElementById("overlayPopUp").style.setProperty("display", "none");

    //Display lyric pop-up
    document.getElementById("lyricEditPopUp").style.setProperty("display", "block");

    //Populate the text area with values from lyricArray
    document.getElementById("editLyricsTextArea").value = lyricArray[0];

    for(var i=1; i<lyricArray.length; i++)
    {
        document.getElementById("editLyricsTextArea").value = document.getElementById("editLyricsTextArea").value + "\n~~~\n" + lyricArray[i];
    }

    //Select the current font type from the font-type dropdown
    var fontOptionsList = document.getElementById('editlyricFontType').options; //Iterate though anim options list to find the value
    for(let i=0; i < fontOptionsList.length; i++)
    {
        if(fontOptionsList[i].value==text.getAttr('fontFamily'))
        {
            document.getElementById('editlyricFontType').selectedIndex = i;
        }
    }

    //Populate the font-size field
    document.getElementById("editlyricFontSize").value= text.getAttr('fontSize')

    //Populate the font-color field
    document.getElementById("editlyricFontColor").value = text.getAttr('fill'); 

    //Check if the BG is not selected. If it is have radio button set to enable and ppluate bg color field
    var lyricRadioButton = document.getElementsByName("lyricEditBackground"); 

    if(EditorManagerObj.getLyricObject().getKonvaBackground().getAttr('fill')=="")
    {
        //Have background option be set to disable
        lyricRadioButton[0].checked = true;

        //Hide BG color
        document.getElementById("lyricEditBackgroundOption").style.setProperty("display", "none");
    }
    else
    {
        //Have background option be set to enable
        lyricRadioButton[1].checked = true;

        //Assign a value to BG color
        document.getElementById("lyricEditBackgroundColor").value = EditorManagerObj.getLyricObject().getKonvaBackground().getAttr('fill');

        //Show BG color
        document.getElementById("lyricEditBackgroundOption").style.setProperty("display", "block");
    }

    document.getElementById("saveLyricsButton").onclick = function() {requestSaveLyricsChanges()};
}

//Removes lyric object from project
export function requestDeleteLyric(){

    //Call Editor Manager
    EditorManagerObj.removeLyrics();

    //Remove the row from hierarchy
    document.getElementById("lyricHierarchy").deleteRow(1);

    //Set the values to back to default
    lyricArray = EditorManagerObj.getLyricArray();
    indexVal=-1;

    //Redisplay the plus button for lyric
    document.getElementById("lyricsPlusButton").style.setProperty("visibility", "visible");
}

//Hides the lyric object in the stage
export function modifyLyricSight()
{
    EditorManagerObj.changeLyricVisibility();
}


// -------------------------- Background --------------------------------------
var imageCont = document.getElementById('imageContent'); //Used to acces the image element and manipulate it
var videoCont = document.getElementById('videoContent');
videoCont.muted=true;

var backgroundArray=[];
var backgroundArrayIndex=0;

let submitFile = document.getElementById('fileSubmit');
submitFile.addEventListener("click", requestCreateBackground);

function requestCreateBackground(){

    //Grab the inputed file and 
    var BackgroundFileInput = URL.createObjectURL(document.getElementById('imgInput').files[0]);
    var fileName = document.getElementById('imgInput').files[0].name;
    let backgroundStartTime = document.getElementById("backgroundStart").value;

    //Create background using editor manager
    EditorManagerObj.createBackground(BackgroundFileInput, fileName, backgroundStartTime);

    //Store the file user inputed
    EditorManagerObj.getBackgroundObject(fileName).theFile = document.getElementById('imgInput').files[0];

    let table = document.getElementById("backgroundHierarchy");
    
    let template = `
        <tr id="addedBackgroundRow${fileName}" >
            <td id="addedBackgroundName" style="border: 1px solid black;">
                <button id="showBackgroundButton${fileName}" onclick="requestShowEditBackgroundSection('${fileName}')" style="background-color: white; border: none; width: 70px; white-space: nowrap; overflow: hidden;">${fileName}</button>
            </td>
            <td id="addedBackgroundVisible" style="border: 1px solid black;">
                <button class="addedBackgroundNameButton" onclick="modifyBackgroundSight()" style="background-color: white; border: none;"><img style="width: 26px;
                height: 26px;" src='/LoginMedia/EyeShow.png' ></button>
            </td>
            <td id="deleteBackground" style="border: 1px solid black;">
                <button id="deleteBackgroundButton${fileName}" onclick="requestDeleteBackground('${fileName}')" style="background-color: white; border: none;"><img src='/EditorMedia/TrashCan.png' style="width: 26px;
                height: 26px; "></button>
            </td>
        </tr>
    `;
    
    table.innerHTML += template;

    //Get the new backgroundArray
    backgroundArray = EditorManagerObj.getBackgroundArray();
}

export function requestShowEditBackgroundSection(fileName)
{
    var backgroundObjectFound;
    
    //Make sure the file input of a prevous edit is gone 
    document.getElementById('editFileInput').value = '';

    //Hide the shapePop or others if there not already
    document.getElementById("editShapePopUp").style.setProperty("display", "none");
    document.getElementById("lyricEditPopUp").style.setProperty("display", "none");
    document.getElementById("editLogoPopUp").style.setProperty("display", "none");
    document.getElementById("overlayPopUp").style.setProperty("display", "none");

    //Display backgroundpop up if not already
    document.getElementById("editBackgroundPopUp").style.setProperty("display", "block");

    //Find the background object to update
    backgroundObjectFound = EditorManagerObj.getBackgroundObject(fileName);

    //Move the time slider to the correct position
    document.getElementById("editBGTimeSlider").value = convertTimestampToSeconds(backgroundObjectFound.backgroundStartTime);

    console.log("BG time is " + convertTimestampToSeconds(backgroundObjectFound.backgroundStartTime));

    //Populate the fields with the the objects properties
    document.getElementById('editStartTime').value = backgroundObjectFound.backgroundStartTime;
    
    //Change the function parementers in button for fileName
    document.getElementById("saveEditBackgroundButton").onclick = function() {requestSaveBackgroundChanges(backgroundObjectFound.fileName)};
}

export function requestDeleteBackground(fileName)
{
    EditorManagerObj.deleteBackground(fileName);

     //Delete the row of the file
     document.getElementById("backgroundHierarchy").deleteRow(document.getElementById("addedBackgroundRow"+fileName).rowIndex);
    
     //Set the filepath of imageCont and videoCont to be empty so that the background stops showing if it's currently showing when being deleted
     imageCont.src = '';
     videoCont.src = '';

     //Get the new backgroundArray
     backgroundArray = EditorManagerObj.getBackgroundArray();
}

export function requestSaveBackgroundChanges(fileName)
{
    let backgroundFileInput = document.getElementById('editFileInput').files[0];

    let backgroundFileContent;
    let backgroundStartTime = document.getElementById("editStartTime").value;
    let backgroundFileInputName;
    let fileInputLength = document.getElementById('editFileInput').files.length;

    //Check if there is a file in the input
    if(fileInputLength==1)
    {
        backgroundFileInputName = backgroundFileInput.name;
        backgroundFileContent = URL.createObjectURL(backgroundFileInput);

        //Store the file user inputed
        EditorManagerObj.getBackgroundObject(fileName).theFile = backgroundFileInput;
    }

    EditorManagerObj.saveBackgroundChanges(fileName, backgroundStartTime, backgroundFileContent, backgroundFileInputName, fileInputLength);

    
    if(fileInputLength != 0)
    {
        //Update the file name
        document.getElementById("showBackgroundButton" + fileName).innerHTML = backgroundFileInput.name;
            
        //Update the functions with the new file name
        document.getElementById("showBackgroundButton" + fileName).setAttribute("onClick", `requestShowEditBackgroundSection('${backgroundFileInput.name}')`);
        document.getElementById("showBackgroundButton" + fileName).id = "showBackgroundButton" +backgroundFileInput.name;
        
        document.getElementById("deleteBackgroundButton" + fileName).setAttribute("onClick", `requestDeleteBackground('${backgroundFileInput.name}')`);
        document.getElementById("deleteBackgroundButton" + fileName).id = "deleteBackgroundButton" + backgroundFileInput.name;

        //Update the tr id 
        document.getElementById("addedBackgroundRow" + fileName).id = "addedBackgroundRow" + backgroundFileInput.name;
    }

    //Get the new backgroundArray
    backgroundArray = EditorManagerObj.getBackgroundArray();
}

//********************************   Overlays   **************************************/
let submitOverlay = document.getElementById('overlaySubmit');
submitOverlay.addEventListener("click", requestCreateOverlay);

var overlayArray=[];

var overlayStartArray=[];
var overlayStartIndex=0;;

var overlayEndArray=[];
var overlayEndIndex=0;

function requestCreateOverlay(){
    //Get the inputs from the fields
    let opacity = document.getElementById("overlayOpacity").value;
    let name = document.getElementById("overlayName").value;
    let overlayOption = document.getElementById("overlayOption").value;
    let startTime = document.getElementById("overlayStart").value;
    let endTime = document.getElementById("overlayEnd").value;

    //Call Editor Manager
    var result = EditorManagerObj.createOverlay(name, opacity, overlayOption, startTime, endTime);

    if(result!=true)
    {
        //Add the row to table
        let table = document.getElementById("overlayHierarchy"); //document.getElementById("shapeHierarchy");

        let template = `
        <tr id="${name}" >
            <td id="addedOverlayName" style="border: 1px solid black;">
                <button id="showOverlayButton${name}" onclick="requestShowEditOverlaySection('${name}')" style="background-color: white; border: none; width: 70px; white-space: nowrap; overflow: hidden;">${name}</button>
            </td>
            <td id="addedOverlayVisible" style="border: 1px solid black;">
                <button id="visibilityOverlayButton${name}" onclick="modifyOverlaySight('${name}')" style="background-color: white; border: none;"><img style="width: 26px;
                height: 26px;" src='/LoginMedia/EyeShow.png' ></button>
            </td>
            <td id="deleteOverlay" style="border: 1px solid black;">
                <button id="deleteOverlayButton${name}" onclick="requestDeleteOverlay('${name}')" style="background-color: white; border: none;"><img src='/EditorMedia/TrashCan.png' style="width: 26px;
                height: 26px; "></button>
            </td>
        </tr>
        `;

        table.innerHTML += template;

        overlayArray = EditorManagerObj.getOverlayArray();
        overlayStartArray = EditorManagerObj.getOverlayStartArray();
        overlayEndArray = EditorManagerObj.getOverlayEndArray();
    }
    else
    {
        alert(name + " is already used");
    }
}

export function requestDeleteOverlay(name)
{
    //Delete the overlay
    EditorManagerObj.deleteOverlay(name);

    //Remove the row from table
    document.getElementById("overlayHierarchy").deleteRow(document.getElementById(name).rowIndex);

    //Get the newly updated arrays
    overlayArray = EditorManagerObj.getOverlayArray();
    overlayStartArray = EditorManagerObj.getOverlayStartArray();
    overlayEndArray = EditorManagerObj.getOverlayEndArray();
}

export function requestShowEditOverlaySection(name)
{
    //Hide the other pop ups
    document.getElementById("editShapePopUp").style.setProperty("display", "none");
    document.getElementById("lyricEditPopUp").style.setProperty("display", "none");
    document.getElementById("editLogoPopUp").style.setProperty("display", "none");
    document.getElementById("editBackgroundPopUp").style.setProperty("display", "none");
    
    //Show the overlay pop-up
    document.getElementById("overlayPopUp").style.setProperty("display", "block");

    //Find the overlay object 
    var overlayObject = EditorManagerObj.getOverlayObject(name);

    //Populate the input fields with the overlay objects values
    document.getElementById("editOverlayName").value = overlayObject.getName();
    document.getElementById("editOverlayOpacity").value = overlayObject.getOpacity();
    document.getElementById("editOverlayOpacityValue").innerHTML = overlayObject.getOpacity();

    document.getElementById("editOverlayStart").value = overlayObject.getStartTime();
    document.getElementById("editOverlayEnd").value = overlayObject.getEndTime();
    
    //Ensure that the time sliders are at the right position
    document.getElementById("editOverlayStartTimeSlider").value = convertTimestampToSeconds(overlayObject.getStartTime());
    document.getElementById("editOverlayEndTimeSlider").value = convertTimestampToSeconds(overlayObject.getEndTime());

    //Select the current font type from the overlay-type dropdown
    var overlayOptionsList = document.getElementById('editOverlayOption').options; //Iterate though anim options list to find the value
    for(let i=0; i < overlayOptionsList.length; i++)
    {
        if(overlayOptionsList[i].value==overlayObject.getOverlayOption())
        {
            document.getElementById('editOverlayOption').selectedIndex = i;
        }
    }

    //Have a save button
    document.getElementById("saveOverlayButton").onclick = function() { 
        requestSaveOverlayChanges(overlayObject.getName());
    };
}

export function requestSaveOverlayChanges(name)
{
    //Get the values from the overlay Popup
    let newOverlayName = document.getElementById("editOverlayName").value;
    let overlayOpacity = document.getElementById("editOverlayOpacity").value;
    let overlayOption = document.getElementById("editOverlayOption").value;
    let overlayStartTime = document.getElementById("editOverlayStart").value;
    let overlayEndTime = document.getElementById("editOverlayEnd").value;

    //Call Editor manager to save changes
    EditorManagerObj.saveOverlayChanges(name, newOverlayName, overlayOpacity, overlayOption, overlayStartTime, overlayEndTime);

    //Update table with new name
    document.getElementById("showOverlayButton" + name).innerHTML = newOverlayName;
    document.getElementById(name).id = newOverlayName;

    //Update the onclick functions
    document.getElementById("showOverlayButton" + name).setAttribute("onClick", `requestShowEditOverlaySection('${newOverlayName}')`);
    document.getElementById("showOverlayButton" + name).id = "showOverlayButton" + newOverlayName;

    document.getElementById("visibilityOverlayButton" + name).setAttribute("onClick", `modifyOverlaySight('${newOverlayName}')`);
    document.getElementById("visibilityOverlayButton" + name).id = "visibilityOverlayButton" + newOverlayName;

    document.getElementById("deleteOverlayButton" + name).setAttribute("onClick", `requestDeleteOverlay('${newOverlayName}')`);
    document.getElementById("deleteOverlayButton" + name).id = "deleteOverlayButton" + newOverlayName;

    //Get the arrays again
    overlayArray = EditorManagerObj.getOverlayArray();
    overlayStartArray = EditorManagerObj.getOverlayStartArray();
    overlayEndArray = EditorManagerObj.getOverlayEndArray();
}



//********************************Event Listners************************************** 
//Keyboard Event Listner
let paused = true;

function keyboardEnabled(event) {

    //Check if the lyric exists
    if(lyricArray.length != 0)
    {
        var FadeInLyric = new Konva.Tween({
            node: EditorManagerObj.getLyricObject().getKonvaTextBox(), 
            duration: 0.15,
            opacity: 0,
            onFinish: function(){
                text.setAttr('text', lyricArray[indexVal]);
                //Update the offset of text box
                EditorManagerObj.updateTextBoxOffset();
                FadeInLyric.reverse();
                FadeInLyric.reset();
            },
        });
    }

    switch (event.key) {
        //Display the next lyric
        case "ArrowRight":
            if (indexVal < lyricArray.length - 1) {

                indexVal += 1;

                FadeInLyric.play();
            }

            break;

        //Display the previous lyric
        case "ArrowLeft":
            if (indexVal >= 1) {
                indexVal -= 1;
                FadeInLyric.play();
            }
            
            break;

        //Pause and play the project
        case "p":
            //Flip the state 
            paused = !paused;

            if (paused == true) //If we are pausing stop the timer, audio, video(if we are currently using it as background)
            {
                document.getElementById('Play&PauseIcon').src = "/EditorMedia/play-icon.png";

                audio.pause();

                if (videoCont.src != "")
                    videoCont.pause();
            }
            else //If we are playing start the timer, video, and audio layers
            {
                document.getElementById('Play&PauseIcon').src = "/EditorMedia/pause-icon.png";

                audio.play();

                if (videoCont.src != "")
                    videoCont.play();
            }

            break;

        // restart button
        case "r":
            //Set the timer
            audio.currentTime = 0;

            //Handle the background
            if (videoCont.src !== "") {
                videoCont.currentTime = 0;
            }

            imageCont.src = "";
            videoCont.src = "";

            backgroundArrayIndex=0;

            //Set the shape start and end index to 0
            ShapeStartIndex=0;
            ShapeEndIndex=0;

            //Hide all the shapes
            EditorManagerObj.hideAllShapes();

            //Hide the overlay layer
            document.getElementById("animatedBackdrop").style.setProperty("visibility", "hidden");
            
            break;

        // full screen
        case "f":
            toggleFullScreen();
            break;

        //If any other button do nothing
        default:
            return;
    }
}

function handler(event)
{
    keyboardEnabled(event);
}

export function createKeyboardListener()
{
    document.addEventListener('keydown', handler);
}


export function disableKeyboardListner(){
    document.removeEventListener('keydown', handler);
}



// Add event listeners for play, pause, and restart buttons
document.getElementById('playVideo').addEventListener('click', function(event) {
    // Handle play button click
    event.preventDefault();
    paused = false;
    audio.play();
    
    if (videoCont.src !== "") {
        videoCont.play();
    }
});

document.getElementById('pauseVideo').addEventListener('click', function(event) {
    // Handle pause button click
    event.preventDefault();
    paused = true;
    audio.pause();

    if (videoCont.src !== "") {
        videoCont.pause();
    }
});

document.getElementById("rightArrowButton").addEventListener('click', function(event){
    event.preventDefault();

    if(lyricArray.length !=0)
    {
        var FadeInLyric = new Konva.Tween({
            node: EditorManagerObj.getLyricObject().getKonvaTextBox(), 
            duration: 0.25,
            opacity: 0,
            onFinish: function(){
                text.setAttr('text', lyricArray[indexVal]);
                 //Update the offset of text box
                EditorManagerObj.updateTextBoxOffset();
                FadeInLyric.reverse();
            },
        });
    }

    if (indexVal < lyricArray.length - 1) {
        indexVal += 1;

        FadeInLyric.play();
    }
});

document.getElementById("leftArrowButton").addEventListener('click', function(event){
    event.preventDefault();

    if(lyricArray.length !=0)
    {
        var FadeInLyric = new Konva.Tween({
            node: EditorManagerObj.getLyricObject().getKonvaTextBox(), 
            duration: 0.25,
            opacity: 0,
            onFinish: function(){
                text.setAttr('text', lyricArray[indexVal]);
                 //Update the offset of text box
                EditorManagerObj.updateTextBoxOffset();
                FadeInLyric.reverse();
            },
        });
    }

    if (indexVal >= 1) {
        indexVal -= 1;

        FadeInLyric.play();
    }
});

document.getElementById('Play&PauseButton').addEventListener('click', function(event){
    event.preventDefault();

    //Flip state
    paused = !paused;

    //Change image icon for button
    if(paused!=false) //If set to play mode change to pause icon
    {
        
        document.getElementById('Play&PauseIcon').src = "/EditorMedia/play-icon.png";

        audio.pause();

        if (videoCont.src != "")
            videoCont.pause();
    } 
    else //set to paused mode change to play icon
    {
        document.getElementById('Play&PauseIcon').src = "/EditorMedia/pause-icon.png";

        audio.play();

        if (videoCont.src != "")
            videoCont.play();
    }      
});

document.getElementById('RestartButton').addEventListener('click', function(event){
    // Handle restart button click
    event.preventDefault();
    audio.currentTime = 0;

    if (videoCont.src !== "") {
        videoCont.currentTime = 0;
    }

    imageCont.src = "";
    videoCont.src = "";

    backgroundArrayIndex=0;

    //Set the shape start and end index to 0
    ShapeStartIndex = 0;
    ShapeEndIndex = 0;

    //Hide all the shapes
    EditorManagerObj.hideAllShapes();

    document.getElementById("animatedBackdrop").style.setProperty("visibility", "hidden");
});

document.getElementById('restartVideo').addEventListener('click', function(event) {
    // Handle restart button click
    event.preventDefault();
    audio.currentTime = 0;

    if (videoCont.src !== "") {
        videoCont.currentTime = 0;
    }

    imageCont.src = "";
    videoCont.src = "";

    backgroundArrayIndex=0;

    //Set the shape start and end index to 0
    ShapeStartIndex = 0;
    ShapeEndIndex = 0;

    //Hide all the shapes
    EditorManagerObj.hideAllShapes();
});

//Function to display elements at specific times. Called by setInterval
function updateProjectElements(formattedTime){
    //Change Background content if the upcoming background element's start time mathces the audio time
    if(backgroundArray.length!=0 && backgroundArray[backgroundArrayIndex].backgroundStartTime==formattedTime)
    {
        
        //if the current background elemnt to be displayed is a video load it to video element src
        if(backgroundArray[backgroundArrayIndex].fileName.includes("mp4"))
        {
            imageCont.src = "";

            //Display and play video
            videoCont.src = backgroundArray[backgroundArrayIndex].contentFile;
            videoCont.play();
        }
        //else load content to image src
        else
        {
            //Stop video
            videoCont.src="";
            videoCont.pause();

            //Display image
            imageCont.src = backgroundArray[backgroundArrayIndex].contentFile;
        }
        
        //Increment background index if current index is not at the end of array
        if(backgroundArrayIndex < backgroundArray.length-1)
            backgroundArrayIndex+=1;   
    }

    //*****************Manage Overlays*****************//
    if(overlayStartArray.length!=0 && overlayStartArray[overlayStartIndex].getStartTime()==formattedTime)
    {
        //Load the css file based on overlay option  "[overlayOption].css"
        document.getElementById("overlayOptionCSS").href = "/EditorViews/" + overlayStartArray[overlayStartIndex].getOverlayOption()+".css";

        //Set the overlay layer to the specified opacity
        document.getElementById("animatedBackdrop").style.setProperty("opacity", overlayStartArray[overlayStartIndex].getOpacity());

        //Display the overlay layer
        document.getElementById("animatedBackdrop").style.setProperty("visibility", "visible");

        //Move to the next shape wating to be displayed. Check if we had exceeded the array boundry
        if(overlayStartIndex < overlayStartArray.length-1)
            overlayStartIndex+=1;
    }

    if(overlayEndArray.length!=0 && overlayEndArray[overlayEndIndex].getEndTime()==formattedTime)
    {
        //Hide the overlay layer
        document.getElementById("animatedBackdrop").style.setProperty("visibility", "hidden");

        //Move to the next shape wating to be displayed. Check if we had exceeded the array boundry
        if(overlayEndIndex < overlayEndArray.length-1)
            overlayEndIndex+=1;
    }


    /******************Manage shapes******************/ 
    if(ShapeStartArray.length!=0 && ShapeStartArray[ShapeStartIndex].shapeStartTime==formattedTime) //Display shape when it's start time meets formattedTime
    {
        //Display the shape
        ShapeStartArray[ShapeStartIndex].shape.showKonvaShape();

        //Check if there is any animations for this shape 
        if(ShapeStartArray[ShapeStartIndex].shape.getAnimationType()!="None")
            ShapeStartArray[ShapeStartIndex].shape.startAnimation();

        //Move to the next shape wating to be displayed. Check if we had exceeded the array boundry
        if(ShapeStartIndex < ShapeArray.length-1)
            ShapeStartIndex+=1;
    }

    if(ShapeArray.length!=0 && ShapeEndArray[ShapeEndIndex].shapeEndTime==formattedTime)
    {
        //Hide the shape
        ShapeEndArray[ShapeEndIndex].shape.hideKonvaShape();

        //Stop the shapes animation if applicable
        if(ShapeEndArray[ShapeEndIndex].shapeAnimation!="None")
            ShapeEndArray[ShapeEndIndex].shape.stopAnimation();
        
        //Move to the next shape if it is available
        if(ShapeEndIndex < ShapeArray.length-1)
            ShapeEndIndex+=1;
    }
}

//Declare variables
let audio; // Holds the audio element
let timeDisplay;
let timeSlider;

let startTimeInput;
let startTimeSlider;

let endTimeInput;
let endTimeSlider;

let editShapeStartTimeInput;
let editShapeStartTimeSlider;

let editShapeEndTimeInput;
let editShapeEndTimeSlider;

let startBackgroundTimeSlider;
let startBackgroundTimeInput;

let editStartBGTimeSlider;
let editStartBGTimeInput;

let startOverlayTimeSlider;
let startOverlayInput;

let endOverlayTimeSlider;
let endOverlayTimeInput;

let editEndOverlayTimeSlider;
let editEndOverlayTimeInput;

let editStartOverlayTimeSlider;
let editStartOverlayTimeInput;


// Function to initialize the audio player and time controls
function initAudioPlayer() {
    audio = document.getElementById('musicPlayer');
    timeDisplay = document.getElementById('audioTimestamp');
    timeSlider = document.getElementById('timeSlider');

    startTimeInput = document.getElementById('shapeStart-Time');
    startTimeSlider = document.getElementById('startTimeSlider');

    endTimeInput = document.getElementById('shapeEnd-Time');
    endTimeSlider = document.getElementById('endTimeSlider');

    editShapeStartTimeInput = document.getElementById('editShapeStartTime');
    editShapeStartTimeSlider = document.getElementById('editShapeStartTimeSlider');

    editShapeEndTimeInput = document.getElementById('editShapeEndTime');
    editShapeEndTimeSlider = document.getElementById('editShapeEndTimeSlider');

    startBackgroundTimeSlider = document.getElementById("startBackgroundTimeSlider");
    startBackgroundTimeInput = document.getElementById("backgroundStart");

    editStartBGTimeSlider = document.getElementById("editBGTimeSlider");
    editStartBGTimeInput = document.getElementById("editStartTime");

    startOverlayTimeSlider = document.getElementById("overlayStartTimeSlider");
    startOverlayInput = document.getElementById("overlayStart");

    endOverlayTimeSlider = document.getElementById("overlayEndTimeSlider");
    endOverlayTimeInput = document.getElementById("overlayEnd");

    editEndOverlayTimeSlider = document.getElementById("editOverlayEndTimeSlider");
    editEndOverlayTimeInput = document.getElementById("editOverlayEnd");

    editStartOverlayTimeSlider = document.getElementById("editOverlayStartTimeSlider");
    editStartOverlayTimeInput = document.getElementById("editOverlayStart");

    // Update start and end times when audio metadata is loaded
    audio.addEventListener('loadedmetadata', updateStartEndTimes);

    // Update time display every decisecond (100 milliseconds)
    const updateTimer = setInterval(updateTimerCallback, 10);

    // When audio stops, timer stops
    audio.addEventListener('ended', () => {
        clearInterval(updateTimer);
    });

    // Add event listener to handle slider change
    timeSlider.addEventListener('input', handleTimeSliderChange);

    // Add event listeners for start and end time sliders
    startTimeSlider.addEventListener('input', handleStartTimeSliderChange);
    endTimeSlider.addEventListener('input', handleEndTimeSliderChange);

    //Add even lisnter for start background time 
    startBackgroundTimeSlider.addEventListener('input', handleStartBGTimeSliderChange);

    //Add event listener for overlay start and end time
    startOverlayTimeSlider.addEventListener('input', handleStartOverlayTimeChange);
    endOverlayTimeSlider.addEventListener('input', handleEndOverlayTimeChange);

    //Add event lisnter for edit BG time
    editStartBGTimeSlider.addEventListener('input', handleEditBGStartTimeSliderChange);

    // Add event listeners for edit start and end time sliders
    editShapeStartTimeSlider.addEventListener('input', handleEditStartTimeSliderChange);
    editShapeEndTimeSlider.addEventListener('input', handleEditEndTimeSliderChange);

    //Add event lister for edit start and end time sliders for overlay
    editEndOverlayTimeSlider.addEventListener('input', handleEditTimeSliderOverlayChange);
    editStartOverlayTimeSlider.addEventListener('input', handleEditStartTimeSliderOverlayChange);
}

// Function to update the start and end time inputs and ranges
function updateStartEndTimes() {
    const duration = audio.duration;
    const maxTime = formatTime(duration);

    // Set the max attribute of the sliders
    startTimeSlider.max = endTimeSlider.max = duration;
    editShapeStartTimeSlider.max = editShapeEndTimeSlider.max = duration;

    startBackgroundTimeSlider.max = duration;

    editStartBGTimeSlider.max = duration;

    startOverlayTimeSlider.max = endOverlayTimeSlider.max = duration;

    editStartOverlayTimeSlider.max = editEndOverlayTimeSlider.max = duration;

    // Set the placeholder of the text inputs
    startTimeInput.placeholder = '00:00.0';
    endTimeInput.placeholder = maxTime;
    editShapeStartTimeInput.placeholder = '00:00.0';
    editShapeEndTimeInput.placeholder = maxTime;

    startBackgroundTimeInput.placeholder = '00:00.0';

    editStartBGTimeInput.placeholder = "00:00.0";

    startOverlayInput.placeholder = "00:00.0";
    endOverlayTimeInput.placeholder = maxTime;

    editStartOverlayTimeInput.placeholder = "00:00.0";
    editEndOverlayTimeInput.placeholder = maxTime; 
}

// Function to format time in mm:ss.s format
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const deciseconds = Math.floor((time * 10) % 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${deciseconds.toString().padStart(1, '0')}`;
}

// Timer callback function
function updateTimerCallback() {
    const minutes = Math.floor(audio.currentTime / 60);
    const seconds = Math.floor(audio.currentTime % 60);
    const deciseconds = Math.floor((audio.currentTime * 10) % 10);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${deciseconds.toString().padStart(1, '0')}`;
    timeDisplay.textContent = formattedTime;

    // Update slider position
    const percentage = (audio.currentTime / audio.duration) * 100;
    timeSlider.value = percentage;

    updateProjectElements(formattedTime);
}

// Handle time slider change
function handleTimeSliderChange() {
    const percentage = timeSlider.value;
    const newTime = (percentage / 100) * audio.duration;
    audio.currentTime = newTime;
}

// Handle start BG time slider change
function handleStartBGTimeSliderChange(){
    const startBGTime = formatTime(startBackgroundTimeSlider.value);
    startBackgroundTimeInput.value = startBGTime;
}

function handleStartOverlayTimeChange(){
    const startOverlayTime = formatTime(overlayStartTimeSlider.value);
    startOverlayInput.value = startOverlayTime;
}

function handleEndOverlayTimeChange(){
    const endOverlayTime = formatTime(endOverlayTimeSlider.value);
    endOverlayTimeInput.value = endOverlayTime;
}

function handleEditTimeSliderOverlayChange()
{
    const endEditOverlayTime = formatTime(editEndOverlayTimeSlider.value);
    editEndOverlayTimeInput.value = endEditOverlayTime;
}

function handleEditStartTimeSliderOverlayChange()
{
    const startEditOverlayTime = formatTime(editStartOverlayTimeSlider.value);
    editStartOverlayTimeInput.value = startEditOverlayTime;
}

//Handle edit Start BG time slider change
function handleEditBGStartTimeSliderChange(){
    const editStartBGTime = formatTime(editStartBGTimeSlider.value);
    editStartBGTimeInput.value = editStartBGTime;
}

// Handle start time slider change
function handleStartTimeSliderChange() {
    const startTime = formatTime(startTimeSlider.value);
    startTimeInput.value = startTime;
}

// Handle end time slider change
function handleEndTimeSliderChange() {
    const endTime = formatTime(endTimeSlider.value);
    endTimeInput.value = endTime;
}

// Handle edit start time slider change
function handleEditStartTimeSliderChange() {
    const editStartTime = formatTime(editShapeStartTimeSlider.value);
    editShapeStartTimeInput.value = editStartTime;
}

// Handle edit end time slider change
function handleEditEndTimeSliderChange() {
    const editEndTime = formatTime(editShapeEndTimeSlider.value);
    editShapeEndTimeInput.value = editEndTime;
}

// Initialize the audio player and time controls
initAudioPlayer();

const canvasColumn = document.getElementById('CanvasColumn');

// Function to toggle fullscreen
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        // If not in fullscreen mode, request fullscreen
        if (canvasColumn.requestFullscreen) {
            canvasColumn.requestFullscreen();
        } else if (canvasColumn.mozRequestFullScreen) {
            canvasColumn.mozRequestFullScreen(); // Firefox
        } else if (canvasColumn.webkitRequestFullscreen) {
            canvasColumn.webkitRequestFullscreen(); // Chrome, Safari and Opera
        } else if (canvasColumn.msRequestFullscreen) {
            canvasColumn.msRequestFullscreen(); // IE/Edge
        }
    } else {
        // If in fullscreen mode, exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen(); // Firefox
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen(); // Chrome, Safari and Opera
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen(); // IE/Edge
        }
    }
}




//============================================================================================================
//Ajax request 
$(document).ready(function(){
    //Once page loads in, get all existing data from project
    
    $(function() {
        $("#shapeTableBody").sortable({
            revert: true,

            stop: function(event, ui) {
                //Get the shapeName of the row index
                var rowsArray = document.getElementById("shapeTableBody").rows;
                var row = rowsArray[$(this).data("ui-sortable").currentItem.index()];

                //Get the name of the shape from the row id
                var shapeName = row.id.split("addedShapeRow")[1];
                
                //Call Editor manager to find the shape and assign it layer postion based on row index
                EditorManagerObj.updateShapeZIndex(shapeName, $(this).data("ui-sortable").currentItem.index(), rowsArray.length);
            }

        });
    });
    
/*--------------------------Get Project Data from DB----------------------------- */ 
    $.ajax({
        url: "/loadProjectElementData",
        method: "POST",
    }).done(response => {
        //Response Values from post request
        var shapes = response.shapeImportArray;
      
        //Set the src for the audio element
        document.getElementById('musicPlayer').setAttribute('src', "/" + response.SongFile[0].SongFile);
      
        //Once you get the shapeImportArray call the editor manager createShape function and iterate throguh array
        for(var i=0; i < shapes.length; i++)
        {
            EditorManagerObj.createShape(shapes[i].DesignElement_Name, shapes[i].Width, shapes[i].Height, shapes[i].FillColor, shapes[i].BorderColor, shapes[i].BorderWidth, shapes[i].X, shapes[i].Y, shapes[i].Sides, shapes[i].AnimType, shapes[i].Opacity, shapes[i].StartTime, shapes[i].EndTime, shapes[i].ShapeType, shapes[i].Radius, "/" + shapes[i].filePath);
            let table = document.getElementById("shapeTableBody"); //document.getElementById("shapeHierarchy");

            let template = `
                <tr id="addedShapeRow${shapes[i].DesignElement_Name}" >
                    <td id="editShape " style="border: 1px solid black;">
                        <button id="editShapeButton${shapes[i].DesignElement_Name}" onclick="showEditShapeSection(this.parentNode.parentNode, '${shapes[i].DesignElement_Name}', '${shapes[i].ShapeType}')" style="background-color: transparent; border: none; max-width: 50px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${shapes[i].DesignElement_Name}</button>
                    </td>
                    <td id="addedShapeVisible" style="border: 1px solid black;">
                        <button id="addedShapeNameButton${shapes[i].DesignElement_Name}" onclick="requestShapeVisibility('${shapes[i].DesignElement_Name}')" style="background-color: transparent; border: none;"><img style="width: 26px;
                        height: 26px;" src='/LoginMedia/EyeShow.png' ></button>
                    </td>
                    <td id="deleteShape" style="border: 1px solid black;">
                        <button id="deleteShapeButton${shapes[i].DesignElement_Name}" onclick="requestDeleteShape('${shapes[i].DesignElement_Name}')" style="background-color: transparent; border: none;"><img src='/EditorMedia/TrashCan.png' style="width: 26px;
                        height: 26px; "></button>
                    </td>
                </tr>
            `;

            table.innerHTML = template + table.innerHTML;

            ShapeArray= EditorManagerObj.getShapeArray();
            ShapeStartArray = EditorManagerObj.getShapeStartArray();
            ShapeEndArray = EditorManagerObj.getShapeEndArray();
            // console.log(ShapeArray.length);
        }


        //Create overlay objects with loaded data
        var overlayInputArray = response.overlayImportArray;
        
        for(var i=0; i<overlayInputArray.length; i++)
        {
            //Create overlay object
            EditorManagerObj.createOverlay(overlayInputArray[i].overlayName, overlayInputArray[i].opacity, overlayInputArray[i].overlayOption, overlayInputArray[i].startTime, overlayInputArray[i].endTime);

            //Add the row to table
            let table = document.getElementById("overlayHierarchy");

            let template = `
            <tr id="${overlayInputArray[i].overlayName}" >
                <td id="addedOverlayName" style="border: 1px solid black;">
                    <button id="showOverlayButton${overlayInputArray[i].overlayName}" onclick="requestShowEditOverlaySection('${overlayInputArray[i].overlayName}')" style="background-color: white; border: none; width: 70px; white-space: nowrap; overflow: hidden;">${overlayInputArray[i].overlayName}</button>
                </td>
                <td id="addedOverlayVisible" style="border: 1px solid black;">
                    <button id="visibilityOverlayButton${overlayInputArray[i].overlayName}" onclick="modifyOverlaySight('${overlayInputArray[i].overlayName}')" style="background-color: white; border: none;"><img style="width: 26px;
                    height: 26px;" src='/LoginMedia/EyeShow.png' ></button>
                </td>
                <td id="deleteOverlay" style="border: 1px solid black;">
                    <button id="deleteOverlayButton${overlayInputArray[i].overlayName}" onclick="requestDeleteOverlay('${overlayInputArray[i].overlayName}')" style="background-color: white; border: none;"><img src='/EditorMedia/TrashCan.png' style="width: 26px;
                    height: 26px; "></button>
                </td>
            </tr>
            `;

            table.innerHTML += template;

            overlayArray = EditorManagerObj.getOverlayArray();
            overlayStartArray = EditorManagerObj.getOverlayStartArray();
            overlayEndArray = EditorManagerObj.getOverlayEndArray();
        }


        //Create background objects with loaded data
        var backgroundInputArray = response.backgroundImportArray;

        for(var i=0; i<backgroundInputArray.length; i++)
        {

            //Get the file url for background object
            var backgroundFileLink = "/" + backgroundInputArray[i].file_name;

            //Create background object
            EditorManagerObj.createBackground(backgroundFileLink, backgroundInputArray[i].Name, backgroundInputArray[i].StartTime);

            //Make table row
            let table = document.getElementById("backgroundHierarchy");
    
            let template = `
                <tr id="addedBackgroundRow${backgroundInputArray[i].Name}" >
                    <td id="addedBackgroundName" style="border: 1px solid black;">
                        <button id="showBackgroundButton${backgroundInputArray[i].Name}" onclick="requestShowEditBackgroundSection('${backgroundInputArray[i].Name}')" style="background-color: white; border: none; width: 70px; white-space: nowrap; overflow: hidden;">${backgroundInputArray[i].Name}</button>
                    </td>
                    <td id="addedBackgroundVisible" style="border: 1px solid black;">
                        <button class="addedBackgroundNameButton" onclick="modifyBackgroundSight()" style="background-color: white; border: none;"><img style="width: 26px;
                        height: 26px;" src='/LoginMedia/EyeShow.png' ></button>
                    </td>
                    <td id="deleteBackground" style="border: 1px solid black;">
                        <button id="deleteBackgroundButton${backgroundInputArray[i].Name}" onclick="requestDeleteBackground('${backgroundInputArray[i].Name}')" style="background-color: white; border: none;"><img src='/EditorMedia/TrashCan.png' style="width: 26px;
                        height: 26px; "></button>
                    </td>
                </tr>
            `;
    
            table.innerHTML += template;

            //Get the new backgroundArray
            backgroundArray = EditorManagerObj.getBackgroundArray();
        }

        //Create lyrics with loaded data
        var lyrics = response.lyrics;

        if(lyrics[0]!=undefined) 
        {
            //Create the lyric object with the data
            EditorManagerObj.createLyrics(lyrics[0].TextContent, lyrics[0].BGColor, lyrics[0].FontColor, lyrics[0].FontSize, lyrics[0].FontType, lyrics[0].lyricsX, lyrics[0].lyricsY);

            //Obtain the array of lyrics, set index, and get refrence to text object
            lyricArray = EditorManagerObj.getLyricArray();
            text = EditorManagerObj.getTextObject();
            indexVal=-1;
            
            //Create Lyric row
            let table = document.getElementById("lyricHierarchy");
    
            let template = `
            <tr id="addedLyricRow">
                <td id="addedLyricName" style="border: 1px solid black;">
                    <button id="showLyricButton" onclick="requestShowEditLyricSection()" style="background-color: white; border: none; white-space: nowrap; overflow: hidden;">Lyrics</button>
                </td>
                <td id="addedLyricVisible" style="border: 1px solid black;">
                    <button class="addedLyricNameButton" onclick="modifyLyricSight()" style="background-color: white; border: none;"><img style="width: 26px;
                    height: 26px;" src='/LoginMedia/EyeShow.png' ></button>
                </td>
                <td id="deleteLyric" style="border: 1px solid black;">
                    <button id="deleteLyricButton" onclick="requestDeleteLyric()" style="background-color: white; border: none;"><img src='/EditorMedia/TrashCan.png' style="width: 26px;
                    height: 26px; "></button>
                </td>
            </tr>
            `;
    
            table.innerHTML += template;
            
            //Hide the plus button for lyrics
            document.getElementById("lyricsPlusButton").style.setProperty("visibility", "hidden");
        }

        //Create logo with loaded data
        var logo = response.logo;

        if(logo[0]!=undefined)
        {
            //Create Logo with Editor Manager
            var fileLink = '/' + logo[0].file_name;

            EditorManagerObj.createLogo(logo[0].Name, fileLink, logo[0].width, logo[0].height, logo[0].x, logo[0].y, logo[0].opacity);

            EditorManagerObj.getLogoObject().setLogoFileName(logo[0].file_name);

            //Create Logo row
            let table = document.getElementById("logoHierarchy");
    
            let template = `
                <tr id="addedLogoRow">
                    <td id="addedLogoName" style="border: 1px solid black;"> 
                        <button class="addedLogoNameButton" onclick="requestShowEditLogoSection()" style="background-color: white; border: none;">Logo</button>
                    </td>
                    <td id="addedLogoVisibility" style="border: 1px solid black;">
                        <button class="addedLogoVisibilityButton" onclick="toggleLogoVisibility()" style="background-color: white; border: none;"><img style="width: 26px;
                        height: 26px;" src='/LoginMedia/EyeShow.png' ></button>
                    </td>
                    <td id="deleteLogo" style="border: 1px solid black;">
                        <button class="deleteLogoButton" onclick="requestDeleteLogo()" style="background-color: white; border: none;" ><img src='/EditorMedia/TrashCan.png' style="width: 26px;
                        height: 26px; "></button>
                    </td>
                </tr>
            `;    
            table.innerHTML += template;

            //Hide plus button for logo
            document.getElementById("logoPlusButton").style.setProperty("visibility", "hidden");
        }
    });
    
    const $saveToDB_Button = $('#saveToDB_Button');
    $saveToDB_Button.on("click", saveProject);

    function saveProject(e){
        e.preventDefault();

        //Perform a copy of the Shape Array
        var copyShapeArray=[];
        for(var i=0; i< ShapeArray.length; i++)
        {
            var shape = ShapeArray[i].shape.getKonvaShape();

            var sides = 0;
            var radius = 0;
            var width = 0;
            var height = 0;

            var file = "";

            if(ShapeArray[i].shapeType == "Rectangle")
            {
                width = shape.getAttr("width");
                height = shape.getAttr("height");
            }
            else if(ShapeArray[i].shapeType == "Polygon")
            {
                sides = shape.getAttr("sides");
                radius = shape.getAttr("radius");
            }
            else if(ShapeArray[i].shapeType == "Image")
            {
                width = shape.getAttr("width");
                height = shape.getAttr("height");
                file = ShapeArray[i].shape.getFileName();
            }

            var copyObject = {
                "shapeStartTime": ShapeArray[i].shapeStartTime,
                "shapeEndTime": ShapeArray[i].shapeEndTime,
                "shapeAnimation": ShapeArray[i].shapeAnimation,
                "shapeName": ShapeArray[i].shapeName,
                "shapeType" : ShapeArray[i].shapeType,
                "fill": shape.getAttr("fill"),
                "stroke": shape.getAttr("stroke"),
                "strokeWidth": shape.getAttr("strokeWidth"),
                "x": shape.getAttr("x"),
                "y": shape.getAttr("y"),
                "opacity": shape.getAttr("opacity"),
                "width": width,
                "height": height,
                "sides": sides,
                "radius": radius,
                "file": file,
                "zIndex": shape.zIndex(),
            }

            copyShapeArray.push(copyObject);
        }

        //Copy content of lyric object
        var textContent;
        var lyricObjectCopy;

        if(lyricArray.length!=0) //Check if there is any content to add
        {
            textContent = lyricArray[0];

            //Iterate throught the rest of the array and add dividers (\n~~~\n)
            for(let i=1; i<lyricArray.length; i++)
            {
                textContent = textContent + "\n~~~\n" + lyricArray[i];
            }

            lyricObjectCopy = {
                "TextContent": textContent,
                "FontColor": text.getAttr('fill'),
                "FontType": text.getAttr('fontFamily'),
                "BGColor": EditorManagerObj.getLyricObject().getKonvaBackground().getAttr('fill'),
                "FontSize": text.getAttr('fontSize'),
                "LyricsX": EditorManagerObj.getLyricObject().getKonvaTextBox().getAttr('x'),
                "LyricsY": EditorManagerObj.getLyricObject().getKonvaTextBox().getAttr('y'),
            }
        }

        //Copy content of logo object 
        var logoCopyObject;
        var logoFile;

        if(EditorManagerObj.getLogoObject()!=undefined && EditorManagerObj.getLogoObject().getLogoFile()!=undefined)
        {
            logoFile = EditorManagerObj.getLogoObject().getLogoFile(); 
        }

        if(EditorManagerObj.getLogoObject() != undefined) //No file has been uploaded or there is no logo to save
        {
            var logoObject = EditorManagerObj.getLogoObject().getKonvaLogo();

            logoCopyObject = {
                "LogoFileName": EditorManagerObj.getLogoObject().getLogoFileName(),
                "LogoWidth": logoObject.getAttr('width'),
                "LogoHeight": logoObject.getAttr('height'),
                "LogoOpacity": logoObject.getAttr('opacity'),
                "LogoName": logoObject.getAttr('name'),
                "LogoX": logoObject.getAttr('x'), 
                "LogoY": logoObject.getAttr('y'),
            }
        }


        //Copy content from background
        var backgroundCopyArray = [];

        for(var i=0; i< backgroundArray.length; i++)
        {
            var backgroundCopyObj = {
                "backgroundStartTime": backgroundArray[i].backgroundStartTime,
                "fileName": backgroundArray[i].fileName,
            }

            backgroundCopyArray.push(backgroundCopyObj);
        }

        console.log("The overlay array length is " + EditorManagerObj.getOverlayArray().length);

/*--------------------------Save Project to DB----------------------------- */ 
        $.ajax({
            url: '/saveProjectData',
            method: 'POST',
            dataType: 'json',
            data: {
                shape: copyShapeArray,
                lyrics: lyricObjectCopy,
                logo: logoCopyObject,
                background: backgroundCopyArray,
                overlay: EditorManagerObj.getOverlayArray(),
            }
        }).done(response => { //Save files to user media folder
            console.log(response.msg);

            //Store logo file to user media if available
            if(logoFile!=undefined)
            {
                var LogoFormData = new FormData();

                LogoFormData.append('LogoFile', logoFile);

                $.ajax({
                    url: '/uploadLogo',
                    method: 'POST',
                    data: LogoFormData,
                    processData: false,
                    contentType: false,
                    encType: "multipart/form-data",
                });
            }

            //Save design element files
            var designElementFormData = new FormData();

            for(var i=0; i<ShapeArray.length; i++)
            {
                //Check if the designelement is an image and see if the file is loaded from media folder
                if(ShapeArray[i].shapeType == "Image" && ShapeArray[i].shape.getFileInput()!="")
                    designElementFormData.append("DesignElementFiles", ShapeArray[i].shape.getFileInput());
            }

            $.ajax({
                url: '/uploadDesignElements',
                method: 'POST',
                data: designElementFormData,
                processData: false,
                contentType: false,
                encType: "multipart/form-data",
            });

            //Save Background Files
            var backgroundFormData = new FormData();

            for(var i=0; i<backgroundArray.length; i++)
            {
                if(backgroundArray[i].theFile != "")
                    backgroundFormData.append('BackgroundFiles', backgroundArray[i].theFile);
            }

            $.ajax({
                url: '/uploadBackgrounds',
                method: 'POST',
                data: backgroundFormData,
                processData: false,
                contentType: false,
                encType: "multipart/form-data",
            });
        });
    }
});