const fs = require("node:fs");
const { exit } = require("node:process");
const {checkFileExists, waitLine} = require("./utils");
const axios = require('axios').default

const ConfPath = './config.json';
const outPath = "./out";

// 获取coll数量信息
async function loadInfo() {
    const op = "info";
    const data = (await axios.post(conf.url, {op})).data;
    return data;
}

// 获取数据
async function loadBatchData(coll, skip, limit) {
    const op = "data";
    const data = (await axios.post(conf.url, {op, coll, skip, limit})).data;
    return data;
}

// 获取一个coll的数据
async function loadColl(coll, count) {
    let res = [];
    console.log(coll, count);
    while (res.length < count) {
        const {err, data} = await loadBatchData(coll, res.length, 100);
        if (err) {
            console.error(err);
            return null;
        }
        res = res.concat(data);
        console.log(`[${res.length}/${count}] loading collection: ${coll}`)
    }
    return res;
}


var conf = null;
async function readConfig() {
    var dirExists = await checkFileExists(ConfPath);
    if (!dirExists) {
        await inputConf();
    }
    conf = JSON.parse(fs.readFileSync(ConfPath, 'utf-8'));
    return true;
}


async function inputConf() {
    conf = {
        "comment": [
            "// 注释：",
            "// Laf console上获取信息，注意信息安全。终端黑框中右键可以粘贴。",
            "// 注意只修改双引号里的字符！源码地址：https://github.com/sysucats/export_laf_db"
        ],
    };
    console.log(conf.comment.slice(0, -1).join("\n"));

    // 获取输入
    conf.url = await waitLine("Laf addRecords 函数地址:");

    await fs.promises.writeFile(ConfPath, JSON.stringify(conf, null, 4));
}

// 把list改成一行一个json
async function dumpColl(data) {
    let res = [];
    for (const item of data) {
        res.push(JSON.stringify(item));
    }
    return res.join("\n");
}

async function main() {
    if (!fs.existsSync(outPath)) {
        await fs.promises.mkdir(outPath)
    }
    const readSuccess = await readConfig();
    if (!readSuccess) {
        await waitLine(`\n======== [ERROR] read config error! Press "Enter" to exit. ========`);
        exit();
    }

    const {err, data} = await loadInfo();
    if (err) {
        console.error(err);
        await waitLine(`\n======== Press "Enter" to exit. ========`);
        exit();
    }

    // 处理多个collection
    for (var coll in data) {
        const collData = await loadColl(coll, data[coll]);
        const lines = await dumpColl(collData);
        // console.log(collData);
        await fs.promises.writeFile(`${outPath}/${coll}.json`, lines);
    }

    await waitLine(`\n======== Press "Enter" to exit. ========`);
    exit();
}


try {
    main();
} catch (error) {
    console.log(error);
    waitLine(`\n======== Press "Enter" to exit. ========`);
}
