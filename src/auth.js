// ============================================================
// auth.js  —  LOGIN Y REGISTRO DE USUARIOS
// ============================================================
// Este archivo maneja todo lo que pasa en la pantalla de
// login/registro. Desde elegir un usuario hasta crear uno
// nuevo o borrarlo.
//
// QUE HACE:
//   - Muestra la lista de usuarios para elegir
//   - Muestra el formulario para crear uno nuevo
//   - Guarda el usuario nuevo en la base de datos
//   - Borra usuarios si queres
//   - Muestra la info del usuario en la barra lateral
// ============================================================


// ------------------------------------------------------------
// mostrarLogin(usuarios)
// ------------------------------------------------------------
// Muestra la pantalla con todos los usuarios guardados.
// Cada usuario aparece como una tarjeta que podes clickear
// para iniciar sesion, o borrar con la cruz roja.
//
// "usuarios" es un array que viene de la base de datos.
// ------------------------------------------------------------
function mostrarLogin(usuarios) {

    // Mostramos el modo login, ocultamos el registro
    document.getElementById('modo-login').style.display = 'block';
    document.getElementById('modo-registro').style.display = 'none';
    document.getElementById('pantalla-auth').style.display = 'flex';

    // Buscamos donde van las tarjetas de usuarios
    var contenedor = document.getElementById('lista-usuarios');
    contenedor.innerHTML = '';  // Limpiamos todo antes de agregar

    // Si no hay usuarios, mostramos el registro directamente
    if (usuarios.length === 0) {
        mostrarRegistro();
        return;
    }

    // Por cada usuario, creamos una tarjeta
    for (var i = 0; i < usuarios.length; i++) {
        var u = usuarios[i];

        // ---- CREAMOS LA TARJETA ----
        var tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-usuario';

        // Elegimos un icono segun el nivel
        var icono = '🌱';  // Principiante
        if (u.nivel === 'Intermedio') icono = '💪';
        if (u.nivel === 'Experto') icono = '🔥';

        // Texto de peso y altura (si tienen)
        var pesoTexto = u.peso ? u.peso + ' kg' : '—';
        var alturaTexto = u.altura ? u.altura + ' cm' : '—';

        // ---- PARTE IZQUIERDA: info del usuario (clickeable para entrar) ----
        var infoDiv = document.createElement('div');
        infoDiv.className = 'tu-info-clickeable';
        infoDiv.onclick = function (id) {
            return function () { seleccionarUsuario(id); };
        }(u.id);

        infoDiv.innerHTML =
            '<span class="tu-icono">' + icono + '</span>' +
            '<div class="tu-info">' +
                '<strong>' + u.nombre + '</strong>' +
                '<small>' + u.nivel + ' · ' + pesoTexto + ' · ' + alturaTexto + '</small>' +
            '</div>' +
            '<span class="tu-flecha">→</span>';

        // ---- PARTE DERECHA: boton rojo para eliminar ----
        var btnEliminar = document.createElement('button');
        btnEliminar.className = 'btn-eliminar-usuario';
        btnEliminar.textContent = '✕';
        btnEliminar.title = 'Eliminar usuario';
        btnEliminar.onclick = function (id, nombre) {
            return function () {
                if (confirm('¿Eliminar a ' + nombre + '?')) {
                    eliminarUsuario(id);
                    var usuariosRestantes = obtenerUsuarios();
                    if (usuariosRestantes.length === 0) {
                        // Recargamos la pagina para arrancar de cero
                        location.reload();
                    } else {
                        mostrarLogin(usuariosRestantes);
                    }
                }
            };
        }(u.id, u.nombre);

        // Juntamos todo en la tarjeta y la agregamos al listado
        tarjeta.appendChild(infoDiv);
        tarjeta.appendChild(btnEliminar);
        contenedor.appendChild(tarjeta);
    }
}


