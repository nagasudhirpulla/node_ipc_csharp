const spawn = require('child_process').spawn;

const make2Digits = (num: number): string => {
    if (num <= 9 && num >= 0) {
        return '0' + num;
    }
    return '' + num;
};

const convertTimeToInpStr = (time: Date): string => {
    const yr = time.getFullYear();
    const mon = make2Digits(time.getMonth() + 1);
    const day = make2Digits(time.getDate());
    const hr = make2Digits(time.getHours());
    const mins = make2Digits(time.getMinutes());
    const secs = make2Digits(time.getSeconds());
    return `${yr}_${mon}_${day}_${hr}_${mins}_${secs}`;
};


export const getTSDataAsync = (fromTime: Date, toTime: Date, measId: string): Promise<[number, number][]> => {
    return new Promise(function (resolve, reject) {
        const fromTimeStr = convertTimeToInpStr(fromTime);
        const toTimeStr = convertTimeToInpStr(toTime);
        
        let res = "";
        
        const ipc = spawn(`./IpcListenerApp.exe`, ["--from_time", fromTimeStr, "--to_time", toTimeStr, "--meas_id", measId]);

        ipc.stderr.once('data', function (data) {
            reject(data.toString());
        });

        ipc.stdout.on('data', function (data) {
            res += data.toString();
        });

        ipc.once('close', (code: number) => {
            const timeSeries: [number, number][] = JSON.parse(res);
            resolve(timeSeries);
            // console.log(`Ipc exe to exit with code: ${code}`);
        });
    });
}