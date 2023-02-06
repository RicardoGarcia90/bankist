'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'João Soarez',
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
  currency: 'BRL',
  locale: 'pt-BR', // de-DE
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
  currency: 'BRL',
  locale: 'pt-BR',
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
const btnLogout = document.querySelector('.link-logout');
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

  if (daysPassed === 0) return 'Hoje';
  if (daysPassed === 1) return 'Ontem';
  if (daysPassed <= 7) return `${daysPassed} dias atrás`;
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

const displayMovements = function (acc, sort) {
  containerMovements.innerHTML = '';
  console.log(acc.movements);

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposito' : 'retirada';

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
      labelWelcome.textContent = `Faça login para começar`;
      containerApp.style.display = 'none';
      document.querySelector('.pageContainer').style.display = 'block';
    }

    // Decrese 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 600;

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
    labelWelcome.textContent = `Bem vindo, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.display = 'grid';
    document.querySelector('.pageContainer').style.display = 'none';
    btnLogout.style.display = 'block';

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
    labelWelcome.textContent = `Sua conta foi excluída, você será direcionado a página inicial!`;
    labelWelcome.style.margin = '20rem 45rem';
    labelWelcome.style.width = '60rem';
    btnLogout.style.display = 'none';
    containerApp.style.display = 'none';

    setTimeout(reset, 4000);
    function reset() {
      location.reload();
    }
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

/* LOGOUT */
btnLogout.addEventListener('click', function (e) {
  e.preventDefault();
  location.reload();
});

/////////////////////////////////////////////////
// PAGE

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////
// 188 - Implementing Smooth Scrolling
///////////////////////////////////////////////////

// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  /////ALGUMAS DICAS DE COMO PEGAR COORDENADAS/////
  const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);
  //Me retorna as coordenadas x/y da posição da section--1 no viewport, sendo y a distancia do topo do viewport até o inicio da seção.
  //---------
  // console.log(e.target); //e.target me mostra onde eu cloquei, aqui no caso foi o botão.
  //---------
  // console.log(e.target.getBoundingClientRect());
  // Me retorna as coordenadas x/y da posição da botão que cliquei no viewport, sendo y a distancia do topo do viewport até o botão.
  //---------
  // console.log(window.pageXOffset, window.pageYOffset);
  // Me retorna a posição da janela na página no momento, a posição do que está aparecendo na página.
  //---------
  // console.log(
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );
  //Me retorna o tamanho da janela no meu pc. Qual o tamanho que a janela está aberta

  // Scrolling
  // Método antigo
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // Método antigo com rolagem suave (behavior:'smooth')
  // Coloco tudo dentro de um objeto
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Método mais moderno
  section1.scrollIntoView({ behavior: 'smooth' });
});
//////////////////////////////////////////////////
// Page Navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();

//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
// Esse método funciona muito bem, porém não é muito eficiente pois ele acaba criando um evento (uma cópia) para cada link que eu clicar, imagine se fosse 10 mil elementos, seriam 10 mil cópias, por tanto vamos usar o que aprendemos nas aulas anteriores 190 e 191, onde usamos o event propagation. Veja abaixo:

// Fazendo o page navigation usando event delegation, como aprendemos na aula anterior. Precisamos separar em dois passos.
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////////////////
// 194 - Building a Tabbed Component
///////////////////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // Aqui tinhamos um problema para selecionar somente o botão de cada aba, quando clicávamos em cima do número ele retornava o span que tinha dentro do botão. A primeira solução seria selecionar seu pai utilizando 'parentElement', funcionou para o span porém quando clicávamos no botão selecionava o pai dele e não ele. A próxima solução encontrada foi selcionar o elemento pai mais próximo que tenha a classe 'operations__tab', para isso usamos o 'closest'.
  console.log(clicked);

  if (!clicked) return;
  // Essa é uma técnica para evitar erros, se eu clicar em qulquer área fora dos botões 'clicked' ele deve retornar a função imediatamente e não fazer nada, isso evita erros.

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  // Precisamos remover primeiro antes de adicionar, se não todos os botões ficarão ativos e levantados.
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  // Fizemos o mesmo para o conteúdo.

  // Active tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
  // dataset.tab pois queremos a numeração correspondente a data-tab
});

///////////////////////////////////////////////////
// 195 - Passing Arguments to Event Handlers
///////////////////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el != link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////////////////
// 197 - A Better Way: The Intersection Observer API
///////////////////////////////////////////////////
// Stick navigation

const header = document.querySelector('.header');

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: '-90px',
});

headerObserver.observe(header);

///////////////////////////////////////////////////
//Elements on Scroll
///////////////////////////////////////////////////
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
});

///////////////////////////////////////////////////
// Loading Images
///////////////////////////////////////////////////
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////////////////
// Slider Component
///////////////////////////////////////////////////
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const creatDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide='${i}'>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Preview Slide
  const prevtSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    creatDots();
    activateDot(0);
  };

  init();

  // Events handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevtSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevtSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;

      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
