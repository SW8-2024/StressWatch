import { TIME } from '@/constants/Time';
import { getUsageStatsAsync, addUsageDataListener, getEventStatsInInterval, getAppIcon } from '@/modules/app-usage';
import { sendUsageData } from './Database';

// Idea is that the database is updated with each call
export const getEventDataByMilli = async (startTime : number, endTime : number) => {        
    let data = await _getEventData(startTime, endTime);
    if (data.length != 0){
        return await sendUsageData(data);
        // Query/update server and local database
    }else{
        return false;
        //No results either because query times are wrong, missing permissions or android has deleted the events for the time frame
    }
}

export const getEventDataForToday = async () => {
    let startDate = new Date()
    startDate.setHours(0)
    startDate.setMinutes(0)
    startDate.setMilliseconds(0)
    return await getEventDataByMilli(startDate.valueOf(), Date.now())
}

export const getEventDataByDate = async (startDate : Date, endDate : Date) => {
    return await getEventDataByMilli(startDate.valueOf(), endDate.valueOf());
}

// Prints the sessions and total time for each application meant for debugging / check that it works for a specific phone
// Note that "background" services might inflate the numbers
export const printEventDataByDate = async (startDate : Date, endDate : Date) => {
    let data : EventUsageTransformedData[] = await _getEventData(startDate.valueOf(), endDate.valueOf());    
    console.log("Event data queried from: " + startDate.toLocaleDateString() + " to: " + endDate.toLocaleDateString() + " local time.");
    data.forEach((elem : EventUsageTransformedData) => {    
        console.log("Starttimes, endtimes for " + elem.appName)        
        elem.sessions.forEach((elem: Session) => {        
            let text = "";                    
            text += elem.from.toLocaleTimeString()               
            text += "   |   "            
            text += elem.to.toLocaleTimeString()              
            console.log(text)
        })
    });
    console.log("A total of " + data.length + " applications.")
}

export const getAppIconFromName = (packageName : string) : string => {
    return getAppIcon(packageName);
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
     
        //Sessions that are interrupted by less than a second are still counted as one session
        let sessions = [];
        let endIndex = 0;
        for (let i = 0; i < startTimes.length;){            
            let val = startTimes[i];
            let nextVal = ++i >= startTimes.length ? undefined : startTimes[i];
            while (nextVal != undefined && nextVal - val < TIME.SECOND){                
                val = nextVal;
                nextVal = ++i >= startTimes.length ? undefined : startTimes[i];
            }
            let end = endTimes[endIndex]; // Should never be out of bounds                    
            //Any sequential endtimes are seen as duplicates and skipped over            
            while (end < val || (nextVal != undefined && nextVal > endTimes[endIndex + 1])){
                endIndex++;                
                end = endTimes[endIndex];
            }                
            sessions.push({from : new Date(val), to : new Date(end)});
        }
            
        transformedData.push({from: new Date(startTime), to : new Date(Math.min(endTime, Date.now())), sessions: sessions, appName : elem.packageName });                
    })
    return transformedData
}