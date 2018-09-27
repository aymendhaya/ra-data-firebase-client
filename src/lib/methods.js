import firebase from 'firebase';
import sortBy from 'sort-by';
import { CREATE } from 'react-admin';

const convertFileToBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.rawFile);

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const addUploadFeature = requestHandler => (type, resource, params) => {
  if (type === 'UPDATE') {
    if (params.data.image && params.data.image.length) {
      const formerPictures = params.data.image.filter(p => !(p.rawFile instanceof File));
      const newPictures = params.data.image.filter(p => p.rawFile instanceof File);

      return Promise.all(newPictures.map(convertFileToBase64))
        .then(base64Pictures =>
          base64Pictures.map(picture64 => ({
            src: picture64,
            title: `${params.data.title}`
          }))
        )
        .then(transformedNewPictures =>
          requestHandler(type, resource, {
            ...params,
            data: {
              ...params.data,
              image: [...transformedNewPictures, ...formerPictures]
            }
          })
        );
    }
  }
  // for other request types and reources, fall back to the defautl request handler
  return requestHandler(type, resource, params);
};

const getImageSize = file => {
  return new Promise(resolve => {
    const img = document.createElement('img');
    img.onload = function() {
      resolve({
        width: this.width,
        height: this.height
      });
    };
    img.src = file.src;
  });
};

const upload = async (fieldName, submitedData, id, resourceName, resourcePath) => {
  const file = submitedData[fieldName] && submitedData[fieldName][0];
  const rawFile = file.rawFile;

  const result = {};
  if (file && rawFile && rawFile.name) {
    const ref = firebase
      .storage()
      .ref()
      .child(`${resourcePath}/${id}/${fieldName}`);
    const snapshot = await ref.put(rawFile);
    result[fieldName] = [{}];
    result[fieldName][0].uploadedAt = Date.now();
    result[fieldName][0].src = snapshot.downloadURL.split('?').shift() + '?alt=media';
    result[fieldName][0].type = rawFile.type;
    if (rawFile.type.indexOf('image/') === 0) {
      try {
        const imageSize = await getImageSize(file);
        result[fieldName][0].width = imageSize.width;
        result[fieldName][0].height = imageSize.height;
      } catch (e) {
        console.error(`Failed to get image dimensions`);
      }
    }
    return result;
  }
  return false;
};

const save = async (
  id,
  data,
  previous,
  resourceName,
  resourcePath,
  firebaseSaveFilter,
  uploadResults,
  isNew,
  timestampFieldNames
) => {
  if (uploadResults) {
    uploadResults.map(uploadResult => (uploadResult ? Object.assign(data, uploadResult) : false));
  }

  if (isNew) {
    Object.assign(data, { [timestampFieldNames.createdAt]: Date.now() });
  }

  data = Object.assign(previous, { [timestampFieldNames.updatedAt]: Date.now() }, data);

  if (!data.key) {
    data.key = id;
  }
  if (!data.id) {
    data.id = id;
  }

  await firebase
    .database()
    .ref(`${resourcePath}/${data.key}`)
    .update(firebaseSaveFilter(data));
  return { data };
};

const del = async (id, resourceName, resourcePath, uploadFields) => {
  if (uploadFields.length) {
    uploadFields.map(fieldName =>
      firebase
        .storage()
        .ref()
        .child(`${resourcePath}/${id}/${fieldName}`)
        .delete()
    );
  }

  await firebase
    .database()
    .ref(`${resourcePath}/${id}`)
    .remove();
  return { data: id };
};

const delMany = async (ids, resourceName, previousData) => {
  await ids.map(id =>
    firebase
      .database()
      .ref(`${resourceName}/${id}`)
      .remove()
  );
  return { data: ids };
};

const getItemID = (params, type, resourceName, resourcePath, resourceData) => {
  let itemId = params.data.id || params.id || params.data.key || params.key;
  if (!itemId) {
    itemId = firebase
      .database()
      .ref()
      .child(resourcePath)
      .push().key;
  }

  if (!itemId) {
    throw new Error('ID is required');
  }

  if (resourceData && resourceData[itemId] && type === CREATE) {
    throw new Error('ID already in use');
  }

  return itemId;
};

const getOne = (params, resourceName, resourceData) => {
  if (params.id && resourceData[params.id]) {
    return { data: resourceData[params.id] };
  } else {
    throw new Error('Key not found');
  }
};

const getList = (params, resourceName, resourceData) => {
  if (params.pagination) {
    let values = [];
    values = Object.values(resourceData);
    if (params.sort) {
      values.sort(sortBy(`${params.sort.order === 'ASC' ? '-' : ''}${params.sort.field}`));
    }

    const keys = values.map(i => i.id);
    const { page, perPage } = params.pagination;
    const _start = (page - 1) * perPage;
    const _end = page * perPage;
    const data = values ? values.slice(_start, _end) : [];
    const ids = keys.slice(_start, _end) || [];
    const total = values ? values.length : 0;
    return { data, ids, total };
  } else {
    throw new Error('Error processing request');
  }
};

const getMany = (params, resourceName, resourceData) => {
  let data = Object.values(resourceData).filter(item => params.ids.indexOf(item.id) > -1);
  return { data, ids: params.ids };
};

export default {
  upload,
  save,
  del,
  delMany,
  getItemID,
  getOne,
  getList,
  getMany,
  addUploadFeature,
  convertFileToBase64
};
