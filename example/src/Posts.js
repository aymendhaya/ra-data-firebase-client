import React from 'react';
import { SimpleFormIterator, FileInput, FileField, ImageInput, ImageField, BooleanInput, RadioButtonGroupInput, PasswordInput, NumberInput, CheckboxGroupInput, NullableBooleanInput, ArrayInput, AutocompleteArrayInput, AutocompleteInput, List, Filter, Datagrid,BulkDeleteButton, SelectArrayInput, Edit, ReferenceInput, SelectInput, Create, SimpleForm, TextField, EditButton, TextInput, DateInput } from 'react-admin';
import ResetViewsButton from './Bulk';

const PostBulkActionButtons = props => (
  <div>
    <ResetViewsButton label="Reset Views" {...props} />
    {/* default bulk delete action */}
    <BulkDeleteButton {...props} />
  </div>)
    
    const PostFilter = (props) => (
      <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <TextInput label="AutocompleteInput" source="AutocompleteInput" defaultValue="" />
      </Filter>
    )

export const PostList = (props) => (
  <List {...props} bulkActionButtons={<PostBulkActionButtons />} filters={<PostFilter />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="AutocompleteInput" />
      
      <EditButton basePath="/posts" />
    </Datagrid>
  </List>
);

export const PostEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
    <FileInput source="FileInput" label="FileInput" accept="application/pdf">
      <FileField source="src" title="title" />
    </FileInput>
      <ImageInput source="ImageInput" accept="image/*" multiple>
        <ImageField source="src" title="title" />
      </ImageInput>
      <AutocompleteInput source="AutocompleteInput" choices={[
    { id: 'programming', name: 'Programming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'photography', name: 'Photography' },
]} />
      <AutocompleteArrayInput source="AutocompleteArrayInput" choices={[
    { id: 'programming', name: 'Programming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'photography', name: 'Photography' },
]} />
      <ArrayInput source="ArrayInput">
        <SimpleFormIterator>
          <DateInput source="date" />
          <TextInput source="url" />
        </SimpleFormIterator>
      </ArrayInput>
      <BooleanInput source="BooleanInput" />
      <NullableBooleanInput source="NullableBooleanInput" fullWidth />
      <CheckboxGroupInput source="CheckboxGroupInput" choices={[
    { id: 'programming', name: 'Programming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'photography', name: 'Photography' },
]} />
      <DateInput source="DateInput" />
      <NumberInput source="NumberInput" />
      <PasswordInput source="PasswordInput" />
      <RadioButtonGroupInput source="RadioButtonGroupInput" choices={[
    { id: 'programming', name: 'Programming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'photography', name: 'Photography' },
]} />
      <ReferenceInput allowEmpty source="ReferenceInput" reference="posts">
        <SelectInput optionText="ReferenceInput" allowEmpty />
      </ReferenceInput>
      <SelectInput source="category" choices={[
    { id: 'programming', name: 'Programming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'photography', name: 'Photography' },
]} />
      <SelectArrayInput source="SelectArrayInput" choices={[
    { id: 'music', name: 'Music' },
    { id: 'photography', name: 'Photo' },
    { id: 'programming', name: 'Code' },
    { id: 'tech', name: 'Technology' },
    { id: 'sport', name: 'Sport' },
]} />
      <TextInput source="TextInput" />
    </SimpleForm>
  </Edit>
);

export const PostCreate = (props) => (
  <Create title="Create a Post" {...props}>
    <SimpleForm>
    <FileInput source="FileInput" label="FileInput" accept="application/pdf">
      <FileField source="src" title="title" />
    </FileInput>
      <ImageInput source="ImageInput" accept="image/*" multiple>
        <ImageField source="src" title="title" />
      </ImageInput>
      <AutocompleteInput source="AutocompleteInput" choices={[
    { id: 'programming', name: 'Programming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'photography', name: 'Photography' },
]} />
      <AutocompleteArrayInput source="AutocompleteArrayInput" choices={[
    { id: 'programming', name: 'Programming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'photography', name: 'Photography' },
]} />
      <ArrayInput source="ArrayInput">
        <SimpleFormIterator>
          <DateInput source="date" />
          <TextInput source="url" />
        </SimpleFormIterator>
      </ArrayInput>
      <BooleanInput source="BooleanInput" />
      <NullableBooleanInput source="NullableBooleanInput" fullWidth />
      <CheckboxGroupInput source="CheckboxGroupInput" choices={[
    { id: 'programming', name: 'Programming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'photography', name: 'Photography' },
]} />
      <DateInput source="DateInput" />
      <NumberInput source="NumberInput" />
      <PasswordInput source="PasswordInput" />
      <RadioButtonGroupInput source="RadioButtonGroupInput" choices={[
    { id: 'programming', name: 'Programming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'photography', name: 'Photography' },
]} />
      <ReferenceInput allowEmpty source="ReferenceInput" reference="posts">
        <SelectInput optionText="ReferenceInput" allowEmpty />
      </ReferenceInput>
      <SelectInput source="category" choices={[
    { id: 'programming', name: 'Programming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'photography', name: 'Photography' },
]} />
      <SelectArrayInput source="SelectArrayInput" choices={[
    { id: 'music', name: 'Music' },
    { id: 'photography', name: 'Photo' },
    { id: 'programming', name: 'Code' },
    { id: 'tech', name: 'Technology' },
    { id: 'sport', name: 'Sport' },
]} />
      <TextInput source="TextInput" />

      {/* <ReferenceArrayInput label="Tag IDs" source="tagIDS" reference="posts" allowEmpty>
    <SelectArrayInput optionText="body" />
</ReferenceArrayInput>
        <ReferenceInput allowEmpty label="posts" source="postID" reference="posts">
                <SelectInput optionText="id" />
            </ReferenceInput>
            <TextInput source="title" />
            <TextInput source="teaser" />
            <TextInput source="body" />
            <TextInput label="Publication date" source="published_at" />
            <TextInput source="average_note" /> */}
    </SimpleForm>
  </Create>
);