import { getTSDataAsync } from './ipcTSFetcher';


const testIpc = async () => {
    const fromTime = new Date((new Date()).getTime() - 20 * 60 * 1000);
    const toTime = new Date((new Date()).getTime() - 19 * 60 * 1000);
    const measId = "222";
    const timeSeries = await getTSDataAsync(fromTime, toTime, measId);
    console.log(fromTime.getTime());
    console.log(toTime.getTime());
    console.log(timeSeries[0][0]);
    console.log(timeSeries[timeSeries.length - 1][0]);
    console.log(timeSeries.length);
}

testIpc();