import React from "react";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function TeacherDashboard() {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [draggedTile, setDraggedTile] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [tiles, setTiles] = React.useState([
    { id: 'clock', type: 'clock', wide: true, content: 'Clock' },
    { id: 'students', type: 'blue', content: 'My Students' },
    { id: 'courses', type: 'green', content: 'Courses' },
    { id: 'weather', type: 'weather', wide: true, content: 'Weather' },
    { id: 'assignments', type: 'orange', badge: '12', content: 'Assignments', subtitle: '12 pending' },
    { id: 'schedule', type: 'purple', content: 'Schedule', subtitle: 'Today: 3 classes' },
    { id: 'grades', type: 'teal', content: 'Grades' },
    { id: 'statistics', type: 'statistics', wide: true, content: '87%', subtitle: 'Average Class Performance' },
    { id: 'messages', type: 'pink', badge: '8', content: 'Messages' },
    { id: 'attendance', type: 'brown', content: 'Attendance', subtitle: 'Mark today' },
    { id: 'resources', type: 'lime', content: 'Resources' },
    { id: 'reports', type: 'indigo', content: 'Reports' },
    { id: 'active-students', type: 'statistics', content: '142', subtitle: 'Active Students' },
    { id: 'settings', type: 'dark', content: 'Settings' },
    { id: 'exams', type: 'red', content: 'Exams', subtitle: '2 upcoming' },
    { id: 'analytics', type: 'purple', content: 'Analytics' },
    { id: 'library', type: 'green', content: 'Library' },
    { id: 'notifications', type: 'orange', badge: '5', content: 'Notifications' },
    { id: 'quiz', type: 'teal', content: 'Quizzes' },
    { id: 'forums', type: 'blue', content: 'Forums' }
  ]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    
    return `${dayName}, ${monthName} ${day}`;
  };

  const handleTileClick = (tileName) => {
    console.log(`Navigating to: ${tileName}`);
    // Add navigation logic here
  };

  const handleDragStart = (e, tileId) => {
    setDraggedTile(tileId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedTile(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetTileId) => {
    e.preventDefault();
    if (draggedTile && draggedTile !== targetTileId) {
      const newTiles = [...tiles];
      const draggedIndex = newTiles.findIndex(tile => tile.id === draggedTile);
      const targetIndex = newTiles.findIndex(tile => tile.id === targetTileId);
      
      // Swap tiles
      [newTiles[draggedIndex], newTiles[targetIndex]] = [newTiles[targetIndex], newTiles[draggedIndex]];
      setTiles(newTiles);
    }
  };

  const getTileStyle = (tile) => {
    const baseStyle = {
      aspectRatio: "1",
      borderRadius: "0",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "space-between",
      cursor: "pointer",
      transition: "all 0.2s ease",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
      userSelect: "none"
    };

    // Add wide tile styling
    if (tile.wide) {
      baseStyle.gridColumn = "span 2";
    }

    // Add background colors based on type
    const colorMap = {
      'blue': '#0078d4',
      'green': '#107c10',
      'orange': '#ff8c00',
      'red': '#e81123',
      'purple': '#5c2d91',
      'teal': '#008272',
      'pink': '#e3008c',
      'brown': '#825a2c',
      'dark': '#2d2d2d',
      'cyan': '#00b7c3',
      'lime': '#8cbd18',
      'indigo': '#4a5459',
      'clock': '#000',
      'weather': '#0078d4',
      'statistics': '#e81123'
    };

    baseStyle.background = colorMap[tile.type] || '#0078d4';

    return baseStyle;
  };

  const getTileIcon = (tile) => {
    const iconMap = {
      'students': 'fas fa-users',
      'courses': 'fas fa-book',
      'assignments': 'fas fa-clipboard-list',
      'schedule': 'fas fa-calendar-alt',
      'grades': 'fas fa-chart-line',
      'messages': 'fas fa-envelope',
      'attendance': 'fas fa-check-circle',
      'resources': 'fas fa-folder-open',
      'reports': 'fas fa-file-alt',
      'settings': 'fas fa-cog',
      'exams': 'fas fa-graduation-cap',
      'analytics': 'fas fa-chart-bar',
      'library': 'fas fa-book-open',
      'notifications': 'fas fa-bell',
      'quiz': 'fas fa-question-circle',
      'forums': 'fas fa-comments',
      'weather': 'fas fa-sun'
    };
    return iconMap[tile.id] || 'fas fa-square';
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
      background: "linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #0369a1 100%)",
      color: "white",
      minHeight: "100vh",
      overflowX: "hidden"
    }}>
      {/* User Info */}
      <div style={{
        position: "absolute",
        top: "20px",
        right: "40px",
        display: "flex",
        alignItems: "center",
        gap: "15px"
      }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600 }}>{userData?.name || user?.email || 'User'}</div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>{(userData?.role || 'teacher').toUpperCase()}</div>
        </div>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            style={{
              width: "50px",
              height: "50px",
              background: "#f97316",
              border: "none",
              borderRadius: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              color: "white",
              cursor: "pointer",
              boxShadow: "0 0 0 2px rgba(255,255,255,0.15) inset"
            }}
          >
            <i className="fas fa-user"></i>
          </button>
          {menuOpen && (
            <div
              role="menu"
              style={{
                position: "absolute",
                top: "54px",
                right: 0,
                minWidth: "200px",
                background: "#1f2937",
                border: "2px solid #111827",
                borderRadius: 0,
                boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
                zIndex: 50
              }}
            >
              <div style={{ padding: "10px 12px", borderBottom: "1px solid #111827" }}>
                <div style={{ fontSize: "13px", color: "#93c5fd" }}>{user?.email}</div>
                <div style={{ fontSize: "12px", color: "#cbd5e1", marginTop: 2 }}>{userData?.name || 'Signed in'}</div>
              </div>
              <button
                role="menuitem"
                onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 14px",
                  background: "transparent",
                  color: "#e5e7eb",
                  border: "none",
                  cursor: "pointer"
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#374151'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <i className="fas fa-user-cog" style={{ marginRight: 8 }}></i>
                Update Profile
              </button>
              <button
                role="menuitem"
                onClick={async () => { setMenuOpen(false); await logout(); navigate('/login', { replace: true }); }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 14px",
                  background: "transparent",
                  color: "#fecaca",
                  border: "none",
                  cursor: "pointer"
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#7f1d1d'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <i className="fas fa-sign-out-alt" style={{ marginRight: 8 }}></i>
                Logout
              </button>
            </div>
          )}
        </div>
    </div>

      {/* Container */}
      <div style={{
        padding: "40px",
        maxWidth: "1920px",
        margin: "0 auto"
      }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{
            fontSize: "42px",
            fontWeight: 300,
            letterSpacing: "-1px",
            margin: 0
          }}>Nanapiyasa Edu</h1>
        </div>

        {/* Tiles Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "10px",
          marginBottom: "20px"
        }}>
          {tiles.map((tile) => (
            <div
              key={tile.id}
              draggable
              onDragStart={(e) => handleDragStart(e, tile.id)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, tile.id)}
              onClick={() => handleTileClick(tile.content)}
              style={getTileStyle(tile)}
            >
              {/* Badge */}
              {tile.badge && (
                <div style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "rgba(255, 255, 255, 0.3)",
                  padding: "4px 12px",
                  borderRadius: "2px",
                  fontSize: "18px",
                  fontWeight: 600
                }}>
                  {tile.badge}
                </div>
              )}

              {/* Icon */}
              {tile.id !== 'clock' && tile.id !== 'weather' && tile.id !== 'statistics' && tile.id !== 'active-students' && (
                <div style={{ fontSize: "48px", marginBottom: "auto" }}>
                  <i className={getTileIcon(tile)}></i>
                </div>
              )}

              {/* Content */}
              <div style={{ width: "100%" }}>
                {tile.id === 'clock' ? (
                  <>
                    <div style={{
                      fontSize: "56px",
                      fontWeight: 300,
                      lineHeight: 1
                    }}>{formatTime(currentTime)}</div>
                    <div style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      marginTop: "5px",
                      opacity: 0.8
                    }}>{formatDate(currentTime)}</div>
                  </>
                ) : tile.id === 'weather' ? (
                  <>
                    <div style={{ fontSize: "20px", fontWeight: 300 }}>23° Clear</div>
                    <div style={{ fontSize: "12px", opacity: 0.9, marginTop: "5px" }}>Colombo • H:27° L:21°</div>
                    <div style={{ fontSize: "12px", opacity: 0.9, marginTop: "5px" }}>Partly Sunny, Humid</div>
                  </>
                ) : tile.id === 'statistics' ? (
                  <>
                    <div style={{
                      fontSize: "64px",
                      fontWeight: 300,
                      lineHeight: 1
                    }}>{tile.content}</div>
                    <div style={{
                      fontSize: "14px",
                      marginTop: "10px"
                    }}>{tile.subtitle}</div>
                  </>
                ) : tile.id === 'active-students' ? (
                  <>
                    <div style={{
                      fontSize: "64px",
                      fontWeight: 300,
                      lineHeight: 1
                    }}>{tile.content}</div>
                    <div style={{
                      fontSize: "14px",
                      marginTop: "10px"
                    }}>{tile.subtitle}</div>
                  </>
                ) : (
                  <>
                    <div style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: 1.3,
                      marginTop: "10px"
                    }}>{tile.content}</div>
                    {tile.subtitle && (
                      <div style={{
                        fontSize: "12px",
                        opacity: 0.9,
                        marginTop: "4px"
                      }}>{tile.subtitle}</div>
                    )}
                  </>
                )}
                </div>
            </div>
          ))}
        </div>
      </div>

      {/* Font Awesome CSS */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
}