// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { doc, setDoc } from 'firebase/firestore';
// import { auth, db } from '../firebase.js';
// import InputField from '../components/common/InputField/InputField.jsx';
// import './SignUpForm.css';

// import UserIcon from '../assets/icons/UserIcon.svg';
// import EnvelopeIcon from '../assets/icons/EnvelopeIcon.svg';
// import PhoneIcon from '../assets/icons/PhoneIcon.svg';
// import KeyIcon from '../assets/icons/KeyIcon.svg';

// const SignUpForm = () => {
//     const [formData, setFormData] = useState({
//         firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: ''
//     });
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [firebaseError, setFirebaseError] = useState('');
//     const navigate = useNavigate();

//     const handleChange = (field) => (e) => {
//         setFormData(prev => ({ ...prev, [field]: e.target.value }));
//         if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
//         if (firebaseError) setFirebaseError('');
//     };

//     const validateForm = () => {
//         const newErrors = {};
//         if (!formData.firstName) newErrors.firstName = 'First name is required';
//         if (!formData.lastName) newErrors.lastName = 'Last name is required';
//         if (!formData.email) {
//             newErrors.email = 'Email is required';
//         } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//             newErrors.email = 'Email is invalid';
//         }
//         if (!formData.phone) newErrors.phone = 'Phone number is required';
//         if (!formData.password) {
//             newErrors.password = 'Password is required';
//         } else if (formData.password.length < 6) {
//             newErrors.password = 'Password must be at least 6 characters';
//         }
//         if (formData.password !== formData.confirmPassword) {
//             newErrors.confirmPassword = 'Passwords do not match';
//         }
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setFirebaseError('');
//         if (!validateForm()) return;

//         setLoading(true);
//         try {
//             const userCredential = await createUserWithEmailAndPassword(
//                 auth,
//                 formData.email,
//                 formData.password
//             );
//             const user = userCredential.user;

//             await updateProfile(user, {
//                 displayName: `${formData.firstName} ${formData.lastName}`
//             });

//             await setDoc(doc(db, "users", user.uid), {
//                 uid: user.uid,
//                 firstName: formData.firstName,
//                 lastName: formData.lastName,
//                 email: formData.email,
//                 phone: formData.phone,
//                 createdAt: new Date()
//             });

//             console.log('User registered successfully:', user);
//             navigate('/'); // Редирект на главную после успешной регистрации
//         } catch (error) {
//             console.error('Error during registration:', error);
//             if (error.code === 'auth/email-already-in-use') {
//                 setFirebaseError('This email address is already in use.');
//             } else if (error.code === 'auth/weak-password') {
//                 setFirebaseError('Password is too weak. Must be at least 6 characters.');
//             } else {
//                 setFirebaseError('Failed to register. Please try again.');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <form className="signup-form" onSubmit={handleSubmit}>
//             {firebaseError && <p className="firebase-error-message">{firebaseError}</p>}
//             <div className="form-row">
//                 <InputField label="First Name" icon={UserIcon} placeholder="Enter your first name" value={formData.firstName} onChange={handleChange('firstName')} error={errors.firstName} required disabled={loading} />
//                 <InputField label="Last Name" icon={UserIcon} placeholder="Enter your last name" value={formData.lastName} onChange={handleChange('lastName')} error={errors.lastName} required disabled={loading} />
//             </div>
//             <InputField label="Email" type="email" icon={EnvelopeIcon} placeholder="Enter your email" value={formData.email} onChange={handleChange('email')} error={errors.email} required disabled={loading} />
//             <InputField label="Phone Number" type="tel" icon={PhoneIcon} placeholder="Enter your phone number" value={formData.phone} onChange={handleChange('phone')} error={errors.phone} required disabled={loading} />
//             <InputField label="Password" type="password" icon={KeyIcon} placeholder="Enter your password" value={formData.password} onChange={handleChange('password')} error={errors.password} required disabled={loading} />
//             <InputField label="Confirm Password" type="password" icon={KeyIcon} placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange('confirmPassword')} error={errors.confirmPassword} required disabled={loading} />
//             <FormBtn btnValue={loading ? 'Registering...' : 'Register'} disabled={loading} />
//         </form>
//     );
// };

// export default SignUpForm;