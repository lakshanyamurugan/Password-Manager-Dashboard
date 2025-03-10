import React, { Component } from 'react';
import './App.css';
import { FaCopy, FaEdit, FaTrash } from 'react-icons/fa';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Auth State
      page: 'login', // 'login' | 'signup' | 'dashboard'
      email: '',
      password: '',
      confirmPassword: '',
      loggedInUser: '',

      // Password Manager State
      website: '',
      username: '',
      pass: '',
      passwords: [],
      alertVisible: false,
      editing: false,
      editIndex: null,
      showPassword: false,
    };
  }

  componentDidMount() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      this.setState({ page: 'dashboard', loggedInUser });
    }
  }

  // ------------- AUTHENTICATION LOGIC -------------

  handleSignup = () => {
    const { email, password, confirmPassword } = this.state;

    if (!email.endsWith('@gmail.com')) {
      alert('Only Gmail addresses are allowed');
      return;
    }

    if (password.length < 6) {
      alert('Password should be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Save user in localStorage
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', password);

    alert('Signup Successful! Please login.');
    this.setState({
      page: 'login',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  handleLogin = () => {
    const { email, password } = this.state;
    const savedEmail = localStorage.getItem('userEmail');
    const savedPassword = localStorage.getItem('userPassword');

    if (email === savedEmail && password === savedPassword) {
      this.setState({ page: 'dashboard', loggedInUser: email });
      localStorage.setItem('loggedInUser', email);
    } else {
      alert('Invalid email or password!');
    }
  };

  handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    this.setState({ page: 'login', email: '', password: '', loggedInUser: '' });
  };

  // ------------- PASSWORD MANAGER LOGIC -------------

  copyPassword = async (pass) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = pass;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.setState({ alertVisible: true });
      setTimeout(() => {
        this.setState({ alertVisible: false });
      }, 2000);
    } catch (error) {
      console.error('Error copying text:', error);
    }
  };

  deletePassword = (website) => {
    const updatedPasswords = this.state.passwords.filter(
      (e) => e.website !== website
    );
    this.setState({ passwords: updatedPasswords });
    alert(`Successfully deleted ${website}'s password`);
  };

  savePassword = () => {
    const { website, username, pass, editing, editIndex, passwords } = this.state;

    if (!website || !username || !pass) {
      alert('Please fill in all fields.');
      return;
    }

    if (editing && editIndex !== null) {
      const updatedPasswords = [...passwords];
      updatedPasswords[editIndex] = { website, username, password: pass };
      this.setState({
        passwords: updatedPasswords,
        editing: false,
        editIndex: null,
        website: '',
        username: '',
        pass: '',
      });
    } else {
      const newPassword = { website, username, password: pass };
      this.setState((prevState) => ({
        passwords: [...prevState.passwords, newPassword],
        website: '',
        username: '',
        pass: '',
      }));
    }
  };

  editPassword = (index) => {
    const { passwords } = this.state;
    this.setState({
      editing: true,
      editIndex: index,
      website: passwords[index].website,
      username: passwords[index].username,
      pass: passwords[index].password,
    });
  };

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  renderPasswordList = () => {
    const { passwords, showPassword } = this.state;

    return passwords.map((item, index) => (
      <div className="passwordItem" key={index}>
        <div className="listItem">
          <div className="listLabel">Website:</div>
          <div className="listValue">{item.website}</div>
          <div className="listLabel">Username:</div>
          <div className="listValue">{item.username}</div>
          <div className="listLabel">Password:</div>
          <div className="listValue">
            <span className="passwordField">
              {showPassword ? item.password : item.password.replace(/./g, '*')}
            </span>
          </div>
          <div className="passwordButtons">
            <button
              className="showPasswordButton"
              onClick={this.togglePasswordVisibility}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="iconContainer">
            <div className="icon" onClick={() => this.copyPassword(item.password)}>
              <FaCopy size={20} color="#555" />
            </div>
            <div className="icon" onClick={() => this.editPassword(index)}>
              <FaEdit size={20} color="#555" />
            </div>
            <div
              className="icon"
              onClick={() => this.deletePassword(item.website)}
            >
              <FaTrash size={20} color="#555" />
            </div>
          </div>
        </div>
      </div>
    ));
  };

  // ------------- RENDER FORMS -------------

  renderLogin = () => {
    const { email, password } = this.state;
    return (
      <div className="formContainer">
        <h1> PASSWORD MANAGER </h1>
        <h1>Login</h1>
        <input
          className="input"
          type="email"
          placeholder="Enter Gmail"
          value={email}
          onChange={(e) => this.setState({ email: e.target.value })}
        />
        <input
          className="input"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => this.setState({ password: e.target.value })}
        />
        <button className="submitButton" onClick={this.handleLogin}>
          Login
        </button>
        <p>
          Don't have an account?{' '}
          <span
            className="link"
            onClick={() => this.setState({ page: 'signup' })}
          >
            Sign Up
          </span>
        </p>
      </div>
    );
  };

  renderSignup = () => {
    const { email, password, confirmPassword } = this.state;
    return (
      <div className="formContainer">
        <h1>Sign Up</h1>
        <input
          className="input"
          type="email"
          placeholder="Enter Gmail"
          value={email}
          onChange={(e) => this.setState({ email: e.target.value })}
        />
        <input
          className="input"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => this.setState({ password: e.target.value })}
        />
        <input
          className="input"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => this.setState({ confirmPassword: e.target.value })}
        />
        <button className="submitButton" onClick={this.handleSignup}>
          Sign Up
        </button>
        <p>
          Already have an account?{' '}
          <span
            className="link"
            onClick={() => this.setState({ page: 'login' })}
          >
            Login
          </span>
        </p>
      </div>
    );
  };

  renderDashboard = () => {
    const { website, username, pass, editing, loggedInUser } = this.state;

    return (
      <div className="container">
        <div className="content">
          <h1 className="heading">Password Manager</h1>
          <button className="logoutButton" onClick={this.handleLogout}>
            Logout ({loggedInUser})
          </button>

          <h2 className="subHeading">
            Your Passwords
            {this.state.alertVisible && <span id="alert">(Copied!)</span>}
          </h2>
          {this.state.passwords.length === 0 ? (
            <p className="noData">No Data To Show</p>
          ) : (
            <div className="table">{this.renderPasswordList()}</div>
          )}

          <h2 className="subHeading">
            {editing ? 'Edit Password' : 'Add a Password'}
          </h2>
          <input
            className="input"
            placeholder="Website"
            value={website}
            onChange={(e) => this.setState({ website: e.target.value })}
          />
          <input
            className="input"
            placeholder="Username"
            value={username}
            onChange={(e) => this.setState({ username: e.target.value })}
          />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={pass}
            onChange={(e) => this.setState({ pass: e.target.value })}
          />
          <div className="submitButton" onClick={this.savePassword}>
            <span className="submitButtonText">
              {editing ? 'Update Password' : 'Add Password'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { page } = this.state;

    if (page === 'login') return this.renderLogin();
    if (page === 'signup') return this.renderSignup();
    if (page === 'dashboard') return this.renderDashboard();
  }
}

export default App;
