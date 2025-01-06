// auth-protection.js



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

import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const auth = getAuth();

// Función para cerrar sesión
async function logout() {
    try {
        await signOut(auth);
        window.location.href = "login.html"; // Redirige al usuario a la página de login
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
}

// Busca un botón con ID "logout" y asocia el evento de clic
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
});
