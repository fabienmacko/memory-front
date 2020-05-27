import React, { Component } from "react";
import Scores from '../Score';
import MySwal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import socketIOClient from "socket.io-client";
import Card from '../Card';
import './reset.scss';
import './app.scss';

class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "http://localhost:4001",
      pseudo: '',
      cards: false,
      players: []
    };
  }

  Swal = withReactContent(MySwal);

  componentDidMount() {
    this.Swal.fire({
      title: 'Bienvenue',
      html: '<p>Le confinement nous a empêché de voir l\'exterrieur, à tel point qu\'on a du mal à se rappeler à quoi ressemble une forêt, de la neige ou une montagne.. Pour pâlier à cela et renouer avec nos souvenir et notre belle planète, je te propose de jouer au <a style="font-weight: bold" target="_blank" href="https://fr.wikipedia.org/wiki/Memory_(jeu)">Memory</a> !</p>',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Voir les règles',
      allowOutsideClick: false
    }).then(() => {
        this.Swal.fire({
          title: 'Règles du jeu',
          html: 'Les règles sont simples: Chacun votre tour vous allez cliquer sur 2 cartes pour les retourner, en cherchant à trouver une paire. <br>'+
          'Chaque paire rapporte un point. Celui qui a le plus de point à la fin de la partie gagne la partie ! <br>'+
          'Entre ton pseudo, puis en cliquant sur le bouton PLAY, le système va cherchera un autre joueur et la partie va commencer. Bonne chance ! <br> (PS: Si aucun joueur, tu peux soliciter un ami, ou alors ouvrir une seconde page dans ton navigateur pour jouer contre toi-même..)',
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
      socket.on('startGame', players => {
        resolve();
        this.setState({players});
        
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

    // When one of the players disconnect
    socket.on('game:cancelled', () => {
      this.Swal.fire({
        title: 'Quel lâche!',
        html: 'Ton adversaire a quitté la partie..',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Rejouer',
        allowOutsideClick: false
      }).then(() => {
        window.location.reload();
      });
    });

    // Get images in order to have same layout for each player
    socket.on('images', images => {
      console.log('IMAGES');
      
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
        console.log('then toast executed');
        
        this.changeTurn(socket);
      });
    });

    socket.on('returnCard', ({imageId})  => {
      
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

    socket.on('game:winner', pseudo => {
      this.Swal.fire({
        title: 'Et le gagnant de cette partie est...',
        html: '<h1><strong>'+pseudo+' !</strong></h1><br> Félicitations tu remportes cette partie !',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Rejouer',
        allowOutsideClick: false
      }).then(() => {
        window.location.reload();
      });

    });

    socket.on('score:add', (players) => {
      console.log('adding score here to player '+ players);
      console.log(players);
      this.setState({players})
      
    });

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
    const {endpoint, players} = this.state;
    return (
        <div id="app">
          {
            // When there is players
            players.length > 0 && <Scores players={players} />
          }
          <div className="card-container">
          {
            this.state.cards && this.state.cards.map((imageIndex, index) => 
            <Card 
            ref={element => this.cardElement = element} 
            pair={imageIndex} id={"imageToMemorize"+index} 
            key={'imageToMemorize'+index} 
            imageToMemorize={endpoint+'/images/'+imageIndex+'.jpeg'} 
            cardSelected={this.cardSelected} />)
          }
          </div>
        </div>
    );
  }
}

export default App;