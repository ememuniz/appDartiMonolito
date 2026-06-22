const API_URL = 'http://localhost:3001';

//_ITEM: CRIA NOVO USUARIO //
export async function criarUsuario(email: string, nome: string, convite: string, senha: string) {
  const response = await fetch(`${API_URL}/usuario`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }, //o header é o tipo de dado que vamos enviar
    body: JSON.stringify({ email: email, nome: nome, convite: convite, senha: senha }),
  }); 
  return response.json();
}

//_ITEM: FAZ LOGIN //
export async function fazerLogin(email: string, senha: string) {
  const response = await fetch(`${API_URL}/usuario/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }, //o header é o tipo de dado que vamos enviar
    body: JSON.stringify({ email: email, senha: senha }),
  }); 
  if (!response.ok) {
    console.log('debug - chegou aqui no deu errado no front');
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Email ou senha incorretos');
  }
  return response.json();
}

//_ITEM: LER OS DADOS DE UM USUÁRIO ESPECÍFICO //
export async function lerDadosdeUsuario(token: string) {
  const response = await fetch(`${API_URL}/usuario/perfil`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Não foi possível carregar os dados do usuário');
  }
  return response.json();
}