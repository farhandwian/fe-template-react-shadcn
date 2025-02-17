/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as WelcomeImport } from './routes/welcome'
import { Route as VerificationImport } from './routes/verification'
import { Route as ResetPasswordImport } from './routes/reset-password'
import { Route as RegisterImport } from './routes/register'
import { Route as LoginImport } from './routes/login'
import { Route as ChangePasswordImport } from './routes/change-password'
import { Route as IndexImport } from './routes/index'
import { Route as UsersIndexImport } from './routes/users/index'

// Create/Update Routes

const WelcomeRoute = WelcomeImport.update({
  path: '/welcome',
  getParentRoute: () => rootRoute,
} as any)

const VerificationRoute = VerificationImport.update({
  path: '/verification',
  getParentRoute: () => rootRoute,
} as any)

const ResetPasswordRoute = ResetPasswordImport.update({
  path: '/reset-password',
  getParentRoute: () => rootRoute,
} as any)

const RegisterRoute = RegisterImport.update({
  path: '/register',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const ChangePasswordRoute = ChangePasswordImport.update({
  path: '/change-password',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const UsersIndexRoute = UsersIndexImport.update({
  path: '/users/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/change-password': {
      id: '/change-password'
      path: '/change-password'
      fullPath: '/change-password'
      preLoaderRoute: typeof ChangePasswordImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/register': {
      id: '/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof RegisterImport
      parentRoute: typeof rootRoute
    }
    '/reset-password': {
      id: '/reset-password'
      path: '/reset-password'
      fullPath: '/reset-password'
      preLoaderRoute: typeof ResetPasswordImport
      parentRoute: typeof rootRoute
    }
    '/verification': {
      id: '/verification'
      path: '/verification'
      fullPath: '/verification'
      preLoaderRoute: typeof VerificationImport
      parentRoute: typeof rootRoute
    }
    '/welcome': {
      id: '/welcome'
      path: '/welcome'
      fullPath: '/welcome'
      preLoaderRoute: typeof WelcomeImport
      parentRoute: typeof rootRoute
    }
    '/users/': {
      id: '/users/'
      path: '/users'
      fullPath: '/users'
      preLoaderRoute: typeof UsersIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/change-password': typeof ChangePasswordRoute
  '/login': typeof LoginRoute
  '/register': typeof RegisterRoute
  '/reset-password': typeof ResetPasswordRoute
  '/verification': typeof VerificationRoute
  '/welcome': typeof WelcomeRoute
  '/users': typeof UsersIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/change-password': typeof ChangePasswordRoute
  '/login': typeof LoginRoute
  '/register': typeof RegisterRoute
  '/reset-password': typeof ResetPasswordRoute
  '/verification': typeof VerificationRoute
  '/welcome': typeof WelcomeRoute
  '/users': typeof UsersIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/change-password': typeof ChangePasswordRoute
  '/login': typeof LoginRoute
  '/register': typeof RegisterRoute
  '/reset-password': typeof ResetPasswordRoute
  '/verification': typeof VerificationRoute
  '/welcome': typeof WelcomeRoute
  '/users/': typeof UsersIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/change-password'
    | '/login'
    | '/register'
    | '/reset-password'
    | '/verification'
    | '/welcome'
    | '/users'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/change-password'
    | '/login'
    | '/register'
    | '/reset-password'
    | '/verification'
    | '/welcome'
    | '/users'
  id:
    | '__root__'
    | '/'
    | '/change-password'
    | '/login'
    | '/register'
    | '/reset-password'
    | '/verification'
    | '/welcome'
    | '/users/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ChangePasswordRoute: typeof ChangePasswordRoute
  LoginRoute: typeof LoginRoute
  RegisterRoute: typeof RegisterRoute
  ResetPasswordRoute: typeof ResetPasswordRoute
  VerificationRoute: typeof VerificationRoute
  WelcomeRoute: typeof WelcomeRoute
  UsersIndexRoute: typeof UsersIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ChangePasswordRoute: ChangePasswordRoute,
  LoginRoute: LoginRoute,
  RegisterRoute: RegisterRoute,
  ResetPasswordRoute: ResetPasswordRoute,
  VerificationRoute: VerificationRoute,
  WelcomeRoute: WelcomeRoute,
  UsersIndexRoute: UsersIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/change-password",
        "/login",
        "/register",
        "/reset-password",
        "/verification",
        "/welcome",
        "/users/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/change-password": {
      "filePath": "change-password.tsx"
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/register": {
      "filePath": "register.tsx"
    },
    "/reset-password": {
      "filePath": "reset-password.tsx"
    },
    "/verification": {
      "filePath": "verification.tsx"
    },
    "/welcome": {
      "filePath": "welcome.tsx"
    },
    "/users/": {
      "filePath": "users/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
