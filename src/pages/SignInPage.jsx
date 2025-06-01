import React from "react";
import { Link } from "react-router-dom";
import SignInForm from "../components/forms/SignInForm/SignInForm";
import FormBtn from "../components/forms/FormBtn/FormBtn";
import '../components/forms/SignUpForm/SignUpForm.css';
// import './SignInPage.css';

function SignInPage() {
    return (
        <div className="auth-page-container"> 
            <h1 className="page-title">Увійти до Language Galaxy</h1>
            <SignInForm />
            <div className="alternative-action">
                <p>Don't have an account?</p>
                <Link to="/registrate" className="alternative-link-button"> <FormBtn btnValue='Registe' /> </Link>
            </div>
        </div>
    );
}
export default SignInPage;