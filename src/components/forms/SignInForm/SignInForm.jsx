import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../firebase';
import InputField from "../../common/InputField/InputField";
import FormBtn from "../FormBtn/FormBtn";
import '../SignUpForm/SignUpForm.css';

import EnvelopeIcon from '../../../assets/icons/EnvelopeIcon.svg';
import KeyIcon from '../../../assets/icons/KeyIcon.svg';

const SignInForm = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.email || !formData.password) {
            setError('Please enter both email and password.');
            return;
        }
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            console.log('User signed in successfully');
            navigate(from, { replace: true });
        } catch (err) {
            console.error('Error signing in:', err);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else {
                setError('Failed to sign in. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="signin-form" onSubmit={handleSubmit}>
            {error && <p className="firebase-error-message">{error}</p>}
            <InputField label="Email" type="email" icon={EnvelopeIcon} placeholder="Enter your email" value={formData.email} onChange={handleChange('email')} required disabled={loading} />
            <InputField label="Password" type="password" icon={KeyIcon} placeholder="Enter your password" value={formData.password} onChange={handleChange('password')} required disabled={loading} />
            <FormBtn btnValue={loading ? 'Signing In...' : 'Sign In'} disabled={loading} />
        </form>
    );
};

export default SignInForm;