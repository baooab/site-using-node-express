var fortuneCookies = [
    "别流泪心酸，更不应舍弃",
    "河流有源泉",
    "无畏未知",
    "今日有惊喜",
    "尽量保持简单",
];

exports.getFortune = function () {
    var idx = Math.floor(Math.random() * fortuneCookies.length);
    return fortuneCookies[idx];
}