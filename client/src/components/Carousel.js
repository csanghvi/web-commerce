import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
//https://www.npmjs.com/package/react-responsive-carousel
import { Carousel } from 'react-responsive-carousel';
//source={source} image={image} image2={image2} legend=

export default class ListingsCarousel extends Component {
    render() {
        return (
            <div className="carousel-banner">
                <Carousel infiniteLoop>
                    <div>
                        <img src={this.props.source} />
                        <p className="legend">{this.props.legend}</p>
                    </div>
                    <div>
                        <img src={this.props.image} />
                        <p className="legend">{this.props.legend}</p>
                    </div>
                    <div>
                        <img src={this.props.image2} />
                        <p className="legend">{this.props.legend}</p>
                    </div>
                </Carousel>
            </div>
        );
    }
}