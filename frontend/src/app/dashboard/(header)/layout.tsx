'use client'
import styles from './presidente.module.css';
//import { useEffect, useState } from 'react';


export default function Presidente({ children } : { children: React.ReactNode }){
  return (
    <>
    {/* _ITEM: HEADER */}
    <header className={styles.cabecalho}>HEADER</header>
    <main className = {styles.main}>{children}</main>
    </>
  )
}