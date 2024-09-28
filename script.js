document.getElementById('calcularBtn').addEventListener('click', calcularFalsaPosicion);

function calcularFalsaPosicion() {
    // Leer los valores ingresados por el usuario
    let funcionStr = document.getElementById('funcion').value;
    let a = parseFloat(document.getElementById('intervaloA').value);
    let b = parseFloat(document.getElementById('intervaloB').value);
    let tolerancia = parseFloat(document.getElementById('tolerancia').value);

    // Convertir la función usando math.js
    let f;
    try {
        f = math.parse(funcionStr).compile(); // Compilar la función
    } catch (error) {
        alert("Error al ingresar la función. Verifica el formato.");
        return;
    }

    // Evaluar f(a) y f(b)
    let fa = f.evaluate({x: a});
    let fb = f.evaluate({x: b});

    // Verificar cambio de signo
    if (fa * fb >= 0) {
        alert(`No hay cambio de signo en el intervalo [${a}, ${b}]. 
               f(a) = ${fa}, f(b) = ${fb}. Prueba con otro intervalo.`);
        return;
    }

    let iteraciones = 0;
    let maxIter = 100;
    let error = Math.abs(b - a) / 2;
    let resultados = '';

    let xr;

    while (error > tolerancia && iteraciones < maxIter) {
        // Método de la falsa posición
         xr = (a * fb - b * fa) / (fb - fa);
        let fxr = f.evaluate({x: xr});
        iteraciones++;

        // Actualizar intervalos
        if (fa * fxr < 0) {
            b = xr;
            fb = fxr;
        } else {
            a = xr;
            fa = fxr;
        }

        error = Math.abs(b - a) / 2;

        // Mostrar resultados de cada iteración
        resultados += `Iteración ${iteraciones}: x ≈ ${xr.toFixed(4)} (Error: ${error.toFixed(4)})<br>`;
    }

    document.getElementById('resultados').innerHTML = resultados;

    // Graficar función y aproximaciones
    graficarFuncion(f, a, b, xr);
}

function graficarFuncion(f, a, b, raiz) {
    const ctx = document.getElementById('graphCanvas').getContext('2d');
    const labels = [];
    const data = [];

    for (let x = a - 1; x <= b + 1; x += 0.1) {
        labels.push(x.toFixed(2));
        data.push(f.evaluate({x: x}));
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'f(x)',
                data: data,
                borderColor: 'blue',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'x' } },
                y: { title: { display: true, text: 'f(x)' } }
            }
        }
    });
}
