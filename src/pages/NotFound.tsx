import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div
        style={{ fontSize: '120px', fontWeight: 'bold', color: '#1890ff', marginBottom: '20px' }}
      >
        404
      </div>
      <div style={{ fontSize: '24px', color: '#333', marginBottom: '10px' }}>页面未找到</div>
      <div style={{ fontSize: '14px', color: '#999', marginBottom: '30px' }}>
        您访问的页面不存在或已被删除
      </div>
      <Link
        to="/"
        style={{
          padding: '10px 30px',
          backgroundColor: '#1890ff',
          color: '#fff',
          borderRadius: '4px',
          textDecoration: 'none',
        }}
      >
        返回首页
      </Link>
    </div>
  );
}
