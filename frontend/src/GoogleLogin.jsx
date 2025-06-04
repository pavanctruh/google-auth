import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { googleAuth } from './api'; // Assuming this wraps your Axios POST call
import { useNavigate } from 'react-router-dom';
function GoogleLogin() {
  const navigate = useNavigate();
  const responseGoogle = async (authResult) => {
    try {
      if (authResult.code) {
        const result = await googleAuth(authResult.code); 

        const user = result?.data?.user;
        if (user) {
          const { email, name, image } = user;
          console.log('User info:', email, name, image);
          const token = result.data.token;
          console.log(token);
          const obj={email, name, image, token};
          localStorage.setItem('user-info',JSON.stringify(obj));
          navigate('/dashboard');
        } else {
          console.error('User data is missing in response:', result.data);

        }
      }
    } catch (err) {
      console.error('Error while requesting google code:', err);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code',
  });

  return (
    <div className='App'>
      <button onClick={() => googleLogin()}>Login with Google</button>
    </div>
  );
}

export default GoogleLogin;
