import React, {Component} from "react";
import Interrogation from '../../style/images/interrogation.png';
import './card.scss';

class Card extends Component {
  constructor() {
    super();
    this.state = {
      selected: false,
    };
  }

  selectCard = () => {
    const {cardSelected} = this.props;
    cardSelected(this.card.id, this.card.dataset.pair);
    
  }

  componentDidMount() {
    console.log('mount');
    
  }

  render() {
    const {imageToMemorize, id, pair} = this.props;
    const {selected} = this.state;
    return (
      <div id="card" onClick={this.selectCard}>
      <div className={'flip-card'} data-pair={pair} id={id} ref={element => this.card = element}>
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <img src={Interrogation} alt="Interrogation" />
          </div>
          <div className="flip-card-back" style={{
            backgroundImage: 'url('+imageToMemorize+')',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default Card;