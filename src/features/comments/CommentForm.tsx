import type { FC } from 'react';
import { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Button, Modal, ModalHeader, ModalBody, FormGroup, Label } from 'reactstrap';
import { validateCommentForm } from '../../utils/validateCommentForm';
import { addComment } from './commentsSlice';
import { useAppDispatch } from '../../app/hooks';
import type { CommentFormValues } from '../../types/forms.types';

interface CommentFormProps {
  campsiteId: number;
}

const CommentForm: FC<CommentFormProps> = ({ campsiteId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <>
      <Button outline onClick={() => setModalOpen(true)}>
        <i className="fa fa-pencil fa-lg" /> Add Comment
      </Button>
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalHeader toggle={() => setModalOpen(false)}>Add Comment</ModalHeader>
        <ModalBody>
          <Formik<CommentFormValues>
            initialValues={{ rating: '', author: '', commentText: '' }}
            onSubmit={(values, { resetForm }) => {
              dispatch(
                addComment({
                  campsiteId,
                  rating: Number(values.rating),
                  author: values.author,
                  text: values.commentText,
                  date: new Date().toISOString(),
                }),
              );
              resetForm();
              setModalOpen(false);
            }}
            validate={validateCommentForm}
          >
            <Form>
              <FormGroup>
                <Label htmlFor="rating">Rating</Label>
                <Field name="rating" as="select" className="form-control">
                  <option value="">Select...</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </Field>
                <ErrorMessage name="rating">
                  {(msg) => <p className="text-danger">{msg}</p>}
                </ErrorMessage>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="author">Your Name</Label>
                <Field name="author" placeholder="Your Name" className="form-control" />
                <ErrorMessage name="author">
                  {(msg) => <p className="text-danger">{msg}</p>}
                </ErrorMessage>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="commentText">Comment</Label>
                <Field name="commentText" as="textarea" rows="12" className="form-control" />
              </FormGroup>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </Form>
          </Formik>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CommentForm;
