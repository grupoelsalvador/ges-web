// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { fontBase64 as importedFontBase64 } from './font.js';
// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDomcoN85Ehas3A55S8txtlw6OTSY1v2bk",
  authDomain: "ges-grupo.firebaseapp.com",
  projectId: "ges-grupo",
  storageBucket: "ges-grupo.firebasestorage.app",
  messagingSenderId: "356789219961",
  appId: "1:356789219961:web:9afba5766ea9ad1ac15aa8",
  measurementId: "G-1L39928RBK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const clientesSelect = document.getElementById("clientesSelect");
const clienteNombre = document.getElementById("clienteNombre");
const clienteNumeroTarjeta = document.getElementById("clienteNumeroTarjeta");
const generatePdfBtn = document.getElementById("generatePdf");

// Cargar los clientes cuando la página se cargue
async function loadClients() {
    try {
        const querySnapshot = await getDocs(collection(db, "clients"));
        console.log("Clientes cargados:", querySnapshot.size);  // Depuración para ver cuántos clientes se cargan
        querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            const option = document.createElement("option");
            option.value = docSnapshot.id;
            option.textContent = data.nombredelcliente || "Nombre no disponible";
            clientesSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar los clientes:", error);
    }
}

// Cargar los datos del cliente seleccionado
clientesSelect.addEventListener("change", async () => {
    const selectedClientId = clientesSelect.value;
    console.log("Cliente seleccionado:", selectedClientId);  // Depuración para ver qué cliente se seleccionó
    if (selectedClientId) {
        const docRef = doc(db, "clients", selectedClientId);
        try {
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                clienteNombre.textContent = data.nombredelcliente || "Nombre no disponible";
                clienteNumeroTarjeta.textContent = data.numerodetarjeta || "Número no disponible";
                console.log("Datos del cliente:", data);  // Depuración para ver los datos cargados
            } else {
                console.log("El cliente no existe en la base de datos.");
            }
        } catch (error) {
            console.error("Error al cargar los datos del cliente:", error);
        }
    }
});

// Generar el PDF con los datos del cliente seleccionado
generatePdfBtn.addEventListener("click", () => {
    const img = document.getElementById("imageToUse");

    // Verificar si la imagen está disponible
    if (!img.complete) {
        alert("La imagen no se ha cargado correctamente.");
        return;
    }

    // Verificar si el nombre y el número de tarjeta están disponibles
    if (!clienteNombre.textContent || !clienteNumeroTarjeta.textContent) {
        alert("No se ha seleccionado un cliente o los datos están incompletos.");
        console.log("Nombre cliente:", clienteNombre.textContent);  // Depuración
        console.log("Número tarjeta:", clienteNumeroTarjeta.textContent);  // Depuración
        return;
    }

    const { jsPDF } = window.jspdf;
  
    
    const fontUrl = "ShareTechMono-Regular.ttf"; // Ruta al archivo de la fuente

    // Convertir la fuente a base64 (puedes usar alguna herramienta en línea para hacerlo)
   
    const doc = new jsPDF();
    doc.addFileToVFS("ShareTechMono.ttf", fontBase64);
    doc.addFont("ShareTechMono.ttf", "Share Tech Mono", "normal");
    // Insertar la imagen en el PDF
    doc.addImage(img, 'PNG', 10, 10, 180, 170); // x, y, width, height
    
    // Establecer la fuente y tamaño
    doc.setFont("Share Tech Mono"); 
    doc.setFontSize(25);

    // Cambiar el color del texto para el nombre del cliente
    doc.setTextColor(246, 187, 33); // Rojo anaranjado
    doc.text(`${clienteNombre.textContent}`, 25, 95); // Nombre del cliente en color rojo anaranjado

    // Cambiar el color del texto para el número de tarjeta
    doc.setTextColor(235, 235, 235); // Verde
    doc.text(`${clienteNumeroTarjeta.textContent}`, 25, 107); // Número de tarjeta en color verde
    
    // Guardar el PDF
    doc.save(data.nombredelcliente);
});


console.log(window.jspdf);
console.log("Nombre del cliente:", clienteNombre.textContent);
console.log("Número de tarjeta:", clienteNumeroTarjeta.textContent);

