import React from "react";
import { Link } from "react-router-dom";
import SignUpForm from "../components/forms/SignUpForm/SignUpForm";
import FormBtn from "../components/forms/FormBtn/FormBtn";
import '../components/forms/SignUpForm/SignUpForm.css';

function SignUpPage() {
    return (
            <div className="auth-page-container"> {/* Общий класс для страниц Auth */}
                <h1 className="page-title">Language Galaxy</h1>
                <SignUpForm />
                <div className="alternative-action">
                    <p>Already have an account?</p>
                   <Link to="/signin" className="alternative-link-button"> <FormBtn btnValue='Sign In' /></Link> 
                </div>
            </div>
    )
}

export default SignUpPage;