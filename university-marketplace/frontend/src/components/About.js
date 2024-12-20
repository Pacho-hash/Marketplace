import React from 'react';
import NavBar from '../components/NavBar';

const About = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '60px' }}>
      <NavBar />
      <h1>About Near East Marketplace</h1>
      <p>Welcome to Near East Marketplace, a platform where students can buy, sell, and trade items within the university community. Our goal is to create a safe and easy-to-use marketplace specifically for students.</p>
      <p>Founded in 2024, our platform is dedicated to connecting buyers and sellers, helping students find affordable goods, and enabling sustainable buying and selling within the campus environment.</p>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    color: '#b30000',
    backgroundColor: '#fff',
  },
};

export default About;
