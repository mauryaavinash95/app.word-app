import React from 'react';
import AppBar from 'material-ui/AppBar';
import LogoutIcon from 'material-ui/svg-icons/action/exit-to-app';
import history from '../routes/history';
import { logout } from '../functions/logout';
import '../styles/header.css';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: this.props.authenticated
        }
    }

    componentWillReceiveProps(newProps) {
        if (JSON.stringify(newProps) !== JSON.stringify(this.props)) {
            this.setState({
                authenticated: newProps.authenticated
            });
        }
    }

    handleLogout() {
        logout()
            .then((res) => {
                console.log("Logout Successful");
                alert("Logout Successful");
                history.push("/")
                history.go();
            })
            .catch((err) => {
                console.log("Error: ", err);
                alert("Couldn't log you out now, please try later");
            })
    }

    render() {
        return (
            <div className="titleBar">
                <AppBar
                    title={<span>Word-App</span>}
                    showMenuIconButton={false}
                    iconElementRight={
                        <div>
                            {
                                this.state.authenticated ?
                                    <div style={{ padding: "0.6rem" }} onClick={this.handleLogout.bind(this)} data-toggle="tooltip" title="Logout">
                                        <LogoutIcon />
                                    </div>
                                    :
                                    undefined
                            }
                        </div>
                    }
                    style={{
                        display: "flex",
                        maxWidth: "30rem",
                        margin: "auto",
                    }}
                />
            </div>
        )
    }
}