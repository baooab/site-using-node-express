suite('全局测试', function() {
    test('页面 title 是有效的', function() {
        assert(document.title && document.title.match(/\S/) &&
        document.title.toUpperCase() !== 'TODO');
    });
});