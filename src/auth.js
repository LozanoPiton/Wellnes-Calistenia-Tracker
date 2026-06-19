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

        var infoDiv = document.createElement('div');
        infoDiv.className = 'tu-info-clickeable';
        infoDiv.onclick = function (id) {
            return function () { seleccionarUsuario(id); };
        }(u.id);

        var icono = document.createElement('img');
        icono.src = 'icons/plant.svg';
        icono.width = 20;
        icono.height = 20;
        if (u.nivel === 'Intermedio') icono.src = 'icons/muscle.svg';
        if (u.nivel === 'Experto') icono.src = 'icons/fire.svg';

        var spanIcono = document.createElement('span');
        spanIcono.className = 'tu-icono';
        spanIcono.appendChild(icono);
        infoDiv.appendChild(spanIcono);

        var divInfo = document.createElement('div');
        divInfo.className = 'tu-info';

        var strong = document.createElement('strong');
        strong.textContent = u.nombre;
        divInfo.appendChild(strong);

        var pesoTexto = u.peso ? u.peso + ' kg' : '—';
        var alturaTexto = u.altura ? u.altura + ' cm' : '—';
        var small = document.createElement('small');
        small.textContent = u.nivel + ' · ' + pesoTexto + ' · ' + alturaTexto;
        divInfo.appendChild(small);

        infoDiv.appendChild(divInfo);

        var flecha = document.createElement('span');
        flecha.className = 'tu-flecha';
        flecha.textContent = '→';
        infoDiv.appendChild(flecha);

        var btnEliminar = document.createElement('button');
        btnEliminar.className = 'btn-eliminar-usuario';
        var imgClose = document.createElement('img');
        imgClose.src = 'icons/close.svg';
        imgClose.width = 16;
        imgClose.height = 16;
        btnEliminar.appendChild(imgClose);
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
    modoRegistro.innerHTML = '';

    var h1 = document.createElement('h1');
    setIconTextNoVAlign(h1, 'icons/new.svg', 24, 24, t('registroTitulo'));
    modoRegistro.appendChild(h1);

    var form = document.createElement('div');
    form.className = 'form-registro';

    // Nombre
    var labelNombre = document.createElement('label');
    labelNombre.textContent = t('regNombre');
    form.appendChild(labelNombre);
    var inputNombre = document.createElement('input');
    inputNombre.type = 'text';
    inputNombre.id = 'reg-nombre';
    inputNombre.className = 'input-auth';
    inputNombre.placeholder = t('placeholderNombre');
    form.appendChild(inputNombre);

    // Nivel
    var labelNivel = document.createElement('label');
    labelNivel.textContent = t('regNivel');
    form.appendChild(labelNivel);
    var opcionesNivel = document.createElement('div');
    opcionesNivel.className = 'opciones-nivel';
    opcionesNivel.appendChild(crearBotonNivel('Principiante', 'icons/plant.svg'));
    opcionesNivel.appendChild(crearBotonNivel('Intermedio', 'icons/muscle.svg'));
    opcionesNivel.appendChild(crearBotonNivel('Experto', 'icons/fire.svg'));
    form.appendChild(opcionesNivel);

    // Fila: Peso + Altura
    var filaDatos = document.createElement('div');
    filaDatos.className = 'fila-datos';

    var colPeso = document.createElement('div');
    colPeso.className = 'columna-dato';
    var labelPeso = document.createElement('label');
    labelPeso.textContent = t('regPeso');
    colPeso.appendChild(labelPeso);
    var inputPeso = document.createElement('input');
    inputPeso.type = 'number';
    inputPeso.id = 'reg-peso';
    inputPeso.className = 'input-auth';
    inputPeso.placeholder = t('placeholderPeso');
    inputPeso.step = '0.1';
    colPeso.appendChild(inputPeso);
    filaDatos.appendChild(colPeso);

    var colAltura = document.createElement('div');
    colAltura.className = 'columna-dato';
    var labelAltura = document.createElement('label');
    labelAltura.textContent = t('regAltura');
    colAltura.appendChild(labelAltura);
    var inputAltura = document.createElement('input');
    inputAltura.type = 'number';
    inputAltura.id = 'reg-altura';
    inputAltura.className = 'input-auth';
    inputAltura.placeholder = t('placeholderAltura');
    colAltura.appendChild(inputAltura);
    filaDatos.appendChild(colAltura);

    form.appendChild(filaDatos);

    // Objetivo
    var labelObjetivo = document.createElement('label');
    labelObjetivo.textContent = t('regObjetivo');
    form.appendChild(labelObjetivo);
    var inputObjetivo = document.createElement('input');
    inputObjetivo.type = 'text';
    inputObjetivo.id = 'reg-objetivo';
    inputObjetivo.className = 'input-auth';
    inputObjetivo.placeholder = t('placeholderObjetivo');
    form.appendChild(inputObjetivo);

    // Boton crear
    var btnCrear = document.createElement('button');
    btnCrear.className = 'btn-principal';
    btnCrear.onclick = crearUsuarioClick;
    setIconTextNoVAlign(btnCrear, 'icons/check.svg', 20, 20, t('btnCrearUsuario'));
    form.appendChild(btnCrear);

    modoRegistro.appendChild(form);

    var hayUsuarios = obtenerUsuarios().length > 0;
    if (hayUsuarios) {
        var btnVolver = document.createElement('button');
        btnVolver.className = 'btn-link';
        btnVolver.style.display = 'inline';
        btnVolver.onclick = function () { mostrarLogin(obtenerUsuarios()); };
        setIconTextNoVAlign(btnVolver, 'icons/back.svg', 16, 16, t('volver'));
        modoRegistro.appendChild(btnVolver);
    }

    nivelSeleccionado = null;
}

