# Mi Portal

## [See the App!](https://mi-portal.adaptable.app/)

![App Logo](your-image-logo-path-or-name)

## Descripción

Mi Portal es una comunidad virtual privada para poner en contacto vecinos de una misma comunidad o ciudad. A través de la web se pueden pedir favores y ofrecerse para solucionar los problemas de los vecinos. Además con el sistema de mensajería integrado los usuarios se pueden enviar mensajes para mantener una conversación fluida.
 
## Acciones que puede hacer el usuario

**NOTE -**  List here all the actions a user can do in the app. Example:

- **homepage** - Primera página de la web donde el usuario puede registrarse para crear una nueva cuenta o entrar con su cuenta.
- **mi perfil** - Página principal donde el usuario va a poder ver todo el historial de solicitudes que ha enviado al sistema, así como las solicitudes que tiene en curso o completadas. Además puede enviar mensajes a los usuarios con los que tiene algun tipo de interacción.
- **crear solicitud** - Página desde donde el usuario puede crear una solicitud nueva.
- **solicitudes pendientes** - Catálogo donde se pueden visualizar todas las solicitudes que hay en el sistema pendientes y con un sistema de filtro, las puede organizar según su categoría.
- **solicitudes completadas** - Catálogo con todas las solicitudes completadas.
- **usuarios** - Página con el listado completo de usuarios registrados en la web.
- **cerrar sesión** - Página para desloguearse como usuario.
- **registro** - Página con el formulario de registro de nuevo usuario.
- **login** - página de acceso para los usuarios registrados a la parte privada de la web.

## Funcionalidades no implementadas

- Favoritos: posibilidad de borrar sus usuarios favoritos.

## Tecnologías usadas

- HTML, CSS, Javascript, Node, Express, Handlebars, Sessions & Cookies, helpers.


## Rutas

- GET / 
  - homepage
- GET /auth/signup
  - redirects to / if user logged in
  - renders the signup form (with flash msg)
- POST /auth/signup
  - redirects to / if user logged in
  - body:
    - username
    - email
    - password
- GET /auth/login
  - redirects to / if user logged in
  - renders the login form (with flash msg)
- POST /auth/login
  - redirects to / if user logged in
  - body:
    - username
    - password

- GET /events
  - renders the event list + the create form
- POST /events/create 
  - redirects to / if user is anonymous
  - body: 
    - name
    - date
    - location
    - description


## Modelos

Usuario modelo
 
```
  correo: String
  password: String
  nombreCompleto: String
  rol:enum
  imagen: String
  favoritos: ObjectId<Usuario>
```

Solicitud modelo

```
  titulo: String
  descripcion: String
  categoria: enum
  imagenSolicitud: String
  fechaServicio: Date
  usuarioCreador: ObjectId<Usuarrio>
  usuarioPrestante: ObjectId<Usuarrio>
  estado: enum
  valoracion: string
  timestamps

```

Mensajeria modelo

```
  usuarioCreador: ObjectId<Usuario>
  usuarioPrestante: ObjectId<Usuario>
  mensaje: String
  nombreServicio:ObjectId<Solicitud>
  escritor: ObjectId<Usuario>
```

## Links

## Colaboradores

[Uriel Gartzia](https://github.com/uriel-gartzia)

[Elliot Fernandez](https://github.com/elliotfern/)

### Project

[Repository Link](https://github.com/elliotfern/mi-portal/)

[Deploy Link](https://mi-portal.adaptable.app/auth/login)

