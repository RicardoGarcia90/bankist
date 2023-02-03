'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-12T09:15:04.904Z',
    '2022-03-13T10:17:24.185Z',
    '2022-03-10T14:11:59.604Z',
    '2022-03-17T17:01:17.194Z',
    '2022-03-16T23:36:17.929Z',
    '2022-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
// AULA - 177
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  /*  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } */
  return new Intl.DateTimeFormat(locale).format(date);
};

/* ---- MOSTRAR MOVIMENTAÇÃO DE CONTA ---- */
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/* ---- MOSTRAR SALDO ---- */
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

/* ---- SAÍDAS, ENTRADAS E RENDIMENTO ---- */
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

/* ---- CRIAR USERNAMES PARA ACESSAR A CONTA ---- */
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

/* ---- FUNÇÃO updateUI REFATORADA (CADA AÇÃO ELE ATUALIZA A PÁGINA) ---- */
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
////////////////////////////////////////
// AULA 181

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // Whhen 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    // Decrese 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

///////////////////////////////////////

/* ---- LOGIN NA CONTA ---- */
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    /* ---- DATA QUE APARECE QUANDO LOGAR ---- */
    ///////////////////////////////////////
    // AULA 178
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // AULA 178
    /* // Create current date and time
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0); //Sempre 2 digitos, qunado for somente 1 digito preencher com 0 o inicio.
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`; */

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    // Quando eu logar a primeira vez ele a conta logada vai criar um cronometro, quando eu acessar outra conta esse mesmo cronometro vai continuar + cronometro da outra conta que acabei de logar, ou seja, ficará 2 cronometros ativos e a contagem ficará estranha, para que isso não aconteça eu tenho que limpar um cronometro para colocar outro, por isso usei "if (timer) clearInterval(timer)"

    // Update UI
    updateUI(currentAccount);
  }
});

/* ---- TRANSFERÊNCIA ---- */
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
    // Toda vez que fizermos uma operação o cronometro será reiniciado
  }
});

/* ---- EMPRÉSTIMO ---- */
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  //171 - colocamos um floor para sempre arredondar para baixo

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
      // Toda vez que fizermos uma operação o cronometro será reiniciado
    }, 2500);
  }
  inputLoanAmount.value = '';
});

/* ---- FECHAR CONTA ---- */
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

/* ---- BOTÃO CRESCENTE E DECRESCENTE ---- */
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////
/* 170 - CONVERTING AND CHECKING NUMBERS */
/////////////////////////////////////////////////
/* 
// Base 10 - 0 to 9
// Binary base 2 - 0 1

// Conversion
console.log(Number('23'));
console.log(+'23');
// Podemos converter uma string em número apenas colocando um sinal de + na frente, o javaScript reconhece.

//Parsing
// parseInt (para números inteiros)
console.log(Number.parseInt('30px', 10)); // funciona (número primeiro)
console.log(Number.parseInt('e23', 10)); // não funciona (letra primeiro)
// parseInt analiza uma string e nos retorna o número que está nela, mesmo ela estando no meio de letras, porém só funciona se o número estiver na frente da letra.
// Sempre usamos o número 10 para dizer qes estamos trabalhando com base 10 e evitar bugs.

// parseFloat (para números decimais)
console.log(Number.parseFloat('2.5rem', 10));

console.log(Number.parseInt('2.5rem', 10));
// Usando 'parseInt' em um número decimal ele me retorna somente a parte interia, no caso 2.

// isNaN (is not a number)
// Check if value is NaN
console.log(Number.isNaN(20)); // É um número, então retorna false
console.log(Number.isNaN('20')); // string qualquer, retorna false
console.log(Number.isNaN(+'20X')); // Não éum número, retorna true
console.log(Number.isNaN(23 / 0)); // infinito, retorna flase.

// Essa não é uma maneira muito fácil de dizer se é um número ou não, existe uma maneira melhor usando o 'isFinite', veja abaixo:

//isFinite
// Checking if value is number
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20X'));
console.log(Number.isFinite(23 / 0));

console.log(Number.isInteger(30));
console.log(Number.isInteger(30.0));
console.log(Number.isInteger(23 / 0));
 */

