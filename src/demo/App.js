import React from 'react';
import { Admin, Resource } from 'react-admin';
import { RestProvider, AuthProvider } from '../lib';

import { PostList, PostEdit, PostCreate } from './Posts';
import { UserList, UserEdit, UserCreate } from './Users';

const firebaseConfig = {
  apiKey: 'AIzaSyBIuQslUV4o-_6_z_NTty8HAFtSBJ0F9is',
  authDomain: 'react-admin-firebase-client.firebaseapp.com',
  databaseURL: 'https://react-admin-firebase-client.firebaseio.com',
  projectId: 'react-admin-firebase-client',
  storageBucket: '',
  messagingSenderId: '627393424606'
};

const trackedResources = [{ name: 'posts', isPublic: true }, { name: 'users', isPublic: true }];

const authConfig = {
  userProfilePath: '/users/',
  userAdminProp: 'isAdmin'
};
const App = () => (
  <Admin dataProvider={RestProvider(firebaseConfig, { trackedResources })} authProvider={AuthProvider(authConfig)}>
    <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} />
    <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} />
  </Admin>
);
// AuthProvider={shouldUseAuth ? AuthProvider : null}
export default App;
