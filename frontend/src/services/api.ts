const API_URL = 'http://localhost:3001';

export async function criarUsuario(email: string, nome: string, convite: string, password: string) {
  const response = await fetch(`${API_URL}/usuario`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }, //o header é o tipo de dado que vamos enviar
    body: JSON.stringify({ email: email, nome: nome, convite: convite, password: password })
  }); 
  return response.json();
}