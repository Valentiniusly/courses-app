const keys = require('../keys');

module.exports = function (email) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Registration successful',
    html: `
			<h1>Welcome to our shop</h1>
			<p>you have successfully created an account with email - ${email}</p>
			<hr/>
			<a href='${keys.BASE_URL}'>Course shop</a>
		`,
  };
};
