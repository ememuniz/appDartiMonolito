// frontend/src/app/(login)/page.tsx
'use client'
import { useState, useEffect } from 'react'
import styles from './login.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from "js-cookie";
import { fazerLogin } from '@/services/api'



export default function Login() {
  const router = useRouter();
  const [mensagem, setMensagem] = useState('')
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    if (mensagem) {
      setTimeout(() => {
        setMensagem('');
        setSucesso(false);
      }, 7000);
    }
  }, [mensagem]);
  //_ITEM: HANDLELOGIN //
  const handleLogin = async (formData: FormData) => {
    //__ITEM: DADOS DO FORMULARIO //
    const email = formData.get('email') as string
    const senha = formData.get('senha') as string
    
    try {
      const response = await fazerLogin(email, senha);
      //Guarda o token no navegador
      //O primeiro argumento é o nome da chave
      //O segundo argumento é o valor da chave
      //O terceiro argumento é a configuração da chave onde diz que ela vai expirar em 7 dias
      Cookies.set('token_acesso', response.acess_token, { expires: 7 });
      router.push(`/dashboard/${response.papel}`);
    } catch (error) {
      setMensagem('Ocorreu um erro ao fazer login: ' + error);
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
          {/*___ITEM: TITULO*/ }
          <div className={styles.title}>
            <h1>Inovação, IA &</h1>
            <span>Humanidade</span>
          </div>
          {/*___ITEM: TEXTO*/ }
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
          {/*___ITEM: TITULO*/ }
          <h1 className={styles.form_title}>Entrar na plataforma</h1>
          <p className={styles.form_description}>Use seu email institucional para acessar</p>
          {mensagem && <p className={sucesso ? styles.sucesso : styles.mensagem}>{mensagem}</p>}
          {/*___ITEM: FORMULARIO*/ }
          <form action={handleLogin} className={styles.form}>

            {/*____ITEM: INPUT DE EMAIL*/ }
            <label className={styles.label} htmlFor="email">E-MAIL</label> 
            <input
              className={styles.input}
              type="email"
              name="email"
              id="email"
              placeholder="Digite seu email"
              autoFocus
              required
            />

            {/*____ITEM: INPUT DE SENHA*/ }
            <div className={styles.title_password}>
              <label className={styles.label} htmlFor="password">SENHA</label>
              <Link href="/recuperar-senha" className={styles.links_direcionais}>Esqueceu sua senha?</Link>
            </div>
            <input
              className={styles.input}
              type="password"
              name="senha"
              id="senha"
              placeholder="Digite sua senha"
              required
            />

            {/*____ITEM: BOTAO DE ENTRAR*/ }
            <button className={styles.button} type="submit">
              Entrar
            </button>

            {/*____ITEM: LINK DE CADASTRO*/ }
            <p className={styles.form_description}>Ainda não possui uma conta? <Link href="/cadastro" className={styles.links_direcionais}>Cadastre-se</Link></p>
          </form>
        </div>
      </div>
    </main>
  )
}