const API_URL = 'http://localhost:3001';

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


export async function fazerLogin(email: string, senha: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }, //o header é o tipo de dado que vamos enviar
    body: JSON.stringify({ email: email, senha: senha }),
  }); 

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Email ou senha incorretos');
  }
  return response.json();
}