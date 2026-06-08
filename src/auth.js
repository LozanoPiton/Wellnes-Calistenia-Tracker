function mostrarLogin(usuarios) {
    document.getElementById('modo-login').style.display = 'block';
    document.getElementById('modo-registro').style.display = 'none';
    document.getElementById('pantalla-auth').style.display = 'flex';

    var contenedor = document.getElementById('lista-usuarios');
    contenedor.innerHTML = '';

    if (usuarios.length === 0) {
        mostrarRegistro();
        return;
    }

    for (var i = 0; i < usuarios.length; i++) {
        var u = usuarios[i];

        var tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-usuario';

        var icono = '<img src="icons/plant.svg" width="20" height="20" />';
        if (u.nivel === 'Intermedio') icono = '<img src="icons/muscle.svg" width="20" height="20" />';
        if (u.nivel === 'Experto') icono = '<img src="icons/fire.svg" width="20" height="20" />';

        var pesoTexto = u.peso ? u.peso + ' kg' : '—';
        var alturaTexto = u.altura ? u.altura + ' cm' : '—';

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

        var btnEliminar = document.createElement('button');
        btnEliminar.className = 'btn-eliminar-usuario';
        btnEliminar.innerHTML = '<img src="icons/close.svg" width="16" height="16" />';
        btnEliminar.title = t('eliminarUsuario');
        btnEliminar.onclick = function (id, nombre) {
            return function () {
                if (confirm(t('confirmEliminar') + ' ' + nombre + '?')) {
                    eliminarUsuario(id);
                    var usuariosRestantes = obtenerUsuarios();
                    if (usuariosRestantes.length === 0) {
                        location.reload();
                    } else {
                        mostrarLogin(usuariosRestantes);
                    }
                }
            };
        }(u.id, u.nombre);

        tarjeta.appendChild(infoDiv);
        tarjeta.appendChild(btnEliminar);
        contenedor.appendChild(tarjeta);
    }
}

function mostrarRegistro() {
    document.getElementById('pantalla-auth').style.display = 'flex';
    document.getElementById('modo-login').style.display = 'none';

    var modoRegistro = document.getElementById('modo-registro');
    modoRegistro.style.display = 'block';

    modoRegistro.innerHTML =
        '<h1><img src="icons/new.svg" width="24" height="24" /> ' + t('registroTitulo') + '</h1>' +
        '<div class="form-registro">' +
            '<label>' + t('regNombre') + '</label>' +
            '<input type="text" id="reg-nombre" class="input-auth" placeholder="' + t('placeholderNombre') + '">' +

            '<label>' + t('regNivel') + '</label>' +
            '<div class="opciones-nivel">' +
                '<button onclick="elegirNivelReg(\'Principiante\')" class="boton-nivel" data-nivel="Principiante">' +
                    '<span class="icono-nivel"><img src="icons/plant.svg" width="24" height="24" /></span>' +
                    '<span class="texto-nivel"><strong>' + t('principiante') + '</strong><small>' + t('principianteDesc') + '</small></span>' +
                '</button>' +
                '<button onclick="elegirNivelReg(\'Intermedio\')" class="boton-nivel" data-nivel="Intermedio">' +
                    '<span class="icono-nivel"><img src="icons/muscle.svg" width="24" height="24" /></span>' +
                    '<span class="texto-nivel"><strong>' + t('intermedio') + '</strong><small>' + t('intermedioDesc') + '</small></span>' +
                '</button>' +
                '<button onclick="elegirNivelReg(\'Experto\')" class="boton-nivel" data-nivel="Experto">' +
                    '<span class="icono-nivel"><img src="icons/fire.svg" width="24" height="24" /></span>' +
                    '<span class="texto-nivel"><strong>' + t('experto') + '</strong><small>' + t('expertoDesc') + '</small></span>' +
                '</button>' +
            '</div>' +

            '<div class="fila-datos">' +
                '<div class="columna-dato">' +
                    '<label>' + t('regPeso') + '</label>' +
                    '<input type="number" id="reg-peso" class="input-auth" placeholder="' + t('placeholderPeso') + '" step="0.1">' +
                '</div>' +
                '<div class="columna-dato">' +
                    '<label>' + t('regAltura') + '</label>' +
                    '<input type="number" id="reg-altura" class="input-auth" placeholder="' + t('placeholderAltura') + '">' +
                '</div>' +
            '</div>' +

            '<label>' + t('regObjetivo') + '</label>' +
            '<input type="text" id="reg-objetivo" class="input-auth" placeholder="' + t('placeholderObjetivo') + '">' +

            '<button onclick="crearUsuarioClick()" class="btn-principal">' + t('btnCrearUsuario') + '</button>' +
        '</div>';

    var hayUsuarios = obtenerUsuarios().length > 0;
    if (hayUsuarios) {
        modoRegistro.innerHTML += '<button onclick="mostrarLogin(obtenerUsuarios())" class="btn-link" style="display:inline"><img src="icons/back.svg" width="16" height="16" /> ' + t('volver') + '</button>';
    }

    nivelSeleccionado = null;
}

function elegirNivelReg(nivel) {
    nivelSeleccionado = nivel;

    var botones = document.querySelectorAll('#modo-registro .boton-nivel');
    for (var i = 0; i < botones.length; i++) {
        if (botones[i].getAttribute('data-nivel') === nivel) {
            botones[i].classList.add('seleccionado');
        } else {
            botones[i].classList.remove('seleccionado');
        }
    }
}

