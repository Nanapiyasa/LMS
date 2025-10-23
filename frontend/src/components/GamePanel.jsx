import React from 'react';

export default function GamePanel({ 
  title, 
  description, 
  iconImage, 
  headerColor,
  headerColorLight,
  onClick 
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
      style={{
        position: 'relative',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        outline: 'none',
        width: '100%',
        maxWidth: '320px',
        margin: '0 auto',
        transform: 'scale(1)',
        zIndex: 1
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Outer metal frame */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(to bottom, #374151, #4b5563, #374151)',
        borderRadius: '24px',
        padding: '4px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Inner wooden panel */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(to bottom right, #C17F5A, #A06744, #8B5A3C)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          {/* Wood grain texture */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.3,
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 6px),
                              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)`
          }}></div>
          
          {/* Metal corner rivets */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom right, #d1d5db, #6b7280, #374151)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #1f2937'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom right, #d1d5db, #6b7280, #374151)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #1f2937'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom right, #d1d5db, #6b7280, #374151)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #1f2937'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom right, #d1d5db, #6b7280, #374151)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #1f2937'
          }}></div>
          
          {/* Colored header banner with rounded top */}
          <div style={{ position: 'relative', paddingTop: '16px', paddingLeft: '16px', paddingRight: '16px' }}>
            <div style={{
              position: 'relative',
              paddingLeft: '24px',
              paddingRight: '24px',
              paddingTop: '12px',
              paddingBottom: '12px',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid rgba(0, 0, 0, 0.2)',
              background: `linear-gradient(180deg, ${headerColorLight} 0%, ${headerColor} 100%)`
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '900',
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                textAlign: 'center',
                margin: 0,
                padding: 0
              }}>
                {title}
              </h3>
            </div>
          </div>

          {/* Content area with paper background */}
          <div style={{ position: 'relative', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '24px', paddingTop: '8px' }}>
            <div style={{
              background: 'linear-gradient(to bottom right, #fffbeb, #FFF8DC, #fef3c7)',
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px',
              border: '2px solid rgba(120, 53, 15, 0.3)',
              boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              minHeight: '240px'
            }}>
              {/* Icon in metal circle */}
              <div style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                background: 'linear-gradient(to bottom right, #9ca3af, #6b7280, #4b5563)',
                border: '4px solid #374151',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}>
                <img 
                  src={iconImage} 
                  alt={title}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Description text */}
              <p style={{
                fontSize: '14px',
                color: '#78350f',
                textAlign: 'center',
                lineHeight: '1.625',
                fontWeight: '500',
                paddingLeft: '8px',
                paddingRight: '8px',
                margin: 0
              }}>
                {description}
              </p>

              {/* Start button */}
              <button 
                type="button"
                style={{
                  marginTop: 'auto',
                  paddingLeft: '32px',
                  paddingRight: '32px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  borderRadius: '9999px',
                  fontWeight: '900',
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.15s ease',
                  border: '3px solid rgba(0,0,0,0.3)',
                  fontSize: '14px',
                  background: `linear-gradient(180deg, ${headerColorLight} 0%, ${headerColor} 100%)`,
                  textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                  cursor: 'pointer',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
                }}
              >
                ▶ START
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}