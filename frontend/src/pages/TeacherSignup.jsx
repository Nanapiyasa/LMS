import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, teacherAPI } from '../services/api';
import Sidebar from './TeacherDashboard/Sidebar';
import Header from './TeacherDashboard/Header';

export default function TeacherSignup() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		initials: '',
		first_name: '',
		last_name: '',
		address: '',
		mobile_no: '',
		email: '',
		username: '',
		password: '',
		confirmPassword: ''
	});
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [teachers, setTeachers] = useState([]);
	const [loadingTeachers, setLoadingTeachers] = useState(true);
	const [teachersError, setTeachersError] = useState('');

	// Fetch registered teachers on component mount
	useEffect(() => {
		const fetchTeachers = async () => {
			try {
				setLoadingTeachers(true);
				const data = await teacherAPI.getAllTeachers();
				setTeachers(data);
				setTeachersError('');
			} catch (err) {
				console.error('Failed to fetch teachers:', err);
				setTeachersError('Failed to load registered teachers');
			} finally {
				setLoadingTeachers(false);
			}
		};

		fetchTeachers();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => setImagePreview(reader.result);
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		// Validation
		if (!formData.initials || !formData.first_name || !formData.last_name || !formData.address || !formData.username || !formData.email || !formData.password) {
			setError('Please fill all required fields');
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		if (formData.password.length < 6) {
			setError('Password must be at least 6 characters');
			return;
		}

		try {
			setLoading(true);
			const submitData = new FormData();
			submitData.append('initials', formData.initials);
			submitData.append('first_name', formData.first_name);
			submitData.append('last_name', formData.last_name);
			submitData.append('address', formData.address);
			submitData.append('mobile_no', formData.mobile_no);
			submitData.append('email', formData.email);
			submitData.append('username', formData.username);
			submitData.append('password', formData.password);
			if (image) submitData.append('profile_picture', image);

			const response = await authAPI.registerTeacher(submitData);

			if (response.token) {
				// Refresh teachers list after successful registration
				const updatedTeachers = await teacherAPI.getAllTeachers();
				setTeachers(updatedTeachers);
				// Reset form
				setFormData({
					initials: '',
					first_name: '',
					last_name: '',
					address: '',
					mobile_no: '',
					email: '',
					username: '',
					password: '',
					confirmPassword: ''
				});
				setImage(null);
				setImagePreview(null);
				navigate('/teacher', { replace: true });
			}
		} catch (err) {
			setError(err.message || 'Failed to register teacher');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex">
			<Sidebar />
			<div className="flex-1 flex flex-col">
				<Header />
				<div className="p-8">
					<div className="max-w-6xl mx-auto">
						<h2 className="text-2xl font-bold text-gray-800 mb-6">Teacher Registration</h2>

						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
						)}

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* Registration Form */}
							<div className="lg:col-span-1">
								<form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
									<h3 className="text-lg font-semibold text-gray-800 mb-4">Register New Teacher</h3>
									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Initials *</label>
											<input type="text" name="initials" value={formData.initials} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
											<input type="text" name="username" value={formData.username} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
											<input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
											<input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
											<input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Mobile No</label>
											<input type="tel" name="mobile_no" value={formData.mobile_no} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
											<textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" required className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Profile Image (optional)</label>
											<input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500" />
											{imagePreview && <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover mt-2" />}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
											<input type="password" name="password" value={formData.password} onChange={handleInputChange} required minLength="6" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
											<input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required minLength="6" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
										</div>
									</div>

									<div className="mt-6 flex gap-4">
										<button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50">{loading ? 'Registering...' : 'Register'}</button>
										<button type="button" onClick={() => navigate('/teacher')} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
									</div>
								</form>
							</div>

							{/* Registered Teachers List */}
							<div className="lg:col-span-2">
								<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
									<h3 className="text-lg font-semibold text-gray-800 mb-4">Registered Teachers</h3>
									
									{loadingTeachers && (
										<div className="flex justify-center py-8">
											<p className="text-gray-500">Loading teachers...</p>
										</div>
									)}
									
									{teachersError && (
										<div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
											{teachersError}
										</div>
									)}
									
									{!loadingTeachers && !teachersError && (
										<div className="overflow-x-auto">
											{teachers.length === 0 ? (
												<p className="text-gray-500 text-center py-8">No teachers registered yet</p>
											) : (
												<table className="w-full text-sm">
													<thead>
														<tr className="border-b border-gray-200">
															<th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
															<th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
															<th className="text-left py-3 px-4 font-semibold text-gray-700">Username</th>
															<th className="text-left py-3 px-4 font-semibold text-gray-700">Address</th>
															<th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
														</tr>
													</thead>
													<tbody>
														{teachers.map((teacher, index) => (
															<tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50">
																<td className="py-3 px-4 text-gray-700">
																	{teacher.first_name} {teacher.last_name}
																</td>
																<td className="py-3 px-4 text-gray-600">{teacher.email}</td>
																<td className="py-3 px-4 text-gray-600">{teacher.username}</td>
																<td className="py-3 px-4 text-gray-600 text-xs">{teacher.address?.substring(0, 30)}...</td>
																<td className="py-3 px-4">
																	<span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
																		teacher.is_active 
																			? 'bg-green-100 text-green-800' 
																			: 'bg-gray-100 text-gray-800'
																	}`}>
																		{teacher.is_active ? 'Active' : 'Inactive'}
																	</span>
																</td>
															</tr>
														))}
													</tbody>
												</table>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
















