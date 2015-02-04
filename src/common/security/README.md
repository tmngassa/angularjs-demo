# The `src/common/security/` Directory

## Overview

The `src/common/security/` directory contains all code used in the AngularJS authentication and authorization along with all
tests of such code. It is based on the famous [AngularJS App](https://github.com/angular-app/angular-app).

```
security/
  |- login/
  |  |- ...
  |  |- ...
  |- authorization.js
  |- index.js
  |- interceptor.js
  |- retryQueue.js
  |- security.js
```

- `security/login/` - login/logout toolbar, and login form and controller.
- `security/authorization.js` - security.authorization service.
- `security/index.js` - security module defined.
- `security/interceptor.js` - security.interceptor service.
- `security/retryQueue.js` - security.retryQueue service.
- `security/security.js` - security service.

## Usage

To use this security functionality, add `security` module dependency in the app module dependency list. `security` module
is defined in `src/common/security/index.js`.

Then drop `<login-toolbar></login-toolbar>` on html page.

`security.authorization` service defined in `security/authorization.js` provides guard methods to support AngularJS routes.
You can add them as resolves to routes to require authorization levels before allowing a route change to complete.

## Configuration/Customization

login url is defined in `security/security.js` as `'/login'` to receive http post. The parameters used in the post also defined in
`security/security.js` named as `email` and `password`. You can change them to fit your application's requirements.

`security` service defined in `security/security.js` also use `'/current-user'` to get current user information. Update it
accordingly based on server side api.

The login form can be customized by updating `security/login/form.tpl.html`.

The login/logout toolbar can be customized by updating `security/login/toolbar.tpl.html`.

`security.authorization` service right now provides two guard methods to support AngularJS routes: requireAuthenticatedUser
and requireAdminUser. You can add more guard methods based on roles in your systems by updating `security` service and your
backend accordingly.