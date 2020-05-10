import sortBy from 'sort-by'
const convertFileToBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve({result: reader.result, type: file.type, title: file.title, size: file.rawFile.size})
    reader.onerror = reject
    reader.readAsDataURL(file.rawFile)
  })
export default (firebase, settings = {context: '', imagekey: 'images', filekey: 'files'}) => {
  const database = firebase.default.database()
  return {
    create: (source, params) => {
      const resource = [settings.context, source].join('/')
      let uid = params.data.id || database.ref().child(resource).push().key

      let create = !params.data[settings.imagekey] && !params.data[settings.filekey]
        ? new Promise((resolve, reject) => {
          let ref = database.ref([resource, uid].join('/'))
          ref.set({...params.data, id: uid})
          resolve()
        })
        : Promise.all((!params.data[settings.imagekey] ? [] : params.data[settings.imagekey] instanceof Array ? params.data[settings.imagekey] : [params.data[settings.imagekey]])
          .map(img => { return {...img, type: 'image'} })
          .map(convertFileToBase64)
          .concat((!params.data[settings.filekey] ? [] : params.data[settings.filekey] instanceof Array ? params.data[settings.filekey] : [params.data[settings.filekey]])
            .map(file => { return {...file, type: 'file'} }).map(convertFileToBase64)))
          .then(base64ed =>
            base64ed.map((item64, key) => ({
              src: item64.result,
              id: `${params.data.id}_${item64.type}_${key}`,
              title: item64.title,
              type: item64.type,
              size: item64.size
            }))
          )
          .then(transformedNewItems => {
            database.ref([resource, uid].join('/')).set({...params.data, [settings.imagekey]: transformedNewItems.filter(i => i.type === 'image'), [settings.filekey]: transformedNewItems.filter(i => i.type === 'file'), id: uid})
          }

          )

      return create.then(res => { return { data: {...params.data, id: uid} } })
    },
    update: (source, params) => {
      const resource = [settings.context, source].join('/')
      let update = !params.data[settings.imagekey] && !params.data[settings.filekey]
        ? new Promise((resolve, reject) => {
          database.ref([resource, params.id].join('/')).set(params.data)
          resolve()
        })
        : Promise.all((!params.data[settings.imagekey] ? [] : params.data[settings.imagekey] instanceof Array ? params.data[settings.imagekey] : [params.data[settings.imagekey]])
          .filter(
            p => p.rawFile instanceof File
          ).map(img => { return {...img, type: 'image'} }).map(convertFileToBase64)
          .concat((!params.data[settings.filekey] ? [] : params.data[settings.filekey] instanceof Array ? params.data[settings.filekey] : [params.data[settings.filekey]])
            .filter(
              p => p.rawFile instanceof File
            ).map(file => { return {...file, type: 'file'} }).map(convertFileToBase64)))
          .then(base64ed =>
            base64ed.map((item64, key) => ({

              src: item64.result,
              id: `${params.data.id}_${item64.type}_${key}`,
              title: item64.title,
              type: item64.type,
              size: item64.size
            }))
          )
          .then(transformedNewItems => {
            database.ref([resource, params.id].join('/')).set({
              ...params.data,
              [settings.imagekey]: [
                ...transformedNewItems.filter(i => i.type === 'image'),
                ...(!params.data[settings.imagekey] ? [] : params.data[settings.imagekey] instanceof Array ? params.data[settings.imagekey] : [params.data[settings.imagekey]]).filter(
                  p => !(p.rawFile instanceof File)
                )
              ],
              [settings.filekey]: [
                ...transformedNewItems.filter(i => i.type === 'file'),
                ...(!params.data[settings.filekey] ? [] : params.data[settings.filekey] instanceof Array ? params.data[settings.filekey] : [params.data[settings.filekey]]).filter(
                  p => !(p.rawFile instanceof File)
                )
              ]
            })
          }

          )
      return update.then(res => { return { data: params.data } })
    },
    getList: async (source, params) => {
      const resource = [settings.context, source].join('/')
      const { field } = params.sort
      let ref = database.ref(resource)
      return ref.orderByChild(field)
        .once('value').then(function(snapshot) {
          let valuesToReturn = snapshot.val() ? Object.values(snapshot.val()) : []
          if (params.filter) {
            let filterset = params.filter
            filterset = Object.assign(filterset, filterset.q ? {id: filterset.q} : {})
            delete filterset.q
            const filters = Object.entries(filterset)
            filters.forEach(([filterKey, filterValue]) => {
              valuesToReturn = valuesToReturn.filter(value => {
                if (value && value[filterKey] && typeof value[filterKey] !== 'object') {
                  const propsToFilter = `${value[filterKey]}`.toLowerCase()
                  if (propsToFilter.includes(`${filterValue}`.toLowerCase())) {
                    return true
                  }
                }
                return false
              })
            })
          }

          if (params.pagination) {
            let values = []
            values = valuesToReturn
            if (params.sort) {
              values.sort(sortBy(`${params.sort.order === 'ASC' ? '-' : ''}${params.sort.field}`))
            }
            const { page, perPage } = params.pagination
            const _start = (page - 1) * perPage
            const _end = page * perPage
            const data = values ? values.slice(_start, _end) : []
            const total = snapshot.val() ? Object.keys(snapshot.val()).length : 0

            return { data, total }
          } else {
            throw new Error('Error processing request')
          }
        })
    },

    getOne: async (source, params) => {
      const resource = [settings.context, source].join('/')
      let ref = await database.ref([resource, params.id].join('/'))
      return ref.once('value').then(function(snapshot) {
        return {
          data: snapshot.val()}
      })
    },

    getMany: (source, params) => {
      const resource = [settings.context, source].join('/')
      let getMany = new Promise((resolve, reject) => {
        let data = params.ids.map(id => {
          return database.ref([resource, id].join('/')).once('value').then(function(snapshot) {
            return snapshot.val()
          })
        })
        resolve(data)
      })
      return getMany.then(data => { return { data: data } })
    },

    getManyReference: (source, params) => {
      const resource = [settings.context, source].join('/')
      let getManyRef = new Promise((resolve, reject) => {
        let data = params.ids.map(id => {
          return database.ref([resource, id].join('/')).once('value').then(function(snapshot) {
            return snapshot.val()
          })
        })
        resolve(data)
      })
      return getManyRef.then(data => { return { data: data } })
    },

    updateMany: async (source, params) => {
      const resource = [settings.context, source].join('/')
      let updateMany = new Promise((resolve, reject) => {
        params.ids.map(id => {
          database.ref([resource, id].join('/')).once('value').then(function(snapshot) {
            let update = new Promise((resolve, reject) => {
              database.ref([resource, id].join('/')).set(Object.assign(snapshot.val(), params.data))
              resolve()
            })
            return update.then(res => { return { data: params.data } })
          })
        })
        resolve()
      })
      return updateMany.then(res => { return { data: params.ids } })
    },

    delete: (source, params) => {
      const resource = [settings.context, source].join('/')
      let Delete = new Promise((resolve, reject) => {
        database.ref([resource, params.id].join('/')).set(null)
        resolve()
      })
      return Delete.then(res => { return { data: params.previousData } })
    },

    deleteMany: (source, params) => {
      const resource = [settings.context, source].join('/')
      let deleteMany = new Promise((resolve, reject) => {
        params.ids.map(id => database.ref([resource, id].join('/')).set(null))
        resolve()
      })
      return deleteMany.then(res => { return { data: params } })
    }
  }
}
