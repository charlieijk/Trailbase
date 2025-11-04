"use client";

import type { FC } from 'react';
import { useState } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import { Modal, ModalHeader, ModalBody, Button, Form as ReactstrapForm } from 'reactstrap';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setCurrentUser, selectCurrentUser } from './userSlice';
import { validateUserLoginForm } from '../../utils/validateUserLoginForm';
import type { UserLoginFormValues } from '../../types/forms.types';

const DEFAULT_AVATAR = '/assets/img/unicorn.png';

const UserLoginForm: FC = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  return (
    <>
      <span className="navbar-text ms-auto">
        {currentUser ? (
          <div style={{ width: '4rem', height: '4rem' }}>
            <img src={currentUser.avatar} alt="user avatar" style={{ width: '100%', height: '100%' }} />
          </div>
        ) : (
          <Button
            outline
            onClick={() => setLoginModalOpen(true)}
            style={{ color: 'white', border: '1px solid white' }}
          >
            <i className="fa fa-sign-in fa-lg" /> Login
          </Button>
        )}
      </span>
      <Modal isOpen={loginModalOpen} toggle={() => setLoginModalOpen(false)}>
        <ModalHeader toggle={() => setLoginModalOpen(false)}>Login</ModalHeader>
        <ModalBody>
          <Formik<UserLoginFormValues>
            initialValues={{ username: '', password: '' }}
            onSubmit={(values, { resetForm }) => {
              dispatch(
                setCurrentUser({
                  id: Date.now(),
                  avatar: DEFAULT_AVATAR,
                  username: values.username,
                  password: values.password,
                }),
              );
              resetForm();
              setLoginModalOpen(false);
            }}
            validate={validateUserLoginForm}
          >
            {({ handleSubmit }) => (
              <ReactstrapForm onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <Field type="text" name="username" className="form-control" placeholder="Enter username" />
                  <ErrorMessage name="username">
                    {(msg) => <p className="text-danger">{msg}</p>}
                  </ErrorMessage>
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter password"
                  />
                  <ErrorMessage name="password">
                    {(msg) => <p className="text-danger">{msg}</p>}
                  </ErrorMessage>
                </div>
                <Button type="submit" color="primary">
                  Login
                </Button>
              </ReactstrapForm>
            )}
          </Formik>
        </ModalBody>
      </Modal>
    </>
  );
};

export default UserLoginForm;
