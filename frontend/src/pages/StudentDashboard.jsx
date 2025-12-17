import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import GamePanel from '../components/GamePanel.jsx';
import lifeSkillsIcon from '../assets/life-skills-icon.png';
import jobSimulationIcon from '../assets/job-simulation-icon.png';
import socialSkillsIcon from '../assets/social-skills-icon.png';
import emotionalControlIcon from '../assets/emotional-control-icon.png';

export default function StudentDashboard() {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();

  const modules = [
    {
      key: 'life-skills',
      title: 'Life Skills',
      description: 'Practice daily living and decision-making skills in interactive scenarios.',
      headerColor: '#059669',
      headerColorLight: '#10b981',
      iconImage: lifeSkillsIcon
    },
    {
      key: 'job-role-simulation',
      title: 'Job Simulation',
      description: 'Experience real-world job tasks in a safe and supportive environment.',
      headerColor: '#2563EB',
      headerColorLight: '#3b82f6',
      iconImage: jobSimulationIcon
    },
    {
      key: 'communication-social',
      title: 'Social Skills',
      description: 'Improve conversations, social cues, and teamwork abilities.',
      headerColor: '#7C3AED',
      headerColorLight: '#8b5cf6',
      iconImage: socialSkillsIcon
    },
    {
      key: 'behaviour-emotional',
      title: 'Emotional Control',
      description: 'Build self-regulation skills and healthy coping strategies.',
      headerColor: '#EA580C',
      headerColorLight: '#f97316',
      iconImage: emotionalControlIcon
    }
  ];

  return (
    <>
      <style>{`
        @media (min-width: 640px) {
          .game-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (min-width: 1024px) {
          .game-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
        }
        @media (min-width: 768px) {
          .user-panel {
            flex-direction: row !important;
          }
          .user-panel > div:first-child {
            text-align: left !important;
          }
        }
      `}</style>
      <div style={{
        minHeight: '100vh',
        background: 'hsl(250 60% 15%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
      {/* Animated starfield background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          width: '384px',
          height: '384px',
          background: '#9333ea',
          borderRadius: '50%',
          mixBlendMode: 'screen',
          filter: 'blur(64px)',
          opacity: 0.1,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          top: '40px',
          left: '40px'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '384px',
          height: '384px',
          background: '#2563eb',
          borderRadius: '50%',
          mixBlendMode: 'screen',
          filter: 'blur(64px)',
          opacity: 0.1,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          animationDelay: '1s',
          bottom: '40px',
          right: '40px'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '256px',
          height: '256px',
          background: '#16a34a',
          borderRadius: '50%',
          mixBlendMode: 'screen',
          filter: 'blur(64px)',
          opacity: 0.1,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          animationDelay: '2s',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}></div>
      </div>

      <div style={{
        maxWidth: '80rem',
        width: '100%',
        position: 'relative',
        zIndex: 10
      }}>
        {/* User info panel at top */}
        <div style={{
          marginBottom: '32px',
          background: 'linear-gradient(to bottom right, hsl(35 30% 60%), hsl(30 25% 45%), hsl(25 30% 30%))',
          borderRadius: '12px',
          padding: '24px',
          border: '4px solid hsl(35 20% 25%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          <div className="user-panel" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{
                fontSize: '30px',
                fontWeight: '700',
                color: 'hsl(30 10% 95%)',
                textShadow: '0 10px 8px rgb(0 0 0 / 0.04), 0 4px 3px rgb(0 0 0 / 0.1)',
                margin: 0,
                padding: 0
              }}>
                Welcome, {userData?.name || user?.email}!
              </h2>
              <p style={{
                color: '#fbbf24',
                fontSize: '16px',
                marginTop: '4px',
                margin: 0,
                padding: 0
              }}>
                Role: <span style={{ fontWeight: '600' }}>{userData?.role}</span>
              </p>
            </div>
            <button 
              onClick={logout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(to right, #dc2626, #b91c1c)',
                color: 'white',
                paddingLeft: '24px',
                paddingRight: '24px',
                paddingTop: '12px',
                paddingBottom: '12px',
                borderRadius: '9999px',
                fontWeight: '700',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.15s ease',
                border: '2px solid #991b1b',
                textTransform: 'uppercase',
                fontSize: '14px',
                letterSpacing: '0.025em',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, #b91c1c, #991b1b)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, #dc2626, #b91c1c)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)';
              }}
            >
              <LogOut style={{ width: '20px', height: '20px' }} />
              Logout
            </button>
          </div>
        </div>

        {/* Title banner */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(to right, #facc15, #f59e0b, #facc15)',
            paddingLeft: '32px',
            paddingRight: '32px',
            paddingTop: '16px',
            paddingBottom: '16px',
            borderRadius: '12px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '4px solid #ca8a04',
            transform: 'scale(1)',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '900',
              color: 'white',
              textShadow: '0 10px 8px rgb(0 0 0 / 0.04), 0 4px 3px rgb(0 0 0 / 0.1)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: 0,
              padding: 0
            }}>
              Choose Your Quest
            </h1>
          </div>
          <p style={{
            color: 'hsl(30 10% 95%)',
            fontSize: '18px',
            textShadow: '0 4px 3px rgb(0 0 0 / 0.07), 0 2px 2px rgb(0 0 0 / 0.06)',
            marginTop: '12px',
            margin: 0,
            padding: 0
          }}>
            Select a learning module to begin your adventure
          </p>
        </div>

        {/* Game panels grid */}
        <div className="game-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          gap: '32px',
          justifyItems: 'center'
        }}>
          {modules.map((module) => (
            <GamePanel
              key={module.key}
              title={module.title}
              description={module.description}
              iconImage={module.iconImage}
              headerColor={module.headerColor}
              headerColorLight={module.headerColorLight}
              onClick={() => navigate(`/student/${module.key}`)}
            />
          ))}
        </div>
      </div>
    </div>
    </>
  );
}