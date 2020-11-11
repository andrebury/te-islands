import Head from 'next/head'
import styles from '../styles/Home.module.css'
import react,{useState,useEffect} from 'react'
import api from './api/api'
import {orderBy,findIndex} from 'lodash';



export default function Home() {
  const [ilhas,setIlhas] = useState([])
  const [idealPriceT,setIdealPriceT] = useState('')
  const [idealPrice,setIdealPrice] = useState(0)
  const [dateRefesh,setDateRefesh] = useState('')
  const [melhorPreco,setMelhorPreco] = useState(0)

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

  function trataData(){
    var data = new Date()
    var dia = data.getDate()
    var mes = data.getMonth() + 1
    var ano = data.getFullYear()
    var hora = data.getHours()  < 10 ? ('0' + data.getHours()) : data.getHours()
    var minuto = data.getMinutes() < 10 ? ('0' + data.getMinutes()) : data.getMinutes()
    var segundo = data.getSeconds() < 10 ? ('0' + data.getSeconds()) : data.getSeconds()


      setDateRefesh(dia + '/' + mes + '/' + ano + ' ' + hora + ':' + minuto + ':' + segundo)
  }


  async function listaIlhas(){
      
    trataData()

    await api.post('/islands').then(resp => {
      const ilhaClassific = orderBy(resp.data.islands, ['turnipPrice'], ['desc'])
      setIlhas(ilhaClassific)
      
      const melhorp = ilhaClassific[0].turnipPrice
      
      setMelhorPreco(melhorp)

      if((melhorp >= localStorage.getItem('idealPrice'))){
        notifica("Encontrada Ilha: " + ilhaClassific[0].name + ', preço ' + melhorp + ' Bells')
        
        }
    })
  }


  useEffect(() => {   
    setIdealPrice(localStorage.getItem('idealPrice'))
    listaIlhas()
    
    setInterval(function() {
        listaIlhas()
      }
    , 30000);

  },[])

  function ShowIdealPrice(){
    if(idealPrice != null ){
    return(
      <p>Acompanhar Ilhas com preço maior que {idealPrice}</p>
      
    )
  }else{
      return <div></div>
  }
  }
  function handlePrice(){
    setIdealPrice(idealPriceT)
    localStorage.setItem('idealPrice',idealPriceT)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>TE Islands - Melhor Preço: </title>
        {/* {melhorPreco} */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
        TE Islands
        </h1>
        <div className={styles.input}>
          <input onChange={(e)=>(setIdealPriceT(e.target.value))} value={idealPriceT} placeholder="Coloque o preço ideal"></input>
          <button onClick={handlePrice}>Salvar</button>
        </div>
        <ShowIdealPrice></ShowIdealPrice>
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
      <footer className={styles.footer}>
        {dateRefesh}
      </footer>
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
