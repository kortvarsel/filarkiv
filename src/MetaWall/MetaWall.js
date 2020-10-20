import React, {Component} from 'react';
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "./MetaWall.css";

class MetaWall extends Component {
    constructor(props) {
      super(props);
      this.state = {
        metaRender: {
        },
      }
    }
    componentDidUpdate(prevProps){
        let checkCurrent = this.props.meta
        if (prevProps.meta !== this.props.meta){
            this.setState({
                metaRender: checkCurrent,
            })
        }  
    }
    checkAdditionalData = () => {

    }
    sizeCheck = () => {
        if (Object.keys(this.state.metaRender).length > 0){
            let size = this.state.metaRender.size;
            let sizeAffix = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
            let index = 0;
            var tempSize = this.state.metaRender.size
            
            while (size.toString().length>3){
                tempSize = tempSize/1024;
                size = tempSize.toFixed();
                index += 1;
            }   
            size = tempSize.toFixed(2);

            return <p>Size: {size} {sizeAffix[index]}</p>
        }
    }
    render() {
        return (
            <div className="metaData" style={{visibility: Object.keys(this.state.metaRender).length > 0 ? 'visible' : 'hidden' }}>

                <p>File Name: {this.state.metaRender.fullPath}</p>
                <p>File Type: {this.state.metaRender.contentType}</p>
                {this.checkAdditionalData}
                <p>Date Added: {this.state.metaRender.timeCreated}</p>
                {this.sizeCheck()}

                
                
            </div>
        );
    }
}
export default MetaWall;