import { useQuery } from '@tanstack/react-query';
import { getMeApi } from '../api/userApi';
import { useAuth } from '../contexts/AuthContext'; // <-- Import useAuth
import { useNavigate, Link } from 'react-router-dom'; // <-- Import Link

export default function DashboardPage() {
  const { logout, isAuthenticated, isLoading: isAuthLoading } = useAuth(); // <-- Lấy state
  const navigate = useNavigate();

  const {
    data: user,
    isLoading: isUserLoading,
    error
  } = useQuery({
    queryKey: ['me'],
    queryFn: getMeApi,
    retry: false,
    enabled: isAuthenticated,
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isAuthLoading) {
    return <div className="">Đang tải ứng dụng...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen p-4 text-center">
        <h1 className="text-xl font-semibold">Trang này được bảo vệ.</h1>
        <p className="mt-2">Vui lòng đăng nhập để xem nội dung.</p>
        <Link to="/login" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
          Đi đến trang Đăng nhập
        </Link>
      </div>
    );
  }

  if (isUserLoading) {
    return <div className="">Đang tải thông tin user...</div>;
  }

  if (error) {
    return <div className="">Lỗi: {error.message}</div>;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Chào mừng bạn đến Dashboard!</h1>
        <p className="mb-4">Bạn đã đăng nhập thành công.</p>
        {user && (
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-medium">Thông tin người dùng</h2>
            <p className="mt-2"><strong>Họ và tên:</strong> {user.name || '—'}</p>
            <p className="mt-1"><strong>Email:</strong> {user.email}</p>
            <p className="mt-1 text-sm text-gray-600"><strong>Đã tạo:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleString() : '—'}</p>
          </div>
        )}
        <div className="mt-4">
          <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Đăng xuất</button>
        </div>
      </div>
    </div>
  );
}