import React, { Component } from 'react';
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import MetaWall from '../MetaWall/MetaWall';
import fileImg from './file.png';
import deleteImg from './delete.png';
import downloadImg from './download.png';
import './FileInput.css';
import jpegIMG from './JPG.png';
import mp3IMG from './MP3.png';
import pdfIMG from './PDF.png';
import pptIMG from './PPT.png';
import svgIMG from './SVG.png';
import zipIMG from './ZIP.png';
import unkIMG from './Unknown.png';
import chooseFile from './chooseFile.png';


var firebaseConfig = {

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
            itemBucket: [],
            metaRender: [],
            name:'N/A',
            comment:'N/A'
        };
    }

    uploadItems = event => {
        event.preventDefault();
        var newMetadata = {
            contentType: this.fileInput.current.files[0].type,
            customMetadata: {
                name: this.state.name,
                comment: this.state.comment
            }
          }
        var moveFile = storageRef.child(this.fileInput.current.files[0].name)
        var metadata = {
            contentType: this.fileInput.current.files[0].type
        };
        moveFile.put(this.fileInput.current.files[0], newMetadata).then(snapshot => {
            console.log('Uploaded a file!');
        }).then(snapshot => {
            this.updateItems()
        }).catch(error => {
            console.log(error)
        });

    }
    handleChange = event => {
        (event.target.dataset.type==='name') ? 
        this.setState({
            name: event.target.value,
        })
        
        : this.setState({
            comment: event.target.value,
        })
    }
    
    downloadItems = event => {
        var selectedFile = event.target.dataset.file;
        storageRef.child(selectedFile).getDownloadURL().then(url => {


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
        deletePath.delete().then(snap => {
            console.log('Deleted file')
        }).then(snapshot => {
            this.updateItems()
        });
    }
    getMetaIcon = (event) => {
        var fileExt = event.split('.').pop(); //"pdf"
        //could be made smoother by going through a list of known or handled extensions and directly returning the extension as a filename on a match
        if (fileExt === 'jpeg' || fileExt === 'jpg') {
            return <img className="metaIcon" data-file={event} src={jpegIMG} width="50px" height="50px" />;
        } else if (fileExt === 'pdf') {
            return <img className="metaIcon" data-file={event} src={pdfIMG} width="50px" height="50px" />;
        } else if (fileExt === 'zip') {
            return <img className="metaIcon" data-file={event} src={zipIMG} width="50px" height="50px" />;
        } else if (fileExt === 'mp3') {
            return <img className="metaIcon" data-file={event} src={mp3IMG} width="50px" height="50px" />;
        } else if (fileExt === 'ppt') {
            return <img className="metaIcon" data-file={event} src={pptIMG} width="50px" height="50px" />;
        } else if (fileExt === 'svg') {
            return <img className="metaIcon" data-file={event} src={svgIMG} width="50px" height="50px" />;
        } else {
            return <img className="metaIcon" data-file={event} src={unkIMG} width="50px" height="50px" />;
        }
    }
    //incorporate color choice for uploads
    //maybe way to change metadata?
    //way to handle folders as well
    setMeta = event => {

        let itemMeta = event.target.dataset.file
        storageRef.child(itemMeta).getMetadata().then(current => {
            this.setState({
                metaRender: current
            })
        });
    }

    updateItems = () => {
        // Find all the prefixes and items.
        var itemList = [];
        var metaList = [];
        storageRef.listAll().then(response => {
            //function for every folder
            response.prefixes.forEach(folderRef => {
            });
            //items
            response.items.forEach(itemRef => {
                itemList.push(itemRef)
            })
            if (itemList !== this.state.itemBucket) {
                this.setState({
                    itemBucket: itemList,
                });
            }
        }).catch(error => {
            console.log(error)
        });
    }


    componentDidMount() {
        this.updateItems();
    }


    render() {
        return (
            <div className="container d-flex p-2">
                <div className="contentContainer p-2 flex-row">
                    <div className="uploadContainer p-2">
                        <div className="upload">
                            <form onSubmit={this.uploadItems}>
                                <label>
                                <input className="customInput" type="text" data-type="name" placeholder="Name" onChange={this.handleChange}/>
                                <br/>
                                <input className="customInput" type="text" data-type="comment" placeholder="Comment" onChange={this.handleChange}/>
                                <br/>
                                <input style={{color: 'white'}} type="file" ref={this.fileInput} />
                                </label>
                                <br />
                                <button className="uploadButton" type="submit">Upload</button>
                            </form>
                        </div>
                    </div>
                    <div className="break"></div>
                    <div className="breakLine"></div>
                    <div className="itemContainer p-2 flex-row">
                        {this.state.itemBucket.map((item, index) => (

                            <div
                                className="item p-2" key={index}>
                                <div className="row textName">
                                    {item.name}
                                </div>
                                <div
                                    onClick={this.setMeta}
                                    className="row raise"
                                >
                                    {this.getMetaIcon(item.name)}
                                </div>
                                <div className="loadIcon row">
                                    <img 
                                        src={downloadImg} 
                                        data-file={item.name} 
                                        onClick={this.downloadItems} 
                                        height="20px" 
                                        width="20px" 
                                    />
                                    <img 
                                        src={deleteImg} 
                                        data-file={item.name} 
                                        onClick={this.deleteItems} 
                                        height="20px" 
                                        width="20px" 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <MetaWall meta={this.state.metaRender} />
                </div>
            </div>
        );
    }
}

export default FileInput;
