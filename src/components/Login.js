import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import '../styles/login.css';
import { postLogin } from '../functions/postLogin';
import { setCredentials } from '../functions/credentials';
import history from '../routes/history';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            error: null,
        }
        this.postLogin = postLogin;
        this.setCredentials = setCredentials;
    }

    changeUsername(e) {
        this.setState({
            username: e.target.value
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

    changePassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    handleSubmit(e) {
        console.log("Submit called");
        e.preventDefault();
        let { username, password } = this.state;
        if (username && password) {
            this.postLogin(username, password)
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

    sendToSignUp() {
        history.push("/signup");
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
                            label="Login"
                            fullWidth={true}
                            primary={true}
                            onClick={this.handleSubmit.bind(this)}
                        />
                    </div>
                    <div className="textBox">
                        <RaisedButton
                            label="Sign up"
                            fullWidth={true}
                            onClick={this.sendToSignUp.bind(this)}
                        />
                    </div>
                </form>
            </div>
        )
    }
}