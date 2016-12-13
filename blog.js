var express = require('express');
var app = express();
var fortune = require('./lib/fortune.js');
// 设置 handlebars 视图引擎
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main',
    helpers: {
        section: function(name, options) {
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.disable('x-powered-by');

app.use(function(req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' &&
    req.query.test === '1';
    next();
});

function getWeatherData() {
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            }
        ]
    };
}
app.use(function(req, res, next){
    if(!res.locals.templates) res.locals.templates = {};
    res.locals.templates.weather = getWeatherData();
    next();
});

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/about', function(req, res) {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js',

        message: 'welcome',
        style: req.query.style
        // userid: req.cookie.userid,
        //username: req.session.username
    });
});

app.get('/blog/2016/12/javascript.html', function(req, res) {
    res.render('blog/2016/12/javascript');
});

app.get('/tours/hood-river', function(req, res) {
    res.render('tours/hood-river');
});

app.get('/tours/oregon-coast', function(req, res) {
    res.render('tours/oregon-coast');
});

app.get('/tours/request-group-rate', function(req, res) {
    res.render('tours/request-group-rate');
});

app.get('/headers', function(req, res) {
    res.set('Content-Type','text/plain');
    var s = '';
    for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
    res.send(s);
});

app.get('/no-layout', function(req, res){
    res.render('no-layout', { layout: null });
});

app.get('/custom-layout', function(req, res){
    res.render('custom-layout', { layout: 'custom' });
});

var tours = [
    { id: 0, name: 'Hood River', price: 99.99 },
    { id: 1, name: 'Oregon Coast', price: 149.95 },
];
app.get('/api/tours', function(req, res){
    var toursXml = '<?xml version="1.0"?><tours>' +
            tours.map(function(p) {
                return '<tour price="' + p.price +
                '" id="' + p.id + '">' + p.name + '</tour>';
            }).join('') + '</tours>';

    var toursText = tours.map(function(p) {
        return p.id + ': ' + p.name + ' (' + p.price + ')';
    }).join('\n');

    res.format({
        'application/json': function() {
            res.json(tours);
        },
        'application/xml': function() {
            res.type('application/xml');
            res.send(toursXml);
        },
        'text/xml': function() {
            res.type('text/xml');
            res.send(toursXml);
        },
        'text/plain': function() {
            res.type('text/plain');
            res.send(toursXml);
        }
    });
});
app.put('/api/tour/:id', function(req, res) {
    var updateTour = null;
    tours.some(function(tour){
            if (tour.id == req.params.id) {
                updateTour = tour;
            }
    });
    if( updateTour ) {
        if( req.query.name ) updateTour.name = req.query.name;
        if( req.query.price ) updateTour.price = req.query.price;
        res.json({tours: tours, success: true});
    } else {
        res.json({error: 'No such tour exists.'});
    }
});
app.delete('/api/tour/:id', function(req, res){
    var i;
    for( var i = tours.length-1; i >= 0; i-- ) {
        if( tours[i].id == req.params.id ) break;
    }

    if( i >= 0 ) {
        tours.splice(i, 1);
        res.json({tours: tours, success: true});
    } else {
        res.json({error: 'No such tour exists.'});
    }
});


app.get('/USA', function(req, res){
    res.render('USA', {
        currency: {
            name: 'United States dollars',
            abbrev: 'USD',
        },
        tours: [
            { name: 'Hood River', price: '$99.95' },
            { name: 'Oregon Coast', price: '$159.95' }
        ],
        specialsUrl: '/january-specials',
        currencies: [ 'USD', 'GBP', 'BTC' ],
    });
});

app.get('/jquerytest', function(req, res){
    res.render('jquerytest');
});

// 定制 404 页面
app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

// 定制 500 页面
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('error');
});

app.listen(app.get('port'), function() {
    console.log( '使用了 Express 服务启动在 http://localhost:' +
    app.get('port') + '; 键入 Ctrl-C 终止服务。' );
});