// ------------------------------------------------------------
// mostrarRegistro()
// ------------------------------------------------------------
// Muestra el formulario para crear un usuario nuevo.
// Pide: nombre, nivel, peso y altura.
// ------------------------------------------------------------
function mostrarRegistro() {
    // Mostramos la pantalla de auth
    document.getElementById('pantalla-auth').style.display = 'flex';
    document.getElementById('modo-login').style.display = 'none';

    // RECREAMOS el formulario de registro desde cero
    // ATENCION: esto reemplaza TODO el contenido de #modo-registro
    // que estaba en el HTML original. El HTML estatico de index.html
    // para #modo-registro solo sirve como plantilla inicial.
    // Si queres cambiar el formulario, edita ACA y no en el HTML.
    var modoRegistro = document.getElementById('modo-registro');
    modoRegistro.style.display = 'block';

    modoRegistro.innerHTML =
        '<h1>🆕 Crear usuario</h1>' +
        '<div class="form-registro">' +
            '<label>Nombre</label>' +
            '<input type="text" id="reg-nombre" class="input-auth" placeholder="Ej: Usuario">' +

            '<label>Nivel</label>' +
            '<div class="opciones-nivel">' +
                '<button onclick="elegirNivelReg(\'Principiante\')" class="boton-nivel" data-nivel="Principiante">' +
                    '<span class="icono-nivel">🌱</span>' +
                    '<span class="texto-nivel"><strong>Principiante</strong><small>Apenas empezando</small></span>' +
                '</button>' +
                '<button onclick="elegirNivelReg(\'Intermedio\')" class="boton-nivel" data-nivel="Intermedio">' +
                    '<span class="icono-nivel">💪</span>' +
                    '<span class="texto-nivel"><strong>Intermedio</strong><small>Ya haces dominadas y fondos</small></span>' +
                '</button>' +
                '<button onclick="elegirNivelReg(\'Experto\')" class="boton-nivel" data-nivel="Experto">' +
                    '<span class="icono-nivel">🔥</span>' +
                    '<span class="texto-nivel"><strong>Experto</strong><small>Muscle up, front lever</small></span>' +
                '</button>' +
            '</div>' +

            '<div class="fila-datos">' +
                '<div class="columna-dato">' +
                    '<label>Peso (kg)</label>' +
                    '<input type="number" id="reg-peso" class="input-auth" placeholder="70" step="0.1">' +
                '</div>' +
                '<div class="columna-dato">' +
                    '<label>Altura (cm)</label>' +
                    '<input type="number" id="reg-altura" class="input-auth" placeholder="175">' +
                '</div>' +
            '</div>' +

            '<button onclick="crearUsuarioClick()" class="btn-principal">✅ Crear usuario</button>' +
        '</div>';

    // Agregamos el boton Volver (si hay usuarios)
    var hayUsuarios = obtenerUsuarios().length > 0;
    if (hayUsuarios) {
        modoRegistro.innerHTML += '<button onclick="mostrarLogin(obtenerUsuarios())" class="btn-link" style="display:inline">← Volver</button>';
    }

    nivelSeleccionado = null;
}


// ------------------------------------------------------------
// elegirNivelReg(nivel)
// ------------------------------------------------------------
// Cuando apretas uno de los 3 botones de nivel en el
// formulario de registro, esto guarda cual elegiste y
// lo resalta visualmente.
// ------------------------------------------------------------
function elegirNivelReg(nivel) {
    nivelSeleccionado = nivel;

    // Recorremos los botones de nivel y resaltamos el elegido
    var botones = document.querySelectorAll('#modo-registro .boton-nivel');
    for (var i = 0; i < botones.length; i++) {
        if (botones[i].getAttribute('data-nivel') === nivel) {
            botones[i].classList.add('seleccionado');
        } else {
            botones[i].classList.remove('seleccionado');
        }
    }
}


