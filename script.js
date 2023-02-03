'use strict';

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
// 198. Revealing Elements on Scroll
///////////////////////////////////////////////////
// Reveal sections
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
  // section.classList.add('section--hidden');
});

///////////////////////////////////////////////////
// 199. Lazy Loading Images
///////////////////////////////////////////////////
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
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
//200/201. Building a Slider Component
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
    // curSlide = 1: -100%, 0%, 100%, 200%
    // curSlide = 2: -200%, -100%, 0%, 100%
    // curSlide = 3: -300%, -200%, -100%, 0%
    // curSlide > 3 (que é o tamanho 'maxSlide') volta para o inicio com curSlide=0: 0%, 100%, 200%, 300%
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
    // começa com curSlide= 0: 0%, 100%, 200%, 300%
    creatDots();
    activateDot(0);
  };

  init();

  // Events handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevtSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevtSlide();
    e.key === 'ArrowRight' && nextSlide(); // Poderia terescrito igual ao de cima, só fiz dessa maneira para mostrar que posso fazer a condição de outra forma, mas fica a sua escolha.
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      /*{slide} - colocamos dentro do parenteses pois é uma maneira nova, ao invés de colocarmos 'slide' duas vezes, uma no inicio e outra no fim:
     'const slide = e.target.dataset.slide
    podemos simplesmente colocar o 'slide' entre colchetes e tirar o último.  
     
     */
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

//////////////////////////////////////////////////
//AULAS//
//////////////////////////////////////////////////
///////////////////////////////////////////////////
// 186 - Selecting, Creating, and Deleting Elements
///////////////////////////////////////////////////

// Selecting elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');

// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');

// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// document.getElementsByClassName('btn');

/////////////////////////////////////
// Creating and inserting elements
// .insertAdjacentHTML

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.textContent = 'We use cookied for improved funcionality and analytics.';
// message.innerHTML =
//   'We use cookied for improved funcionality and analytics. <button class="btn btn--close-cookie">Go it!</button>';

// header.prepend(message);
// header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

/////////////////////////////////////
// Delete elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

///////////////////////////////////////////////////
// 187 - Styles, Attributes and Classes
///////////////////////////////////////////////////
// Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';
// Os nomes dos estilos são os mesmos do CSS, porém precisamos sempre colocar os valores entre aspas.

// Se euprecisar dar um console.log em algum stilo
// console.log(message.style.width) isso NÃO VAI FUNCIONAR
//Para dar um console.log em algum estilo preciso usar 'getComputedStyle'

// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// Vamos aumentar a altura da mensagem a partir da medida que pegamos no 'getComputedStyle'.

// message.style.height =
// Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';
// OBS: Temos que converter em número pois o getComputedStyle vem como string, além de vir acompanhado do 'px', por isso usamos o parseFloat também para pegarmos somente o numero e somarmos depois com 40. Outra coisa, usamos o '10' para dizer que estamos lidando com números de base 10, isso evita 'bugs', já aprendemos isso no modulo anterior.

// Posso fazeralterações em variáveis do CSS (':root')
// document.documentElement.style.setProperty('--color-primary', 'orangered');
// Aqui pegamos como exemplo uma variável chamada '--color-primary', usamos para isso o 'setProperty', entre parênteses colocamos qual variável queremos mudar, e depois da vírgula colocamos pelo que queremos trocar no casoa cor 'orangered'.

//Attributes

// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt); // Descrição da imagem
// console.log(logo.className); // Nome da classe

// logo.alt = 'Beatiful minimalist logo'; // Posso alterar o alt.

// console.log(logo.designer); // Non-standart (não funciona)
// console.log(logo.getAttribute('designer')); // Funciona

// logo.setAttribute('company', 'Bankist'); // altero o company

// console.log(logo.src); // url absoluta, incluindo o endereço da pagina
// console.log(logo.getAttribute('src')); // Local dentro do arquivo com nome das pastas onde se encontra a imagem.
// Funciona do mesmo jeito para links, veja exemplo abaixo:
// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// Data attributes
// console.log(logo.dataset.versionNumber); // Retorna atributo que começa com 'data'

// Classes
// logo.classList.add('c', 'j'); // Posso tanto adicionar quanto remover mais de uma classe.
// logo.classList.remove('c', 'j');
// logo.classList.toggle('c');
// logo.classList.contains('c');

