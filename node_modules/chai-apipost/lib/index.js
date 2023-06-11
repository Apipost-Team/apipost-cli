const _ = require('lodash');
const FIRST_LINE = /(.*?)\n.*/g,

    statusClassReasons = {
        info: 1,
        success: 2,
        redirection: 3,
        clientError: 4,
        serverError: 5
    },

    statusCodeReasons = {
        accepted: { statusCode: 202, name: 'Accepted' },
        withoutContent: { statusCode: 204, name: 'No Content' },
        badRequest: { statusCode: 400, name: 'Bad Request' },
        unauthorised: { statusCode: 401, name: 'Unauthorised' },
        unauthorized: { statusCode: 401, name: 'Unauthorized' },
        forbidden: { statusCode: 403, name: 'Forbidden' },
        notFound: { statusCode: 404, name: 'Not Found' },
        notAcceptable: { statusCode: 406, name: 'Acceptable' },
        rateLimited: { statusCode: 429, name: 'Too Many Requests' }
    };

/**
 * v1.0.4
 */
module.exports = function (chai) {
    const Assertion = chai.Assertion;
    _.forOwn(statusClassReasons, function (classCode, reason) {
        Assertion.addProperty(reason, function () {
            new Assertion(this._obj).to.have.property('code');
            new Assertion(this._obj.code).to.be.a('number');

            const statusClass = Math.floor(this._obj.code / 100);

            this.assert(statusClass === classCode,
                '预期响应代码应为 #{exp}XX，但实际却是 #{act}',
                '预期响应代码不是 #{exp}XX',
                classCode, this._obj.code);
        });
    });

    Assertion.addMethod('statusCodeClass', function (classCode) {
        new Assertion(this._obj).to.have.property('code');
        new Assertion(this._obj.code).to.be.a('number');

        const statusClass = Math.floor(this._obj.code / 100);

        this.assert(statusClass === classCode,
            '预期响应代码应为 #{exp}XX，但实际却是 #{act}',
            '预期响应代码不是 #{exp}XX',
            classCode, this._obj.code);
    });

    Assertion.addProperty("error", function (input) {
        new Assertion(this._obj).to.have.property('code');
        new Assertion(this._obj.code).to.be.a('number');

        const statusClass = Math.floor(this._obj.code / 100);

        this.assert(statusClass === 4 || statusClass === 5,
            '预期响应代码为4XX或5XX，但实际却是 #{act}',
            '预期响应代码不是4XX或5XX',
            null, this._obj.code);
    });

    Assertion.addMethod('statusCode', function (code) {
        new Assertion(this._obj).to.have.property('code');
        new Assertion(this._obj.code).to.be.a('number');

        this.assert(this._obj.code === Number(code),
            '预期响应的状态代码为 #{exp}，但实际却是 #{act}',
            '预期响应没有状态代码 #{act}',
            Number(code), this._obj.code);
    });

    Assertion.addMethod('statusReason', function (reason) {
        new Assertion(this._obj).to.have.property('reason');
        new Assertion(this._obj.reason).to.be.a('function');

        reason = String(reason);

        this.assert(this._obj.reason() === reason,
            '预期响应状态原因应为 #{exp}，但实际却是 #{act}',
            '预期响应没有状态原因 #{act}',
            reason, this._obj.reason());
    });

    _.forOwn(statusCodeReasons, function (reason, assertionName) {
        Assertion.addProperty(assertionName, function () {
            new Assertion(this._obj).to.have.property('reason');
            new Assertion(this._obj.reason).to.be.a('function');
            new Assertion(this._obj).to.have.property('details');
            new Assertion(this._obj.details).to.be.a('function');

            const wantedReason = reason.name.toUpperCase(),
                actualReason = String(this._obj.reason()).toUpperCase(),
                actualStatusCode = Number(this._obj.details().code);

            this.assert(actualReason === wantedReason,
                '预期响应状态原因应为 #{exp}，但实际却是 #{act}',
                '预期响应没有状态原因 #{act}',
                wantedReason, actualReason);
            this.assert(actualStatusCode === reason.statusCode,
                '预期响应的状态代码应为 #{exp}，但实际的响应为 #{act}',
                '预期响应没有状态代码 #{act}',
                reason.statusCode, actualStatusCode);
        });
    });

    Assertion.addProperty('ok', function () {
        if (!sdk.Response.isResponse(this._obj)) {
            this.assert(chai.util.flag(this, 'object'),
                '#{this} 应为真',
                '#{this} 应为假');

            return;
        }

        new Assertion(this._obj).to.have.property('reason');
        new Assertion(this._obj.reason).to.be.a('function');
        new Assertion(this._obj).to.have.property('details');
        new Assertion(this._obj.details).to.be.a('function');

        const wantedReason = 'OK',
            actualReason = String(this._obj.reason()).toUpperCase(),
            actualStatusCode = Number(this._obj.details().code);

        this.assert(actualReason === wantedReason,
            '预期响应状态原因应为 #{exp}，但实际却是 #{act}',
            '预期响应没有状态原因 #{act}',
            wantedReason, actualReason);
        this.assert(actualStatusCode === 200,
            '预期响应的状态代码应为 #{exp}，但实际的响应为 #{act}',
            '预期响应没有状态代码 #{act}',
            200, actualStatusCode);
    });

    Assertion.addMethod('status', function (codeOrReason) {

        if (_.isNumber(codeOrReason)) {
            new Assertion(this._obj).to.have.property('code');
            new Assertion(this._obj.code).to.be.a('number');

            this.assert(this._obj.code === Number(codeOrReason),
                '预期响应的状态代码应为 #{exp}，但实际的响应为 #{act}',
                '预期响应没有状态代码 #{act}',
                Number(codeOrReason), this._obj.code);
        }
        else {
            new Assertion(this._obj).to.have.property('reason');
            new Assertion(this._obj.reason).to.be.a('function');

            this.assert(this._obj.reason() === codeOrReason,
                '预期响应状态原因应为 #{exp}，但实际却是 #{act}',
                '预期响应没有状态原因 #{act}',
                codeOrReason, this._obj.reason());
        }
    });

    Assertion.addMethod('header', function (headerKey, headerValue) {
        new Assertion(this._obj).to.have.property('header');

        let _map = [];
        this._obj.header.forEach(item => {
            _map.push([item.key, item.value])
        })

        let _headers = new Map(_map)

        this.assert(_headers.has(headerKey),
            'header 应含有键 key： \'' + String(headerKey) + '\'',
            'header 不含键 key \'' + String(headerKey) + '\'',
            true, _headers.has(headerKey));

        if (arguments.length < 2) { return; }

        this.assert(_headers.get(headerKey) == headerValue,
            'header头 \'' + String(headerKey) + '\'应为 #{exp}， 实际却是 #{act}',
            'header头 \'' + String(headerKey) + '\'不为 #{act}',
            headerValue, _headers.get(headerKey));
    });

    Assertion.addProperty('withBody', function () {
        new Assertion(this._obj).to.have.property('text');
        new Assertion(this._obj.text).to.be.a('function');

        const bodyText = this._obj.text();

        this.assert(_.isString(bodyText) && bodyText.length,
            '响应体应不为空',
            '响应体应为空');
    });

    Assertion.addProperty('json', function () {
        new Assertion(this._obj).to.have.property('json');
        new Assertion(this._obj.json).to.be.a('function');

        var parseError;

        try { this._obj.json(); }
        catch (e) {
            if (e.name === 'JSONError' && e.message) {
                parseError = e.message.replace(FIRST_LINE, '$1');
            }
            else {
                parseError = e.name + ': ' + e.message;
            }
        }

        this.assert(!parseError,
            '响应体应该为有效的JSON类型，实际却出现错误： ' + parseError,
            '响应体不是有效的JSON类型');
    });

    Assertion.addMethod('body', function (content) {
        let bodyData;

        if (_.isPlainObject(content)) {
            new Assertion(this._obj).to.have.property('json');
            new Assertion(this._obj.json).to.be.a('function');

            try { bodyData = this._obj.json(); }
            catch (e) { }

            this.assert(_.isEqual(bodyData, content),
                '预期响应JSON应该为 #{exp}，实际却是 #{act}',
                '预期响应JSON不应为 #{exp}，而是 #{act}',
                content, bodyData);

            return;
        }

        new Assertion(this._obj).to.have.property('text');
        new Assertion(this._obj.text).to.be.a('function');
        bodyData = this._obj.text();

        if (arguments.length === 0) {
            this.assert(_.isString(bodyData) && bodyData.length,
                '响应体应不为空',
                '响应体应为空');

            return;
        }

        // assert regexp
        if (content instanceof RegExp) {
            this.assert(content.exec(bodyData) !== null,
                '响应正文文本应为 #{exp}，但实际却是 #{act}',
                '响应正文文本为 #{act}，却不是 #{exp}',
                content, bodyData);

            return;
        }

        // assert text or remaining stuff
        this.assert(_.isEqual(bodyData, content),
            '响应正文体应为 #{exp}，但实际却是 #{act}',
            '响应正文体不是 #{exp}',
            content, bodyData);
    });

    Assertion.addMethod('jsonBody', function (path, value) {
        console.log(this._obj)
        new Assertion(this._obj).to.have.property('json');
        new Assertion(this._obj.json).to.be.a('function');

        var jsonBody,
            parseError;

        try { jsonBody = this._obj.json(); }
        catch (e) {
            if (e.name === 'JSONError' && e.message) {
                parseError = e.message.replace(FIRST_LINE, '$1');
            }
            else {
                parseError = e.name + ': ' + e.message;
            }
        }

        if (arguments.length === 0) {
            this.assert(!parseError, '响应体应该为有效的JSON类型，实际却出现错误： ' + parseError,
                '响应体不是有效的JSON类型');

            return;
        }

        if (_.isString(path)) {
            this.assert(_.has(jsonBody, path),
                '响应体中的 #{act} 应该含有属性 #{exp}',
                '响应体中的 #{act} 不应该含有属性 #{exp}',
                path, jsonBody);

            if (arguments.length > 1) {
                jsonBody = _.get(jsonBody, path);
                this.assert(_.isEqual(jsonBody, value),
                    '响应JSON的 "' + path + '" 应为 #{exp}，但实际却是 #{act}',
                    '响应JSON的 "' + path + '" 不为 #{exp}，却是 #{act}',
                    value, jsonBody);
            }
        }
    });

    Assertion.addChainableMethod('responseTime', function (value) {
        const time = chai.util.flag(this, 'number');

        this.assert(_.isNumber(time),
            '预期响应具有有效的响应时间，但实际却是 #{act}',
            '预期响应没有有效的响应时间，但实际却是 #{act}', null, time);

        arguments.length && this.assert(_.isEqual(time, value),
            '响应时间应为 #{act}，实际却是 #{exp}',
            '预期响应时间不等于 #{act}，但实际却是 #{exp}', null, time);
    }, function () {
        new Assertion(this._obj).to.have.property('responseTime');

        chai.util.flag(this, 'number', this._obj.responseTime);
        this._obj = _.get(this._obj, 'responseTime');
    });

    Assertion.addChainableMethod('responseSize', function (value) {
        const size = chai.util.flag(this, 'number');

        this.assert(_.isNumber(size),
            '预期响应具有有效的响应大小，但实际却是 #{act}',
            '预期响应没有有效的响应大小，但实际却是 #{act}', null, size);

        arguments.length && this.assert(_.isEqual(size, value),
            '响应大小应为 #{act}，实际却是 #{exp}',
            '预期响应大小不等于 #{act}，但实际却是 #{exp}', value, size);
    }, function () {
        new Assertion(this._obj).to.have.property('size');
        new Assertion(this._obj.size).to.be.a('function');

        const size = this._obj.size(),
            total = (size.header || 0) + (size.body || 0);

        chai.util.flag(this, 'number', total);
        this._obj = total;
    });

    Assertion.addMethod('jsonSchema', function (schema, options) {
        new Assertion(schema).to.be.an('object');

        var ajv,
            valid,
            data;

        // eslint-disable-next-line prefer-object-spread
        options = Object.assign({
            allErrors: true, // check all rules collecting all errors
            logger: false // logging is disabled
        }, options);

        if (sdk.Response.isResponse(this._obj) || sdk.Request.isRequest(this._obj) &&
            typeof this._obj.json === 'function') {
            data = this._obj.json();
        }
        else {
            data = this._obj;
        }

        ajv = new Ajv(options);
        valid = ajv.validate(schema, data);

        this.assert(valid && !ajv.errors,
            'expected data to satisfy schema but found following errors: \n' +
            ajv.errorsText(),
            'expected data to not satisfy schema', true, valid);
    });
};
