export class Lyrics{
    constructor(BackgroundColor, FontColor, FontType, FontSize, lyricsX, lyricsY)
    {
        //Create Textbox by adding a Tag(background) and Text
        this.textBox = new Konva.Label({
            x: lyricsX,
            y: lyricsY,
            draggable: true,
        });

        this.textBackground = new Konva.Tag({
            fill: BackgroundColor,
            id: 'textBackground',
        });

        this.text =  new Konva.Text({
            text: "",
            fontSize: FontSize,
            fontFamily: FontType,
            fill: FontColor,
            align: 'center',
            id: 'P1',
        }); 

        this.textBox.add(this.textBackground);

        this.textBox.add(this.text);
    }

    getKonvaTextBox()
    {
        return this.textBox;
    }

    getKonvaText()
    {
        return this.text;
    }

    getKonvaBackground()
    {
        return this.textBackground;
    }
}