// Llamar a la función para cargar los clientes cuando la página se cargue
loadClients();
// Manejo de autenticación
if (window.location.pathname.includes("login.html")) {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("login");
    const signupBtn = document.getElementById("signup");

    signupBtn.addEventListener("click", async () => {
        try {
            await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
            alert("Usuario registrado");
        } catch (error) {
            alert(error.message);
        }
    });

    loginBtn.addEventListener("click", async () => {
        try {
            await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
            window.location.href = "start.html";
        } catch (error) {
            alert(error.message);
        }
    });

    // Redirigir si ya está autenticado
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.href = "start.html";
        }
    });
}

// Manejo del CRUD
const dataTable = document.querySelector(".table tbody");

// Campos del formulario
const formFields = {
    nombredelcliente: document.getElementById("nombredelcliente"),
    tipodetarjeta: document.getElementById("tipodetarjeta"),
    miembrodesde: document.getElementById("miembrodesde"),
    contacto: document.getElementById("contacto"),
    codigo: document.getElementById("codigo"),
    referidode: document.getElementById("referidode"),
    correo: document.getElementById("correo"),
    whatsapp: document.getElementById("whatsapp"),
};

let editingDocId = null;

// Opciones predefinidas para el "Tipo de Tarjeta"
const tipoDeTarjetaOptions = ["digital", "fisica", "ambas"];

// Función para cargar las opciones del select "Tipo de Tarjeta"
function loadTipoDeTarjeta() {
    const select = formFields.tipodetarjeta;
    tipoDeTarjetaOptions.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option.charAt(0).toUpperCase() + option.slice(1); // Capitaliza la primera letra
        select.appendChild(optionElement);
    });
}
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();  // Obtener el término de búsqueda en minúsculas
    loadData(searchTerm);  // Pasar el término de búsqueda a la función de carga
});
// Función para cargar los datos
async function loadData(searchTerm = "") {
    dataTable.innerHTML = "";  // Limpiar la tabla

    // Obtener los documentos de la colección "clients"
    const querySnapshot = await getDocs(collection(db, "clients"));
    let index = 1;

    querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
    
        // Filtrar por nombre del cliente (o cualquier otro campo)
        if (
            data.nombredelcliente.toLowerCase().includes(searchTerm) ||
            data.tipodetarjeta.toLowerCase().includes(searchTerm) ||
            data.miembrodesde.toLowerCase().includes(searchTerm) ||
            data.contacto.toLowerCase().includes(searchTerm) ||
            data.referidode.toLowerCase().includes(searchTerm) ||
            data.correo.toLowerCase().includes(searchTerm) ||
            data.whatsapp.toLowerCase().includes(searchTerm) ||
            data.numerodetarjeta.toLowerCase().includes(searchTerm)
        ) {
            const row = document.createElement("tr");
        
            row.innerHTML = `
                <th>${index++}</th>
                <td>${data.nombredelcliente || ""}</td>
                <td>${data.tipodetarjeta || ""}</td>
                <td>${data.miembrodesde || ""}</td>
                <td>${data.contacto || ""}</td>
                <td>${data.referidode || ""}</td>
                <td>${data.correo || ""}</td>
                <td>${data.whatsapp || ""}</td>
                <td>${data.numerodetarjeta || ""}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${docSnapshot.id}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${docSnapshot.id}">Eliminar</button>
                    <button class="btn btn-info btn-sm generate-pdf-btn" data-id="${docSnapshot.id}">Generar Tarjeta</button>
                </td>
            `;
            dataTable.appendChild(row);
        }
        
    
    });
// Agregar eventos a los botones de editar y eliminar
document.querySelectorAll(".edit-btn").forEach((btn) =>
    btn.addEventListener("click", () => editData(btn.getAttribute("data-id")))
);

