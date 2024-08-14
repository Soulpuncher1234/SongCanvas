export class Logo{
    constructor(logoName, logoPic, logoWidth, logoHeight, logoX, logoY, logoOpcaity)
    {
        
        var imageObj = new Image();

        //Populate the konva image with the specified properties 
        this.konvaLogo = new Konva.Image({
            draggable: true,
            name: logoName,
            x: Number(logoX),
            y: Number(logoY),
            image: imageObj, 
            width: logoWidth,
            height: logoHeight,
            opacity: logoOpcaity,
            id: "logo",
            offset: {
                x: logoWidth/2,
                y: logoHeight/2,
            }
        });  


        //Add the fileInput to the imageObj
        imageObj.src = logoPic;
    }

    //Used to store the file user selected from input.  
    setLogoFile(logoFileInput)
    {
        this.LogoFile = logoFileInput;
    }

    setLogoFileName(logoNameInput)
    {
        this.LogoFileName = logoNameInput;
    }

    getLogoFileName()
    {
        return this.LogoFileName;
    }

    //Get the inputed file user selected and save it to cloud storage
    getLogoFile()
    {
        return this.LogoFile;
    }

    getKonvaLogo()
    {
        return this.konvaLogo;
    }
}