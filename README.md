# ra-data-firebase-client

> 

[![NPM](https://img.shields.io/npm/v/ra-data-firebase-client.svg)](https://www.npmjs.com/package/ra-data-firebase-client) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Requirements

```bash
npm install firebase
```

## Install

```bash
npm install ra-data-firebase-client
```
## Usage

```jsx
import { Admin, Resource } from 'react-admin'
import firebaseDataProvider from 'ra-data-firebase-client'
import firebase from 'firebase/app'
import "firebase/database";

firebase.initializeApp({
  apiKey: '**************',
  authDomain: '**************',
  databaseURL: 'https://myrealtimedatabase.firebaseio.com',
  projectId: 'myrealtimedatabase',
  storageBucket: 'myrealtimedatabase.appspot.com',
  messagingSenderId: '**************',
  appId: '**************',,
  measurementId: '**************'
})


const settings = {context: 'dev', imagekey: "images", filekey: "files"}


export default () =>
        <Admin dataProvider={firebaseDataProvider(firebase, settings)}>
          <Resource 
            name='posts' 
            list={PostList} 
            edit={PostEdit} 
            create={PostCreate} />
        </Admin>
```
## Result
```json
{
  "myrealtimedatabase": {
    "dev" : {
      "posts" : {
        "-M6rfMORj0dfoisK1taJ" : {
          "id" : "-M6rfMORj0dfoisK1taJ",
          "key1" : "value1",
          "key2" : "value2",
          "images": [
                      {
                        "id": "-M6rfMORj0dfoisK1taJ_img_0"},
                        "src": "data:image/jpeg;base64......", 
                        "size": 150402,
                        "title": "my-uploaded-image.jpg"
                        "type": "image"
                        
                      {...}, 
                      {...}
                    ]
          "files": [
                      {
                        "id": "-M6rfMORj0dfoisK1taJ_img_0"},
                        "src": "data:application/pdf;base64......", 
                        "size": 150402,
                        "title": "my-uploaded-file.pdf"
                        "type": "file"
                        
                      {...}, 
                      {...}, {...}, {...}]
        }
      }
    }
  }
}
```
## Demo 
[https://aymendhaya.github.io/ra-data-firebase-client](https://aymendhaya.github.io/ra-data-firebase-client)

## About authProvider 
Firebase authProvider on versions < 3 has been moved to a separate project    [ra-auth-firebase-client](https://github.com/aymendhaya/ra-auth-firebase-client)

