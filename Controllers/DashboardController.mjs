var selectedIndex; //Find the row to highlight and determine which project we use
var previousSelectedIndex; //USed to figure out which row to unhighlight

$(document).ready(function(){
    $('#ProjectPlayButton').click(openProjectToPlayer)

    function openProjectToPlayer(e)
    {
        e.preventDefault()

        //Get the projectID from the value attribute in the radio
        var theProjID = selectedIndex; 

        if(theProjID==null)
            return;
        
        $.ajax({
            url: '/openProjectPlayer',
            method: 'POST',
            data: {
                project_ID: theProjID,
            },
        }).done(response=>{
            window.location.href = "/PlayerViews/Player.html";
        });
    }
    
    $("#openProjectEditorButton").click(openExistingProject);

    function openExistingProject(e)
    {
        e.preventDefault()

        //Gets the projectID from the "value" attribute in the radio button
        var theProjID = selectedIndex; 

        if(theProjID==null)
            return;

        $.ajax({
            url: '/openProjectEditor',
            method: 'POST',
            data: {
                project_ID: theProjID,
            },
        }).done(response=>{
            window.location.href = "/EditorViews/editor.html";
        });
        
    }

    $("#ProjectDeleteButton").click(deleteExistingProject);

    function deleteExistingProject(e)
    {
        e.preventDefault()

        //Gets the projectID from the "value" attribute in the radio button
        var theProjID = selectedIndex; 

        selectedIndex = undefined;

        if(theProjID==null)
            return;

        console.log(theProjID);

        $.ajax({
            url: '/deleteProject',
            method: 'POST',
            data: {
                project_ID: theProjID,
            },
        }).done(response=>{
            //Remove the row of the project that we deleted from db
            document.getElementById('editorProjects').deleteRow(document.getElementById(theProjID).rowIndex);
        });
    }


    $("#editorModal").click(populateEditorTable);
    $('#playerModal').click(populateEditorTable);

    function populateEditorTable(e) {
        e.preventDefault()
        $.ajax({
            url: '/dashboardProjectsRetrieval',
            method: 'POST',
        }).done(response => {
            var table = document.getElementById('editorProjects');
            var tableData = response.data;

            //Clear the table            
            for (let i = table.rows.length - 1; i > 0; i--) {
                table.deleteRow(i);
            }

            //Popluate the table in modal with the queried data
            for(let i=0; i<response.data.length; i++)
            {
                requestAddProject(tableData[i].ProjectName, tableData[i].CreatedAt.split("T")[0], tableData[i].updated_at.split("T")[0], tableData[i].Project_ID);
            }
        });
    }

    $("#modifyButton").click(getProjectName);

    function getProjectName(e)
    {
        e.preventDefault();
    
        //Get the project name based on the button user has selected
        var theProjID = selectedIndex;  
        var projectName = "";

        //Clear the project file field 
        document.getElementById('editAudioInput').value = '';

        //Perform ajax request to get the project name from database
        $.ajax({
            url: '/getProjectName',
            method: 'POST',
            data: {
                project_ID: theProjID,
            }
        }).done(response=>{

            //Get the project name from response
            projectName = response.data;

            //Populate the editProjectName txt field with the the orignal project name
            document.getElementById("editProjectName").value = projectName[0].ProjectName;
        });
    }

    //Save project changes
    $("#modifyProjectButton").click(saveProjectChanges);
    
    function saveProjectChanges(e)
    {
        e.preventDefault();

        //Modify the ProjectName property 
        var newProjectName = document.getElementById("editProjectName").value;
        var theProjID = selectedIndex;

        $.ajax({
            url: '/updateProjectName',
            method: 'POST',
            data: {
                project_ID: theProjID,
                newName: newProjectName,
            }
        }).done(response =>{
            //Check if we have a file to upload
            if(document.getElementById("editAudioInput").files[0]!=undefined)
            {
                var audioFile = document.getElementById("editAudioInput").files[0];

                var formData = new FormData();

                formData.append('newSoundFile', audioFile);
                formData.append('projectID', theProjID);

                $.ajax({
                    url: '/updateProjectAudioFile',
                    method: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    encType: "multipart/form-data",
                });
            } 
        });
    }

    $("#projectSubmit").click(createProject);

    function createProject(e)
    {
        e.preventDefault();

        var formData = new FormData();

        formData.append('soundFile', document.getElementById("audioInput").files[0]);
        formData.append('projectName', document.getElementById("insertProjectName").value);

        $.ajax({
            url: '/createProject',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            encType: "multipart/form-data",
        }).done(response => {
           
        });

    }
});


export function highlightProject(row) {
    
    if(selectedIndex == undefined)
    {
        //Assign the row id to selectedIndex
        selectedIndex = row.id;

        //Add a background color to row to show it was selected
        document.getElementById(selectedIndex).style.backgroundColor = "lightblue";
    } 
    else
    {
        //Remove the background color from the previous row
        document.getElementById(selectedIndex).style.backgroundColor = "";

        //Assign the new row to selectedIndex
        selectedIndex = row.id;
        
        //Add bg color to the newly selected row
        document.getElementById(selectedIndex).style.backgroundColor = "lightblue";
    }

    console.log("The selected index is " + selectedIndex);
}

function requestAddProject(projectName, CreatedAt, updated_at, projectID){

    selectedIndex = undefined;

    let projectTable = document.getElementById("editorProjects");
    let template = `
            <tr colspan="4" id="${projectID}" onclick="highlightProject(this)">
                <td id="editShape " style="border: 1px solid black;">
                    ${projectName}
                </td>
                <td id="addedShapeVisible" style="border: 1px solid black;">
                    ${CreatedAt}
                </td>
                <td id="deleteShape" style="border: 1px solid black;">
                    ${updated_at}
                </td>
            </tr>
        `;
    
    projectTable.innerHTML += template;
}