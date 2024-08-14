import {EditorManager} from './EditorManager.mjs';

//Create the editor manager 
var EditorManagerObj = new EditorManager();

//Create the keyboard listner
createKeyboardListener();

//Set up variables for shapes
var ShapeArray=[];

var ShapeStartArray=[];
var ShapeStartIndex=0;;

var ShapeEndArray=[];
var ShapeEndIndex=0;

//Variables for overlays
var overlayArray = [];
var overlayStartArray = [];
var overlayEndArray = [];

var overlayStartIndex = 0;
var overlayEndIndex = 0;

//Set up variables for Lyrics
var lyricArray=[];
var text;
var indexVal = -1;

//Set up variables for background
var imageCont = document.getElementById('imageContent'); //Used to acces the image element and manipulate it
var videoCont = document.getElementById('videoContent');
videoCont.muted=true;

var backgroundArray=[];
var backgroundArrayIndex=0;

//Risize the stage to fit screen
var scale = document.querySelector('#KonvaCanvas').offsetWidth / 1050;

var stage = EditorManagerObj.getStage();

stage.width(1050 * scale);
stage.height(document.getElementById('KonvaCanvas').offsetHeight);
stage.scale({x: scale, y:scale});



/***************** Event Listner******************/
let paused = true;
let recording = false;

