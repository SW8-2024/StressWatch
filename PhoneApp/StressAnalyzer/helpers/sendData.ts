import { TIME } from "@/constants/Time";
import { getEventDataForToday } from "./appUsage";

let interval : NodeJS.Timeout;

export const sendData : any = () => {
    getEventDataForToday();
    if (interval == undefined){
        sendDataInIntervals();
    }else{
        clearInterval(interval);
        sendDataInIntervals();
    }
}

export const stopSendingData : any = () => {
    clearInterval(interval);
}

const sendDataInIntervals : any = () => {
    interval = setInterval(() => {
        getEventDataForToday();
    }, TIME.MINUTE * 30);
}
