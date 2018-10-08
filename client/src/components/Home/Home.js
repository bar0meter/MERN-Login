import React, { Component } from "react";
import "whatwg-fetch";

import { getFromStorage, setInStorage } from "../../storage";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: "",
      signUpError: "",
      signInError: "",
      signInEmail: "",
      signInPassword: "",
      signUpEmail: "",
      signUpPassword: "",
      signUpFirstName: "",
      signUpLastName: ""
    };
  }

  componentDidMount() {
    const obj = getFromStorage("the_main_app");
    if (obj && obj.token) {
      const { token } = obj;
      fetch("http://localhost:8080/api/users/accounts/verify?token=" + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({ token, isLoading: false });
          } else {
            this.setState({ isLoading: false });
          }
        });
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  onChangeSignInEmail = e => {
    this.setState({ signInEmail: e.target.value });
  };

  onChangeSignInPassword = e => {
    this.setState({ signInPassword: e.target.value });
  };

  onChangeSignUpEmail = e => {
    this.setState({ signUpEmail: e.target.value });
  };

  onChangeSignUpPassword = e => {
    this.setState({ signUpPassword: e.target.value });
  };

  onChangeSignUpFirstName = e => {
    this.setState({ signUpFirstName: e.target.value });
  };

  onChangeSignUpLastName = e => {
    this.setState({ signUpLastName: e.target.value });
  };

  onSignIn = () => {
    const { signInEmail, signInPassword } = this.state;

    this.setState({ isLoading: true });

    fetch("http://localhost:8080/api/users/accounts/signin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setInStorage("the_main_app", { token: json.token });
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: "",
            signInPassword: "",
            token: json.token
          });
        } else {
          this.setState({ signInError: json.message, isLoading: false });
        }
      });
  };

  onSignUp = () => {
    const {
      signUpEmail,
      signUpPassword,
      signUpFirstName,
      signUpLastName
    } = this.state;

    this.setState({ isLoading: true });

    fetch("http://localhost:8080/api/users/accounts/signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: "",
            signUpPassword: "",
            signUpFirstName: "",
            signUpLastName: ""
          });
        } else {
          this.setState({ signUpError: json.message, isLoading: false });
        }
      });
  };

  logout = () => {
    this.setState({ isLoading: true });
    const obj = getFromStorage("the_main_app");
    if (obj && obj.token) {
      const { token } = obj;
      fetch("http://localhost:8080/api/users/accounts/logout?token=" + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({ token: "", isLoading: false });
          } else {
            this.setState({ isLoading: false });
          }
        });
    } else {
      this.setState({
        isLoading: false
      });
    }
  };

  render() {
    const {
      isLoading,
      token,
      signInError,
      signUpError,
      signInEmail,
      signInPassword,
      signUpEmail,
      signUpPassword,
      signUpFirstName,
      signUpLastName
    } = this.state;

    if (isLoading) {
      return (
        <div>
          <p>Loading....</p>
        </div>
      );
    }

    if (!token) {
      return (
        <div>
          <div>
            <div>{signInError ? <p>{signInError}</p> : null}</div>
            <p>Sign In</p>
            <input
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={this.onChangeSignInEmail}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={this.onChangeSignInPassword}
            />
            <br />
            <button onClick={this.onSignIn}>Sign In</button>
          </div>
          <div>
            <div>{signUpError ? <p>{signUpError}</p> : null}</div>
            <p>Sign Up</p>
            <input
              type="text"
              placeholder="First Name"
              value={signUpFirstName}
              onChange={this.onChangeSignUpFirstName}
            />
            <br />
            <input
              type="text"
              placeholder="Last Name"
              value={signUpLastName}
              onChange={this.onChangeSignUpLastName}
            />
            <br />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={this.onChangeSignUpEmail}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={this.onChangeSignUpPassword}
            />
            <br />
            <button onClick={this.onSignUp}>Sign Up</button>
          </div>
        </div>
      );
    }
    return (
      <div>
        <p>Account</p>
        <button onClick={this.logout}>Logout</button>
      </div>
    );
  }
}

export default Home;
