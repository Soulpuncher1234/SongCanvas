const db = require("./database.js");
const fs = require("fs");


class LoginDAO {

    //***************************************Section for handling Projects************************************************************************************* */
    async getExistingProjects(currentUser){
        return new Promise((resolve, reject) => {
            db.query('SELECT Project_ID, ProjectName, CreatedAt, updated_at FROM Project WHERE UserId=(SELECT id FROM Users WHERE email=?)', [currentUser], function(error, results, fields)
	        {
		        //Handle potential error
		        if (error){
                    reject(error);
                    return;
                };

		        //Have response store the array as a json object array and send back to client
		        resolve(results);
	        });
        });
    }

    async deleteProject(projectID, currentUser)
    {
        return new Promise((resolve, reject)=>{
            //Step 1 get the soundFile
            db.query('SELECT SongFile FROM Project WHERE Project_ID=? AND UserID=(Select id FROM Users WHERE email=?)', [projectID, currentUser], function(error, results, fields){
                if (error){
                    reject(error);
                    return;
                };

                //Grab the file name and delte using fs

                fs.unlink('UserMedia/'+results[0].SongFile,
                    (err => {
                        if (err) console.log(err);
                        else {
                            console.log("Deleted File");
                        }}
                    )
                );

                //Step 2 Delete the row based on id
                db.query('Delete From Project WHERE Project_ID=? AND UserId=(Select id FROM Users WHERE email=?)', [projectID, currentUser], function(error, results, fields)
                {
                    //Handle potential error
                    if (error){
                        reject(error);
                        return;
                    };

                    //This true value not used anywhere
                    resolve(true);
                });

                
            });


        });
    }

    async getProjectName(projectId)
    {
        return new Promise((resolve, reject)=>{
            db.query("Select ProjectName From Project Where Project_ID=?", [projectId], function(error, results, fields){
                //Handle potential error
                if (error){
                    reject(error);
                    return;
                };

                resolve(results);
            });
        });
    }

    async updateProjectName(projectName, projID)
    {
        return new Promise((resolve, reject)=>{
            db.query("UPDATE Project Set ProjectName=? where Project_ID=?", [projectName, projID], function(error, results, fields){
                if (error){
                    reject(error);
                    return;
                };

                resolve(true);
            });
        });
    }

    async updateProjectAudioFile(soundFilePath, projectID)
    {
        return new Promise((resolve, reject)=>{
            db.query("Update Project SET SongFile = ? WHERE Project_ID=?", [soundFilePath, projectID], function(error, results, fields){
                if (error){
                    reject(error);
                    return;
                };

                resolve(true);
            });
        });
    }


    async getProjectFileName(projectID)
    {
        return new Promise((resolve, reject)=>{
            db.query("Select SongFile From Project WHERE Project_ID = ?", [projectID], function(error, results, fields){
                if (error){
                    reject(error);
                    return;
                };
                
                resolve(results);
            });
        });
    }

    async getProjectID(currentUser, projectName)
    {
        return new Promise((resolve, reject) =>{
            console.log(currentUser);
            db.query("SELECT id FROM Users where email=?", [currentUser], function(error, results, fields){
                //Handle potential error
                if (error){
                    reject(error);
                    return;
                };

                var userID = results[0].id;

                console.log(userID);

                db.query("Select Project_ID FROM Project Where ProjectName=? AND UserId=?", [projectName, userID], function(error, results, fields){
                    //Handle potential error
                    if (error){
                        reject(error);
                        return;
                    };

                    resolve(results);
                });
            });
        });
    }

    async isProjectCreated(currentUser, projectName, filePath){
        return new Promise((resolve, reject) =>{
            //Create Project
            var userID;
            var projectID;
            var newFileName;

            //Step 1: Grab the id of the current user
            db.query("SELECT id FROM Users where email=?", [currentUser], function (error, results, fields){
                if(error){
                    reject(error);
                    return;
                }

                userID = results[0].id;

                //Step 2: Find out if there is a project with an exisitng name
                db.query('SELECT * FROM Project WHERE ProjectName=? AND UserId=?', [projectName, userID], function(error, results, fields){
                    if(error){
                        reject(error);
                        return;
                    }

                    if(results.length>0) //Duplicate Found
                    {
                        console.log("duplicate found");
                        resolve(false);
                    }
                    else
                    {
                        //Step 3
                        db.query('insert into Project(UserId, ProjectName, SongFile) Values (?, ?, ?)', [userID, projectName, filePath], function(error, results, fields){
                            if (error) {
                                reject(error);
                                return;
                            }

                            //Step 4 Get the project Id of the newly created project and modify the songFile to have the new file name
                            db.query('Select Project_ID FROM Project Where ProjectName=? AND UserId=?', [projectName, userID], function(error, results, fields){
                                if (error) {
                                    reject(error);
                                    return;
                                }

                                //Grab the project id and use it for Step 5
                                projectID = results[0].Project_ID;
                                
                                //Create new file name to replace in the UserMedia folder and in database
                                newFileName = projectID + "_sound_"+ filePath; 

                                // fs.rename('UserMedia/'+filePath, 'UserMedia/'+newFileName, function(err) {
                                //     if (err) console.log('ERROR: ' + err);
                                // });

                                //Step 5: Update SongFile with new file name
                                db.query('UPDATE Project SET SongFile=? WHERE ProjectName=? AND UserId=?', [newFileName, projectName, userID], function(error, results, fields){
                                    if (error) {
                                        reject(error);
                                        return;
                                    }
                                    
                                    resolve(true);
                                });
                            });
                            
                        });
                    }
                });
            });
        });
    }

    //*******************************************Section for handling Users******************************************************* */
    async isLoginValid(email, password) {

        return new Promise((resolve, reject) => {
            // Execute SQL query that'll select the account from the database based on the specified username and password
            db.query('SELECT * FROM Users WHERE email = ? AND password = ?', [email, password], function (error, results, fields) {
                
                // If there is an issue with the query, reject the promise
                if (error) {
                    reject(error);
                    return;
                }

                // If the account exists, resolve the promise with true
                if (results.length > 0) {
                    resolve(true);
                } else {
                    // If the account doesn't exist, resolve the promise with false
                    resolve(false);
                }
            });
        });
    }

    async isAccCreated(email, password, firstName, lastName)
    {
        return new Promise((resolve, reject) => {
            //Check if there is a duplicate email with query
			db.query('SELECT * FROM Users WHERE email = ?', [email], function (error, results, fields) {

				// If there is an issue with the query, output the error
				if (error){
                    reject(error);
                    return;
                } 
                

				// If the account exists return false
				if (results.length > 0) {
                    resolve(false);
				}
				else { //An account doesnt exist
					//Insert the new user to the table
					db.query('insert into Users(first_name, last_name, email, password) Values (?, ?, ?, ?)', [firstName, lastName, email, password], function (error, results, fields) {
						// If there is an issue with the query, output the error
						if (error)
                        {
                            reject(error);
                            return;
                        };
					});

					resolve(true);
				}			
			});
        });
    }
}

module.exports = LoginDAO;