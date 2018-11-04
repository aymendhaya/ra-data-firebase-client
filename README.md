# ra-data-firebase-client

> A Firebase Client for the awesome [react-admin](https://github.com/marmelab/react-admin) framework. A continuity for [sidferreira/aor-firebase-client](https://github.com/sidferreira/aor-firebase-client)

**PS: We are still in BETA. AuthProvider & RestProvider are available**

## For a quick demo:
clone the repo & run 

```bash
npm install 
```

```bash
npm run init 
```

```bash
npm run demo 
```
## To install & test RestProvider & AuthProvider:

```bash
npm install ra-data-firebase-client
```
Check [HERE](https://github.com/aymendhaya/ra-data-firebase-client/blob/master/src/demo/App.js) for implementation tutorial.



For AuthProvider, dont forget to add the user UID to your firebase DB under /users matching the following structure:

```bash
"users": {
    "UID": {
        "isAdmin": true
    }
}
```

## ra-data-firebase-client now support `base64` image uploading. 

Check [HERE](https://github.com/aymendhaya/ra-data-firebase-client/blob/master/src/demo/App.js) for implementation tutorial.