document.querySelectorAll(".generate-pdf-btn").forEach((btn) =>
    btn.addEventListener("click", async () => {
        const clientId = btn.getAttribute("data-id");
        const docRef = doc(db, "clients", clientId);
        try {
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                
                // Obtener los datos necesarios
                const clienteNombre = data.nombredelcliente || "Nombre no disponible";
                const clienteNumeroTarjeta = data.numerodetarjeta || "Número no disponible";
                const img1 = document.getElementById("imageToUse");  // Primera imagen
                const img2 = document.getElementById("secondImageToUse");  // Segunda imagen
                
                // Verificar si la primera imagen está disponible
                if (!img1.complete || !img2.complete) {
                    alert("Una o ambas imágenes no se han cargado correctamente.");
                    return;
                }

                const { jsPDF } = window.jspdf;

                // Crear el documento PDF
                const fontBase64 = importedFontBase64;
                const doc = new jsPDF();
                doc.addFileToVFS("ShareTechMono.ttf", fontBase64);
                doc.addFont("ShareTechMono.ttf", "Share Tech Mono", "normal");

                // Insertar la primera imagen en la primera página del PDF
                doc.addImage(img1, 'PNG', 10, 10, 180, 170); // x, y, width, height

                // Establecer la fuente y tamaño para el texto
                doc.setFont("Share Tech Mono"); 
                doc.setFontSize(25);

                // Cambiar el color del texto para el nombre del cliente
                doc.setTextColor(246, 187, 33); // Rojo anaranjado
                doc.text(clienteNombre, 25, 95); // Nombre del cliente en color rojo anaranjado

                // Cambiar el color del texto para el número de tarjeta
                doc.setTextColor(235, 235, 235); // Verde
                doc.text(clienteNumeroTarjeta, 25, 107); // Número de tarjeta en color verde

                // Crear una nueva página en el PDF
                doc.addPage();

                // Insertar la segunda imagen en la segunda página
                doc.addImage(img2, 'PNG', 10, 10, 180, 170); // x, y, width, height

                // Guardar el PDF
                doc.save('cliente.pdf');
            } else {
                console.log("El cliente no existe en la base de datos.");
            }
        } catch (error) {
            console.error("Error al generar el PDF:", error);
        }
    })
);

document.querySelectorAll(".delete-btn").forEach((btn) =>
    btn.addEventListener("click", () => deleteData(btn.getAttribute("data-id")))
);
}
// Función para mostrar un toast
function showToast(message, type) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.classList.add('toast', `bg-${type}`, 'text-white', 'position-relative', 'fade', 'show');
    toast.innerHTML = `
        <div class="toast-body">
            ${message}
        </div>
    `;
    toastContainer.appendChild(toast);

    // Mostrar el toast manualmente
    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();

    // Eliminar el toast después de que se oculta
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Función para eliminar un documento
async function deleteData(id) {
    try {
        await deleteDoc(doc(db, "clients", id));
        showToast("Cliente eliminado correctamente.", "success");
        loadData();
    } catch (error) {
        console.error("Error al eliminar el documento:", error);
        showToast("Error al eliminar el cliente.", "danger");
    }
}

// Función para cargar los datos en el formulario de edición
async function editData(id) {
    const docRef = doc(db, "clients", id);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
        const data = docSnapshot.data();

        // Llenar los campos del formulario en el modal
        document.getElementById("nombredelcliente").value = data.nombredelcliente || "";
        document.getElementById("tipodetarjeta").value = data.tipodetarjeta || "";
        document.getElementById("miembrodesde").value = data.miembrodesde || "";
        document.getElementById("contacto").value = data.contacto || "";
        document.getElementById("codigo").value = data.codigo || "";
        document.getElementById("correo").value = data.correo || "";
        document.getElementById("whatsapp").value = data.whatsapp || "";
        document.getElementById("referidode").value = data.referidode || "";
        document.getElementById("editingDocId").value = id;

        // Mostrar el modal
        const editModal = new bootstrap.Modal(document.getElementById("editModal"));
        editModal.show();
    } else {
        showToast("Cliente no encontrado.", "warning");
    }
}

