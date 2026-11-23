const $=id=>document.getElementById(id);
const CUSTOS=[['Roteiro e legenda',0,0.1],['Voz',0.1,0.6],['Movimento',0.5,2],['Video realista',1,4]];
let atual=null;
function entrar(){const u=$('usuario').value.trim(),s=$('senha').value;if(!u||!s)return alert('Preencha usuario e senha.');const t=JSON.parse(localStorage.getItem('zapex_usuarios')||'{}');if(!t[u]){t[u]=s;localStorage.setItem('zapex_usuarios',JSON.stringify(t));}else if(t[u]!==s)return alert('Senha incorreta.');localStorage.setItem('zapex_sessao',u);mostrarApp();}
function mostrarApp(){$('tela-login').classList.add('oculto');$('tela-app').classList.remove('oculto');listarVersoes();}
function sair(){localStorage.removeItem('zapex_sessao');location.reload();}
function pegarChave(){let k=localStorage.getItem('zapex_chave');if(!k){k=(prompt('Cole sua chave do Gemini:')||'').trim();if(k)localStorage.setItem('zapex_chave',k);}return k;}
function montarTabela(){let h='<tr><th>Etapa</th><th>Rascunho</th><th>Premium</th></tr>',a=0,b=0;CUSTOS.forEach(c=>{a+=c[1];b+=c[2];h+='<tr><td>'+c[0]+'</td><td>US$ '+c[1].toFixed(2)+'</td><td>US$ '+c[2].toFixed(2)+'</td></tr>';});h+='<tr><th>Total</th><th>US$ '+a.toFixed(2)+'</th><th>US$ '+b.toFixed(2)+'</th></tr>';$('tabela-custos').innerHTML=h;}
async function analisar(){const k=pegarChave();if(!k)return;const p=$('produto').value||'produto do nicho feminino',per=$('personagem').value||'jovem brasileira casual',n=$('notas').value||'nenhuma',ref=$('link-video').value||'sem referencia';
const q='Voce e roteirista de TikTok Shop no Brasil. Referencia: '+ref+'. Observacoes: '+n+'. Produto: '+p+'. Personagem IA: '+per+'. Crie roteiro ORIGINAL de 15 a 25s, sem copiar falas, em portugues: GANCHO, CENAS com falas, LEGENDA, 5 HASHTAGS, MELHOR HORARIO e 3 DICAS DE ALCANCE. Lembre de marcar como conteudo de IA.';
$('saida').textContent='Gerando, aguarde...';$('resultado').classList.remove('oculto');montarTabela();
try{const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key='+encodeURIComponent(k),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:q}]}]})});const d=await r.json();if(!r.ok)throw new Error(d.error?d.error.message:r.status);const tx=d.candidates[0].content.parts.map(x=>x.text).join('');$('saida').textContent=tx;atual={data:new Date().toLocaleString('pt-BR'),produto:p,texto:tx};}catch(e){$('saida').textContent='Erro: '+e.message;}}
function lista(){return JSON.parse(localStorage.getItem('zapex_versoes_'+localStorage.getItem('zapex_sessao'))||'[]');}
function gravar(l){localStorage.setItem('zapex_versoes_'+localStorage.getItem('zapex_sessao'),JSON.stringify(l));listarVersoes();}
function salvar(){if(!atual)return;const l=lista();l.unshift(atual);atual=null;gravar(l);}
function listarVersoes(){$('lista-versoes').innerHTML=lista().map((v,i)=>'<li><b>'+v.produto+'</b> - '+v.data+' <button class="link" onclick="abrir('+i+')">abrir</button> <button class="link" onclick="apagar('+i+')">apagar</button></li>').join('')||'<li>Nenhuma versao salva.</li>';}
function abrir(i){$('saida').textContent=lista()[i].texto;montarTabela();$('resultado').classList.remove('oculto');scrollTo(0,0);}
function apagar(i){const l=lista();l.splice(i,1);gravar(l);}
$('btn-entrar').onclick=entrar;$('btn-sair').onclick=sair;$('btn-analisar').onclick=analisar;$('btn-salvar').onclick=salvar;
if(localStorage.getItem('zapex_sessao'))mostrarApp();


                
