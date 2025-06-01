import React from 'react';
import './PlatformIcon.css'; 

const PlatformIcon = ({ iconSrc, name }) => {
  return (
    <div className="platform-item">
      <div className="platform-icon-circle">
        <img src={iconSrc} alt={`${name} icon`} />
      </div>
      <span className="platform-name">{name}</span>
    </div>
  );
};

export default PlatformIcon;