import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Button, 
  Modal, ModalHeader, ModalBody, FormGroup, Label } from 'reactstrap';
import { validateCommentForm } from '../../utils/validateCommentForm';
import { postComment } from './commentsSlice';


const CommentForm = ({ campsiteId }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const dispatch = useDispatch();

    const handleSubmit = (values) => {
      const comment = {
        campsiteId: parseInt(campsiteId),
        rating: values.rating,
        author: values.author,
        text: values.commentText,
        date: new Date(Date.now()).toISOString()
    };
    console.log('comment', comment);
    dispatch(postComment(comment));
    setModalOpen(false);
  };

  return (
    <>
      <Button outline onClick={() => setModalOpen(true)}>
        <i className='fa fa-pencil fa-lg' /> Add Comment
      </Button>
      <Modal isOpen={modalOpen}>
        <ModalHeader toggle={() => setModalOpen(false)}>Add Comment</ModalHeader>
          <Formik
            initialValues={{
              rating: undefined,
              author: '',
              commentText: '',
            }}
            onSubmit={handleSubmit}
            validate={validateCommentForm}
          >
            <Form> 
              <FormGroup>
                <Label htmlFor='rating'>Rating</Label>
                <Field
                  name='rating'
                  as='select'
                  className='form-control'
                >
                  <option>Select...</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Field>
                <ErrorMessage name="rating" className="text-danger">
                  {(msg) => <p className="error">{msg}</p>}
                </ErrorMessage>
              </FormGroup>
              <FormGroup>
                <Label htmlFor='author'>Your Name</Label>
                <Field
                  name='author'
                  placeholder='Your Name'
                  className='form-control'
                />
                <ErrorMessage name="author" className="text-danger">
                  {(msg) => <p className="error">{msg}</p>}
                </ErrorMessage>
              </FormGroup>
              <FormGroup>
                <Label htmlFor='commentText'>Comment</Label>
                <Field
                  name='commentText'
                  as='textarea'
                  rows='12'
                  className='form-control'
                />
              </FormGroup>
              <Button type='submit' color='primary'>
                Submit
              </Button>
            </Form>
          </Formik>
      </Modal>
    </>
  );
}

export default CommentForm;
