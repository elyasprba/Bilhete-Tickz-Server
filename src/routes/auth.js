const Router = require('express').Router();

const authControllers = require('../controllers/auth');
const { checkDuplicate, checkToken, registerInput, loginInput, emailToken, forgotInput } = require('../middlewares/auth');

// register
Router.post('/new', checkDuplicate, authControllers.register);
// sign in
Router.post('/', authControllers.signIn);
// confirm email
// Router.get("/confirm/:token", emailToken, authControllers.confirmEmail);
// forgot-password
Router.get('/forgot-password/:email', forgotInput, authControllers.forgotPassword);
// sign out
// Router.delete("/", checkToken, authControllers.logout);

module.exports = Router;
