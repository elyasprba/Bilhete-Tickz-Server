<p align="center">

  <h1 align="center">Bilhete Tickz Server</h1>

  <p align="center">
    <br />
    <a href="#">View Live Application</a>
    ·
    <a href="#">Report Bug</a>
    ·
    <a href="#">Request Feature</a>
  </p>
</p>
<br>
</div>

## 📍 About

<p>Description</p>
<br>

## 📌 How To Install?

-  Clone This Repo

```
$  git clone
```

-  Go To Folder Repo

```
$  cd Bilhete-Tickz-Server
```

-  Setup .env

```
DB_USER
DB_HOST
DB_DATABASE
DB_PASSWORD
DB_PORT
DATABASE_URL
JWT_SECRET
JWT_ISSUER
CLOUD_NAME
CLOUD_API
CLOUD_SECRET
SERVICE
USER
PASS
BASE_URL
```

-  Install Module

```
$  npm install
```

-  To Start The Project

```
$  npm run startDev
```

<br/>

## ✍️ Related Project

Link project : [Bilhete-Tickz](https://bilhete-tickz.vercel.app)

<br>

## ⛏️ Built Using

-  [Bcrypt](https://www.npmjs.com/package/bcrypt)
-  [Cloudinary](https://www.npmjs.com/package/cloudinary)
-  [Cors](https://www.npmjs.com/package/cors)
-  [Dotenv](https://www.npmjs.com/package/dotenv)
-  [Express](https://www.npmjs.com/package/express)
-  [Express-Validator](https://www.npmjs.com/package/express-validator)
-  [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken)
-  [Multer](https://www.npmjs.com/package/multer)
-  [multer-storage-cloudinary](https://www.npmjs.com/package/multer-storage-cloudinary)
-  [pg](https://www.npmjs.com/package/pg)
-  [Morgan](https://www.npmjs.com/package/morgan)
-  [uuid](https://www.npmjs.com/package/uuidv4)
-  [Eslint](https://www.npmjs.com/package/eslint)
-  [Nodemon](https://www.npmjs.com/package/nodemon)

<br>

## 🖇 Endpoint Details

### Module Auth

| Method | Endpoint                     | Information                      |
| ------ | ---------------------------- | -------------------------------- |
| POST   | /auth/new                    | Used for register new user.      |
| POST   | /auth                        | Used for login into app.         |
| GET    | /auth/confirm/:token         | Used for activating new account. |
| GET    | /auth/forgot-password/:email | Used for forgot password.        |
| DELETE | /auth                        | Used for logout.                 |

### Module Users

| Method | Endpoint            | Information                 |
| ------ | ------------------- | --------------------------- |
| GET    | /users              | Used for user info.         |
| PATCH  | /users              | Used for update user info.  |
| PATCH  | /auth/edit-password | Used for reseting password. |

### Module Payments

| Method | Endpoint             | Information                       |
| ------ | -------------------- | --------------------------------- |
| GET    | /payments/history    | Used for get history payments.    |
| GET    | /payments/ticket/:id | Used for get transactions.        |
| GET    | /payments/check      | Used for check unpaid payments.   |
| GET    | /payments/cancel     | Used for cancel paymnets.         |
| GET    | /payments/dashboard  | Used for get dashboard.           |
| PATCH  | /payments/:id        | Used for confirm payments.        |
| POST   | /payments            | Used for create new transactions. |

### Module Movies

| Method | Endpoint                 | Information                   |
| ------ | ------------------------ | ----------------------------- |
| GET    | /movies                  | Used for get movies.          |
| GET    | /movies/upcoming         | Used for get upcoming movies. |
| GET    | /movies/nowshow          | Used for get showing movies.  |
| GET    | /movies/cinema/:location | Used for get location movies. |
| GET    | /movies/:id              | Used for get movies detail.   |
| POST   | /movies                  | Used for create new movies.   |

### Module Showtime

| Method | Endpoint             | Information                   |
| ------ | -------------------- | ----------------------------- |
| GET    | /showtime/:id        | Used for get movies showtime. |
| GET    | /showtime/detail/:id | Used for get detail showtime. |
| POST   | /showtime            | Used for create new showtime. |

## 📄 Documentation

-  [Postman]()
-  [Bilhete-Tickz-Backend](https://bilhete-tickz.herokuapp.com)

<br>

## 🤝 Bilhete-Tickz - Team Project

|                                      [Elyas Purba Prastiya](https://github.com/elyasprba)                                       |                                           [Yoga Arta Grahanantyo](https://github.com/yogaarta)                                           |                                            [Ferry Aryadicka](https://github.com/faryadicka)                                            |                                               [Ilham Nurrohman](https://github.com/IlhamNurrohman)                                                |                                                 [Rivaldi Christovel Siby](https://github.com/RivaldiSiby)                                                 |
| :-----------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://res.cloudinary.com/dqlpsz6fz/image/upload/v1657624249/2_gvxvcd.jpg" alt="Elyas Purba Prastiya" width="210"  > | <img src="https://res.cloudinary.com/dqlpsz6fz/image/upload/v1657623879/foto-profil_zuai90.jpg" alt="Yoga Arta Grahanantyo" width='160'> | <img src="https://res.cloudinary.com/dqlpsz6fz/image/upload/v1657625072/20220712_181903_gwmm8o.jpg" alt="Ferry Aryadicka" width='210'> | <img src="https://res.cloudinary.com/dqlpsz6fz/image/upload/v1657626519/LRM_EXPORT_20200627_192933_igl7oe.jpg" alt="Ilham Nurrohman" width='200'> | <img src="https://res.cloudinary.com/dqlpsz6fz/image/upload/v1657632081/IMG_20220620_021316-picsay_yrgtpr.jpg" alt="Rivaldi Christovel Siby" width='180'> |
|                                                 <b>PM & Frontend Developer</b>                                                  |                                                        <b>Fullstack Developer</b>                                                        |                                                       <b>Frontend Developer</b>                                                        |                                                             <b>Backend Developer</b>                                                              |                                                                <b>Fullstack Developer</b>                                                                 |
