// =========================
// CACHE DOM ELEMENTS
// =========================

const lengthSlider =
    document.getElementById('lengthSlider');

const lengthValue =
    document.getElementById('lengthValue');

const baseWord =
    document.getElementById('baseWord');

const uppercase =
    document.getElementById('uppercase');

const lowercase =
    document.getElementById('lowercase');

const numbers =
    document.getElementById('numbers');

const symbols =
    document.getElementById('symbols');

const excludeSimilar =
    document.getElementById('excludeSimilar');

const generateBtn =
    document.getElementById('generateBtn');

const multiGenerateBtn =
    document.getElementById('multiGenerateBtn');

const passwordBox =
    document.getElementById('passwordBox');

const password =
    document.getElementById('password');

const copyBtn =
    document.getElementById('copyBtn');

const strength =
    document.getElementById('strength');

const strengthFill =
    document.getElementById('strengthFill');

const entropyValue =
    document.getElementById('entropyValue');

const toast =
    document.getElementById('toast');

const historyList =
    document.getElementById('historyList');

const themeToggle =
    document.getElementById('themeToggle');

const exportBtn =
    document.getElementById('exportBtn');

const clearBtn =
    document.getElementById('clearBtn');

const presetSelect =
    document.getElementById('presetSelect');

const multiplePasswords =
    document.getElementById('multiplePasswords');


// =========================
// PASSWORD HISTORY
// =========================

let passwordHistory =

    JSON.parse(
        localStorage.getItem(
            'passwordHistory'
        )
    ) || [];


// UI visible history only

let visibleHistory =
    [...passwordHistory];


// =========================
// THEME AUTO SAVE
// =========================

if (
    localStorage.getItem('theme') ===
    'light'
) {

    document.body.classList.add(
        'light-mode'
    );

    themeToggle.textContent =
        '🌙 Dark Mode';
}

else {

    themeToggle.textContent =
        '☀ Light Mode';
}


themeToggle.addEventListener(
    'click',
    () => {

        document.body.classList.toggle(
            'light-mode'
        );

        if (
            document.body.classList.contains(
                'light-mode'
            )
        ) {

            localStorage.setItem(
                'theme',
                'light'
            );

            themeToggle.textContent =
                '🌙 Dark Mode';
        }

        else {

            localStorage.setItem(
                'theme',
                'dark'
            );

            themeToggle.textContent =
                '☀ Light Mode';
        }
    }
);


// =========================
// PRESETS
// =========================

presetSelect.addEventListener(
    'change',
    () => {

        const preset =
            presetSelect.value;

        switch (preset) {

            case 'gaming':

                lengthSlider.value = 16;

                uppercase.checked = true;
                lowercase.checked = true;
                numbers.checked = true;
                symbols.checked = false;

                break;

            case 'banking':

                lengthSlider.value = 20;

                uppercase.checked = true;
                lowercase.checked = true;
                numbers.checked = true;
                symbols.checked = true;

                break;

            case 'wifi':

                lengthSlider.value = 14;

                uppercase.checked = true;
                lowercase.checked = true;
                numbers.checked = true;
                symbols.checked = false;

                break;

            case 'simple':

                lengthSlider.value = 8;

                uppercase.checked = false;
                lowercase.checked = true;
                numbers.checked = true;
                symbols.checked = false;

                break;
        }

        lengthValue.textContent =
            lengthSlider.value;

        updateStrength();

        showFeedback(
            'Preset Applied!',
            'success'
        );
    }
);


// =========================
// SLIDER UPDATE
// =========================

lengthSlider.addEventListener(
    'input',
    () => {

        lengthValue.textContent =
            lengthSlider.value;

        updateStrength();
    }
);


// =========================
// STRENGTH SYSTEM
// =========================

