var fortune = require('../lib/fortune.js');
var expect = require('chai').expect;

suite('今日金句测试', function() {
    test('getFortune() 返回一句话', function() {
        expect(typeof fortune.getFortune() === 'string');
    });
});