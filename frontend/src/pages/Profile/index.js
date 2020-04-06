import React, {useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import {FiPower, FiTrash2} from 'react-icons/fi';

import api from '../../services/api';

import './style.css';
import logoImg from '../../assets/logo.svg';


export default function Profile(){
    const [incidents, setIncidents] = useState([]);
    const OngId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');
    const history = useHistory();

    useEffect(() => {
        api.get('profile', {
            headers:{
                Authorization : OngId,
            }
        }).then(Response => {
            setIncidents(Response.data);
        })

    },[OngId]);

    async function handleDeleteIncidents(id){
        try {
          await  api.delete(`incidents/${id}`, {
              headers: {
                  Authorization: OngId,
              }
          });

          setIncidents(incidents.filter(incidents => incidents.id !== id));
        } catch (error) {
            alert('Erro ao deletar caso');
        }
    }

    function handleLogout(){
        localStorage.clear();

        history.push('/');
    }

   return(
    <div className="profile-container">
        <header>
            <img src={logoImg} alt="Be The Hero"/>
            <span>Bem Vindo, {ongName}</span>
            <Link  to="incidents/new" className="button"> Cadastrar Novo Caso</Link>
            <button onClick={handleLogout} type="button">
                <FiPower size={18} color="E02041" />
            </button>
        </header>

        <h1>Casos Cadastrados</h1>
        <ul>
          {incidents.map(incidents =>(
                <li key={incidents.id}>
                <strong>CASO:</strong>
                <p>{incidents.title}</p>

                <strong>DESCRIÇÃO</strong>
                <p>{incidents.description}</p>

                <strong>VALOR:</strong>
                <p>{Intl.NumberFormat('pt-BR',{style:'currency', currency:'BRL'}).format(incidents.value)}</p>
                <button type="button" onClick={() => handleDeleteIncidents(incidents.id)}>
                    <FiTrash2 size={20} color="#a8a8b3"/>
                </button>
            </li>
          ))}
        </ul>

    </div>
   );
}