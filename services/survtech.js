//const db = require('./db');
const helper = require('../helper');
//const config = require('../config');
//const psutil = require('psutil');


async function DeviceInf() {
    try {
        const cpuUsage = await getCpuUsage();
        const ramUsage = getRamUsage();
        const diskInfo = await getDiskInfo();

        return {
            cpuUsage,
            ramUsage,
            ...diskInfo,
        };
    } catch (err) {
        console.error(`Error while getting device information: ${err.message}`);
        throw err;
    }
}

async function getCpuUsage() {
    try {
        const cpuPercent = await psutil.cpuPercent({ interval: 1000 });
        return cpuPercent;
    } catch (err) {
        console.error(`Error while getting CPU usage: ${err.message}`);
        throw err;
    }
}

function getRamUsage() {
    try {
        const ramPercent = psutil.virtualMemory().percent;
        return ramPercent;
    } catch (err) {
        console.error(`Error while getting RAM usage: ${err.message}`);
        throw err;
    }
}

async function getDiskInfo() {
    try {
        const diskInfo = await psutil.diskUsage('/');
        const totalDisk = diskInfo.total / (1024 ** 3);  // Convert to GB
        const usedDisk = diskInfo.used / (1024 ** 3);  // Convert to GB

        return { totalDisk, usedDisk };
    } catch (err) {
        console.error(`Error while getting disk information: ${err.message}`);
        throw err;
    }
}

module.exports = {
    DeviceInf,
};