/////////////////////////////////////////////////
/* 171 - MATH AND ROUNDING */
/////////////////////////////////////////////////
/* 
//square root
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3)); //cubic

//max and min

console.log(Math.max(5, 18, 23, 11, 2)); //retorna o maior número
console.log(Math.max(5, 18, '23', 11, 2)); //também le seestiver como string
console.log(Math.max(5, 18, '23px', 11, 2)); // não faz uma analise (parsing), não reconhece.

console.log(Math.min(5, 18, 23, 11, 2)); // retorna o menor número

// Calcular área de um circulo
// A = pi x r²
console.log(Math.PI * Number.parseFloat('10px') ** 2);

// Criar npumeros aleatórios
console.log(Math.trunc(Math.random() * 6) + 1);
//cria números de 1 a 6
// detalhes:
//Math.random() cria números de 0 até 0,99, mas não cria 1
//Quando faço 'Math.random() * 6', estou chegando nomáximo até o número cinco pois (6 * 0.99 = 5.94) e como eu dei um 'trunc' ele arredonda para 5, por esse motivo eu coloco o + 1 no final, com isso ele vai de 1 a 6.

//Vamos fazer agora uma função que sempre nos retornará números em um intervalo determindado.

const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;
console.log(randomInt(10, 20)); // cria-rá números entre 10 e 20.

// Vamos entender:
// No exemplo acima eu quero criar números aleatórios de 10 a 20, para isso determinamos um valor máximo e um valor minimo.
//min = 10
//max = 20
// se trocarmos os valor da função pelos valores max e min, fica da seguinte forma:
//Math.trunc(Math.random() * (max - min) + 1) + min;
//(0...0.99 * (20 - 10) + 1) + 10;

// Com isso posso escolher qualquer intervalo de números
console.log(randomInt(25, 50));
console.log(randomInt(1, 100));

/* ------------------------ 
//Rounding integers (ARREDONDAMENTO DE NÚMEROS INTEIROS)//
// round
console.log(Math.round(23.3)); // numero < 5 (arredonda para baixo)
console.log(Math.round(23.5)); // numero >= 5 (arredonda para cima)

console.log(' ');

// ceil arredonda sempre para CIMA
console.log(Math.ceil(23.3));
console.log(Math.ceil(23.1));
console.log(Math.ceil(23.5));
console.log(Math.ceil(23.8));

console.log(' ');

//floor arredonda sempre para BAIXO
console.log(Math.floor(23.3));
console.log(Math.floor(23.1));
console.log(Math.floor(23.5));
console.log(Math.floor(23.8));

console.log(' ');

// floor e trunc são muito parecidos, porém funcionam de maneira diferente quando o número é negativo.
console.log(Math.trunc(-23.3)); // o trunc sempre vai eliminar qualquer casa decimal que exista
console.log(Math.floor(-23.3)); // o floor como ele sempre arredonda para baixo ele vai continuar diminuindo o número ex:
// -1.2 floor arredonda para -2
// -5.3 floor arredonda para -6
// alogica dele é sempre para baixo: -1, -2, -3, -4...
console.log(' ');
 */
/* ------------------------ */
//Rounding decimals (ARREDONDAMENTO DE NÚMEROS DECIMAIS)//
/* 
console.log((2.7).toFixed(0)); //nenhuma casa decimal e arredonda para cima
console.log((2.7).toFixed(3)); // três casas decimais depois da vírgula
console.log((2.345).toFixed(2)); // duas casas depois da vírgula e arredonda
//Perceba que o toFixed retorna uma string e não um número, para transformar em número colocamos um + na frente do número.
console.log(+(2.345).toFixed(2));

//Vamos usar esses arredondamentos no nosso app, vamos arredondar os valores do empréstimo
 */

/////////////////////////////////////////////////
/* 172 - THE REMAINDER OPERATOR */
/////////////////////////////////////////////////
//remainder retorna o resto de uma divisão - simbolo: %
/* 
console.log(5 % 2);
console.log(5 / 2); // 5 = 2 * 2 + 1
console.log(8 % 3);
console.log(8 / 3); // 8 = 2 * 3 + 2

//podemos usar o remainder para saber se um número é par ou ímpar

const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));

//Vamos checar se os movimentos são pares ou ímpares

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});

/////////////////////////////////////////////////
/* 173 - NUMERIC SEPARATORS */
/////////////////////////////////////////////////
// Podemos usar '_'(underline) para melhorar nosso entendimento de números grandes.

