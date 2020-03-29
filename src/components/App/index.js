import React, { Component } from "react";
import MySwal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import socketIOClient from "socket.io-client";
import Card from '../Card';
import One from '../../style/images/1.jpeg';
import Two from '../../style/images/2.jpg';
import Three from '../../style/images/3.jpeg';
import Four from '../../style/images/4.jpeg';
import Five from '../../style/images/5.jpeg';
import Six from '../../style/images/6.jpeg';
import './app.scss';

class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "http://localhost:4001",
      images: [One,Two,Three,Four,Five,Six]
    };
  }

  starter = async () => {
    
  }

  Swal = withReactContent(MySwal);

  shuffle = array => {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  componentDidMount() {
    this.Swal.fire({
      title: '❤️❤️❤️ BON ANNIVERSAIRE MON COEUR !!! ❤️❤️❤️',
      html: '<p>Maintenant que tu as 22 ans je pense qu\'il est temps de voir si tu as une bonne mémoire 😏. Pour cela je te propose de jouer au <a style="font-weight: bold" target="_blank" href="https://fr.wikipedia.org/wiki/Memory_(jeu)">Memory</a> (Remix version anniversaire) !</p>',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Voir les règles',
      allowOutsideClick: false
    }).then(() => {
        this.Swal.fire({
          title: 'Règles du jeu',
          html: 'Les règles sont simples: Chacun notre tour nous allons cliquer sur 2 cartes pour les retourner, en cherchant à trouver la paire. <br>'+
          'Chaque paire rapporte un point. Celui qui a le plus de point à la fin de la partie gagne une une petite surprise.. (Alors je compte sur toi pour gagner hein sinon c\'est pas drôle 😂) <br>'+
          'Entre ton pseudo, puis en cliquant sur le bouton PLAY la partie va commencer. Bonne chance ! ❤️',
          input: 'text',
          inputPlaceholder: 'Entre ton pseudo ici',
          confirmButtonText: 'PLAY',
          allowOutsideClick: false,
          preConfirm: () => {
            if (!document.querySelector('.swal2-input').value) {
              this.Swal.showValidationMessage('Tu as oublié de choisir un pseudo!')
            }
          }
        }).then(({value}) => {
          this.socketIo(value);
        })
    });

  }

  waitPlayers = socket => {
    this.waitingSwal = this.Swal.fire({
      title: 'En attente d\'un autre joueur...',
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      onOpen: () => {
        this.Swal.showLoading();
      }
    })

    return new Promise((resolve,reject) => {
      socket.on('startGame', data => {
        resolve(data);
      })
    })
  }

  socketIo = (pseudo) => {

    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    
    // Socket On

    //Socket Emit
    socket.emit('pseudo', pseudo);

    // When two players are found, start the game
    this.waitPlayers(socket).then(() => {
      this.waitingSwal.close();
    });
  }

  render() {
    const { images } = this.state;
    return (
        <div id="app">
          {
            this.shuffle([...images, ...images]).map((image, index) => <Card id={"imageToMemorize"+index} key={'imageToMemorize'+index} imageToMemorize={image} />)
          }
        </div>
    );
  }
}

export default App;