const usuarios = [
  { id: 1, nome: 'Ana Souza', email: 'ana@empresa.com', perfil: 'Administrador', situacao: 'ativo', cadastro: '12/08/2026' },
  { id: 2, nome: 'Bruno Lima', email: 'bruno@empresa.com', perfil: 'Analista', situacao: 'ativo', cadastro: '18/08/2026' },
  { id: 3, nome: 'Carla Mendes', email: 'carla@empresa.com', perfil: 'Operador', situacao: 'bloqueado', cadastro: '26/08/2026' },
  { id: 4, nome: 'Diego Alves', email: 'diego@empresa.com', perfil: 'Analista', situacao: 'ativo', cadastro: '02/09/2026' }
];

// TODO 1: selecione os elementos HTML que serão usados no sistema.
const loginForm = document.querySelector('#login-form');
const loginView = document.querySelector('#login-view');
const dashboardView = document.querySelector('#dashboard-view');
const loginEmail = document.querySelector('#login-email');
const loginPassword = document.querySelector('#login-password');
const loginMessage = document.querySelector('#login-message');

const userForm = document.querySelector('#user-form');
const userName = document.querySelector('#user-name');
const userEmail = document.querySelector('#user-email');
const userRole = document.querySelector('#user-role');
const userPassword = document.querySelector('#user-password');
const userPasswordConfirm = document.querySelector('#user-password-confirm');
const formMessage = document.querySelector('#form-message');

const tableBody = document.querySelector('#users-table-body');
const searchInput = document.querySelector('#search-input');
const statusFilter = document.querySelector('#status-filter');
const roleFilter = document.querySelector('#role-filter');

const totalUsers = document.querySelector('#total-users');
const activeUsers = document.querySelector('#active-users');
const adminUsers = document.querySelector('#admin-users');
const resultCount = document.querySelector('#result-count');
const loggedUser = document.querySelector('#logged-user');

function mostrarMensagem(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = `message ${tipo}`;
}

// TODO 2: crie o evento de submit do login.
loginForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const email = loginEmail.value.trim();
  const senha = loginPassword.value;

  if (email === '' || senha === '') {
    mostrarMensagem(loginMessage, 'Preencha o e-mail e a senha.', 'error');
    return;
  }

  const credenciaisCorretas = email === 'admin@empresa.com' && senha === '123456';

  if (!credenciaisCorretas) {
    mostrarMensagem(loginMessage, 'E-mail ou senha inválidos.', 'error');
    return;
  }

  loginView.classList.add('hidden');
  dashboardView.classList.remove('hidden');
  loggedUser.textContent = 'Administrador';

  renderizarUsuarios(usuarios);
  atualizarIndicadores();
});

// TODO 3: crie o evento de submit do cadastro.
const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

userForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const nome = userName.value.trim();
  const email = userEmail.value.trim().toLowerCase();
  const perfil = userRole.value;
  const senha = userPassword.value;
  const confirmacao = userPasswordConfirm.value;

  if (nome.length < 3) {
    mostrarMensagem(formMessage, 'Informe um nome com pelo menos 3 caracteres.', 'error');
    return;
  }

  if (!emailValido.test(email)) {
    mostrarMensagem(formMessage, 'Informe um e-mail válido.', 'error');
    return;
  }

  if (perfil === '') {
    mostrarMensagem(formMessage, 'Selecione um perfil de acesso.', 'error');
    return;
  }

  if (senha.length < 6) {
    mostrarMensagem(formMessage, 'A senha deve ter pelo menos 6 caracteres.', 'error');
    return;
  }

  if (senha !== confirmacao) {
    mostrarMensagem(formMessage, 'As senhas não são iguais.', 'error');
    return;
  }

  const emailJaExiste = usuarios.some(function (usuario) {
    return usuario.email === email;
  });

  if (emailJaExiste) {
    mostrarMensagem(formMessage, 'Já existe um usuário com este e-mail.', 'error');
    return;
  }

  const novoUsuario = {
    id: Date.now(),
    nome: nome,
    email: email,
    perfil: perfil,
    situacao: 'ativo',
    cadastro: new Date().toLocaleDateString('pt-BR')
  };

  usuarios.push(novoUsuario);
  userForm.reset();
  mostrarMensagem(formMessage, 'Usuário cadastrado com sucesso!', 'success');
  aplicarFiltros();
  atualizarIndicadores();
});

function renderizarUsuarios(lista) {
  // TODO 4: percorra lista e monte as linhas da tabela.
  resultCount.textContent = lista.length;

  if (lista.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5">Nenhum usuário encontrado.</td></tr>';
    return;
  }

  tableBody.innerHTML = lista.map(function (usuario) {
    const situacao = usuario.situacao === 'ativo' ? 'Ativo' : 'Bloqueado';
    const acao = usuario.situacao === 'ativo' ? 'Bloquear' : 'Ativar';

    return `
      <tr>
        <td>${usuario.nome}<br><small>${usuario.email}</small></td>
        <td>${usuario.perfil}</td>
        <td><span class="badge ${usuario.situacao}">${situacao}</span></td>
        <td>${usuario.cadastro}</td>
        <td><button class="action-button" data-id="${usuario.id}">${acao}</button></td>
      </tr>
    `;
  }).join('');
}

function atualizarIndicadores() {
  // TODO 5: atualize total, ativos e administradores.
  const total = usuarios.length;

  const ativos = usuarios.filter(function (usuario) {
    return usuario.situacao === 'ativo';
  }).length;

  const administradores = usuarios.filter(function (usuario) {
    return usuario.perfil === 'Administrador';
  }).length;

  totalUsers.textContent = total;
  activeUsers.textContent = ativos;
  adminUsers.textContent = administradores;
}

function aplicarFiltros() {
  // TODO 6: filtre usuarios pelo texto, situação e perfil.
  const texto = searchInput.value.trim().toLowerCase();
  const situacaoSelecionada = statusFilter.value;
  const perfilSelecionado = roleFilter.value;

  const listaFiltrada = usuarios.filter(function (usuario) {
    const correspondeAoTexto =
      usuario.nome.toLowerCase().includes(texto) ||
      usuario.email.toLowerCase().includes(texto);

    const correspondeASituacao =
      situacaoSelecionada === 'todos' ||
      usuario.situacao === situacaoSelecionada;

    const correspondeAoPerfil =
      perfilSelecionado === 'todos' ||
      usuario.perfil === perfilSelecionado;

    return correspondeAoTexto && correspondeASituacao && correspondeAoPerfil;
  });

  renderizarUsuarios(listaFiltrada);
}

// TODO 7: adicione eventos aos campos de busca e aos selects de filtro.
searchInput.addEventListener('input', aplicarFiltros);
statusFilter.addEventListener('change', aplicarFiltros);
roleFilter.addEventListener('change', aplicarFiltros);

// TODO 8: use delegação de eventos na tabela para ativar/bloquear usuários.
tableBody.addEventListener('click', function (event) {
  if (!event.target.matches('.action-button')) {
    return;
  }

  const id = Number(event.target.dataset.id);

  const usuario = usuarios.find(function (item) {
    return item.id === id;
  });

  if (!usuario) {
    return;
  }

  usuario.situacao = usuario.situacao === 'ativo' ? 'bloqueado' : 'ativo';

  aplicarFiltros();
  atualizarIndicadores();
});

// Inicialização do sistema
renderizarUsuarios(usuarios);
atualizarIndicadores();