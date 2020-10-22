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
        metaRender: this.props.meta
      }
      const options = {
        timeZone:"Africa/Accra",
        hour12 : true,
        hour:  "2-digit",
        minute: "2-digit",
       second: "2-digit"
     };
    }
    componentDidUpdate(prevProps){
        let checkCurrent = this.props.meta
        if (prevProps.meta !== this.props.meta){
            this.setState({
                metaRender: checkCurrent,
                name: checkCurrent.customMetadata.name,
                comment: checkCurrent.customMetadata.comment
            })
        }  
    }
    checkAdditionalData = () => {
            if (this.state.name !== 'N/A' && this.state.comment !== 'N/A'){
                return (
                    <div>
                <p>Comment: {this.state.comment}</p>
                <p>Added By: {this.state.name}</p>
                </div>
                );
            } else if (this.state.name !== 'N/A' && this.state.comment === 'N/A') {
                return (<div>
                <p>Added By: {this.state.name}</p>
                </div>
                );
            } else if (this.state.name === 'N/A' && this.state.comment !== 'N/A') {
                return (<div>
                <p>Comment: {this.state.comment}</p>
                </div>
                );
            } else {
                return
            }
            
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
    parseDate = () => {
        var date = new Date(this.state.metaRender.timeCreated);
        console.log(date.toDateString())
        var newDate = date.toDateString();
        return newDate
    }
    render() {
        
        return (
            <div className="metaData" style={{visibility: Object.keys(this.state.metaRender).length > 0 ? 'visible' : 'hidden' }}>

                <p>File Name: {this.state.metaRender.fullPath}</p>
                {this.checkAdditionalData()}
                {this.sizeCheck()}
                <p>Date Added: {this.parseDate()}</p>

                
                
            </div>
        );
    }
}
export default MetaWall;