document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  const usuarioInput = document.getElementById('usuario');
  const senhaInput = document.getElementById('senha');
  const erroEl = document.getElementById('erro');
  const submitBtn = form.querySelector('.btn');

  const USUARIO_CORRETO = 'AdminConfidencias';
  const SENHA_CORRETA = 'admin123456';

  let failedAttempts = 0;
  let currentQuestion = 0;
  let isAnswering = false;

  const overlay = document.getElementById('terminalOverlay');
  const output = document.getElementById('terminalOutput');
  const termInput = document.getElementById('terminalInput');
  const termSend = document.getElementById('terminalSend');
  const termClose = document.getElementById('terminalClose');

  const questions = [
    { q: 'Quem criou o mundo?', ans: ['Deus', 'deus'] },
    { q: 'Qual nome da colonia atual?', ans: ['Ordem das barreiras', 'As Barreiras', 'Barreiras'] },
    { q: '1+1 = ?', ans: ['Fish', 'fish', '11'] }
  ];

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const usuario = usuarioInput.value.trim();
    const senha = senhaInput.value.trim();

    if (usuario === USUARIO_CORRETO && senha === SENHA_CORRETA) {
      erroEl.classList.remove('visible');
      window.location.href = 'dashboard.html';
    } else {
      erroEl.textContent = 'tente novamente.';
      erroEl.classList.add('visible');
      usuarioInput.value = '';
      senhaInput.value = '';
      usuarioInput.focus();

      failedAttempts++;
      if (failedAttempts >= 2) {
        showQuebreButton();
      }
    }
  });

  function showQuebreButton() {
    if (document.getElementById('quebreBtn')) return;

    submitBtn.style.display = 'none';

    const quebreBtn = document.createElement('button');
    quebreBtn.id = 'quebreBtn';
    quebreBtn.className = 'btn-quebre';
    quebreBtn.textContent = 'QUEBRE!';
    quebreBtn.type = 'button';
    submitBtn.parentNode.appendChild(quebreBtn);

    quebreBtn.style.display = 'block';
    quebreBtn.addEventListener('click', openTerminal);
  }

  function openTerminal() {
    currentQuestion = 0;
    isAnswering = false;
    output.innerHTML = '';
    overlay.classList.add('visible');
    termInput.disabled = true;

    typeWriter('> Ola, passe por 3 respostas e quebre tudo e descubra o login...\n', function () {
      setTimeout(function () {
        askQuestion();
      }, 400);
    });
  }

  function askQuestion() {
    if (currentQuestion >= questions.length) {
      termInput.disabled = true;
      typeWriter('\n> ACESSO CONCEDIDO.\n> LOGIN: AdminConfidencias / admin123456\n', function () {
        setTimeout(function () {
          overlay.classList.remove('visible');
          submitBtn.style.display = 'block';
          var qb = document.getElementById('quebreBtn');
          if (qb) qb.style.display = 'none';
          usuarioInput.value = USUARIO_CORRETO;
          senhaInput.value = SENHA_CORRETA;
          form.submit();
        }, 1500);
      });
      return;
    }

    typeWriter('\n> ' + questions[currentQuestion].q + '\n', function () {
      isAnswering = true;
      termInput.disabled = false;
      termInput.focus();
    });
  }

  function submitAnswer() {
    if (!isAnswering || termInput.disabled) return;

    var answer = termInput.value.trim();
    termInput.value = '';

    var line = document.createElement('div');
    line.className = 'line user';
    line.textContent = '> ' + answer;
    output.appendChild(line);
    scrollOutput();

    var q = questions[currentQuestion];
    var correct = q.ans.some(function (a) {
      return a.toLowerCase() === answer.toLowerCase();
    });

    if (correct) {
      var corrLine = document.createElement('div');
      corrLine.className = 'line correct';
      corrLine.textContent = '> Correto.';
      output.appendChild(corrLine);
      scrollOutput();

      isAnswering = false;
      termInput.disabled = true;
      currentQuestion++;

      setTimeout(function () {
        askQuestion();
      }, 500);
    } else {
      var wrongLine = document.createElement('div');
      wrongLine.className = 'line wrong';
      wrongLine.textContent = '> Incorreto. Tente novamente.';
      output.appendChild(wrongLine);
      scrollOutput();

      termInput.disabled = false;
      termInput.focus();
    }
  }

  function typeWriter(text, callback) {
    var cursorSpan = document.createElement('span');
    cursorSpan.className = 'cursor';
    output.appendChild(cursorSpan);
    scrollOutput();

    var i = 0;
    var speed = 25;

    function type() {
      if (i < text.length) {
        output.insertBefore(document.createTextNode(text.charAt(i)), cursorSpan);
        i++;
        scrollOutput();
        setTimeout(type, speed);
      } else {
        output.removeChild(cursorSpan);
        if (callback) callback();
      }
    }

    type();
  }

  function scrollOutput() {
    output.scrollTop = output.scrollHeight;
  }

  termSend.addEventListener('click', submitAnswer);
  termInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitAnswer();
    }
  });

  termClose.addEventListener('click', function () {
    overlay.classList.remove('visible');
    termInput.disabled = true;
  });
});
