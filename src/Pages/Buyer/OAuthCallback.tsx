import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const OAuthCallback: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage

      if (code && userId) {
        const response = await fetch(`${import.meta.env.VITE_API_OAUTH_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, userId }),
        });

        if (response.ok) {
          // Handle success
          console.log('Stripe account connected successfully');
        } else {
          // Handle error
          console.error('Failed to connect Stripe account');
        }
      }
    };

    handleOAuthCallback();
  }, [location]);

  return <div>Connecting your Stripe account...</div>;
};

export default OAuthCallback;
