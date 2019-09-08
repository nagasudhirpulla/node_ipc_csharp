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
const fromTimeStr = convertTimeToInpStr(new Date((new Date()).getTime() - 20 * 60 * 1000));
const toTimeStr = convertTimeToInpStr(new Date((new Date()).getTime() - 10 * 60 * 1000));
const measId = "222";

const getIpcResultAsync = (fromTimeStr: string, toTimeStr: string, measId: string): Promise<string> => {
    return new Promise(function (resolve, reject) {
        const ipc = spawn(`./IpcListenerApp.exe`, ["--from_time", fromTimeStr, "--to_time", toTimeStr, "--meas_id", measId]);

        ipc.stderr.once('data', function (data) {
            // console.log(data.toString());
            reject(data.toString());
        });

        ipc.stdout.once('data', function (data) {
            // console.log(data.toString());
            resolve(data.toString());
        });

        ipc.once('exit', (code) => {
            // console.log(`Ipc exe to exit with code: ${code}`);
            reject("No output before exit");
        });
    });
}
// const ipc = spawn(`./IpcListenerApp.exe`, ["--from_time", fromTimeStr, "--to_time", toTimeStr, "--meas_id", measId]);

// ipc.stderr.on('data', function (data) {
//     console.log(data.toString());
// });

// ipc.stdout.on('data', function (data) {
//     console.log(data.toString());
// });

// ipc.on('exit', (code) => {
//     console.log(`Ipc exe to exit with code: ${code}`);
// });

getIpcResultAsync(fromTimeStr, toTimeStr, measId).then((res) => {
    console.log(res);
});