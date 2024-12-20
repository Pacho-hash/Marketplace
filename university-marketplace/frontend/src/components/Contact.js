import React, { useState } from 'react';
import NavBar from '../components/NavBar'; 

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, like sending an email or saving to a database
    console.log('Form submitted:', { name, email, message });
    alert('Thank you for reaching out to us!');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '60px' }}>
    <NavBar />
    <h2>Contact Us</h2>
    <p>please reach out to us at info@neareastmarketplace.com.</p>
</div>
);
};


export default Contact;
