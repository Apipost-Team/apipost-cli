#!/usr/bin/env node
const { Command } = require('commander');
const pkginfo = require('pkginfo');
const { Collection, Runtime } = require('apipost-runtime');
const { isObject } = require('lodash');
const downloadTestReport = require('./template');
const nodeFetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const os = require('os');
const dayjs = require('dayjs');
const APTools = require('apipost-inside-tools');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const program = new Command();
const homedir = os.homedir();
const request = require('request');
let now = dayjs();
let formattedTime = now.format('YYYY-MM-DD HH:mm:ss');

program.version(pkginfo.version, '-v, --version', 'apipost-cli 当前版本')

let last_msg = "";

const cliOption = {
  reporters: 'cli',
  outDir: './apipost-reports',
  outFile: '',
  iterationData: '',
  iterationCount: 1,
  ignoreRedirects: 0,
  maxRequestLoop: 5,
  timeoutRequest: 0,
  timeoutScript: 5000,
  delayRequest: 0,
  externalProgramPath: process.cwd(),
  insecure: 1,
  rejectUnauthorized: 1,
  sslClientCertList: '', //客户端证书配置列表文件的路径。此选项优先于sslClientCert、sslClientKey和sslClientPassphrase。
  sslClientCert: '', //"certificate": '', // 客户端证书地址
  sslClientKey: '', // "key": '', //客户端证书私钥文件地址
  sslClientPassphrase: '', //  "passphrase": '' // 私钥密码
  sslClientPfx: '', //"pfx": '', // pfx 证书地址
  sslExtraCaCerts: '', //"certificateAuthority": '', // ca证书地址
  webHook: ''
}

const emitRuntimeEvent = (msg, request) => {
  try {
    last_msg = msg; //只记录最后结果
    if (isObject(msg)) {
      // 完成
      if (msg?.action === 'complate') {
        // if (validator.isURL(options.webHook)) {}
        downloadTestReport(msg?.test_report || {}, cliOption, request);
      }
    }
  } catch (error) { }
}

const runTestEvents = async (data, options) => {
  if (!isObject(data)) {
    fs.appendFileSync(path.join(homedir, 'apipost-cli-error.log'), formattedTime + '\t链接地址数据不正确\n');
    process.exit(1)
    return;
  }
  _.merge(cliOption, options)

  const newOptions = {
    ...data,
    option: {
      ...data.option,
      iterationCount: _.toNumber(cliOption.iterationCount),
      sleep: _.toNumber(cliOption.delayRequest)
    }
  }

  //fix apipost-runtime@126 修复数option env 不为空时，pre_url 重命名为 env_pre_url
  if (_.has(newOptions, 'option.env.pre_url') && (!_.has(newOptions, 'option.env.env_pre_url'))) {
    _.set(newOptions, 'option.env.env_pre_url', _.get(newOptions, 'option.env.pre_url'));
  }
  if (_.has(newOptions, 'option.env.name') && (!_.has(newOptions, 'option.env.env_name'))) {
    _.set(newOptions, 'option.env.env_name', _.get(newOptions, 'option.env.name'));
  }
  if (_.has(newOptions, 'option.env.pre_urls') && (!_.has(newOptions, 'option.env.env_pre_urls'))) {
    _.set(newOptions, 'option.env.env_pre_urls', _.get(newOptions, 'option.env.pre_urls'));
  }


  // 外部数据文件
  if (cliOption.iterationData != '') {
    try {
      let interData = await APTools.str2testDataAsync(fs.readFileSync(String(cliOption.iterationData), "utf-8"));

      if (_.isArray(interData)) {
        _.set(newOptions, 'option.iterationData', interData)
      }
    } catch (e) {
      fs.appendFileSync(path.join(homedir, 'apipost-cli-error.log'), `${formattedTime}\t数据文件 ${String(cliOption.iterationData)} 不存在\n`);
    }
  }

  // 设置发送相关选项参数
  _.chain(newOptions)
    .set('option.requester.maxrequstloop', _.toNumber(cliOption.maxRequstLoop))
    .set('option.requester.timeout', _.toNumber(cliOption.timeoutRequest))
    .set('option.requester.timeoutScript', _.toNumber(cliOption.timeoutScript))
    .set('option.requester.followRedirect', cliOption.ignoreRedirects === '1' ? 0 : 1)
    .set('option.requester.strictSSL', _.toNumber(cliOption.insecure) ? 0 : 1)
    .set('option.requester.externalPrograms', cliOption.externalProgramPath)
    .tap(() => {
      try {
        const sslConfigPath = fs.readFileSync(cliOption.sslClientCertList, 'utf8');
        if (_.isPlainObject(sslConfigPath)) {
          _.merge(cliOption, JSON.parse(sslConfigPath));
        }
      } catch (err) { }
    })
    .set('option.requester.https', {
      rejectUnauthorized: _.toNumber(cliOption.insecure) > 0 ? 1 : -1,
      certificateAuthority: cliOption.sslExtraCaCerts,
      certificate: cliOption.sslClientCert,
      key: cliOption.sslClientKey,
      pfx: cliOption.sslClientPfx,
      passphrase: cliOption.sslClientPassphrase
    })
    .value();
  

  const myCollection = new Collection(newOptions?.test_events, { iterationCount: newOptions?.option?.iterationCount, sleep: newOptions?.option.sleep });
  const runTimeEvent = new Runtime(emitRuntimeEvent, false);

  await runTimeEvent.run(myCollection.definition, newOptions?.option);

  // 处理文件过大错误问题
  let task_status = 0; //默认错的
  if (!last_msg) {
    // error
  } else {
    if (typeof last_msg == 'object') {
      if (last_msg['test_report'] && last_msg['test_report']['event_status']) {
        for (const event_key in last_msg['test_report']['event_status']) {
          if (last_msg['test_report']['event_status'][event_key] == 'passed') {
            task_status = 1;
          } else {
            task_status = 0;
            break
          }
        }
      }
    }
  }

  if (task_status == 0) {
    process.exit(1)
  } else {
    process.exit(0); //正常时候错误码为0
  }
}

