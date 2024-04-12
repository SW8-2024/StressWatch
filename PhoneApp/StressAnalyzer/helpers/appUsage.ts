import { TIME } from '@/constants/Time';
import { getUsageStatsAsync, addUsageDataListener, getEventStatsInInterval } from '@/modules/app-usage';

export const getUsageDataByMilliseconds = (start: number, end: number) => {
    getUsageStatsAsync(start,end);
};


//Related to onUsageData
export const attachHandler = () => {
    addUsageDataListener(onUsageData);
}

//Deprecated because UsageData gives weird data because of Android's API kept in case it might be needed
function onUsageData(response : UsageDataEvent, callback? : (data : UsageData[]) => void){
    if (!response.success){
        console.log("We do not have persmission for usageStats"); //Possibly show an error message in app
    }else{
        let start = response.start;
        let end = response.end;       
        //Filter out apps that have not been actively used        
        response.data = response.data.filter((val : UsageDataPerApp) => {
            return val[1] != 0;
        });
     
        //Send data to server
    }
}

// Idea is that the database is updated with each call
export const getEventDataByMilli = async (startTime : number, endTime : number) => {        
    let data = await _getEventData(startTime, endTime);
    if (data.length != 0){
        // Query/update server and local database
    }else{
        //No results either because query times are wrong, missing permissions or android has deleted the events for the time frame
    }
}

// Idea is that the database is updated with each call
export const getEventDataForToday = async () => {
    let startDate = new Date(Date.now())
    startDate.setHours(0)
    startDate.setMinutes(0)
    startDate.setMilliseconds(0)
    return getEventDataByMilli(startDate.valueOf(), Date.now())
}

// Idea is that the database is updated with each call
export const getEventDataByDate = async (startDate : Date, endDate : Date) => {
    return getEventDataByMilli(startDate.valueOf(), endDate.valueOf())
}

// Prints the sessions and total time for each application meant for debugging / check that it works for a specific phone
// Note that "background" services might inflate the numbers
export const printEventDataByDate = async (startDate : Date, endDate : Date) => {
    let data : EventUsageTransformedData[] = await _getEventData(startDate.valueOf(), endDate.valueOf());
    let totalTime : number = 0;
    console.log("Event data queried from: " + startDate.toLocaleDateString() + " to: " + endDate.toLocaleDateString() + " local time.");
    data.forEach((elem : EventUsageTransformedData) => {    
        console.log("Starttimes, endtimes for " + elem.name + "With a total of: " + (elem.timeSpent / 1000 / 60).toFixed(2) + " minutes spent.")
        totalTime += elem.timeSpent
        elem.sessions.forEach((elem: Session) => {        
            let text = "";        
            let start = new Date(elem.start)
            text += start.toLocaleTimeString()               
            text += "   |   "
            let end = new Date(elem.end)
            text += end.toLocaleTimeString()              
            console.log(text)
        })
    });
    console.log(totalTime)
    let hours = totalTime / TIME.HOUR
    let minutes = (totalTime % TIME.HOUR) / TIME.MINUTE
    console.log("A total of: " + hours.toFixed(0) + " hours and " + minutes.toFixed(1) + " minutes on: " + data.length + " applications.")

}

const _getEventData = async (startTime : number, endTime : number) => {
    let eventData: EventUsageRawData = await getEventStatsInInterval(startTime, endTime)
    let transformedData : EventUsageTransformedData[] = [];
    if (!eventData.success){
        console.log("We do not have UsageData permission")
        return [];
    } 
    eventData.packageTimes.forEach((elem : EventUsage) => {        
        let timeSpent : number = 0;
        let startTimes = elem.startTimes
        let endTimes = elem.endTimes
        if (startTimes.length + endTimes.length == 0) return;
    
        // If first endtime is bigger than first starttime we assume a session was ongoing from querystart time
        if (startTimes.length == 0 || startTimes[0] > endTimes[0]){
            startTimes.unshift(eventData.queryStart);          
        }
        // If last endtime is smaller than last starttime we assume a session is ongoing to queryend time
        if (endTimes.length == 0 || endTimes[endTimes.length - 1] < startTimes[startTimes.length - 1]){
            endTimes.push(eventData.queryEnd);
        }        
        
        let endIndex = 0;
        let sessions = startTimes.map((val : number, index : number, array : number[]) => {
            let nextVal = index + 1 >= array.length ? undefined : startTimes[index + 1];
            let end = endTimes[endIndex]; // Should never be out of bounds        
            let len = end - val
            //Any sequential endtimes are seen as duplicates and skipped over
            while (nextVal != undefined && nextVal > endTimes[++endIndex]){}            
            timeSpent = timeSpent + len
            return {start : val, end : end, length : len}
        })
        transformedData.push({name : elem.packageName, sessions: sessions, timeSpent : timeSpent});                
    })
    return transformedData
}