// ------------------------------------------------------------
// crearUsuarioClick()
// ------------------------------------------------------------
// Lee los datos del formulario de registro, los valida,
// crea el usuario en la base de datos y vuelve al login.
// ------------------------------------------------------------
function crearUsuarioClick() {

    // Leemos los valores del formulario
    var nombre = document.getElementById('reg-nombre').value.trim();
    var peso = parseFloat(document.getElementById('reg-peso').value);
    var altura = parseFloat(document.getElementById('reg-altura').value);

    // Validamos: si falta el nombre, avisamos
    if (nombre === '') {
        alert('Pon un nombre');
        return;
    }
    // Validamos: si no eligio nivel, avisamos
    if (nivelSeleccionado === null) {
        alert('Elegi un nivel');
        return;
    }
    // Si peso o altura estan vacios, los dejamos como null
    if (isNaN(peso)) peso = null;
    if (isNaN(altura)) altura = null;

    // Guardamos el usuario en la base de datos
    crearUsuario(nombre, nivelSeleccionado, peso, altura);

    // Limpiamos el nivel elegido para el proximo registro
    nivelSeleccionado = null;

    // Volvemos a la pantalla de login con el usuario nuevo
    var usuarios = obtenerUsuarios();
    mostrarLogin(usuarios);
}


// ------------------------------------------------------------
// seleccionarUsuario(id)
// ------------------------------------------------------------
// Cuando haces click en un usuario de la lista, esto:
//   1. Busca sus datos en la base de datos
//   2. Guarda quien es el usuario actual
//   3. Oculta la pantalla de login
//   4. Muestra la app principal con sus datos
// ------------------------------------------------------------
function seleccionarUsuario(id) {
    // Buscamos los datos del usuario en la DB
    usuarioActual = obtenerUsuarioPorId(id);

    // Ocultamos login, mostramos la app
    ocultarAuth();
    mostrarApp();

    // Actualizamos la barra lateral con su nombre y nivel
    actualizarInfoUsuario();
}


// ------------------------------------------------------------
// cerrarSesion()
// ------------------------------------------------------------
// Vuelve a la pantalla de login. Se llama desde el boton
// "Cambiar usuario" en la barra lateral.
// ------------------------------------------------------------
function cerrarSesion() {
    // Limpiamos todo
    usuarioActual = null;
    nivelSeleccionado = null;

    // Ocultamos la app y mostramos el login
    ocultarApp();
    document.getElementById('pantalla-auth').style.display = 'flex';

    // Preguntamos si hay usuarios y mostramos login o registro
    var usuarios = obtenerUsuarios();
    if (usuarios.length === 0) {
        mostrarRegistro();
    } else {
        mostrarLogin(usuarios);
    }
}


// ------------------------------------------------------------
// actualizarInfoUsuario()
// ------------------------------------------------------------
// Muestra el nombre, nivel y avatar del usuario en la
// barra lateral de la izquierda.
// ------------------------------------------------------------
function actualizarInfoUsuario() {
    if (!usuarioActual) return;

    // Mostramos el nombre
    document.getElementById('user-nombre').textContent = usuarioActual.nombre;

    // Mostramos el nivel con un icono
    var icono = '🌱';
    if (usuarioActual.nivel === 'Intermedio') icono = '💪';
    if (usuarioActual.nivel === 'Experto') icono = '🔥';
    document.getElementById('user-nivel').textContent = icono + ' ' + usuarioActual.nivel;

    // El avatar es la primera letra del nombre
    document.getElementById('avatar-usuario').textContent = usuarioActual.nombre.charAt(0).toUpperCase();

    // Actualizamos la tarjeta de bienvenida en el inicio
    var pesoTexto = usuarioActual.peso ? usuarioActual.peso + ' kg' : '—';
    var alturaTexto = usuarioActual.altura ? usuarioActual.altura + ' cm' : '—';
    var tarjeta = document.getElementById('tarjeta-bienvenida');

    tarjeta.innerHTML =
        '<h3>👋 Hola, ' + usuarioActual.nombre + '</h3>' +
        '<p>Nivel: <strong>' + usuarioActual.nivel + '</strong></p>' +
        '<p>Peso: ' + pesoTexto + ' | Altura: ' + alturaTexto + '</p>';
}
