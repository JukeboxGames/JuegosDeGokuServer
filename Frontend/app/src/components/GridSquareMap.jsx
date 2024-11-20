import React, { Component } from "react";
import "../App.css";

export default class GridSquareMap extends Component {
  render() {
    return (
        <>
          {this.props.door && <div className='button' style={{ backgroundImage: `url("https://imgur.com/GMQU1Mr.png")` }}></div>}
          {this.props.assasin && <div className='blinkbutton' style={{ backgroundImage: `url("https://imgur.com/ZyFxj8p.png")` }}></div>}
          {this.props.survivor && <div className='blinkbutton' style={{ backgroundImage: `url("https://imgur.com/w0hMjO9.png")` }}></div>}
          {this.props.trap && !this.props.assasin && !this.props.survivor && <div className='blinkbutton' style={{ backgroundImage: `url("https://imgur.com/BTpjgLb.png")` }}></div>}
          {this.props.clone && !this.props.assasin && !this.props.survivor && <div className='blinkbutton' style={{ backgroundImage: `url("https://imgur.com/ZyFxj8p.png")` }}></div>}
          {!this.props.survivor && !this.props.assasin && !this.props.trap && !this.props.clone && !this.props.door && <button className="button"> </button>}
        </>
    );
  }
}
