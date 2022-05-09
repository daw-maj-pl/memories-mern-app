import React, { useRef } from 'react';
import { OAuth2Client } from 'google-auth-library';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useScript from '../../hooks/useScript';
import useStyles from './styles';
import { AUTH } from '../../constants/actionTypes';

const GoogleLogin = () => {
  const classes = useStyles();
  const googleSignInButton = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();

  useScript('https://accounts.google.com/gsi/client', () => {
    const CLIENT_ID_GOOGLE =
      '714376652765-995g1v0i7g9t4eafe1clgg05r10qlqqq.apps.googleusercontent.com';

    window.google.accounts.id.initialize({
      client_id: CLIENT_ID_GOOGLE,
      callback: async ({ credential }) => {
        const client = new OAuth2Client(CLIENT_ID_GOOGLE);

        const ticket = await client.verifyIdToken({
          idToken: credential
        });

        try {
          dispatch({
            type: AUTH,
            data: { result: ticket.payload, token: credential }
          });
          history.push('/');
        } catch (error) {
          console.log(error);
        }
      }
    });

    window.google.accounts.id.renderButton(googleSignInButton.current, {});
  });

  return <div className={classes.googleButton} ref={googleSignInButton}></div>;
};

export default GoogleLogin;
