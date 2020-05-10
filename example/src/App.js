import React from 'react'
import { Admin, Resource } from 'react-admin'
import { PostList, PostEdit, PostCreate } from './Posts'
import firebaseDataProvider from 'ra-data-firebase-client'
import firebaseConfig from "./firebaseConfig";

import firebase from 'firebase/app'
import "firebase/database";
import "firebase/auth";

firebase.initializeApp(firebaseConfig)

const settings = {context: 'demo', imagekey: "ImageInput", filekey: "FileInput"}

export default () => 
  <Admin dataProvider={firebaseDataProvider(firebase, settings)} >
    <Resource name='posts' list={PostList} edit={PostEdit} create={PostCreate} />
  </Admin>