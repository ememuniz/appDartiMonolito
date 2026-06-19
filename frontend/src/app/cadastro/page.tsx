// frontend/src/app/cadastro/page.tsx
'use client'
import styles from './cadastro.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
//_ITEM: IMPORTAR FETCHS //
import { criarUsuario } from '@/services/api' //Criar novos usuários



export default function Registro() {
  //_ITEM: VARIAVEIS DE ESTADO //
  const [mensagem, setMensagem] = useState('')

//_ITEM: INTERFACES //
interface dados {
  email: string;
  nome: string;
  convite: string;
  password: string;
  confirmPassword: string;
}

  
  
  //_ITEM: RETIRA A MENSAGEM EM 3 SEGUNDOS //
  useEffect(() => {
    if (mensagem) {
      setTimeout(() => {
        setMensagem('');
      }, 7000);
    }
  }, [mensagem]);

  //_ITEM: HANDLEREGISTRO //
  const handleRegistro = async (formData: FormData) => {
    //__ITEM: DADOS //
    const email = formData.get('email') as string
    const nome = formData.get('nome') as string
    const convite = formData.get('convite') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const regexValidaPassword = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/ // Verifique se a senha tem pelo menos 8 caracteres, uma letra e um número e pode conter outros caracteres ou nao

    //__ITEM: VALIDAÇÃO DA SENHA //
    if (password !== confirmPassword) {
      setMensagem('As senhas não coincidem. frefe gegeg grgeg. eg eg eg ');
      return;
    }

    if (!regexValidaPassword.test(password)) {
      setMensagem('A senha precisa ter pelo menos 8 caracteres, uma letra e um número');
      return;
    }

    //__ITEM: CRIAR NOVO USUARIO //
    try {
      const response = await criarUsuario(email, nome, convite, password);
      setMensagem(response.message);
    } catch (error) {
      setMensagem('Ocorreu um erro ao criar o usuário: ' + error);
    }
  }





 //DIVIDE====================================================================//

  return (
    <main className={styles.login}> 
      {/*_ITEM: BANNER*/ }
      <div className={styles.banner}>
        {/*__ITEM: IMAGEM DO BANNER*/ }
        <div className={styles.banner_image}>
        </div>
        {/*__ITEM: TEXTO DO BANNER*/ }
        <div className={styles.banner_content}>
          {/*___ITEM: TITULO DO BANNER*/ }
          <div className={styles.title}>
            <h1>Inovação, IA &</h1>
            <span>Humanidade</span>
          </div>
          {/*___ITEM: TEXTO DO BANNER*/ }
          <p>
            O laboratório multidisciplinar da UFMA onde tecnologia, biotecnologia, inovação social e educação digital convergem para redefinir o futuro.
          </p> 
        </div>
      </div>

      {/*_ITEM: METADE FORMULARIO*/ }
      <div className={styles.content}>
        {/*__ITEM: FORMULARIO*/ }
        <div className={styles.form_container}>
          {/*___ITEM: LOGO*/ }
          <div className={styles.form_logo_container}>
            <Image src="/logo-darti.png" alt="Logo" className={styles.form_logo} width={100} height={100} />
          </div>
          {/*___ITEM: TITULO DO FORMULARIO*/ }
          <h1 className={styles.form_title}>Criar Conta</h1>
          <p className={styles.form_description}>Insira seus dados e o seu código de convite</p>
          {/*___ITEM: MENSAGEM DE AVISO*/ }
          {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
          {/*___ITEM: FORMULARIO*/ }
          <form action={handleRegistro} className={styles.form}>

            {/*____ITEM: INPUT DE NOME*/ }
            <label className={styles.label} htmlFor="nome">NOME COMPLETO</label> 
            <input
              className={styles.input}
              type="text"
              name="nome"
              id="nome"
              placeholder="Digite o seu nome completo"
              autoFocus
              required
            />

            {/*____ITEM: INPUT DE EMAIL*/ }
            <label className={styles.label} htmlFor="email">EMAIL</label> 
            <input
              className={styles.input}
              type="email"
              name="email"
              id="email"
              placeholder="Digite o seu email"
              required
            />

            {/*____ITEM: CÓDIGO DE CONVITE*/ }
            <label className={styles.label} htmlFor="convite">CÓDIGO DE CONVITE</label> 
            <input
              className={styles.input}
              type="text"
              name="convite"
              id="convite"
              placeholder="xxxx-xxxx"
              required
            />

            {/*____ITEM: INPUT DE SENHA*/ }
            <label className={styles.label} htmlFor="password">SENHA</label>
            <input
              className={styles.input}
              type="password"
              name="password"
              id="password"
              placeholder="Digite sua senha"
              required
            />

            {/*____ITEM: INPUT DE CONFIRMAÇÃO DE SENHA*/ }
            <label className={styles.label} htmlFor="password_confirmation">CONFIRME SUA SENHA</label> 
            <input
              className={styles.input}
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirme sua senha"
              required
            />

            {/*____ITEM: BOTAO DE ENTRAR*/ }
            <button className={styles.button} type="submit">
              Cadastrar
            </button>

            {/*____ITEM: LINK DE CADASTRO*/ }
            <p className={styles.form_description}>Ja possui cadastro? <Link href="/" className={styles.links_direcionais}>Faça login</Link></p>
          </form>
        </div>
      </div>
    </main>
  )
}