
let height_val;
let weight_m0_val;
let weight_m1_val;

const gravitation = 9.806;
const effectivePulleyWeight = 0.3;
const blockFriction = 0.01;

let minHeight = 205;
let maxHeight = 360;

let y;

let labEnd = true;

let timer;
let timer_list = [];
let timerErrors = [];

function setup() {
    for (let i = 0; i < 4; i++) timer_list.push(document.getElementById('timer_' + i));
}
setup();

// По нажатию на кнопку проводится опыт
const startLab = document.getElementById('startLab');
startLab.onclick = function() {

    // Если предыдущий опыт не был закончен останавливаем его
    if (!labEnd){
        labEnd = true;
        clearInterval(timer);
        startLabButton();
        return;
    }
    
    labEnd = false;
    
    setupValues();
    let acceleration = calculateAcceleration(); // Ускорение
    let ratioHeight = calculateRatioHeight();   // Учёт высоты

    // запускаем таймер
    let time_start = Date.now();
    
    timer = setInterval(function() {
        let time_passed = (Date.now() - time_start) / 1000;

        // вычисляем и меняем координату блока (и веревки) для каждого момента времени
        updateY(acceleration, ratioHeight, time_passed);
        draw(y, time_passed);
        
        // как только один из блоков на земле -> выходим
        if (y >= maxHeight) {
            y = maxHeight;
            stopLab(time_passed);
            return;
        }
        else if (y <= 50) {
            y = 50;
            stopLab(time_passed);
            return;
        }
    }, 20);
}

function setupValues() {
    // Устанавливаем значения
    setHeight();
    setWeightM0();
    setWeightM1();

    y = minHeight;
    for (let i = 0; i < 4; i++) timerErrors[i] = Math.random() / 4 - 0.125;

    stopLabButton(); // рисуем кнопку остановки лабораторной
}

function calculateRatioHeight() {
    return height_val / (maxHeight - minHeight);
}

function calculateAcceleration() {
    let weightForce = (weight_m0_val - weight_m1_val) * gravitation; 

    if ( Math.abs(weightForce) < blockFriction)
        return 0;
    if (weightForce > 0)
        return (weightForce - blockFriction) / (weight_m0_val + weight_m1_val + effectivePulleyWeight);
    return (weightForce + blockFriction) / (weight_m0_val + weight_m1_val + effectivePulleyWeight);
        
}

function stopLab(time_passed) {
    labEnd = true;
    draw(y, time_passed);
    clearInterval(timer);
    startLabButton();
}

// отрисовка кнопки "старта"
function startLabButton() {
    startLab.classList.remove('btn-danger');
    startLab.classList.add('btn-success');
    startLab.innerHTML = 'Провести опыт';
}

// отрисовка кнопки "стоп"
function stopLabButton() {
    startLab.classList.remove('btn-success');
    startLab.classList.add('btn-danger');
    startLab.innerHTML = 'Сбросить результат';
}


// вычисления высоты в каждый момент времени
function updateY(acceleration, ratioHeight, time_passed) {
    y = minHeight + acceleration * Math.pow(time_passed, 2) / 2 / ratioHeight;
}

function draw(y, time_passed) {
    rope_0.style.height = y + 'px';
    rope_1.style.height = 2 * minHeight - y + 'px';

    block_m0.style.top = y + 'px';
    block_m1.style.top = 2 * minHeight - y + 'px';

    for (let i = 0; i < 4; i++) {
        let real_time = time_passed + timerErrors[i];    
        if (real_time >= 0) timer_list[i].innerHTML = real_time.toFixed(2) + 'c.';
    }
}

// Ввод только для цифр
function onlyDigits(event) {
    let val = event.target.value;
    if (event.data != null && (event.data[0] < '0' || event.data[0] > '9'))
        event.target.value = val.substr(0,val.length-1);
}

const height = document.getElementById('height');           height.addEventListener('input', onlyDigits);
const weight_m0 = document.getElementById('weight_m0');     weight_m0.addEventListener('input', onlyDigits);
const weight_m1 = document.getElementById('weight_m1');     weight_m1.addEventListener('input', onlyDigits);

function setHeight()    { height_val = parseInt(height.value) / 100; }
function setWeightM0()  { weight_m0_val = Number(weight_m0.value) / 1000; }
function setWeightM1()  { weight_m1_val = Number(weight_m1.value) / 1000; }