const $ = (id) => document.getElementById(id);
const CUSTOS = [
  { etapa: 'Roteiro e legenda (IA de texto)', barato: 0.02, premium: 0.10 },
  { etapa: 'Voz em português', barato: 0.10, premium: 0.60 },
  { etapa: 'Movimento / dança', barato: 0.50, premium: 2.00 },
  { etapa: 'Vídeo realista com personagem', barato: 1.00, premium: 4.00 }
];
let atual = null;

function lerUsuarios() { return JSON.parse(localStorage.getItem('zapex_usuarios') || '{}'); }
function entrar() {
  const u = $('usuario').value.trim(), s = $('senha').value;
  if (!u || !s) return alert('Preencha usuário e senha.');
  const todos = lerUsuarios();
  if (!todos[u]) { todos[u] = s; localStorage.setItem('zapex_usuarios', JSON.stringify(todos)); }
  else if (todos[u] !== s) return alert('Senha incorreta.');
  localStorage.setItem('zapex_sessao', u);
  mostrarApp();
}
function mostrarApp() {
  $('tela-login').classList.add('oculto');
  $('tela-app').classList.remove('oculto');
  listarVersoes();
}
function sair() { localStorage.removeItem('zapex_sessao'); location.reload(); }

function montarTabela() {
  let t = '<tr><th>Etapa</th><th>Rascunho</th><th>Premium</th></tr>';
  let a = 0, b = 0;
  CUSTOS.forEach(c => { a += c.barato; b += c.premium; t += `<tr><td>${c.etapa}</td><td>US$ ${c.barato.toFixed(2)}</td><td>US$ ${c.premium.toFixed(2)}</td></tr>`; });
  t += `<tr><th>Total</th><th>US$ ${a.toFixed(2)}</th><th>US$ ${b.toFixed(2)}</th></tr>`;
  $('tabela-custos').innerHTML = t;
}

function analisar() {
  const produto = $('produto').value.trim() || 'seu produto';
  const pers = $('personagem').value.trim() || 'a personagem';
  const notas = $('notas').value.trim();
  const ref = $('link-video').value.trim() || ($('arquivo-video').files[0] ? $('arquivo-video').files[0].name : 'sem referência');
  const texto = `REFERÊNCIA: ${ref}\n\nGANCHO (0-3s): "Eu achei que isso era exagero... até testar ${produto}."\n\nROTEIRO:\n1. ${pers} aparece segurando ${produto} e mostra o problema do dia a dia.\n2. Demonstra o produto em uso, em 10 a 15 segundos.\n3. Fecha com o benefício principal e chamada para o carrinho laranja.\n\nLEGENDA: Testei ${produto} e olha o resultado! Link no carrinho.\nHASHTAGS: #tiktokshop #achadinhos #review\n\nNOTAS SUAS: ${notas || '-'}\n\nLembrete: marque o vídeo como conteúdo gerado por IA ao postar.`;
  $('saida').textContent = texto;
  montarTabela();
  $('resultado').classList.remove('oculto');
  atual = { data: new Date().toLocaleString('pt-BR'), produto, texto };
}

function salvar() {
  if (!atual) return;
  const u = localStorage.getItem('zapex_sessao');
  const chave = 'zapex_versoes_' + u;
  const lista = JSON.parse(localStorage.getItem(chave) || '[]');
  lista.unshift(atual);
  localStorage.setItem(chave, JSON.stringify(lista));
  listarVersoes();
}
function listarVersoes() {
  const u = localStorage.getItem('zapex_sessao');
  const lista = JSON.parse(localStorage.getItem('zapex_versoes_' + u) || '[]');
  $('lista-versoes').innerHTML = lista.map((v, i) => `<li><b>${v.produto}</b> - ${v.data} <button class="link" onclick="abrir(${i})">abrir</button></li>`).join('') || '<li>Nenhuma versão salva ainda.</li>';
}
function abrir(i) {
  const u = localStorage.getItem('zapex_sessao');
  const lista = JSON.parse(localStorage.getItem('zapex_versoes_' + u) || '[]');
  $('saida').textContent = lista[i].texto;
  montarTabela();
  $('resultado').classList.remove('oculto');
  window.scrollTo(0, 0);
}

$('btn-entrar').onclick = entrar;
$('btn-sair').onclick = sair;
$('btn-analisar').onclick = analisar;
$('btn-salvar').onclick = salvar;
if (localStorage.getItem('zapex_sessao')) mostrarApp();
