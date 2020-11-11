import Head from 'next/head'
import styles from '../styles/Home.module.css'
import react,{useState,useEffect} from 'react'
import api from './api/api'
import {orderBy,findIndex} from 'lodash';



export default function Home() {
  const [ilhas,setIlhas] = useState([])

  function notifica(notificacao) {
    // Verifica se o browser suporta notificações
    if (!("Notification" in window)) {
      alert("Este browser não suporta notificações de Desktop");
    }
  
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification(notificacao);
    }
  
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          var notification = new Notification(notificacao);
        }
      });
    }
  }

  useEffect(() => {
    async function listaIlhas(){
      await api.post('/islands').then(resp => {
        setIlhas(orderBy(resp.data.islands, ['turnipPrice'], ['desc']))
        console.log(ilhas)
      })
    if(_.findIndex(ilhas, function(o) { return o.turnipPrice >= 650; })>=0){
      notifica("Encontrada Ilha")
      }

    }
    listaIlhas()
    setTimeout(function() {
      listaIlhas()
      if(_.findIndex(ilhas, function(o) { return o.turnipPrice >= 650; })>=0){
        notifica("Encontrada Ilha")
      }

    }, 30000);
  },[])

  return (
    <div className={styles.container}>
      <Head>
        <title>TE Islands</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
        TE Islands
        </h1>
        <div className={styles.grid}>
          {ilhas.map((ilha) => (
            <div className={styles.card}>
              <h3>{ilha.name}</h3>
              <ul>
              <p>
              <li>Hora na ilha: {ilha.islandTime.slice(11,19)}</li>
              <li>Preço: {ilha.turnipPrice}</li>
              <li><a href={`https://turnip.exchange/island/${ilha.turnipCode}`} target="_blank">Acessar a Página</a></li>
              </p>
              </ul>
            </div>
          ))} 
       </div>






      </main>
{/* 
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer> */}
    </div>
  )
}