// Guardar los cambios realizados en el formulario del modal
document.getElementById("saveChanges").addEventListener("click", async () => {
    const id = document.getElementById("editingDocId").value;
    const updatedData = {
        nombredelcliente: document.getElementById("nombredelcliente").value,
        tipodetarjeta: document.getElementById("tipodetarjeta").value,
        miembrodesde: document.getElementById("miembrodesde").value,
        contacto: document.getElementById("contacto").value,
        codigo: document.getElementById("codigo").value,
        correo: document.getElementById("correo").value,
        whatsapp: document.getElementById("whatsapp").value,
        referidode: document.getElementById("referidode").value,
    };

    try {
        await updateDoc(doc(db, "clients", id), updatedData);
        showToast("Cliente actualizado correctamente.", "success");
        const editModal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
        editModal.hide();
        loadData(); // Recargar la tabla
    } catch (error) {
        console.error("Error al guardar los cambios:", error);
        showToast("Error al actualizar el cliente.", "danger");
    }
});


// Crear o editar datos
    const createBtn = document.getElementById("create");
    createBtn.addEventListener("click", async () => {
        const data = Object.fromEntries(
            Object.entries(formFields).map(([key, field]) => [key, field.value.trim()])
        );

        // Validación de campos obligatorios
        if (!data.nombredelcliente || !data.miembrodesde || !data.contacto || !data.codigo || !data.correo || !data.whatsapp) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        try {
            // Generar el número de tarjeta automáticamente
            data.numerodetarjeta = generarNumeroDeTarjeta();
            
            // Si hay un referente seleccionado, tomar el ID de ese referente
            if (data.referidode) {
                data.referidode = data.referidode;  // Guardar directamente el ID del referente
            }

            // Guardar los datos en Firestore
            if (editingDocId) {
                await updateDoc(doc(db, "clients", editingDocId), data);
                alert("Cliente actualizado correctamente");
            } else {
                await addDoc(collection(db, "clients"), data);
                alert("Cliente registrado correctamente");
            }

            // Limpiar los campos
            Object.values(formFields).forEach((field) => (field.value = ""));
            editingDocId = null;
            createBtn.textContent = "Crear";

            // Recargar los datos
            loadData();

        } catch (error) {
            console.error("Error al guardar los datos:", error);
        }
    });

// Carga inicial de datos
loadData();

// Cargar las opciones predefinidas del "Tipo de Tarjeta" en el select
loadTipoDeTarjeta();

// Cargar los datos de referidos en el select
// Cargar los datos de referidos en el select
async function loadReferidos() {
    try {
        // Obtener los documentos de la colección "clients"
        const querySnapshot = await getDocs(collection(db, "clients"));

        // Limpiar el select antes de agregar nuevas opciones
        const selectReferidos = document.getElementById("referidode");
        selectReferidos.innerHTML = '<option value="">Selecciona un referente</option>';

        // Verificar si la colección tiene datos
        if (querySnapshot.empty) {
            console.log("No hay referidos disponibles");
            return;
        }

        // Iterar sobre los documentos de la colección
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Cargando referente: ", data.nombredelcliente); // Verifica que los datos están correctos

            const option = document.createElement("option");
            option.value = data.nombredelcliente;  // Asignar el ID del documento como valor
            option.textContent = data.nombredelcliente || "Nombre no disponible";  // Nombre del referente
            selectReferidos.appendChild(option);  // Agregar la opción al select
        });
    } catch (error) {
        console.error("Error al cargar los referidos:", error);
    }
}

// Llamar la función para cargar los referidos cuando se inicializa la página
loadReferidos();


function generarNumeroDeTarjeta() {
    // Los primeros 8 dígitos fijos
    const primeros8Digitos = "2124 1937";
    
    // Generar 4 dígitos aleatorios para cada parte final
    const aleatorio1 = Math.floor(Math.random() * 10000);  // Números entre 0 y 9999
    const aleatorio2 = Math.floor(Math.random() * 10000);  // Números entre 0 y 9999
    
    // Asegurarse de que los números sean de 4 dígitos (rellenarlos con ceros a la izquierda si es necesario)
    const numeroFinal1 = aleatorio1.toString().padStart(4, '0');
    const numeroFinal2 = aleatorio2.toString().padStart(4, '0');
    
    return `${primeros8Digitos} ${numeroFinal1} ${numeroFinal2}`;
}

