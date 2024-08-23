function openTab(tabName) {
    const calculators = document.querySelectorAll('.calculator');
    
    calculators.forEach(calculator => {
        if (calculator.id === tabName) {
            calculator.classList.add('active');
        } else {
            calculator.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    openTab('basic');
    adjustFontSize(document.querySelectorAll('.display input, .display div'));
});

// Adding keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    const activeCalc = document.querySelector('.calculator.active');
    const display = activeCalc.querySelector('.display input');
    const result = activeCalc.querySelector('.display div');
    
    if (!isNaN(key) || key === '.') {
        display.value += key;
    } else if (key === 'Enter') {
        calculate(display, result);
    } else if (key === 'Backspace') {
        display.value = display.value.slice(0, -1);
    } else if (['+', '-', '*', '/', '(', ')'].includes(key)) {
        display.value += key;
    } else if (key.toLowerCase() === 'c') {
        clearDisplay(display, result);
    }
    adjustFontSize([display, result]);
});

// Adding click support for buttons
document.querySelectorAll('.buttons button').forEach(button => {
    button.addEventListener('click', function() {
        const value = button.getAttribute('data-value');
        const activeCalc = document.querySelector('.calculator.active');
        const display = activeCalc.querySelector('.display input');
        const result = activeCalc.querySelector('.display div');

        if (value === 'C') {
            clearDisplay(display, result);
        } else if (value === '=') {
            calculate(display, result);
        } else if (['sin', 'cos', 'tan'].includes(value)) {
            display.value += value + '(';
        } else if (value === 'π') {
            display.value += Math.PI;
        } else if (value === '°') {
            display.value += '°';
        } else {
            display.value += value;
        }
        adjustFontSize([display, result]);
    });
});

function calculate(display, result) {
    let expression = display.value;

    try {
        expression = expression.replace(/sin\((.*?)\)°/g, 'Math.sin(toRadians($1))');
        expression = expression.replace(/cos\((.*?)\)°/g, 'Math.cos(toRadians($1))');
        expression = expression.replace(/tan\((.*?)\)°/g, 'Math.tan(toRadians($1))');

        expression = expression.replace(/sin\((.*?)\)/g, 'Math.sin($1)');
        expression = expression.replace(/cos\((.*?)\)/g, 'Math.cos($1)');
        expression = expression.replace(/tan\((.*?)\)/g, 'Math.tan($1)');

        result.textContent = eval(expression);
    } catch {
        result.textContent = "Error";
    }
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function clearDisplay(display, result) {
    display.value = '';
    result.textContent = '0';
}

function adjustFontSize(elements) {
    elements.forEach(element => {
        const maxFontSize = 30; // Maximum font size
        const minFontSize = 14; // Minimum font size
        const maxWidth = element.offsetWidth; // Maximum width of the element
        let fontSize = maxFontSize;

        element.style.fontSize = `${fontSize}px`;

        // Reduce font size if text overflows
        while (element.scrollWidth > maxWidth && fontSize > minFontSize) {
            fontSize -= 1;
            element.style.fontSize = `${fontSize}px`;
        }
    });
}
