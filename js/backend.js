
let js_radius;
let js_height;
let js_weight_m0;
let js_weight_m1;


let acceleration;
let angleAcceleration;
let effectivePulleyWeight = 0.3;

const gravitation = 9.806;
const blockFriction = 0.01;
let ratioHeight;
let tensionForce;

let incorrectValues = [true, true, true];

const HEIGHT_VALUE = 0;
const WEIGHT_M0_VALUE = 1;
const WEIGHT_M1_VALUE = 2;

let deg = 0;
let startDeg = deg;

let minHeight = 205;
let maxHeight = 360;

let y;

let labEnd = true;

let timer;

let timer_1_error_rate;
let timer_2_error_rate;
let timer_3_error_rate;
let timer_4_error_rate;
let timer_5_error_rate;

// По нажатию на кнопку проводится опыт
startLab.onclick = function() {

    // Если предыдущий опыт не был закончен останавливаем его
    if (!labEnd){
        labEnd = true;
        clearInterval(timer);
        startLabButton();
        startDeg = deg;
        return;
    }
    else {
        labEnd = false;

        // Сброс значений и проверка введеных данных
        reset_values();
        if (check_incorrect_input()) {
            alert('Неверные данные, проверьте ввод');
            return;
        }
        
        // вычисляем основные силы действующие на тело
        setup(); 

        // рисуем кнопку остановки лабораторной
        stopLabButton();
        
        // запускаем таймер
        let time_start = Date.now();
        
        timer = setInterval(function() {
            
            let time_passed = Date.now() - time_start;
            // вычисляем и меняем координату блока (и веревки) для каждого момента времени
            calculate_y(time_passed / 1000);
            draw_result(y, time_passed / 1000);
            
            // как только блок оказался на земле выходим
            if (y >= maxHeight) {
                y = maxHeight;
                stopLab(time_passed / 1000);
                return;
            }
            else if (y <= 50) {
                y = 50;
                stopLab(time_passed / 1000);
                return;
            }
        }, 20);
    }
}

function stopLab(time_passed) {
    labEnd = true;
    startDeg = deg;
    draw_result(y, time_passed);
    clearInterval(timer);
    startLabButton();
}

// высчет основных сил
function setup() {
    ratioHeight = js_height / (maxHeight - minHeight);

    if ( Math.abs((js_weight_m0 - js_weight_m1) * gravitation) < blockFriction)
        acceleration = 0;
    else
    if ((js_weight_m0 - js_weight_m1) * gravitation < 0)
        acceleration = ((js_weight_m0 - js_weight_m1) * gravitation + blockFriction) / (js_weight_m0 + js_weight_m1 + effectivePulleyWeight);
    else
        acceleration = ((js_weight_m0 - js_weight_m1) * gravitation - blockFriction) / (js_weight_m0 + js_weight_m1 + effectivePulleyWeight);
}

function reset_values() {
    y = minHeight;
    timer_1_error_rate = Math.random() / 4 - 0.125;
    timer_2_error_rate = Math.random() / 4 - 0.125;
    timer_3_error_rate = Math.random() / 4 - 0.125;
    timer_4_error_rate = Math.random() / 4 - 0.125;
    timer_5_error_rate = Math.random() / 4 - 0.125;
}

function check_incorrect_input() {
    if (js_height == '' || js_height == undefined) {
        height_alert.classList.remove('visually-hidden');
        incorrectValues[HEIGHT_VALUE] = true;
    }

    if (js_weight_m0 == '' || js_weight_m0 == undefined) {
        weight_m0_alert.classList.remove('visually-hidden');
        incorrectValues[WEIGHT_M0_VALUE] = true;
    }

    if (js_weight_m1 == '' || js_weight_m1 == undefined) {
        weight_m1_alert.classList.remove('visually-hidden');
        incorrectValues[WEIGHT_M1_VALUE] = true;
    }

    for (let i = 0; i < incorrectValues.length; i++)
            if (incorrectValues[i])
                return true;
    return false;
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
function calculate_y(time_passed) {
    deg = startDeg + angleAcceleration * Math.pow(time_passed, 2) / 2 / ratioHeight / 10;
    y = minHeight + acceleration * Math.pow(time_passed, 2) / 2 / ratioHeight;
}

function draw_result(y, time_passed) {

    rope_0.style.height = y + 'px';
    rope_1.style.height = 2 * minHeight - y + 'px';

    block_m0.style.top = y + 'px';
    block_m1.style.top = 2 * minHeight - y + 'px';

    //lab_time.innerHTML = 'Время : ' + Number(time_passed).toFixed(2) + ' секунд';
    if (time_passed + timer_1_error_rate >= 0) {
        timer_1.innerHTML = Number(time_passed + timer_1_error_rate).toFixed(2) + 'c.';
    }
    if (time_passed + timer_2_error_rate >= 0) {
        timer_2.innerHTML = Number(time_passed + timer_2_error_rate).toFixed(2) + 'c.';
    }
    if (time_passed + timer_3_error_rate >= 0) {
        timer_3.innerHTML = Number(time_passed + timer_3_error_rate).toFixed(2) + 'c.';
    }
    if (time_passed + timer_4_error_rate >= 0) {
        timer_4.innerHTML = Number(time_passed + timer_4_error_rate).toFixed(2) + 'c.';
    }
    if (time_passed + timer_5_error_rate >= 0) {
        timer_5.innerHTML = Number(time_passed + timer_5_error_rate).toFixed(2) + 'c.';
    }
}

height.onblur = function() {
    js_height = Number(height.value) / 100;
    if (js_height < 0 || js_height > 10) {
        incorrectValues[HEIGHT_VALUE] = true;
        height_alert.classList.remove('visually-hidden');
    }
    else {
        incorrectValues[HEIGHT_VALUE] = false;
        height_alert.classList.add('visually-hidden');
    }
}

weight_m0.onblur = function() {
    js_weight_m0 = Number(weight_m0.value) / 1000;
    if (js_weight_m0 < 0 || js_weight_m0 >= 1) {
        incorrectValues[WEIGHT_M0_VALUE] = true;
        weight_m0_alert.classList.remove('visually-hidden');
    }
    else {
        incorrectValues[WEIGHT_M0_VALUE] = false;
        weight_m0_alert.classList.add('visually-hidden');
    }
}

weight_m1.onblur = function() {
    js_weight_m1 = Number(weight_m1.value) / 1000;
    if (js_weight_m1 < 0 || js_weight_m1 >= 1) {
        incorrectValues[WEIGHT_M1_VALUE] = true;
        weight_m1_alert.classList.remove('visually-hidden');
    }
    else {
        incorrectValues[WEIGHT_M1_VALUE] = false;
        weight_m1_alert.classList.add('visually-hidden');
    }
}