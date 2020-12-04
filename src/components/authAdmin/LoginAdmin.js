import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginAdmin } from "../../actions/authActionAdmin";
class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {}
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push("/admin/dashboard"); // push user to dashboard when they login
        }
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0)
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            if (this.props.auth.user.type === "student") {
                this.props.history.push("/dashboard");
            } else if (this.props.auth.user.type === "mentor") {
                this.props.history.push("/mentor/dashboard");
            } else if (this.props.auth.user.type === "admin") {
                this.props.history.push("/admin/dashboard");
            }
        }
    }
    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };
    onSubmit = e => {
        e.preventDefault();
        this.setState({ loading: true })
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginAdmin(userData, this.props.history);
        // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
        this.setState({ loading: false })
    };
    render() {
        const { errors } = this.state; return (
            <div className="container">
                <div className="auth">
                    <div className="auth__nav">
                        <Link to="/">Back to home</Link>
                    </div>
                    <form className="auth__form" noValidate onSubmit={this.onSubmit}>
                        <div className="auth__form__control">
                            <label htmlFor="email">Email</label>
                            <input
                                onChange={this.onChange}
                                value={this.state.email}
                                error={errors.email}
                                id="email"
                                type="email"
                            />
                            <span className="error">
                                {errors.email}
                                {errors.emailnotfound}
                            </span>
                        </div>
                        <div className="auth__form__control">
                            <label htmlFor="password">Password</label>
                            <input
                                onChange={this.onChange}
                                value={this.state.password}
                                error={errors.password}
                                id="password"
                                type="password"
                            />
                            <span className="errortext">
                                {errors.password}
                                {errors.passwordincorrect}
                            </span>
                        </div>
                        <div className="auth__form__control">
                            <button type="submit">Login</button>
                        </div>
                    </form>
                    <div className="auth__footer">
                        <Link to="/admin/forgotpass">Forgot Password?</Link>
                    </div>
                </div>
            </div>
        );
    }
}
Login.propTypes = {
    loginAdmin: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(
    mapStateToProps,
    { loginAdmin }
)(Login);