function keyboardEnabled(event) {

    switch (event.key) {
        //Display the next lyric
        case "ArrowRight":
            if (indexVal < lyricArray.length - 1) {
                indexVal += 1;
                text.setAttr('text', lyricArray[indexVal]);
                EditorManagerObj.updateTextBoxOffset();
            }

            break;

        //Display the previous lyric
        case "ArrowLeft":
            if (indexVal >= 1) {
                indexVal -= 1;
                text.setAttr('text', lyricArray[indexVal]);
                EditorManagerObj.updateTextBoxOffset();
            }
            break;

        //Pause and play the project
        case "p":
            //Flip the state 
            paused = !paused;

            if (paused == true) //If we are pausing stop the timer, audio, video(if we are currently using it as background)
            {
                audio.pause();

                if (videoCont.src != "")
                    videoCont.pause();
            }
            else //If we are playing start the timer, video, and audio layers
            {
                audio.play();
                if (videoCont.src != "")
                    videoCont.play();
            }

            break;

        //Record button
        case "q":
            //Flip the state
            recording = !recording;

            if(recording==true)
            {
                alert("Recording in-progress");
                startRecording();
            }
            else
            {
                alert("Recording Done");
                stopRecording();
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

function createKeyboardListener()
{
    document.addEventListener('keydown', handler);
}

//Screen Record Feature
let mediaRecorder;
let stream;

async function getScreen(){
    return await navigator.mediaDevices.getDisplayMedia({
        audio: true, 
        video: true,
    });
}

//Call in the keyboard listner for key "q".  
async function startRecording()
{
    //Start sharing screen
    stream = await getScreen();

    //Create recorder object
    mediaRecorder = createRecording(stream, "video/webm");
}

async function stopRecording()
{
    mediaRecorder.stop();
}

function createRecording(stream, mimeType)
{
    //Store data from stream into array
    let chunks = [];

    //Create the recorder object
    const mediaRecorder = new MediaRecorder(stream);

    //Push data into chunks array
    mediaRecorder.ondataavailable = function (e) {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }  
    };

    //Save file when recorder is finished
    mediaRecorder.onstop = function() {
        saveFile(chunks);
        chunks = []; //Remove previous recording data when done
    };

    //Start recording 
    mediaRecorder.start();

    //Get the recorder object and use it to stop later time
    return mediaRecorder;

}

function saveFile(chunks){

    //Create blob with data taken from chunks
    const blob = new Blob(chunks, {
        type: 'video/webm'
    });

    //Convert blob to file and have user download it
    let url = URL.createObjectURL(blob);

    let a = document.createElement('a');
    a.href = url;
    a.download = 'SongCanvasVideo.mp4';
    a.click();

    //Clear memory and remove a tag (in case user might have to record again without refresh)
    URL.revokeObjectURL(blob);
    document.body.removeChild(a);

    //Stop screen sharing
    
}

//Function to display elements at specified times. Called by setInterval
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

    //*****************Manage Overlays*****************//
    if(overlayStartArray.length!=0 && overlayStartArray[overlayStartIndex].getStartTime()==formattedTime)
    {
        //Load the css file based on overlay option  "[overlayOption].css"
        document.getElementById("overlayOptionCSS").href = "/EditorViews/" + overlayStartArray[overlayStartIndex].getOverlayOption() + ".css";

        //Set the overlay layer to the specified opacity
        document.getElementById("animatedBackdrop").style.setProperty("opacity", overlayStartArray[overlayStartIndex].getOpacity());

        //Display the overlay layer
        document.getElementById("animatedBackdrop").style.setProperty("visibility", "visible");

        //Move to the next shape wating to be displayed. Check if we had exceeded the array boundry
        if (overlayStartIndex < overlayStartArray.length - 1)
            overlayStartIndex += 1;
    }
    
    if (overlayEndArray.length != 0 && overlayEndArray[overlayEndIndex].getEndTime() == formattedTime) {
        //Hide the overlay layer
        document.getElementById("animatedBackdrop").style.setProperty("visibility", "hidden");

        //Move to the next shape wating to be displayed. Check if we had exceeded the array boundry
        if (overlayEndIndex < overlayEndArray.length - 1)
            overlayEndIndex += 1;
    }
}

//Audio
const audio = document.getElementById('musicPlayer');

//Get the span element and update the time to it
const timeDisplay = document.getElementById('audioTimestamp');

// Update time display every decisecond (100 milliseconds)
const updateTimer = setInterval(() => {
    const minutes = Math.floor(audio.currentTime / 60);
    const seconds = Math.floor(audio.currentTime % 60);
    const deciseconds = Math.floor((audio.currentTime * 10)) % 10;
        
    // Format time string with leading zeros
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${deciseconds.toString().padStart(1, '0')}`;

    updateProjectElements(formattedTime);
}, 10);

// When audio stops, timer stops
audio.addEventListener('ended', () => {
    clearInterval(updateTimer);
});

//*********************Ajax Requests********************** */
$(document).ready(function(){

    $.ajax({
        url: "/loadProjectElementData",
        method: "POST",
    }).done(response => {
        //Set the src for the audio element
        document.getElementById('musicPlayer').setAttribute('src', "/" + response.SongFile[0].SongFile);

        //==================== Load Overlay Data ====================
        var overlayInputArray = response.overlayImportArray;

        for (var i = 0; i < overlayInputArray.length; i++) {
            //Create overlay object
            EditorManagerObj.createOverlay(overlayInputArray[i].overlayName, overlayInputArray[i].opacity, overlayInputArray[i].overlayOption, overlayInputArray[i].startTime, overlayInputArray[i].endTime);

            overlayArray = EditorManagerObj.getOverlayArray();
            overlayStartArray = EditorManagerObj.getOverlayStartArray();
            overlayEndArray = EditorManagerObj.getOverlayEndArray();
        }

        //============Load Shape Data================
        var shapes = response.shapeImportArray;

        for(var i=0; i < shapes.length; i++)
        {
            EditorManagerObj.createShape(shapes[i].DesignElement_Name, shapes[i].Width, shapes[i].Height, shapes[i].FillColor, shapes[i].BorderColor, shapes[i].BorderWidth, shapes[i].X, shapes[i].Y, shapes[i].Sides, shapes[i].AnimType, shapes[i].Opacity, shapes[i].StartTime, shapes[i].EndTime, shapes[i].ShapeType, shapes[i].Radius,  "/" + shapes[i].filePath);
            
            ShapeArray= EditorManagerObj.getShapeArray();
            ShapeStartArray = EditorManagerObj.getShapeStartArray();
            ShapeEndArray = EditorManagerObj.getShapeEndArray();
        }

        //Hide all the shapes
        EditorManagerObj.hideAllShapes();

        //Disable dragging for all design elements
        EditorManagerObj.disableDraggingDE();

        //===========Load Background Data===========
        var backgroundInputArray = response.backgroundImportArray;

        for(var i=0; i<backgroundInputArray.length; i++)
        {

            //Get the file url for background object
            var backgroundFileLink = "/" + backgroundInputArray[i].file_name;

            //Create background object
            EditorManagerObj.createBackground(backgroundFileLink, backgroundInputArray[i].Name, backgroundInputArray[i].StartTime);

            //Get the new backgroundArray
            backgroundArray = EditorManagerObj.getBackgroundArray();
        }

        //===========Load Lyrics Data===============
        var lyrics = response.lyrics;

        if(lyrics[0]!=undefined) 
        {
            //Create the lyric object with the data
            EditorManagerObj.createLyrics(lyrics[0].TextContent, lyrics[0].BGColor, lyrics[0].FontColor, lyrics[0].FontSize, lyrics[0].FontType,  lyrics[0].lyricsX, lyrics[0].lyricsY);

            //Obtain the array of lyrics, set index, and get refrence to text object
            lyricArray = EditorManagerObj.getLyricArray();
            text = EditorManagerObj.getTextObject();
            indexVal=-1;

            EditorManagerObj.getLyricsTextBox().setAttr("draggable", false);
        }

        //==============Load Logo Data================
        var logo = response.logo;

        if(logo[0]!=undefined)
        {
            //Create Logo with Editor Manager
            var fileLink = '/' + logo[0].file_name;

            EditorManagerObj.createLogo(logo[0].Name, fileLink, logo[0].width, logo[0].height, logo[0].x, logo[0].y, logo[0].opacity);

            EditorManagerObj.getLogoObject().setLogoFileName(logo[0].file_name);

            EditorManagerObj.getLogoObject().getKonvaLogo().setAttr("draggable", false);
        }
    });
});