///////////////////////////////////////////////////
// 189 - Types of Events and Event Handlers
///////////////////////////////////////////////////
// mouseenter
// muito parecido com o 'hover' do CSS
// Vamos ver um exemplo passando o mouse em cima do h1.

// const h1 = document.querySelector('h1');
// h1.addEventListener('mouseenter', function (e) {
//   alert('addEventListenner: Great! You are reading the headin :D');
// });

// Método mais antigo que você pode encontrar por ai:
// h1.onmouseenter = function (e) {
//   alert('addEventListenner: Great! You are reading the headin :D');
// };

// const alertH1 = function (e) {
//   alert('addEventListenner: Great! You are reading the headin :D');

//   h1.removeEventListener('mouseenter', alertH1);
// };

// h1.addEventListener('mouseenter', alertH1);
//Podemos fazer com que o alerta apareça somente uma vez quando passar o mouse em cima, para isso removemos o EventListener. Para facilitar o processo vamos colocar nossa função de alerta dentro de uma variável 'alertH1',junto com a remoção do evento. Com isso ele vai chamar a função uma vez e dentro da própria função ele exclui o evento e nada mais acontece.

// const alertH1 = function (e) {
//   alert('addEventListenner: Great! You are reading the headin :D');
// };

// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
// Aqui podemos usar um timeout para que o alerta só seja removido após passar 3 segundos, ou seja, durante 3 segundos se eu passar o mouse em cima do h1 ainda vai aparecer o alerta, se eu fechar o alerta e esperar passar os 3 segundos quando eu passar o mouse novamente ele não funcionará.

///////////////////////////////////////////////////
// 191 - Event Propagation in Practice
///////////////////////////////////////////////////
// Aqui vamos ver como um evento se propaga, quando clico em algum link por exemplo todo os elementos 'pai' desse link serão tingidos também. Vamos ver um sexmplo prático abaixo.

// Vamos usar cores, primeiro vamos fazer um selecionador de cores aleatório, vamos usar um 'rgb' que possui três valores numéricos de 0 a 255 (rgb(255,255,255)), com isso podemos usar o 'randomInt' para gerar números inteiros.
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)} )`;

// //Vamos usar o menu de navegação do site, onde temos o 'nav__link', seu pai 'nav__links' e o pai de seu pai 'nav'
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget); // Só para vermos o que foi selecionado

//   Stop propagation
//   e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget); // Só para vermos o que foi selecionado
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget); // Só para vermos o que foi selecionado
// });

///////////////////////////////////////////////////
// 193 - DOM Traversing
///////////////////////////////////////////////////

const h1 = document.querySelector('h1');

// Going downwards: child
// Selecionando filhos

// console.log(h1.querySelectorAll('.highlight'));
// todos os filhos do h1 com a classe 'highlight'

// console.log(h1.childNodes);
// todos os elementos filhos que estão em h1, podendo ser texto, comentários, classes, o que estiver dentro de h1.

// console.log(h1.children);
// Todos os filhos diretos de h1

// h1.firstElementChild.style.color = 'white'; // primeiro elemento filho de h1.
// h1.lastElementChild.style.color = 'orangered'; // ultimo elemento filho de h1.

// Going upwards: parent
// Selecionando pais

// console.log(h1.parentNode); // pai do h1
// console.log(h1.parentElement); // elemento pai do h1

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// 'closest' seleciona o pai mais próximo de h1 que contém a classe '.header'

// h1.closest('h1').style.background = 'var(--gradient-primary)';
// aqui o pai mais próximo de h1 que contém o elemento h1 é ele mesmo.

// O metodo 'closest' é como se fosse o contrário do 'querySelector'. O querySelector seleciona os filhos, não importanto a profundidade, já o 'closest' seleciona o pai mais próximo.

// Going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// O javascript só deixa chamar os irmão diretos, se quisermos chamar todos os irmão de uma vez precisamos fazer esse método de chama primeiro o pai do h1 e em seguida seus filhos, com isso ele traz todos os irmãoincluindo o próprio h1.
// Podemos manipular os irmão como se fosse um array, veja abaixo:

// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });
// Aqui só para podermos ver diminuimos em 50% o tamanho de cada filho do h1. Colocamos 'el !== h1' para não incluir ele nessa formatação.
