import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { registerApi } from '../api/authApi.jsx';

export default function RegisterPage() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const registerMutation = useMutation({
        mutationFn: registerApi,
        onSuccess: (data) => {
            console.log('Đăng ký thành công', data);
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        },
        onError: (error) => {
            console.error('Đăng ký thất bại:', error);
            const errorMessage = error.response?.data?.message || error.message;
            alert(errorMessage);
        }
    });

    const onSubmit = (data) => {
        const { confirmPassword, ...payload } = data;
        registerMutation.mutate(payload);
    };

    const password = watch('password', '');

    return (
        <div className=" min-h-screen flex items-center justify-center p-4 border shadow bg-gray-50">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-semibold mb-4">Đăng Ký</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium">Họ và tên</label>
                        <input
                            id="name"
                            type="text"
                            className="w-full border px-2 py-1 rounded mt-1"
                            {...register('name', { required: 'Họ tên là bắt buộc' })}
                        />
                        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="w-full border px-2 py-1 rounded mt-1"
                            {...register('email', {
                                required: 'Email là bắt buộc',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Email không hợp lệ'
                                }
                            })}
                        />
                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">Mật khẩu</label>
                        <input
                            id="password"
                            type="password"
                            className="w-full border px-2 py-1 rounded mt-1"
                            {...register('password', {
                                required: 'Mật khẩu là bắt buộc',
                                minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                            })}
                        />
                        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium">Xác nhận mật khẩu</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="w-full border px-2 py-1 rounded mt-1"
                            {...register('confirmPassword', {
                                required: 'Vui lòng xác nhận mật khẩu',
                                validate: (value) => value === password || 'Mật khẩu không khớp'
                            })}
                        />
                        {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>}
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={registerMutation.isLoading}
                            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
                        >
                            {registerMutation.isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
