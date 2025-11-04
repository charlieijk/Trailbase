export interface ContactFormValues {
  firstName: string;
  lastName: string;
  phoneNum: string;
  email: string;
  agree: boolean;
  contactType: 'By Phone' | 'By Email';
  feedback: string;
}

export interface CommentFormValues {
  rating: string;
  author: string;
  commentText: string;
}

export interface UserLoginFormValues {
  username: string;
  password: string;
}
