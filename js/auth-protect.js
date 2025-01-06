// auth-protection.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Configuración de Firebase (debes usar la misma configuración que ya tienes)
const firebaseConfig = {
  apiKey: "AIzaSyDomcoN85Ehas3A55S8txtlw6OTSY1v2bk",
  authDomain: "ges-grupo.firebaseapp.com",
  projectId: "ges-grupo",
  storageBucket: "ges-grupo.firebasestorage.app",
  messagingSenderId: "356789219961",
  appId: "1:356789219961:web:9afba5766ea9ad1ac15aa8",
  measurementId: "G-1L39928RBK"
};

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);

// Ahora puedes acceder a Firebase Auth
const auth = getAuth(app);

// Verifica si el usuario está autenticado
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Si no está autenticado, redirige al login
        window.location.href = "login.html";
    }
});