const parseCommandString = async (url, options) => {
  _.merge(cliOption, _.mapKeys(options, (value, key) => _.camelCase(key)))

  if (_.intersection(_.split(cliOption.reporters, ','), ['html', 'json'])) {
    const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|[\w-]+(?:\.[\w-]+)+)(?::\d+)?(?:\/[\w-]+)*(?:\?[\w-]+=[\w-]+(?:&[\w-]+=[\w-]+)*)?(?:#[\w-]+)?$/;
    if (!urlRegex.test(url)) {
      console.log(`请执行正确的url链接 [${url}]`);
      fs.appendFileSync(path.join(homedir, 'apipost-cli-error.log'), `${formattedTime}\t请执行正确的url链接 [${url}]\n`);
      return;
    }

    let response = await nodeFetch(url);
  
    let runData = await response.json();

    if (_.has(runData, 'code')) {
      if (runData.code === 10000 && _.isObject(_.get(runData, 'data'))) {
        runData = _.get(runData, 'data');
      } else {
        console.log(`执行失败,  原因 [${runData.msg}]`);
        fs.appendFileSync(path.join(homedir, 'apipost-cli-error.log'), `${formattedTime}\t执行失败, 原因 [${runData.msg}]\n`);
        return;
      }
    }

    if (!_.isArray(_.get(runData, 'test_events')) || !_.isObject(_.get(runData, 'option'))) {
      console.log(`执行失败, 原因 [Json 数据格式不匹配]`);
      fs.appendFileSync(path.join(homedir, 'apipost-cli-error.log'), `${formattedTime}\t执行失败, 原因 [Json 数据格式不匹配]\n`);
      return;
    }

    runTestEvents(runData, cliOption);
  }
}

const bindEvent = (program) => {
  program.command('run <url>')
    .option('-r, --reporters <reporters>', `指定测试报告类型, 支持 cli,html,json `, `${cliOption.reporters}`)
    .option('-n, --iteration-count <n>', `设置循环次数。默认值 ${cliOption.iterationCount}`)
    .option('-d, --iteration-data <path>', `设置用例循环的 [公共] 测试数据路径 (JSON 或 CSV)。如设置将替换默认 [公共] 测试数据。`)
    .option('--external-program-path <path>', `指定 [外部程序] 的所处文件路径，默认值为命令当前执行目录`)
    .option('--out-dir <outDir>', `输出测试报告目录，默认为当前目录下的 ${cliOption.outDir}`)
    .option('--out-file <outFile>', '输出测试报告文件名，不需要添加后缀，默认格式为 apipost-reports-当前 YYYY-MM-DD HH:mm:ss')
    .option('--ignore-redirects <0/1>', `阻止 Apipost 自动重定向返回 3XX 状态码的请求。0 阻止, 1 不阻止`, `${cliOption.ignoreRedirects}`)
    .option('--max-requst-loop <n>', `3XX重定向时的最大定向次数`, cliOption.maxRequestLoop)
    .option('--timeout-request <n>', `指定接口请求超时时间`, cliOption.timeoutRequest)
    .option('--timeout-script <n>', '指定脚本预执行/后执行接口运行超时时间', cliOption.timeoutScript)
    // delay-request
    .option('--delay-request <n>', `指定请求之间停顿间隔 (default: ${cliOption.delayRequest})`, cliOption.delayRequest)
    .option('-k --insecure <n>', `关闭 SSL 校验 (1 关闭, 0 开启。default: ${cliOption.insecure})`, cliOption.insecure)
    .option('--ssl-client-cert-list <path>', `客户端证书配置文件(JSON)的路径。此选项优先于sslClientCert、sslClientKey和sslClientPassphrase。`)
    .option('--ssl-client-cert <path>', `指定客户端证书路径 (CRT file)`)
    .option('--ssl-client-pfx <path>', `指定客户端证书路径 (PFX file)`)
    .option('--ssl-client-key <path>', `指定客户端证书私钥路径 (KEY file) `)
    .option('--ssl-client-passphrase <passphrase>', `指定客户端证书密码 (for protected key)`)
    .option('--ssl-extra-ca-certs <path>', `指定额外受信任的 CA 证书 (PEM)`)
    // .option('--web-hook <url>', `Web-hook用于在任务完成后向指定URL发送数据 (POST) `)
    .action((url, options) => {
      parseCommandString(url, options)
    });

  program.on('-h --help', () => {
    console.log('如何使用 Apipost');
  });
  program.parse();
}

const init = () => {
  bindEvent(program);
}

init();
