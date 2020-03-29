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
      <div id="card">
      <div className={selected ? 'flip-card selected' : 'flip-card'} id={id} onClick={this.selectCard}>
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