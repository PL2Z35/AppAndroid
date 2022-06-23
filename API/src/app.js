const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { config } = require('./database/keys');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const morgan = require('morgan');
const passport = require('passport');
require('./lib/passport');


app.set("port", process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.use(flash());
app.engine(
    ".hbs",
    exphbs.engine({
        defaultLayout: "main",
        extname: ".hbs",
        layoutsDir: path.join(app.get("views"), "layouts"),
        partialsDir: path.join(app.get("views"), "partials"),
    })
);
app.use(session({
    secret: 'loginnodemysql',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(config),
    cookie: {
        secure: false
    }
}));

app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.success = req.flash("success");
    app.locals.message = req.flash("message");
    app.locals.user = req.user;
    next();
});
app.set("view engine", ".hbs");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", require('./routes/login'))

module.exports = app;