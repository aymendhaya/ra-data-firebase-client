import React from 'react';
import { Admin, Resource } from 'react-admin';
import { RestClient } from 'ra-data-firebase-client';

import { PostList, PostEdit, PostCreate } from 'ra-data-firebase-client/src/demo/Posts';
import { UserList, UserEdit, UserCreate } from 'ra-data-firebase-client/src/demo/Users';

const firebaseConfig = {
  apiKey: 'AIzaSyBIuQslUV4o-_6_z_NTty8HAFtSBJ0F9is',
  authDomain: 'react-admin-firebase-client.firebaseapp.com',
  databaseURL: 'https://react-admin-firebase-client.firebaseio.com',
  projectId: 'react-admin-firebase-client',
  storageBucket: '',
  messagingSenderId: '627393424606'
};

const trackedResources = [{ name: 'posts', isPublic: true }, { name: 'users', isPublic: true }];

// const shouldUseAuth = !(window && window.location && window.location.search && window.location.search === '?security=0')

const App = () => (
  <Admin dataProvider={RestClient(firebaseConfig, { trackedResources })}>
    <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} />
    <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} />
  </Admin>
);
// authClient={shouldUseAuth ? AuthClient : null}
export default App;
