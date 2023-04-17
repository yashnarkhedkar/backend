const User = require('./schema/user')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')


exports.intializePassport = (passport) => {
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({ email: username });

                if (!user) {
                    return done(null, false);
                }

                const passCheck = await bcrypt.compare(password, user.password);
                if (!passCheck) {
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done(null, false);
            }
        }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    })
}


exports.isAuthenticated = (req, res, next) => {
    if(req.user) return next();
    res.redirect('/login')
}