function crearBotonNivel(nivel, iconoSrc) {
    var btn = document.createElement('button');
    btn.className = 'boton-nivel';
    btn.setAttribute('data-nivel', nivel);
    btn.onclick = function () { elegirNivelReg(nivel); };

    var spanIcono = document.createElement('span');
    spanIcono.className = 'icono-nivel';
    var img = document.createElement('img');
    img.src = iconoSrc;
    img.width = 24;
    img.height = 24;
    spanIcono.appendChild(img);
    btn.appendChild(spanIcono);

    var spanTexto = document.createElement('span');
    spanTexto.className = 'texto-nivel';
    var strong = document.createElement('strong');
    strong.textContent = t(nivel.toLowerCase());
    spanTexto.appendChild(strong);
    var small = document.createElement('small');
    small.textContent = t(nivel.toLowerCase() + 'Desc');
    spanTexto.appendChild(small);
    btn.appendChild(spanTexto);

    return btn;
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
    var nivelEl = document.getElementById('user-nivel');
    nivelEl.innerHTML = '';
    var imgNivel = document.createElement('img');
    imgNivel.src = 'icons/plant.svg';
    imgNivel.width = 20;
    imgNivel.height = 20;
    if (usuarioActual.nivel === 'Intermedio') imgNivel.src = 'icons/muscle.svg';
    if (usuarioActual.nivel === 'Experto') imgNivel.src = 'icons/fire.svg';
    nivelEl.appendChild(imgNivel);
    nivelEl.appendChild(document.createTextNode(' ' + t(usuarioActual.nivel.toLowerCase())));
    document.getElementById('avatar-usuario').textContent = usuarioActual.nombre.charAt(0).toUpperCase();

    var pesoTexto = usuarioActual.peso ? usuarioActual.peso + ' kg' : '—';
    var alturaTexto = usuarioActual.altura ? usuarioActual.altura + ' cm' : '—';
    var objetivotTexto = usuarioActual.objetivo && usuarioActual.objetivo.trim() !== ''
        ? usuarioActual.objetivo
        : '<span style="color:var(--text-muted);font-style:italic">' + t('sinObjetivo') + '</span>';

    var tarjeta = document.getElementById('tarjeta-bienvenida');
    tarjeta.innerHTML = '';

    var h3 = document.createElement('h3');
    var imgMuscle = document.createElement('img');
    imgMuscle.src = 'icons/muscle.svg';
    imgMuscle.width = 24;
    imgMuscle.height = 24;
    h3.appendChild(imgMuscle);
    h3.appendChild(document.createTextNode(' ' + t('hola') + ', ' + usuarioActual.nombre));
    tarjeta.appendChild(h3);

    var pNivel = document.createElement('p');
    pNivel.textContent = t('nivel') + ' ';
    var strongNivel = document.createElement('strong');
    strongNivel.textContent = t(usuarioActual.nivel.toLowerCase());
    pNivel.appendChild(strongNivel);
    tarjeta.appendChild(pNivel);

    var pObjetivo = document.createElement('p');
    var imgTarget = document.createElement('img');
    imgTarget.src = 'icons/target.svg';
    imgTarget.width = 16;
    imgTarget.height = 16;
    imgTarget.className = 'icon-vmiddle';
    pObjetivo.appendChild(imgTarget);
    pObjetivo.appendChild(document.createTextNode(' '));
    if (usuarioActual.objetivo && usuarioActual.objetivo.trim() !== '') {
        pObjetivo.appendChild(document.createTextNode(usuarioActual.objetivo));
    } else {
        var spanSinObj = document.createElement('span');
        spanSinObj.className = 'texto-sin-objetivo';
        spanSinObj.textContent = t('sinObjetivo');
        pObjetivo.appendChild(spanSinObj);
    }
    tarjeta.appendChild(pObjetivo);

    var pPesoAlt = document.createElement('p');
    pPesoAlt.textContent = t('peso') + ' ' + pesoTexto + ' | ' + t('altura') + ' ' + alturaTexto;
    tarjeta.appendChild(pPesoAlt);

    var textoObjEl = document.getElementById('texto-objetivo');
    textoObjEl.innerHTML = '';
    if (usuarioActual.objetivo && usuarioActual.objetivo.trim() !== '') {
        textoObjEl.textContent = usuarioActual.objetivo;
    } else {
        var spanSinObj2 = document.createElement('span');
        spanSinObj2.className = 'texto-sin-objetivo';
        spanSinObj2.textContent = t('sinObjetivo');
        textoObjEl.appendChild(spanSinObj2);
    }

    document.getElementById('perfil-nombre').textContent = usuarioActual.nombre;
    document.getElementById('perfil-nivel').textContent = t(usuarioActual.nivel.toLowerCase());
    var perfilObjEl = document.getElementById('perfil-objetivo');
    perfilObjEl.innerHTML = '';
    if (usuarioActual.objetivo && usuarioActual.objetivo.trim() !== '') {
        perfilObjEl.textContent = usuarioActual.objetivo;
    } else {
        var spanSinObj3 = document.createElement('span');
        spanSinObj3.className = 'texto-sin-objetivo';
        spanSinObj3.textContent = t('sinObjetivo');
        perfilObjEl.appendChild(spanSinObj3);
    }
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
