// acordeón de preguntas frecuentes
// el contenido ya está en el HTML, así que si falla el JS todo se ve abierto
const acordeones = document.querySelectorAll('.acordeon');

acordeones.forEach((acordeon) => {
    const titulos = acordeon.querySelectorAll('h3');

    titulos.forEach((titulo, i) => {
        const panel = titulo.nextElementSibling;
        if (!panel) return;
        if (!panel.id) panel.id = 'faq-' + (i + 1);

        const boton = document.createElement('button');
        boton.type = 'button';
        boton.setAttribute('aria-expanded', 'false');
        boton.setAttribute('aria-controls', panel.id);
        boton.textContent = titulo.textContent.trim();

        const icono = document.createElement('span');
        icono.className = 'icono';
        icono.setAttribute('aria-hidden', 'true');
        boton.appendChild(icono);

        titulo.textContent = '';
        titulo.appendChild(boton);
        panel.hidden = true;

        boton.addEventListener('click', () => {
            const abierto = boton.getAttribute('aria-expanded') === 'true';
            boton.setAttribute('aria-expanded', String(!abierto));
            panel.hidden = abierto;
        });
    });
});

// formulario de contacto
const form = document.getElementById('formulario');

if (form) {
    // con JS usamos nuestros mensajes, sin JS queda la validación del navegador
    form.noValidate = true;

    const resumen = document.getElementById('resumen');
    const exito = document.getElementById('exito');
    const campos = form.querySelectorAll('input, select, textarea');

    const textos = {
        nombre: { vacio: 'Error: escribe tu nombre completo.' },
        correo: {
            vacio: 'Error: escribe tu correo electrónico.',
            formato: 'Error: el correo debe tener el formato nombre@dominio.com.'
        },
        tema: { vacio: 'Error: selecciona un tema.' },
        mensaje: {
            vacio: 'Error: escribe tu mensaje.',
            corto: 'Error: el mensaje debe tener al menos 10 caracteres.'
        }
    };

    function validar(campo) {
        const t = textos[campo.id];
        const valor = campo.value.trim();
        let msg = '';

        if (!valor) {
            msg = t.vacio;
        } else if (campo.validity.typeMismatch) {
            msg = t.formato;
        } else if (campo.id === 'mensaje' && valor.length < 10) {
            msg = t.corto;
        }

        campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
        document.getElementById('error-' + campo.id).textContent = msg;
        return msg;
    }

    // si el campo ya tenía error, se revisa de nuevo mientras la persona lo corrige
    function revisarSiTieneError(campo) {
        if (campo.getAttribute('aria-invalid') === 'true') validar(campo);
    }

    campos.forEach((campo) => {
        campo.addEventListener('input', () => revisarSiTieneError(campo));
        campo.addEventListener('change', () => revisarSiTieneError(campo));
    });

    form.addEventListener('submit', (evento) => {
        evento.preventDefault();
        exito.hidden = true;

        const errores = [];
        campos.forEach((campo) => {
            const msg = validar(campo);
            if (msg) errores.push({ campo, msg });
        });

        if (errores.length > 0) {
            resumen.textContent = '';

            const p = document.createElement('p');
            const titulo = document.createElement('strong');
            titulo.textContent = errores.length === 1
                ? 'Hay 1 error en el formulario:'
                : 'Hay ' + errores.length + ' errores en el formulario:';
            p.appendChild(titulo);

            const lista = document.createElement('ul');
            errores.forEach((error) => {
                const li = document.createElement('li');
                const enlace = document.createElement('a');
                enlace.href = '#' + error.campo.id;
                enlace.textContent = error.msg;
                enlace.addEventListener('click', (e) => {
                    e.preventDefault();
                    error.campo.focus();
                });
                li.appendChild(enlace);
                lista.appendChild(li);
            });

            resumen.appendChild(p);
            resumen.appendChild(lista);
            resumen.hidden = false;
            resumen.focus();
            return;
        }

        resumen.hidden = true;
        exito.textContent = 'Gracias, ' + form.elements.nombre.value.trim() +
            '. Tu mensaje se validó correctamente. Este proyecto no tiene servidor, por lo que no se envía a ningún sitio.';
        exito.hidden = false;
        form.reset();
        campos.forEach((c) => c.setAttribute('aria-invalid', 'false'));
    });
}
