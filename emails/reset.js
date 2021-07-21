const keys = require('../keys');

module.exports = function (email, token) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Password recovery',
    html: `
			<h1>Forgot password?</h1>
			<p>If not, ignore this message</p>
			<p>Else tap the link below:</p>
			<p><a href='${keys.BASE_URL}/auth/password/${token}'>Restore access</a></p>
			<hr/>
			<a href='${keys.BASE_URL}'>Course shop</a>
		`,
  };
};
