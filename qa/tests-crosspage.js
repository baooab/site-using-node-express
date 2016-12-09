var Browser = require('zombie'),

assert = require('chai').assert;
var browser;
suite('Cross-Page Tests', function() {
    setup(function(){
        browser = new Browser();
    });

    test('从 hood river 页面而来的 referrer 值应该是有的', function(done) {
        var referrer = 'http://localhost:3000/tours/hood-river';
        browser.visit(referrer, function() {
            browser.clickLink('.requestGroupRate', function() {
                assert(browser.field('referrer').value
                === referrer);
                done();
            });
        });
    });

    test('从 oregon coast 页面而来的 referrer 值应该是有的', function(done) {
        var referrer = 'http://localhost:3000/tours/oregon-coast';
        browser.visit(referrer, function() {
            browser.clickLink('.requestGroupRate', function() {
                assert(browser.field('referrer').value === referrer);
                done();
            });
        });
    });

    test('直接访问 "request group rate" 页面，referrer 值应该为空', function(done) {
        browser.visit('http://localhost:3000/tours/request-group-rate', function() {
            assert('' === browser.field('referrer').value);
            done();
        });
    });
});