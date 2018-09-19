import React from 'react';
import { List, Edit, Create, Datagrid, TextField, EditButton, SimpleForm, TextInput } from 'react-admin';

export const UserList = props => (
  <List title="All users" {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="username" />
      <TextField source="email" />
      <EditButton />
    </Datagrid>
  </List>
);

export const UserCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="name" />
      <TextInput source="username" />
      <TextInput source="email" />
    </SimpleForm>
  </Create>
);

export const UserEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="name" />
      <TextInput source="username" />
      <TextInput source="email" />
    </SimpleForm>
  </Edit>
);
