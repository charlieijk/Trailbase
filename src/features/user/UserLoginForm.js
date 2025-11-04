import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser, selectCurrentUser } from './userSlice';
import {
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    Label,
    Button
} from 'reactstrap';
import { Formik, Field, Form , ErrorMessage } from 'formik';
import defaultAvatar from '../../app/assets/img/unicorn.png';
import { validateUserLoginForm } from '../../utils/validateUserLoginForm';


const UserLoginForm = () => {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();

  const handleLogin = ( values ) => { 
        const currentUser = {
            id: Date.now(),
            avatar: defaultAvatar,
            username: values.username,
            password: values.password,
        };

        dispatch(setCurrentUser(currentUser));
        setLoginModalOpen(false);
      };
        return (
            <>
            <span className='navbar-text ml-auto'>
              {currentUser ? (
                <div style={{ width: '4rem', height: '4rem' }}>
                  <img
                    src={currentUser.avatar}
                    alt={'user'}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              ) : (
                <Button
                  outline
                  onClick={() => setLoginModalOpen(true)}
                  style={{ color: 'white', border: '1px solid white' }}
                >
                  <i className='fa fa-sign-in fa-lg' /> Login
                </Button>
              )}      
            <Modal isOpen={loginModalOpen}>
              <ModalHeader toggle={() => setLoginModalOpen(false)}>Login</ModalHeader>
              <ModalBody>
                <Formik
                  initialValues={{ username: '', password: '' }}
                  onSubmit={handleLogin}
                  validate={validateUserLoginForm}
                >
                  <Form>
                    <div className='form-group'>
                      <label htmlFor='username'>Username</label>
                      <Field
                        type='text'
                        name='username'
                        className='form-control'
                        placeholder='Enter username'
                      />
                      <ErrorMessage name='username'>
                            {(msg) => <p className='text-danger'>{msg}</p>}
                        </ErrorMessage>
                    </div>
                    <div className='form-group'>
                      <label htmlFor='password'>Password</label>
                      <Field
                        type='password'
                        name='password'
                        className='form-control'
                        placeholder='Enter password'
                      />
                      <ErrorMessage name='password'>
                            {(msg) => <p className='text-danger'>{msg}</p>}
                        </ErrorMessage>
                    </div>
                    <Button type='submit' color='primary'>
                      Login
                    </Button>
                  </Form>
                </Formik>
              </ModalBody>
            </Modal>
            </span>
          </>
        );
      };



    export default UserLoginForm;