function updateStrength() {

    const len =
        parseInt(lengthSlider.value);

    let charsetSize = 0;

    if (uppercase.checked)
        charsetSize += 26;

    if (lowercase.checked)
        charsetSize += 26;

    if (numbers.checked)
        charsetSize += 10;

    if (symbols.checked)
        charsetSize += 32;

    const entropy =
        Math.round(
            len * Math.log2(charsetSize || 1)
        );

    entropyValue.textContent =
        entropy;

    let strengthText = '';
    let strengthClass = '';
    let width = 0;

    if (entropy < 40) {

        strengthText = 'Weak';
        strengthClass = 'weak';
        width = 33;
    }

    else if (entropy < 70) {

        strengthText = 'Medium';
        strengthClass = 'medium';
        width = 66;
    }

    else {

        strengthText = 'Strong';
        strengthClass = 'strong';
        width = 100;
    }

    strength.textContent =
        strengthText;

    strengthFill.className =
        `strength-fill ${strengthClass}`;

    strengthFill.style.width =
        `${width}%`;
}


// =========================
// GENERATE BUTTONS
// =========================

generateBtn.addEventListener(
    'click',
    generatePassword
);

multiGenerateBtn.addEventListener(
    'click',
    generateMultiplePasswords
);


// =========================
// MAIN PASSWORD GENERATOR
// =========================

function generatePassword() {

    const options = [

        uppercase.checked,
        lowercase.checked,
        numbers.checked,
        symbols.checked
    ];

    if (!options.some(opt => opt)) {

        showFeedback(
            'Select at least one option!',
            'error'
        );

        return;
    }

    passwordBox.classList.add(
        'generating'
    );

    setTimeout(() => {

        const targetLength =
            parseInt(lengthSlider.value);

        let newPassword;

        const baseInput =
            baseWord.value.trim();

        if (baseInput) {

            newPassword =
                generateFromBase(
                    baseInput,
                    targetLength
                );
        }

        else {

            newPassword =
                generateRandom(
                    targetLength
                );
        }

        newPassword =
            shuffleString(newPassword);

        typePassword(
            newPassword,
            40
        );

        addToHistory(
            newPassword
        );

        updateStrength();

        passwordBox.classList.remove(
            'generating'
        );

        showFeedback(
            'Password Generated!',
            'success'
        );

    }, 400);
}


// =========================
// MULTIPLE PASSWORDS
// =========================

function generateMultiplePasswords() {

    multiplePasswords.innerHTML = '';

    for (let i = 0; i < 5; i++) {

        const pw =
            generateRandom(
                parseInt(
                    lengthSlider.value
                )
            );

        const item =
            document.createElement('div');

        item.className =
            'multi-password-item';

        item.innerHTML = `

            <span>${pw}</span>

            <button class="reuse-btn">
                Copy
            </button>
        `;

        item
            .querySelector('button')
            .addEventListener(
                'click',
                async () => {

                    await navigator
                        .clipboard
                        .writeText(pw);

                    password.textContent =
                        pw;

                    addToHistory(pw);

                    showFeedback(
                        'Password Copied!',
                        'success'
                    );
                }
            );

        multiplePasswords.appendChild(
            item
        );
    }

    showFeedback(
        '5 Passwords Generated!',
        'success'
    );
}


// =========================
// BASE PASSWORD
// =========================

function generateFromBase(
    base,
    targetLength
) {

    let pw = base;

    const remaining =
        targetLength - base.length;

    if (remaining > 0) {

        pw += generateRandom(
            remaining
        );
    }

    return pw;
}


// =========================
// RANDOM PASSWORD
// =========================

function generateRandom(length) {

    let upper =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let lower =
        'abcdefghijklmnopqrstuvwxyz';

    let nums =
        '0123456789';

    let syms =
        '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeSimilar.checked) {

        upper =
            upper.replace(/[OI]/g, '');

        lower =
            lower.replace(/[l]/g, '');

        nums =
            nums.replace(/[01]/g, '');
    }

    let charPool = '';

    if (uppercase.checked)
        charPool += upper;

    if (lowercase.checked)
        charPool += lower;

    if (numbers.checked)
        charPool += nums;

    if (symbols.checked)
        charPool += syms;

    let pw = '';

    for (let i = 0; i < length; i++) {

        pw +=
            charPool.charAt(

                Math.floor(
                    Math.random() *
                    charPool.length
                )
            );
    }

    return pw;
}


