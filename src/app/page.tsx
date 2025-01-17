'use client';

import axios from 'axios';
import {useRouter} from 'next/navigation';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {loginSuccess} from './redux/userSlice';
import {RootState} from './redux/store';

export default function page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formdata = {
      email,
      password,
    };
    console.log('formdata', formdata);

    try {
      const res = await axios.post('https://sajiloride.vercel.app/api/user/userlogin', formdata);
      console.log(res.data.user);
      dispatch(loginSuccess(res.data.user));
      if (res.data.user.role === 'user') {
        navigate.push('/userhome');
      } else {
        navigate.push('/captain');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <h2>Login user</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}