function crearUsuarioClick() {
    var nombre = document.getElementById('reg-nombre').value.trim();
    var peso = parseFloat(document.getElementById('reg-peso').value);
    var altura = parseFloat(document.getElementById('reg-altura').value);
    var objetivo = document.getElementById('reg-objetivo').value.trim();

    if (nombre === '') {
        alert(t('alertNombre'));
        return;
    }
    if (nivelSeleccionado === null) {
        alert(t('alertNivel'));
        return;
    }
    if (isNaN(peso)) peso = null;
    if (isNaN(altura)) altura = null;
    if (objetivo === '') objetivo = null;

    crearUsuario(nombre, nivelSeleccionado, peso, altura, objetivo);

    nivelSeleccionado = null;

    var usuarios = obtenerUsuarios();
    mostrarLogin(usuarios);
}

function seleccionarUsuario(id) {
    usuarioActual = obtenerUsuarioPorId(id);

    inicializarPlanSemanal(usuarioActual.id);

    ocultarAuth();
    mostrarApp();

    actualizarInfoUsuario();
    refrescarHistorial();
    refrescarPlanSemanal();
}

function cerrarSesion() {
    usuarioActual = null;
    nivelSeleccionado = null;

    ocultarApp();
    document.getElementById('pantalla-auth').style.display = 'flex';

    var usuarios = obtenerUsuarios();
    if (usuarios.length === 0) {
        mostrarRegistro();
    } else {
        mostrarLogin(usuarios);
    }
}

function actualizarInfoUsuario() {
    if (!usuarioActual) return;

    document.getElementById('user-nombre').textContent = usuarioActual.nombre;
    var icono = '<img src="icons/plant.svg" width="20" height="20" />';
    if (usuarioActual.nivel === 'Intermedio') icono = '<img src="icons/muscle.svg" width="20" height="20" />';
    if (usuarioActual.nivel === 'Experto') icono = '<img src="icons/fire.svg" width="20" height="20" />';
    document.getElementById('user-nivel').innerHTML = icono + ' ' + t(usuarioActual.nivel.toLowerCase());
    document.getElementById('avatar-usuario').textContent = usuarioActual.nombre.charAt(0).toUpperCase();

    var pesoTexto = usuarioActual.peso ? usuarioActual.peso + ' kg' : '—';
    var alturaTexto = usuarioActual.altura ? usuarioActual.altura + ' cm' : '—';
    var objetivotTexto = usuarioActual.objetivo && usuarioActual.objetivo.trim() !== ''
        ? usuarioActual.objetivo
        : '<span style="color:#6c7086;font-style:italic">' + t('sinObjetivo') + '</span>';
    var tarjeta = document.getElementById('tarjeta-bienvenida');
    tarjeta.innerHTML =
        '<h3><img src="icons/muscle.svg" width="24" height="24" /> ' + t('hola') + ', ' + usuarioActual.nombre + '</h3>' +
        '<p>' + t('nivel') + ' <strong>' + t(usuarioActual.nivel.toLowerCase()) + '</strong></p>' +
        '<p><img src="icons/target.svg" width="16" height="16" style="vertical-align:middle" /> ' + objetivotTexto + '</p>' +
        '<p>' + t('peso') + ' ' + pesoTexto + ' | ' + t('altura') + ' ' + alturaTexto + '</p>';

    document.getElementById('texto-objetivo').innerHTML = objetivotTexto;

    document.getElementById('perfil-nombre').textContent = usuarioActual.nombre;
    document.getElementById('perfil-nivel').textContent = t(usuarioActual.nivel.toLowerCase());
    document.getElementById('perfil-objetivo').innerHTML = objetivotTexto;
    document.getElementById('perfil-peso').textContent = usuarioActual.peso || '—';
    document.getElementById('perfil-altura').textContent = usuarioActual.altura || '—';
}

function mostrarEditarPerfil() {
    if (!usuarioActual) return;

    document.getElementById('edit-nombre').value = usuarioActual.nombre;
    document.getElementById('edit-nivel').value = usuarioActual.nivel;
    document.getElementById('edit-objetivo').value = usuarioActual.objetivo || '';
    document.getElementById('edit-peso').value = usuarioActual.peso || '';
    document.getElementById('edit-altura').value = usuarioActual.altura || '';

    document.getElementById('perfil-vista').style.display = 'none';
    document.getElementById('perfil-edicion').style.display = 'block';
}

function guardarEditarPerfil() {
    if (!usuarioActual) return;

    var nombre = document.getElementById('edit-nombre').value.trim();
    var nivel = document.getElementById('edit-nivel').value;
    var objetivo = document.getElementById('edit-objetivo').value.trim();
    var peso = parseFloat(document.getElementById('edit-peso').value);
    var altura = parseFloat(document.getElementById('edit-altura').value);

    if (nombre === '') { alert(t('nombreVacio')); return; }
    if (isNaN(peso)) peso = null;
    if (isNaN(altura)) altura = null;
    if (objetivo === '') objetivo = null;

    actualizarUsuario(usuarioActual.id, nombre, nivel, peso, altura, objetivo);

    usuarioActual = obtenerUsuarioPorId(usuarioActual.id);
    actualizarInfoUsuario();
    cancelarEditarPerfil();
}

function cancelarEditarPerfil() {
    document.getElementById('perfil-vista').style.display = 'block';
    document.getElementById('perfil-edicion').style.display = 'none';
}

window.mostrarEditarPerfil = mostrarEditarPerfil;
window.guardarEditarPerfil = guardarEditarPerfil;
window.cancelarEditarPerfil = cancelarEditarPerfil;
