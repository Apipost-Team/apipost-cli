const fs = require('fs');
const path = require('path');
const os = require('os');
const dayjs = require('dayjs');
const _ = require('lodash');
const { types } = require('util');
const retry = require('retry');
const validator = require('validator');

const RENDER_TEST_REPORT_HTML_STR = (data = {}) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <style>
        body {
          padding: 30px 20%;
        }
        .apipost-logo {
          width: 121px;
          display: flex;
          align-items: center;
          height: 35px;
        }
        .apipost-report-wrap .apipost-report-wrap-tpl .report-info {
          padding-top: 30px;
        }
  
        .apipost-report-wrap .apipost-report-wrap-tpl .report-info .report-item {
          padding-bottom: 10px;
          color: #666666;
          font-weight: 400;
          font-size: 14px;
        }
  
        .apipost-report-wrap-tpl .report-info .report-item .label {
          display: inline-block;
          width: 135px;
          text-align: right;
        }
  
        .apipost-report-wrap-tpl .report-info .report-item .value {
        }

        .apipost-report-wrap-tpl .report-info .report-item .value a {
          color: #ff6907;
        }

        .apipost-report-wrap .dashed {
          height: 1px;
          width: 100%;
          border: 1px dashed #d8d8d8;
        }
  
        .report-title {
          padding-top: 15px;
          display: flex;
          align-items: center;
        }
        .report-title img {
          width: 15px;
          height: 17px;
        }
        .report-title .title {
          padding-left: 10px;
          font-weight: 400;
          font-size: 18px;
          color: #fa7600;
        }
        .report-table {
          margin-top: 30px;
        }
        .report-table table {
          width: 100%;
          border: 1px solid #e9e9e9;
          border-collapse: collapse;
        }
  
        .report-table table th {
          font-weight: 400;
          font-size: 12px;
          color: #666666;
          background: #f4f4f4;
          height: 32px;
          border: 1px solid #e9e9e9;
          text-align: center;
        }
        .report-table table td {
          background: #ffffff;
          height: 32px;
          color: #666666;
          font-weight: 400;
          font-size: 12px;
          border: 1px solid #e9e9e9;
          text-align: center;
        }
  
        .report-info-list {
          width: 100%;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          padding-top: 15px;
        }
  
        .report-info-list .report-info-item {
          display: inline-flex;
          align-items: center;
          width: 25%;
          padding-bottom: 15px;
        }
  
        .report-info-list .report-info-item img {
          width: 13px;
          height: 13px;
        }
        .report-info-list .report-info-item span {
          padding-left: 10px;
          font-weight: 400;
          font-size: 12px;
          color: #666666;
        }
        .test-detail {
          padding-top: 15px;
          padding-bottom: 15px;
        }
        .test-detail .toggle-arrow {
          display: flex;
          align-items: center;
        }
        .test-detail .icon-bg {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 16px;
          height: 16px;
          background: #f2f2f2;
          border-radius: 3px;
        }
        .test-detail img {
          width: 8px;
          height: 4px;
        }
        .test-detail span.title {
          font-weight: 400;
          font-size: 16px;
          padding-left: 10px;
          color: #2b2b2b;
        }
  
        .test-detail .test-event-list {
          width: 100%;
        }
        .test-detail .test-event-list .test-event-item {
        }
        .test-detail .test-event-list .test-event-item .loop {
          padding: 10px 0;
          font-weight: 400;
          font-size: 12px;
          color: #666666;
        }
        .test-detail .test-event-list .test-event-item .panel {
          display: flex;
          align-items: center;
          height: 36px;
          font-weight: 400;
          font-size: 12px;
          background: #f8f8f8;
          border-radius: 5px;
        }
        .test-event-list .test-event-item .panel .status {
          width: 16px;
          height: 16px;
          margin-left: 25px;
          margin-right: 30px;
        }
        .test-event-list .test-event-item .panel .index {
          padding-right: 30px;
          color: #666666;
        }
  
        .test-event-list .test-event-item .panel .method {
          padding-right: 30px;
          color: #26cea4;
        }
        .test-event-list .test-event-item .panel .name {
          padding-right: 30px;
          color: #666666;
        }
        .test-event-list .test-event-item .panel .link a {
          text-decoration: none;
        }
  
        .test-event-list .test-event-item .item-info {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 10px;
          font-weight: 400;
          font-size: 12px;
          color: #666666;
        }
        .test-event-list .test-event-item .item-info span {
          display: inline-block;
          width: 25%;
        }
  
        .test-event-list .test-event-item .assert-info {
          display: flex;
          width: 100%;
          font-weight: 400;
          font-size: 12px;
        }
        .test-event-list .test-event-item .assert-info .assert-label {
          min-width: 60px;
        }
        .test-event-item .assert-info .response-panel {
          width: 100%;
        }
        .test-event-item .assert-info .response-panel img {
          width: 12px;
          height: 12px;
          margin: 0 10px;
        }
        .test-event-item .assert-info .response-panel .success,
        .test-event-item .assert-info .response-panel .error {
          display: flex;
          align-items: center;
          width: 100%;
          height: 34px;
        }
        .test-event-item .assert-info .response-panel .success {
          background: #f1faf3;
          color: #2ba58f;
        }
  
        .test-event-item .assert-info .response-panel .error {
          background: #ffedee;
          color: #ff4c4c;
        }
        .show {
          display: block;
        }
        .hide {
          display: none;
        }
        .chart-wrap {
          display: flex;
          align-items: center;
          padding-top: 15px;
        }
  
        .chart-wrap .api {
          display: flex;
          align-items: center;
          width: 50%;
        }
        .chart-wrap .api .api-des {
          display: flex;
          flex-direction: column;
          padding-left: 50px;
        }
  
        .chart-wrap .api .api-des .api-title {
          padding-bottom: 15px;
          font-weight: 600;
          font-size: 16px;
          color: #666666;
        }
  
        .chart-wrap .api .api-des .api-label {
          padding-bottom: 10px;
          font-weight: 400;
          font-size: 12px;
          color: #666666;
        }
        #api-pie,
        #assert-pie {
          width: 80px;
          height: 80px;
        }
      </style>
      <script src="https://img.cdn.apipost.cn/cdn/test-report/js/template-web.js"></script>
      <script src="https://img.cdn.apipost.cn/cdn/test-report/js/echarts.min.js"></script>
    </head>
    <body>
      <div id="app">
      <img class="apipost-logo" src="https://img.cdn.apipost.cn/new_www/index_img/apipost-logo_or.svg" />
        <div class="apipost-report-wrap"></div>
      </div>
  
      <script type="text/html" id="tpl">
        <div class="apipost-report-wrap-tpl">
          <h1>{{value.report_name}}</h1>
          <div class="report-info">
            <div class="report-item">
              <span class="label">测试用例/测试套件：</span>
              <span class="value">{{value.report_name}}</span>
            </div>
            <div class="report-item">
              <span class="label">测试时间：</span>
              <span class="value">{{value.start_time}}</span>
            </div>
            <div class="report-item">
              <span class="label">测试工具：</span>
              <span class="value"><a href="https://www.apipost.cn/download.html">apipost客户端</a></span>
            </div>
          </div>
          <div class="dashed"></div>
  
          <div class="report-title">
            <img src="https://img.cdn.apipost.cn/cdn/test-report/img/doc.png" alt="" />
            <span class="title">测试结果</span>
          </div>
          <div class="chart-wrap">
            <div class="api">
              <div id="api-pie"></div>
              <div class="api-des">
                <span class="api-title">接口</span>
                <span class="api-label"
                  >接口通过率：{{formatRate({ passed: value?.http?.passed, failure:
                  value?.http?.failure }, value?.http?.passed)}}</span
                >
                <span class="api-label"
                  >接口失败率：{{formatRate({ passed: value?.http?.passed, failure:
                  value?.http?.failure }, value?.http?.failure)}}</span
                >
              </div>
            </div>
            <div class="api">
              <div id="assert-pie"></div>
              <div class="api-des">
                <span class="api-title">断言</span>
                <span class="api-label"
                  >断言通过率：{{formatRate({ passed: value?.assert?.passed, failure:
                  value?.assert?.failure }, value?.assert?.passed)}}</span
                >
                <span class="api-label"
                  >断言失败率：{{formatRate({ passed: value?.assert?.passed, failure:
                  value?.assert?.failure }, value?.assert?.failure)}}</span
                >
              </div>
            </div>
          </div>
          <div class="report-table">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>请求总数</th>
                  <th>通过</th>
                  <th>失败</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>接口</td>
                  <td>{{value.http.failure + value.http.passed}}</td>
                  <td>{{value.http.passed}}</td>
                  <td>{{value.http.failure}}</td>
                </tr>
                <tr>
                  <td>断言</td>
                  <td>{{value.assert.failure + value.assert.passed}}</td>
                  <td>{{value.assert.passed}}</td>
                  <td>{{value.assert.failure}}</td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <div class="report-info-list">
            <div class="report-info-item">
              <span>开始时间 : {{value.start_time}}</span>
            </div>
            <div class="report-info-item">
              <span>结束时间 : {{value.end_time}}</span>
            </div>
            <div class="report-info-item">
              <span>总耗时 : {{value.long_time}}</span>
            </div>
            <div class="report-info-item">
              <span>总响应时间 : {{value.total_response_time}}ms</span>
            </div>
            <div class="report-info-item">
              <span>平均响应时间 : {{value.average_response_time}}ms</span>
            </div>
            <div class="report-info-item">
              <span>总响应数据大小 : {{value.total_received_data}}kb</span>
            </div>
            <div class="report-info-item">
              <span>未测接口 : {{value.ignore_count}}</span>
            </div>
          </div>
  
          <div class="dashed"></div>
          {{if value.type === 'single'}}
          <div class="report-title">
            <img src="https://img.cdn.apipost.cn/cdn/test-report/img/doc.png" alt="" />
            <span class="title">测试情况</span>
          </div>
  
          <div class="action-wrap">
            <div class="test-detail failed">
              <div class="toggle-arrow">
                <span class="icon-bg">
                  <img src="https://img.cdn.apipost.cn/cdn/test-report/img/arrow.png" class="arrow" alt="" />
                </span>
                <span class="title">失败情况</span>
              </div>
              <div class="test-event-list show">
                {{each value.logList.filter(item => item.http_error === 1 || item.assert_error === 1) item
                key}}
                <div data-text="{{key}}" id="{{key}}" class="test-event-item">
                  <div class="panel">
                    <img class="status" src="https://img.cdn.apipost.cn/cdn/test-report/img/error.png" alt="" />
                    <div class="index">{{key + 1}}</div>
                    <div class="method">{{item?.request?.method}}</div>
                    <span class="name">{{item?.request?.name}}</span>
                    <div class="link">
                      <a href="{{item?.request?.url}}">{{item?.request?.url}}</a>
                    </div>
                  </div>
                  <div class="item-info">
                    <span>请求状况：{{(item?.http_error === 1 || item.assert_error === 1) ? '失败' : '成功'}}</span>
                    <span>状态码：{{item?.response?.data?.response?.code}}</span>
                    <span>响应时间：{{item?.response?.data?.response?.responseTime}}ms</span>
                    <span>响应数据大小：{{item?.response?.data?.response?.responseSize}}kb</span>
                  </div>
                  {{if item?.assert && item?.assert.length > 0}}
                  <div class="assert-info">
                    <span class="assert-label">断言:</span>
                    <div class="response-panel">
                      {{each item?.assert assert cKey}} {{if assert.status === 'error'}}
                      <div class="error">
                        <img src="https://img.cdn.apipost.cn/cdn/test-report/img/error.png" alt="" />
                        <span>{{assert?.expect}}</span>
                      </div>
                      {{/if}} {{if assert.status !== 'error'}}
                      <div class="success">
                        <img src="https://img.cdn.apipost.cn/cdn/test-report/img/success.png" alt="" />
                        <span>{{assert?.expect}}</span>
                      </div>
                      {{/if}} {{/each}}
                    </div>
                  </div>
                  {{/if}}
                </div>
                {{/each}}
              </div>
            </div>
            <div class="dashed"></div>
            <div class="test-detail success">
              <div class="toggle-arrow">
                <span class="icon-bg">
                  <img src="https://img.cdn.apipost.cn/cdn/test-report/img/arrow.png" alt="" />
                </span>
                <span class="title">测试详情</span>
              </div>
              <div class="test-event-list show">
                {{each value.logList item key}}
                <div data-text="{{key}}" id="{{key}}" class="test-event-item">
                  <div class="panel">
                    {{if item.http_error === -1}}
                    <img class="status" src="https://img.cdn.apipost.cn/cdn/test-report/img/success.png" alt="" />
                    {{/if}} {{if item.http_error === 1}}
                    <img class="status" src="https://img.cdn.apipost.cn/cdn/test-report/img/error.png" alt="" />
                    {{/if}}
  
                    <div class="index">{{key + 1}}</div>
                    <div class="method">{{item?.request?.method}}</div>
                    <span class="name">{{item?.request?.name}}</span>
                    <div class="link">
                      <a href="{{item?.request?.url}}">{{item?.request?.url}}</a>
                    </div>
                  </div>
                  <div class="item-info">
                    <span>请求状况：{{(item?.http_error === 1 || item.assert_error === 1) ? '失败' : '成功'}}</span>
                    <span>状态码：{{item?.response?.data?.response?.code}}</span>
                    <span>响应时间：{{item?.response?.data?.response?.responseTime}}ms</span>
                    <span>响应数据大小：{{item?.response?.data?.response?.responseSize}}kb</span>
                  </div>
                  {{if item?.assert && item?.assert.length > 0}}
                  <div class="assert-info">
                    <span class="assert-label">断言:</span>
                    <div class="response-panel">
                      {{each item?.assert assert cKey}} 
                      {{if assert.status === 'error'}}
                      <div class="error">
                        <img src="https://img.cdn.apipost.cn/cdn/test-report/img/error.png" alt="" />
                        <span>{{assert?.expect}}</span>
                      </div>
                      {{/if}} 
                      {{if assert.status !== 'error'}}
                      <div class="success">
                        <img src="https://img.cdn.apipost.cn/cdn/test-report/img/success.png" alt="" />
                        <span>{{assert?.expect}}</span>
                      </div>
                      {{/if}} {{/each}}
                    </div>
                  </div>
                  {{/if}}
                </div>
                {{/each}}
              </div>
            </div>
          </div>
          {{/if}}
          {{if value.type === 'combined'}}
          {{each value.children child childKey}}
            <div data-text="{{childKey}}" id="{{childKey}}">
            <div class="report-title">
            <img src="https://img.cdn.apipost.cn/cdn/test-report/img/doc.png" alt="" />
            <span class="title">{{child?.report_name}}_测试情况</span>
          </div>
  
          <div class="action-wrap">
            <div class="test-detail failed">
              <div class="toggle-arrow">
                <span class="icon-bg">
                  <img src="https://img.cdn.apipost.cn/cdn/test-report/img/arrow.png" class="arrow" alt="" />
                </span>
                <span class="title">失败情况</span>
              </div>
              <div class="test-event-list show">
                {{each value.logList.filter(item => (item.http_error === 1 || item.assert_error === 1) && item.test_id === child.test_id) item
                key}}
                <div data-text="{{key}}" id="{{key}}" class="test-event-item">
                  <div class="panel">
                    <img class="status" src="https://img.cdn.apipost.cn/cdn/test-report/img/error.png" alt="" />
                    <div class="index">{{key + 1}}</div>
                    <div class="method">{{item?.request?.method}}</div>
                    <span class="name">{{item?.request?.name}}</span>
                    <div class="link">
                      <a href="{{item?.request?.url}}">{{item?.request?.url}}</a>
                    </div>
                  </div>
                  <div class="item-info">
                    <span>请求状况：{{(item?.http_error === 1 || item.assert_error === 1) ? '失败' : '成功'}}</span>
                    <span>状态码：{{item?.response?.data?.response?.code}}</span>
                    <span>响应时间：{{item?.response?.data?.response?.responseTime}}ms</span>
                    <span>响应数据大小：{{item?.response?.data?.response?.responseSize}}kb</span>
                  </div>
                  {{if item?.assert && item?.assert.length > 0}}
                  <div class="assert-info">
                    <span class="assert-label">断言:</span>
                    <div class="response-panel">
                      {{each item?.assert assert cKey}} {{if assert.status === 'error'}}
                      <div class="error">
                        <img src="https://img.cdn.apipost.cn/cdn/test-report/img/error.png" alt="" />
                        <span>{{assert?.expect}}</span>
                      </div>
                      {{/if}} {{if assert.status !== 'error'}}
                      <div class="success">
                        <img src="https://img.cdn.apipost.cn/cdn/test-report/img/success.png" alt="" />
                        <span>{{assert?.expect}}</span>
                      </div>
                      {{/if}} {{/each}}
                    </div>
                  </div>
                  {{/if}}
                </div>
                {{/each}}
              </div>
            </div>
            <div class="dashed"></div>
            <div class="test-detail success">
              <div class="toggle-arrow">
                <span class="icon-bg">
                  <img src="https://img.cdn.apipost.cn/cdn/test-report/img/arrow.png" alt="" />
                </span>
                <span class="title">测试详情</span>
              </div>
              <div class="test-event-list show">
                {{each value.logList.filter(item => item.test_id === child.test_id) item key}}
                <div data-text="{{key}}" id="{{key}}" class="test-event-item">
                  <div class="panel">
                    {{if item.http_error === -1}}
                    <img class="status" src="https://img.cdn.apipost.cn/cdn/test-report/img/success.png" alt="" />
                    {{/if}} {{if item.http_error === 1}}
                    <img class="status" src="https://img.cdn.apipost.cn/cdn/test-report/img/error.png" alt="" />
                    {{/if}}
  
                    <div class="index">{{key + 1}}</div>
                    <div class="method">{{item?.request?.method}}</div>
                    <span class="name">{{item?.request?.name}}</span>
                    <div class="link">
                      <a href="{{item?.request?.url}}">{{item?.request?.url}}</a>
                    </div>
                  </div>
                  <div class="item-info">
                    <span>请求状况：{{(item?.http_error === 1 || item.assert_error === 1) ? '失败' : '成功'}}</span>
                    <span>状态码：{{item?.response?.data?.response?.code}}</span>
                    <span>响应时间：{{item?.response?.data?.response?.responseTime}}ms</span>
                    <span>响应数据大小：{{item?.response?.data?.response?.responseSize}}kb</span>
                  </div>
                  {{if item?.assert && item?.assert.length > 0}}
                  <div class="assert-info">
                    <span class="assert-label">断言:</span>
                    <div class="response-panel">
                      {{each item?.assert assert cKey}} 
                      {{if assert.status === 'error'}}
                      <div class="error">
                        <img src="https://img.cdn.apipost.cn/cdn/test-report/img/error.png" alt="" />
                        <span>{{assert?.expect}}</span>
                      </div>
                      {{/if}} 
                      {{if assert.status !== 'error'}}
                      <div class="success">
                        <img src="https://img.cdn.apipost.cn/cdn/test-report/img/success.png" alt="" />
                        <span>{{assert?.expect}}</span>
                      </div>
                      {{/if}} {{/each}}
                    </div>
                  </div>
                  {{/if}}
                </div>
                {{/each}}
              </div>
            </div>
          </div>
            </div>
          {{/each}}
          {{/if}}
        </div>
      </script>
  
      <script>
        template.defaults.imports.formatRate = function (info, per) {
          if (
            typeof info.passed !== 'number' ||
            typeof info.failure !== 'number' ||
            info?.passed + info?.failure === 0
          ) {
            return '0%';
          }
          if (typeof per === 'number') {
            return ((per / (info?.passed + info?.failure)) * 100).toFixed(2) + '%';
          }
          return '-';
        };
  
        const data = ${JSON.stringify(data)};
        console.log(data, 'data')

        document.title = data?.report_name || '';
        const _docContentHtml = template('tpl', {
          value: data,
        });
        const oWrap = document.querySelector('.apipost-report-wrap');
        oWrap.innerHTML = _docContentHtml;
  
        (() => {
          const oApp = document.querySelector('#app'),
            oTestReport = oApp.querySelector('.apipost-report-wrap'),
            oActionWrap = oTestReport.querySelector('.action-wrap'),
            oTestDetailFailed = oActionWrap.querySelector('.test-detail.failed'),
            oTestDetailSuccess = oActionWrap.querySelector('.test-detail.success');
          
          const oTestDetails = document.querySelectorAll('.test-detail');
          let curIndex = 0;
  
          const init = () => {
            bindEvent();
            initPie();
          };
  
          function bindEvent() {
            Array.from(oTestDetails).forEach(item => {
              item.addEventListener('click', handleToggle.bind(null, item), false)
            })
          }
  
          function handleToggle(detailWrap, e) {
            const clickClassName = e.target.className;
            const oTestList = detailWrap.querySelector('.test-event-list');
  
            if (oTestList && ['title', 'toggle-arrow', 'arrow'].includes(clickClassName)) {
              const className = oTestList.className;
              if (className.includes('show')) {
                oTestList.className = 'test-event-list hide';
              } else {
                oTestList.className = 'test-event-list show';
              }
            }
          }
  
          const computedInfo = (info) => {
            if (info?.passed == 0 && info?.failure == 0) {
              return [{ value: info?.passed, name: '接口通过率' }];
            }
            return [
              { value: info?.passed, name: '接口通过率' },
              { value: info?.failure, name: '接口失败率' },
            ];
          };
  
          const getOption = (info, color) => {
            return {
              color: color || ['#26CEA4', 'red'],
              series: [
                {
                  name: 'Access From',
                  type: 'pie',
                  radius: ['50%', '80%'],
                  avoidLabelOverlap: false,
                  label: {
                    show: false,
                    position: 'center',
                  },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: 5,
                    },
                  },
                  labelLine: {
                    show: false,
                  },
                  data: computedInfo(info),
                },
              ],
            };
          };
          function initPie() {
            const apiPieWrap = document.querySelector('#api-pie');
            const assertPieWrap = document.querySelector('#assert-pie');
  
            if (apiPieWrap) {
              const pie = echarts.init(apiPieWrap);
              const options = getOption(
                {
                  passed: data?.http?.passed,
                  failure: data?.http?.failure,
                },
                ['#26CEA4', '#E45252']
              );
              pie && pie.setOption(options);
            }
            if (assertPieWrap) {
              const pie = echarts.init(assertPieWrap);
              const options = getOption(
                {
                  passed: data?.assert?.passed,
                  failure: data?.assert?.failure,
                },
                ['#26CEA4', '#E45252']
              );
              pie && pie.setOption(options);
            }
          }
  
          init();
        })();
      </script>
    </body>
  </html>
  `;
};

const downloadTestReport = async (data, options, request) => {
  // console.log(options)
  const homedir = os.homedir();
  const now = dayjs();
  const formattedTime = now.format('YYYY-MM-DD HH:mm:ss');

  for (const type of options.reporters.split(',')) {
    if (['html', 'json'].indexOf(type) > -1) {
      const reportContent = type === 'html'
        ? RENDER_TEST_REPORT_HTML_STR(data)
        : JSON.stringify(data, null, '\t');

      const finalFilePath = path.resolve(options.outDir, `${options.outFile || `apipost-reports-${formattedTime}`}.${type}`);

      let retries = 0;

      while (true) {
        try {
          fs.writeFileSync(finalFilePath, reportContent);
          break;
        } catch (err) {
          if (err.code === 'ENOENT') {
            fs.mkdirSync(options.outDir, { recursive: true });
            continue;
          }

          if (err.code === 'EMFILE' && retries < 10) {
            retries++;
            await new Promise(resolve => setTimeout(resolve, 50 * retries));
            continue;
          }

          fs.appendFileSync(path.join(homedir, 'apipost-cli-error.log'), `${formattedTime}\t${String(err)}\n`);
          throw err;
        }
      }
    }
  }
};

module.exports = downloadTestReport;