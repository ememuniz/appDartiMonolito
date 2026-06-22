'use client'
import styles from './dashboard.module.css';
import { useEffect, useState } from 'react';
import { lerDadosdeUsuario } from '@/services/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface UsuarioLogado {
  id: string;
  nome: string;
  email: string;
  papel: string;
}


export default function DashboardLayout({ children }: { children: React.ReactNode}){
  //_ITEM: VARIÁVEIS //
  const [usuario,  setUsuario] = useState<UsuarioLogado | null>(null);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

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
      try {
        const response = await lerDadosdeUsuario(token) as UsuarioLogado;
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

  
  return (
    <div className={styles.dashboard}>
      <aside className={styles.navigate}>{usuario?.nome}</aside>
      <div className={styles.content}>{children}</div>
    </div>
  )
}