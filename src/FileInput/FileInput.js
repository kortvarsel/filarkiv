import React, {Component} from 'react';
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import file from './file.png';
import './FileInput.css';

var firebaseConfig = {
    apiKey: 'AIzaSyBLIpmFo07grN1ueW3CNnPag1nmmsh_84I',
    authDomain: 'filarkiv-75d02.firebaseapp.com',
    databaseURL: 'https://filarkiv-75d02.firebaseio.com',
    storageBucket: 'filarkiv-75d02.appspot.com',
    messagingSenderId: "866884287442"
  };
  firebase.initializeApp(firebaseConfig);

  // Get a reference to the storage service, which is used to create references in your storage buckets
// Points to the root reference
var storageRef = firebase.storage().ref();

/**/


class FileInput extends Component {
    constructor(props) {
      super(props);
      this.fileInput = React.createRef();
      this.state = {
          itemBucket: []
      };
    }
    
    uploadItems = event => {
        event.preventDefault();
        var moveFile = storageRef.child(this.fileInput.current.files[0].name)
        var metadata = {
            contentType: this.fileInput.current.files[0].type
        };
        moveFile.put(this.fileInput.current.files[0], metadata).then(snapshot => {
            console.log('Uploaded a file!');
            
        }).then(snapshot => {
            this.updateItems()
        });
        
    }

    downloadItems = event => {
        var selectedFile = event.target.dataset.file;
        storageRef.child(selectedFile).getDownloadURL().then(url => {
        // `url` is the download URL for 'images/stars.jpg'
  
        // This can be downloaded directly:
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (selectedFile => {
        });
        xhr.open('GET', url);
        //opens in new window
        window.open(url);

        xhr.send();
    
        });
    }

    deleteItems = event => {
        var deletePath = storageRef.child(event.target.dataset.file)
        deletePath.delete().then(snap =>{
            console.log('Deleted file')
        }).then(snapshot =>{
            this.updateItems()
        });
    }
    
    updateItems = () =>{
        // Find all the prefixes and items.
        var itemList = [];
        storageRef.listAll().then(response => {
            //function for every folder
            response.prefixes.forEach(folderRef => {                      
            });
            //items
            response.items.forEach(itemRef => {
            itemList.push(itemRef.name); 
            })

            if (itemList !== this.state.itemBucket){
            this.setState({
                itemBucket: itemList
            });
        }        
        }).catch(function(error) {
            console.log(error)
        });
    }
    componentDidMount() {
        this.updateItems();
    }

    render() {
        
      return (
        <div className="container">
            <div className="row">
            {this.state.itemBucket.map((name, index) => (
            <div className="indFile col-2" key={index}><div className="row textName" width='50px'>{name}</div><div className="row"><img src={file} data-file={name} onClick={this.downloadItems} alt={name} width="30px" height="30px"/></div><div className="row">
            <button data-file={name} onClick={this.deleteItems}>Delete</button></div></div>
            ))}
            </div>
            <form onSubmit={this.uploadItems}>
                <label>
                    <input type="file" ref={this.fileInput} />
                </label>
                <br />
                <button type="submit">Upload</button>
            </form>
        </div>
      );
    }
  }
export default FileInput;
