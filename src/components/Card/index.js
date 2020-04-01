import React, {Component} from "react";
import Cake from '../../style/images/cake.jpg';
import './card.scss';

class Card extends Component {
  constructor() {
    super();
    this.state = {
      selected: false,
    };
  }

  selectCard = (e) => {
    const {cardSelected} = this.props;
    cardSelected(this.card.id);
    
    this.setState({
      selected: true
    });
    
  }

  componentDidMount() {
    
  }

  render() {
    const {imageToMemorize, id} = this.props;
    const {selected} = this.state;
    return (
      <div id="card" onClick={this.selectCard}>
      <div className={selected ? 'flip-card selected' : 'flip-card'} id={id} ref={element => this.card = element}>
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <img src={Cake} alt="Cake" />
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