/* //280356000000 para ler esse número da um pouco de trabalho por isso podemos usar '_' para facilitar nossa leitura, isso não muda em nada o funcionamento.
const num = 280_356_000_000;
console.log(num);
 */
/////////////////////////////////////////////////
/* 174 - WORKING WITH BigInt */
/////////////////////////////////////////////////

/* //Antigamente esse era o maior número que o JavaScript trabalha
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
 */
// A partir de 2020 foi adotado o BigInt que pode ser representado pela letra 'n'. Com o BigInt podemos trabalhar com números enormes:

/* console.log(23289457647512623847777464637378374757n);
console.log(BigInt(3289457647512623847777464637378));
 */
// Operations
// As operações funcionam normalmente como qualquer outro numero desde que seja um BigInt também.

/* console.log(10000n + 10000n);
console.log(17884773883484990n * 100000000n);
 */
// Para conseguir fazer uma operação de um BigInt com um npumero pequeno temos que converter o número pequeno.

/* const huge = 3346574665352627n;
const num = 23;

console.log(huge * BigInt(num));
 */
/* //Exceptions
console.log(20n > 15);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n == '20');

console.log(huge + ' is REALLY big ');

// Divisions
console.log(11n / 3n);
console.log(10 / 3);
 */
/////////////////////////////////////////////////
/* 175 - CREATING DATES */
////////////////////////////////////////////////
// create a date
/* const now = new Date();
console.log(now);

console.log(new Date('Wed Mar 16 2022 16:03:52'));
//Posso colocar um string

console.log(new Date('December 24, 2015'));
// O JavaScript completa pra mim,com o dia da semana
// Não é uma boa prática

console.log(new Date(2037, 10, 19, 15, 23, 5));
//Detalhe: Date trabalha os meses começando a contar a partir de 0, por isso novembro está 10.

console.log(new Date(2037, 10, 31));
//Sabemos que Novembro só tem 30 dias, se eu colocar 31 ele pula para 1 de Dezembro.

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));
 */
/* 
// Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate()); // dia do mês
console.log(future.getDay()); // dia da semana
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString()); // retorna string;
console.log(future.getTime()); // retorna quantos segundos se passaram desde 1970;
console.log(new Date(2142267780000)); // retorna a data desses milisegundos passados.

console.log(Date.now()); // retorna a data de agora em milisegundos

future.setFullYear(2040);
console.log(future);
// Posso inserir um ano, mês ou dia manualmente com 'set'.
 */

/////////////////////////////////////////////////
/* 177 - OPERATIONS WITH DATES */
////////////////////////////////////////////////
/* const future = new Date(2037, 10, 19, 15, 23);
console.log(+future); //convertendo para número ele me retorna em milissegundos, depois preciso converter para data.

// Vamos fazer uma função para calcular quanto dias se passou de uma data para outra. Dividimos por (1000 * 60 * 60 * 24) para converter milissegundos em dias.
const calcDaysPassed = (date1, date2) =>
  (date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
console.log(days1); */

/////////////////////////////////////////////////
/* 179 - INTERNATIONALIZING NUMBERS (Intl) */
////////////////////////////////////////////////
/* const num = 3884764.23;

const options = {
  style: 'currency',
  currency: 'EUR',
};

console.log('US:      ', new Intl.NumberFormat('en-US', options).format(num));
console.log('Germany: ', new Intl.NumberFormat('de-DE', options).format(num));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(num)
);
 */
/////////////////////////////////////////////////
/* 180 - TIMERS: setTimeout and setInterval */
////////////////////////////////////////////////

//setTimeout
/* setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
  3000, //milissegundos
  'olives',
  'spinach'
);
console.log('Waiting...'); */

/* //Parar um timeout antes do tempo
const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
  3000, //milissegundos
  ...ingredients
);
console.log('Waiting...');

if (ingredients.includes('spinach')) clearTimeout(pizzaTimer); */

/* //setInterval
setInterval(function () {
  const now = new Date();
  const hour = now.getHours();
  const min = now.getMinutes();
  const sec = now.getSeconds();

  // console.log(`${hour}:${min}:${sec}`);
}, 1000); */

/////////////////////////////////////////////////
/* 181 - IMPLEMENTING A COUNTDOWN TIMER */
////////////////////////////////////////////////
