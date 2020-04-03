import React, { Component } from "react";
import MySwal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import socketIOClient from "socket.io-client";
import Card from '../Card';
import './app.scss';

class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "http://localhost:4001",
      pseudo: '',
      cards: false
    };
  }

  starter = async () => {
    
  }

  Swal = withReactContent(MySwal);



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
        }).then(({value : pseudo}) => {
          this.socketIo(pseudo);
          this.setState({pseudo});
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

    return new Promise(resolve => {
      socket.on('startGame', () => {
        resolve();
      })
    })
  }

  changeTurn = socket => {
    socket.emit('turn:change');
  }



  Toast = this.Swal.mixin({
    position: 'top-end',
    showConfirmButton: false,
    timer: 20000,
    timerProgressBar: true
  });
  
  

  socketIo = pseudo => {

    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    
    // Socket On


    // Get images in order to have same layout for each player
    socket.on('images', images => {
      
      this.setState({
        cards: images
      })
    });

    // Get current player turn
    socket.on('player', firstPlayer => {

      const isCurrentPlayer = firstPlayer.pseudo === this.state.pseudo;

      this.Toast.fire({
        text: firstPlayer.pseudo+' is playing!',
        allowOutsideClick: firstPlayer.pseudo === this.state.pseudo,
        backdrop: !isCurrentPlayer,
      }).then(() => {
        this.changeTurn(socket);
      });
    });

    socket.on('returnCard', ({imageId,pairId})  => {
      
      document.querySelector('#'+imageId).className = 'flip-card selected';
    })

    socket.on('card:reset', imagesArray => {
      console.log(imagesArray);
      
      setTimeout(() => {
        imagesArray.forEach(imageObject => {
          document.querySelector('#'+imageObject.imageId).className = 'flip-card';
        });
      }, 1000);
    })

    //Socket Emit
    socket.emit('pseudo', pseudo);


    this.cardSelected = (imageId, pairId) => {
      socket.emit('cardSelected', {imageId, pairId})
    }

    // When two players are found, start the game
    this.waitPlayers(socket).then(() => {
      this.waitingSwal.close();
    });
  }

  render() {
    const {endpoint} = this.state;
    return (
        <div id="app">
          {
            this.state.cards && this.state.cards.map((imageIndex, index) => <Card ref={element => this.cardElement = element} pair={imageIndex} id={"imageToMemorize"+index} key={'imageToMemorize'+index} imageToMemorize={endpoint+'/images/'+imageIndex+'.jpeg'} cardSelected={this.cardSelected} />)
          }
        </div>
    );
  }
}

export default App;