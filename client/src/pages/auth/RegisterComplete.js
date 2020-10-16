import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';

const Register = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (window.localStorage.getItem('emailForRegistration')) {
      setEmail(window.localStorage.getItem('emailForRegistration'));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Email and Password are required.');

      return;
    }

    if (password.length < 6) {
      toast.error('Password must contain at least 6 characters.');

      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');

      setPassword('');
      setConfirmPassword('');

      return;
    }

    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );

      if (result.user.emailVerified) {
        let user = auth.currentUser;

        await user.updatePassword(password);

        const idTokenResult = await user.getIdTokenResult();

        window.localStorage.removeItem('emailForRegistration');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        toast.success(`${email} has been successfully registered.`);

        history.push('/');
      }
    } catch (error) {
      toast.error(
        'Invalid registration link. Please register this email again.'
      );
    }
  };

  const completeRegisterForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        placeholder="Email"
        type="email"
        className="form-control"
        disabled
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="Password"
        type="password"
        className="form-control"
        autoComplete="new-password"
        disabled={!email}
        autoFocus
      />
      <input
        onChange={(e) => setConfirmPassword(e.target.value)}
        value={confirmPassword}
        placeholder="Confirm Password"
        type="password"
        className="form-control"
        autoComplete="new-password"
        disabled={!email}
      />
      <button
        type="submit"
        className="btn btn-raised"
        disabled={!email || !password || !confirmPassword}
      >
        Complete Registration
      </button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Complete Registration</h4>
          {completeRegisterForm()}
        </div>
      </div>
    </div>
  );
};

export default Register;
