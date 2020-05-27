import React, {Component} from "react";
import Versus from '../../style/images/versus.png';
import Fire from '../../style/images/fire.mp4';
import './score.scss';

class Score extends Component {
  constructor() {
    super();
    this.state = {
      scores: [],
    };
  }

  componentDidMount()   {
    const {players} = this.props;
    console.log(players);
    
  }

  render() {
    const {players} = this.props;
    return (
      <div id="score">
        <div className="content-container">
          <div className="score" key={players[0].id}>
            <h4>{players[0].pseudo}</h4>
            <div>{players[0].points}</div>
          </div>

          <img id='versus' src={Versus} alt="versus"/>

          <div className="score" key={players[1].id}>
            <h4>{players[1].pseudo}</h4>
            <div>{players[1].points}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Score;