export class Overlay{

    constructor(name, opacity, overlayOption, startTime, endTime){
        this.name = name;
        this.opacity = opacity;
        this.overlayOption = overlayOption;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    //***********************************Getters***********************
    getName(){
        return this.name;
    }

    getOpacity(){
        return this.opacity;
    }

    getOverlayOption(){
        return this.overlayOption;
    }

    getStartTime(){
        return this.startTime;
    }

    getEndTime(){
        return this.endTime;
    }

    //***********************************Setters***********************
    setName(name){
        this.name=name;
    }

    setOpacity(opacity){
        this.opacity=opacity;
    }

    setOverlayOption(overlayOption){
        this.overlayOption=overlayOption;
    }

    setStartTime(startTime){
        this.startTime=startTime;
    }

    setEndTime(endTime){
        this.endTime=endTime;
    }
}