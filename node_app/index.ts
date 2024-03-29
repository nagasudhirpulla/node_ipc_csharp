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


export const getIpcResultAsync = (fromTime: Date, toTime: Date, measId: string): Promise<string> => {
    return new Promise(function (resolve, reject) {
        const fromTimeStr = convertTimeToInpStr(fromTime);
        const toTimeStr = convertTimeToInpStr(toTime);
        const ipc = spawn(`./IpcListenerApp.exe`, ["--from_time", fromTimeStr, "--to_time", toTimeStr, "--meas_id", measId]);
        let res = "";
        ipc.stderr.once('data', function (data) {
            // console.log(data.toString());
            reject(data.toString());
        });

        ipc.stdout.on('data', function (data) {
            // console.log(data.toString());
            // resolve(`result=` + data.toString());
            res += data.toString();
        });

        ipc.once('close', (code: number) => {
            resolve(res);
            // console.log(`Ipc exe to exit with code: ${code}`);
        });
    });
}