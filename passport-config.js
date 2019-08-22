const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByUName, getUserById) {
    const authenticateUser = async (uName, password, done) => {
        const user = await getUserByUName(uName);
        if(user === null || user === '') {
            return done(null, false, { message: 'User does not exist'});
        }
        //done(<errorType>, <user:object, false>, <message>)
        try {
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Username or Password incorrect' });
            }
        } catch (e) {
            return done(e);
        }
    };
    passport.use(new LocalStrategy({usernameField: 'uName', passwordField: 'password'}, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        return done(null, await getUserById(id));
    });
}

module.exports = initialize;