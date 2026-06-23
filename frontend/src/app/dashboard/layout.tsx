'use client';
import styles from './dashboard.module.css';
import { useEffect, useState } from 'react';
import { lerDadosdeUsuario } from '@/services/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface UsuarioLogado {
  id: string;
  nome: string;
  email: string;
  papel: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //_ITEM: VARIÁVEIS //
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [homeAtivo, setHomeAtivo] = useState(true);
  const [perfilAtivo, setPerfilAtivo] = useState(false);
  const [usuariosAtivo, setUsuariosAtivo] = useState(false);
  const [avisosAtivo, setAvisosAtivo] = useState(false);
  const [tarefasAtivo, setTarefasAtivo] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();
  //_ITEM: FUNÇÃO PARA CARREGAR PERFIL TODA VEZ QUE A PAGINA CARREGAR //
  useEffect(() => {
    //_ITEM: CARREGAR PERFIL //
    const carregarPerfil = async () => {
      //__ITEM: RECUPERAR O TOKEN DO COOKIE //
      const token = Cookies.get('token_acesso');
      //__ITEM: VERIFICAR SE O TOKEN EXISTE //
      if (!token) {
        router.push('/');
        return;
      }
      //__ITEM: CARREGAR O PERFIL DO USUARIO //
      try {
        const response = (await lerDadosdeUsuario(token)) as UsuarioLogado;
        setUsuario(response);
      } catch (error) {
        console.error(error);
        Cookies.remove('token_acesso');
        router.push('/');
      } finally {
        setCarregando(false);
      }
    };
    void carregarPerfil();
  }, [router]);
  //_ITEM: MENSAGEM DE CARREGAMENTO //
  if (carregando) {
    return <div className={styles.loading}>Carregando dados do painel...</div>;
  }

  const handleLogout = () => {
    Cookies.remove('token_acesso');
    router.push('/');
  };

  //_ITEM: BACKEND //
  return (
    <div className={styles.dashboard}>
      {/* __ITEM: MENU LATERAL */}
      <aside className={styles.navigate}>
        {/* ___ITEM: LOGO */}
        < Image 
          src="/logo-darti.png"
          alt="Logo"
          className={styles.logo}
          width={100}
          height={100}
        />
        {/* ___ITEM: LISTA COMPLETA */}
        <div className={styles.lista}>
          {/* ____ITEM: MENU */}
          <nav className={styles.menu}>
            {/* _____ITEM: ITEM DE MENU HOME */}
            <Link 
              href={`/dashboard/${usuario?.papel?.toLowerCase()}/home`}
              className={homeAtivo ? styles.paginaAcessada : styles.acessoPagina}
              onClick={() => {
                setHomeAtivo(true);
                setPerfilAtivo(false);
                setUsuariosAtivo(false);
                setAvisosAtivo(false);
                setTarefasAtivo(false);
              }}
            >
              Home
            </Link>
            {/* _____ITEM: ITEM DE MENU PERFIL */}
            <Link 
              href={`/dashboard/${usuario?.papel?.toLowerCase()}/perfil`}
              className={perfilAtivo ? styles.paginaAcessada : styles.acessoPagina}
              onClick={() => {
                setHomeAtivo(false);
                setPerfilAtivo(true);
                setUsuariosAtivo(false);
                setAvisosAtivo(false);
                setTarefasAtivo(false);
              }}
            >
              Perfil
            </Link>
            {/* _____ITEM: ITEM DE MENU USUÁRIOS */}
            <Link 
              href={`/dashboard/${usuario?.papel?.toLowerCase()}/usuarios`}
              className={usuario?.papel === 'DIRETOR' || usuario?.papel === 'MEMBRO' || usuario?.papel === 'EXTERNO' ? styles.paginaDesabilitada : usuariosAtivo ? styles.paginaAcessada : styles.acessoPagina}
              onClick={() => {
                setHomeAtivo(false);
                setPerfilAtivo(false);
                setUsuariosAtivo(true);
                setAvisosAtivo(false);
                setTarefasAtivo(false);
              }}
            >
              Usuários
            </Link>
            {/* _____ITEM: ITEM DE MENU AVISOS */}
            <Link 
              href={`/dashboard/${usuario?.papel?.toLowerCase()}/avisos`}
              className={usuario?.papel === 'MEMBRO' || usuario?.papel === 'EXTERNO' ? styles.paginaDesabilitada : avisosAtivo ? styles.paginaAcessada : styles.acessoPagina}
              onClick={() => {
                setHomeAtivo(false);
                setPerfilAtivo(false);
                setUsuariosAtivo(false);
                setAvisosAtivo(true);
                setTarefasAtivo(false);
              }}
            >
              Avisos
            </Link>
            {/* _____ITEM: ITEM DE MENU TAREFAS */}
            <Link 
              href={`/dashboard/${usuario?.papel?.toLowerCase()}/tarefas`}
              className={tarefasAtivo ? styles.paginaAcessada : styles.acessoPagina}
              onClick={() => {
                setHomeAtivo(false);
                setPerfilAtivo(false);
                setUsuariosAtivo(false);
                setAvisosAtivo(false);
                setTarefasAtivo(true);
              }}
            >
              Tarefas
            </Link>
          </nav>
          {/* ____ITEM: SAIR */}
          <Link href="/" onClick={handleLogout} className={styles.sair}>Sair</Link>
        </div>
      </aside>
      {/* __ITEM: CONTEUDO PRINCIPAL */}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
