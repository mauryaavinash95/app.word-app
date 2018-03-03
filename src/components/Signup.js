import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import '../styles/login.css';
import { postSignup } from '../functions/postSignup';
import { setCredentials } from '../functions/credentials';
import history from '../routes/history';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            email: "",
            error: null,
        }
        this.postSignup = postSignup;
        this.setCredentials = setCredentials;
    }

    changeUsername(e) {
        this.setState({
            username: e.target.value.toString().toLowerCase()
        })
    }

    changePassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    changeEmail(e) {
        this.setState({
            email: e.target.value.toString().toLowerCase()
        })
    }

    showError(error) {
        this.setState({
            error
        }, () => {
            setTimeout(() => {
                this.setState({
                    error: null,
                })
            }, 10000);
        })

    }

    handleSubmit(e) {
        console.log("Submit called");
        e.preventDefault();
        let { username, password, email } = this.state;
        console.log("Submitted as: ", username, email, password);
        if (username && password && email) {
            this.postSignup(username, email, password)
                .then((resolve) => {
                    console.log("Resolved as: ", resolve);
                    this.setCredentials(resolve.message)
                        .then((res) => {
                            history.push("/home");
                            history.go();
                        })
                        .catch((err) => {
                            console.log("Error while setting credentials: ", err);
                            this.showError(JSON.stringify(err));
                        })
                })
                .catch((err) => {
                    console.log("Err: ", err);
                    this.showError(err);
                })
        } else {
            this.showError("Please enter username & password");
        }
    }

    sendToLogin() {
        history.push("/");
        history.go();
    }

    render() {
        return (
            <div tabIndex="0">
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="textBox">
                        <TextField
                            hintText="Username"
                            fullWidth={true}
                            autoFocus
                            onChange={this.changeUsername.bind(this)}
                            value={this.state.username}
                        />
                    </div>
                    <div className="textBox">
                        <TextField
                            hintText="Email"
                            fullWidth={true}
                            onChange={this.changeEmail.bind(this)}
                            value={this.state.email}
                        />
                    </div>
                    <div className="textBox">
                        <TextField
                            hintText="Password"
                            type="password"
                            fullWidth={true}
                            onChange={this.changePassword.bind(this)}
                            value={this.state.password}
                        />
                    </div>
                    <div style={{ color: "red" }}>
                        {this.state.error}
                    </div>
                    <div className="textBox">
                        <RaisedButton
                            type="submit"
                            label="Sign up"
                            fullWidth={true}
                            primary={true}
                            onClick={this.handleSubmit.bind(this)}
                        />
                    </div>
                    <div className="textBox">
                        <RaisedButton
                            label="Go back to login"
                            fullWidth={true}
                            onClick={this.sendToLogin.bind(this)}
                        />
                    </div>
                </form>
            </div>
        )
    }
}