import { TIME } from "@/constants/Time";
import { getEventDataByMilli, getEventDataForToday } from "./appUsage";
import { getString, storeString} from '@/helpers/AsyncStorage';

let interval : NodeJS.Timeout;

export const sendData : any = async () => {
    sendDataFun();
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
    interval = setInterval(async () => {
        sendDataFun();
    }, TIME.MINUTE * 30);
}

const sendDataFun : any = async () => {
    let lastData = await getString("lastDataSent");
    let startMilli : number;
    let endDate = new Date();

    if (!(lastData == null || lastData == undefined)){
        startMilli = Date.parse(lastData);
    }else{
        //Events are stored for a few days will probably not be 5 but it is not defined
        startMilli = Date.now() - TIME.DAY * 5;
    }
    let success = await getEventDataByMilli(startMilli, endDate.valueOf());
    if (success){
        storeString("lastDataSent", endDate.toString());
    }
}
