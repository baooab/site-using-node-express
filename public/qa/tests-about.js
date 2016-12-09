suite('"关于" 页面的测试项', function() {
        test('页面应该包含一个 /contact 的 a 标签链接', function(){
        assert($('a[href="/contact"]').length);
    });
});