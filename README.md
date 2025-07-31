# 💬 Real-Time Chat App

Una aplicación de chat en tiempo real construida con **React**, **TailwindCSS**, **Stomp**, y **WebSockets**, que permite comunicación instantánea entre usuarios.

El backend para este repostirio se encuentra en [Repositorio](https://github.com/panchoarc/chatit-backend-spring-boot)

## 🛠 Tecnologías utilizadas

### Frontend

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) nativo
- [Axios](https://axios-http.com/) para peticiones HTTP
- [StompJS](https://stomp-js.github.io/guide/stompjs/using-stompjs-v5.html)

## ✨ Características

- Autenticación de usuarios (registro/login con JWT)
- Chats privados y de grupo
- Envío de mensajes en tiempo real mediante WebSocket
- Subida de archivos y mensajes multimedia (imágenes, audio, etc.)
- Notificaciones de nuevos mensajes
- Chats anidados con historial y scroll infinito

## 🚀 Cómo ejecutar localmente

### Requisitos

- Node.js >= 18

### 1. Clonar el repositorio

```bash
  git clone https://github.com/panchoarc/chatit-frontend-react.git
  cd chatit-frontend-react
  npm install
  npm run dev
```

### 2. Configurar el archivo .env

Modifica el archivo env.example y conviertelo a .env con sus respectivas credenciales si es necesario, asegurándote de que las credenciales y la URL de la base de datos sean correctas.

La aplicación estará disponible en http://localhost:5173

# Características principales

### 🔹 Registro y login de usuarios.

### 🔹 Chat con soporte de grupos y de mensajes privados.

### 🔹 Soporte de notificaciones en tiempo real con stomp y websockets

### 🔹 Soporte de subida de archivos (audio, imágenes)

### 🔹 Indicaciones de escritura

### 🔹 Visualización de imágenes


## ✅ Roadmap / To-do

### 💬 Mensajes

- [ ] Menciones y reacciones

### 🖼️ Multimedia

- [x] Soporte para mensajes de voz

### 🔒 Seguridad
- [ ] Cifrado de extremo a extremo (E2EE)

### 🧠 UX / UI
- [ ] Mejora de interfaz para dispositivos móviles
- [ ] Notificaciones de nuevos mensajes en segundo plano
- [ ] Animaciones al enviar/recibir mensajes
