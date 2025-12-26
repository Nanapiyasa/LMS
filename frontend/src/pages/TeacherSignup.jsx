// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { teacherAPI } from '../services/api';
// import Sidebar from './TeacherDashboard/Sidebar';
// import Header from './TeacherDashboard/Header';

// export default function TeacherSignup() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     initials: '',
//     first_name: '',
//     last_name: '',
//     address: '',
//     mobile_no: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     // Validation
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters');
//       return;
//     }

//     try {
//       setLoading(true);
//       const submitData = new FormData();
//       submitData.append('initials', formData.initials);
//       submitData.append('first_name', formData.first_name);
//       submitData.append('last_name', formData.last_name);
//       submitData.append('address', formData.address);
//       submitData.append('mobile_no', formData.mobile_no);
//       submitData.append('email', formData.email);
//       submitData.append('password', formData.password);
//       if (image) {
//         submitData.append('image', image);
//       }

//       const response = await teacherAPI.signup(submitData);
      
//       if (response.token) {
//         navigate('/teacher', { replace: true });
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to register teacher');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       <Sidebar />
//       <div className="flex-1 flex flex-col">
//         <Header />
//         <div className="p-8">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">Teacher Registration</h2>

//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Initials */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Initials *
//                   </label>
//                   <input
//                     type="text"
//                     name="initials"
//                     value={formData.initials}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   />
//                 </div>

//                 {/* First Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     First Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="first_name"
//                     value={formData.first_name}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   />
//                 </div>

//                 {/* Last Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Last Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="last_name"
//                     value={formData.last_name}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   />
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email *
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   />
//                 </div>

//                 {/* Mobile No */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Mobile No
//                   </label>
//                   <input
//                     type="tel"
//                     name="mobile_no"
//                     value={formData.mobile_no}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   />
//                 </div>

//                 {/* Address */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Address
//                   </label>
//                   <textarea
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     rows="3"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   />
//                 </div>

//                 {/* Image Upload */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Profile Image
//                   </label>
//                   <div className="flex items-center gap-4">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
//                     />
//                     {imagePreview && (
//                       <img
//                         src={imagePreview}
//                         alt="Preview"
//                         className="w-20 h-20 rounded-lg object-cover"
//                       />
//                     )}
//                   </div>
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Password *
//                   </label>
//                   <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     required
//                     minLength="6"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   />
//                 </div>

//                 {/* Confirm Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Confirm Password *
//                   </label>
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     required
//                     minLength="6"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               <div className="mt-6 flex gap-4">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50"
//                 >
//                   {loading ? 'Registering...' : 'Register'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => navigate('/teacher')}
//                   className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
