// =========================
// SHUFFLE
// =========================

function shuffleString(str) {

    const arr = str.split('');

    for (
        let i = arr.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [arr[i], arr[j]] =
            [arr[j], arr[i]];
    }

    return arr.join('');
}


// =========================
// TYPE EFFECT
// =========================

function typePassword(
    text,
    speed = 40
) {

    password.textContent = '';

    let index = 0;

    const typing = setInterval(() => {

        password.textContent +=
            text.charAt(index);

        index++;

        if (index >= text.length) {

            clearInterval(typing);
        }

    }, speed);
}


// =========================
// HISTORY
// =========================

function addToHistory(newPassword) {

    if (
        passwordHistory.includes(
            newPassword
        )
    ) {

        return;
    }

    passwordHistory.unshift(
        newPassword
    );

    visibleHistory.unshift(
        newPassword
    );

    if (
        passwordHistory.length > 5
    ) {

        passwordHistory.pop();
    }

    if (
        visibleHistory.length > 5
    ) {

        visibleHistory.pop();
    }

    localStorage.setItem(

        'passwordHistory',

        JSON.stringify(
            passwordHistory
        )
    );

    renderHistory();
}


function renderHistory() {

    historyList.innerHTML = '';

    if (
        visibleHistory.length === 0
    ) {

        historyList.innerHTML = `

            <div class="empty-history">
                No passwords generated yet
            </div>
        `;

        return;
    }

    visibleHistory.forEach(pw => {

        const item =
            document.createElement('div');

        item.className =
            'history-item';

        item.innerHTML = `

            <div class="history-password">
                ${pw}
            </div>

            <button class="reuse-btn">
                Reuse
            </button>
        `;

        item
            .querySelector('.reuse-btn')
            .addEventListener(
                'click',
                async () => {

                    password.textContent =
                        pw;

                    await navigator
                        .clipboard
                        .writeText(pw);

                    showFeedback(
                        'Password Reused!',
                        'success'
                    );
                }
            );

        historyList.appendChild(item);
    });
}


// =========================
// CLEAR HISTORY UI
// =========================

clearBtn.addEventListener(
    'click',
    () => {

        visibleHistory = [];

        renderHistory();

        showFeedback(
            'History Cleared!',
            'success'
        );
    }
);


// =========================
// EXPORT HISTORY PDF
// =========================

exportBtn.addEventListener(
    'click',
    exportHistory
);

function exportHistory() {

    if (
        passwordHistory.length === 0
    ) {

        showFeedback(
            'No History Available!',
            'error'
        );

        return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text(
        'Password History',
        20,
        20
    );

    doc.setFontSize(12);

    let y = 40;

    passwordHistory.forEach(
        (pw, index) => {

            doc.text(
                `${index + 1}. ${pw}`,
                20,
                y
            );

            y += 12;
        }
    );

    doc.save(
        'password-history.pdf'
    );

    showFeedback(
        'PDF Exported!',
        'success'
    );
}


// =========================
// COPY MAIN PASSWORD
// =========================

copyBtn.addEventListener(
    'click',
    async () => {

        if (
            password.textContent ===
            'Click generate to create a password'
        ) {

            showFeedback(
                'No Password To Copy!',
                'error'
            );

            return;
        }

        await navigator.clipboard.writeText(
            password.textContent
        );

        addToHistory(
            password.textContent
        );

        showFeedback(
            'Password Copied!',
            'success'
        );
    }
);


// =========================
// TOAST
// =========================

function showFeedback(
    message,
    type
) {

    toast.textContent =
        message;

    toast.className =
        `toast show ${type}`;

    setTimeout(() => {

        toast.classList.remove(
            'show'
        );

    }, 1800);
}


// =========================
// INITIAL LOAD
// =========================

updateStrength();

renderHistory();

if (
    passwordHistory.length > 0
) {

    password.textContent =
        passwordHistory[0];
}