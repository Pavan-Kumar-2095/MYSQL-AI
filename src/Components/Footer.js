import React from 'react';
import './Footer.css'; // Import the CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; </p><br></br><p>All rights reserved.</p>
        <div className="footer-links">
          <a href="https://www.linkedin.com/in/pavan-kumar-107655297/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://github.com/Pavan-Kumar-2095" target="_blank" rel="noopener noreferrer">github</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
