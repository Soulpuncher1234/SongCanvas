const db = require("./database.js");
const fs = require("fs");

class EditorDAO {
	async getProjectData()
	{
		return new Promise((resolve, reject) => {
            db.query('', [], function(error, results, fields)
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

	async getFileName(currentProjectID)
	{
		return new Promise((resolve, reject) => {
			db.query('Select SongFile FROM Project WHERE Project_ID=?', [currentProjectID], function(error, results, fields)	
			{
				if (error){
                    reject(error);
                    return;
                };

				resolve(results);
			});
		});
	}

	// *******************************************    Background    ******************************************
	async saveBackgroundElement(currentProjectID, backgroundObject)
	{
		return new Promise((resolve, reject)=>{
			db.query('insert into Background(Name, file_name, StartTime, ProjectID) Values(?, ?, ?, ?)', [backgroundObject.fileName, currentProjectID + "_BG_" + backgroundObject.fileName, backgroundObject.backgroundStartTime, currentProjectID], function(error, results, fields){
				if (error){
                    reject(error);
                    return;
                };
				
				resolve(true);
			});
		});
	}

	async deleteBackgroundElements(currentProjectID){
		return new Promise((resolve, reject)=>{
			db.query('DELETE FROM Background WHERE ProjectID=?', [currentProjectID], function(error, results, fields){
				if (error){
                    reject(error);
                    return;
                };
				
				resolve(true);
			});
		});
	}

	async getAllBackgroundElements(currentProjectID)
	{
		return new Promise((resolve, reject)=>{
			db.query('SELECT * FROM Background WHERE ProjectID=?', [currentProjectID], function(error, results, fields){
				if (error){
                    reject(error);
                    return;
                };
				
				resolve(results);
			});
		});
	}

	async getBackgroundFileNames(currentProjectID)
	{
		return new Promise((resolve, reject)=>{
			db.query('SELECT file_name FROM Background WHERE ProjectID=?', [currentProjectID], function(error, results, fields){
				if (error){
                    reject(error);
                    return;
                };
				
				resolve(results);
			});
		});
	}

	async ifBackgroundFileExists(currentProjectID, fileName)
	{
		return new Promise((resolve, reject)=>{
			db.query('SELECT file_name FROM Background WHERE ProjectID=? AND file_name=?', [currentProjectID, fileName], function(error, results, fields){
				if (error){
                    reject(error);
                    return;
                };
				
				if(results.length==0)
					resolve(false);
				else
					resolve(true);

			});
		});
	}
	
	// *******************************************    Overlay      *******************************************
	async removeAllOverlays(currentProjectID)
	{
		return new Promise((resolve, reject)=>{
			db.query('DELETE From Overlay where ProjectID=?', [currentProjectID], function(error, results, fields){
				if (error){
					reject(error);
					return;
				};

				resolve(true);
			});
		});
	}

	async saveOverlayElement(currentProjectID, overlayObject)
	{
		return new Promise((resolve, reject)=>{
			db.query('insert into Overlay(opacity, overlayName, overlayOption, startTime, endTime, ProjectID) Values(?, ?, ?, ?, ?, ?)', [overlayObject.opacity, overlayObject.name, overlayObject.overlayOption, overlayObject.startTime, overlayObject.endTime, currentProjectID], function(error, results, fields){
				if (error){
					reject(error);
					return;
				};

				resolve(true);
			});
		});
	}

	async getAllOverlays(currentProjectID)
	{
		return new Promise((resolve, reject)=>{
			db.query("Select * From Overlay Where ProjectID=?", [currentProjectID], function(error, results, fields){
				if (error){
					reject(error);
					return;
				};

				resolve(results);
			});
		});
	}

	// ********************************************     Logo        ******************************************
	async saveLogoElement(currentProjectID, logoObject)
	{
		return new Promise((resolve, reject)=>{
			db.query('insert into Logo(Name, file_name, opacity, height, width, x, y, ProjectID) Values(?, ?, ?, ?, ?, ?, ?, ?)', [logoObject.LogoName, logoObject.LogoFileName, logoObject.LogoOpacity, logoObject.LogoHeight, logoObject.LogoWidth, logoObject.LogoX, logoObject.LogoY, currentProjectID], function(error, results, fields){
				if (error){
					reject(error);
					return;
				};

				resolve(true);
			});
		});
	}

	async updateLogoFileName(currentProjectID, fileName)
	{
		return new Promise((resolve, reject)=>{
			db.query('UPDATE Logo Set file_name=? WHERE ProjectID=?', [fileName, currentProjectID], function(error, results, fields){
				if (error){
					reject(error);
					return;
				};

				resolve(true);
			});
		});
	}

	async removeLogoElement(currentProjectID)
	{
		return new Promise((resolve, reject)=>{
			db.query('DELETE FROM Logo WHERE ProjectID=?', [currentProjectID], function(error, results, fields){
				if (error){
					reject(error);
					return;
				};

				resolve(true);
			});
		});
	}

	async getLogoElement(currentProjectID)
	{
		return new Promise((resolve, reject)=>{
			db.query('SELECT * FROM Logo WHERE ProjectID=?', [currentProjectID], function(error, results, fields){
				if (error){
					reject(error);
					return;
				};
	
				resolve(results);
			});
		});
	}

	async ifLogoElementExists(currentProjectID, fileName){
		return new Promise((resolve, reject)=>{
			db.query('Select * FROM Logo WHERE ProjectID=? AND file_name=?', [currentProjectID, fileName], function(error, results, fields){
				if (error){
					reject(error);
					return;
				};
	
				if(results.length==0)
					resolve(false);
				else
					resolve(true);
			});
		});
	}



	// ********************************************     Lyrics      ******************************************
	async saveLyricsElement(currentProjectID, lyricObj)
	{
		return new Promise((resolve, reject)=>{

			db.query('insert into Lyrics(FontColor, TextContent, FontType, BGColor, FontSize, ProjectID, lyricsX, lyricsY) Values(?, ?, ?, ?, ?, ?, ?, ?)', [lyricObj.FontColor, lyricObj.TextContent, lyricObj.FontType, lyricObj.BGColor, lyricObj.FontSize, currentProjectID, lyricObj.LyricsX, lyricObj.LyricsY], function(error, results, fields)
			{
				if (error){
					reject(error);
					return;
				};
	
				resolve(true);
			});
		});
	}

	async removeLyricsElement(currentProjectID)
	{
		return new Promise((resolve, reject)=>{
			db.query('Delete FROM Lyrics WHERE ProjectID=?', [currentProjectID], function(error, results, fields)
			{
				if (error){
					reject(error);
					return;
				};
	
				resolve(true);
			});
		});
	}

	async getLyricsElement(currentProjectID)
	{
		return new Promise((resolve, reject)=>{
			db.query('SELECT * FROM Lyrics WHERE ProjectID=?', [currentProjectID], function(error, results, fields){
				if (error){
					reject(error);
					return;
				};
	
				resolve(results);
			});
		});
	}

	// ******************************************** Design Elements ******************************************
	async saveDesignElement(currentProjectID, shapeArray)
	{
		return new Promise((resolve, reject) => {
            db.query('insert into DesignElement(Width, BorderColor, X, AnimType, Opacity, BorderWidth, EndTime, Sides, DesignElement_Name, FillColor, shapeType, Height, Y, Radius, StartTime, ProjectID, filePath, zIndex) Values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ', [shapeArray.width, shapeArray.stroke, shapeArray.x, shapeArray.shapeAnimation, shapeArray.opacity, shapeArray.strokeWidth, shapeArray.shapeEndTime, shapeArray.sides, shapeArray.shapeName, shapeArray.fill, shapeArray.shapeType, shapeArray.height, shapeArray.y, shapeArray.radius, shapeArray.shapeStartTime, currentProjectID, currentProjectID +"_DE_"+ shapeArray.file, shapeArray.zIndex], function(error, results, fields)
	        {
		        //Handle potential error
				
		        if (error){
                    reject(error);
                    return;
                };

		        //Have response store the array as a json object array and send back to client
		        resolve(true);
	        });
        });
	}

	async removeAllDesignElements(currentProjectID)
	{
		return new Promise((resolve, reject)=>{
			db.query('DELETE FROM DesignElement WHERE ProjectID=?', [currentProjectID], function(error, results, fields){
				if (error){
                    reject(error);
                    return;
                };

				resolve(true);
			});
		});
	}

	async getAllDesignElementFileNames(currentProjectID)
	{
		return new Promise((resolve, reject)=>{
			db.query('SELECT filePath FROM DesignElement WHERE ProjectID=? AND filePath!=?', [currentProjectID, ""], function(error, results, fields){
				if (error){
                    reject(error);
                    return;
                };

				resolve(results);
			});
		});
	}

	async ifDesignElementFileExists(currentProjectID, fileName)
	{
		return new Promise((resolve, reject)=>{
			db.query('SELECT filePath FROM DesignElement WHERE ProjectID=? AND filePath=?', [currentProjectID, fileName], function(error, results, fields){
				if (error){
                    reject(error);
                    return;
                };
				
				if(results.length==0)
					resolve(false);
				else
					resolve(true);

			});
		});
	}

	async getAllDesignElements(currentProjectID) {
		return new Promise((resolve, reject) =>{
			db.query('SELECT * FROM DesignElement WHERE ProjectID=? ORDER BY zIndex ASC', [currentProjectID], function(error, results, fields)
	        {
		        //Handle potential error
				
		        if (error){
                    reject(error);
                    return;
                };

		        //Have response store the array as a json object array and send back to client
		        resolve(results);
	        });
		}) ;
	}
}

module.exports = EditorDAO;