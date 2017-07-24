import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './bootstrap/css/bootstrap-theme.min.css';
import './bootstrap/css/bootstrap.min.css';
import registerServiceWorker from './registerServiceWorker';

const NOTE_STATUS_OPTIONS= ["Pending","Done"];

function isEnterPressed(e){
    const key = e.which || e.keyCode;
    return key === 13 ? true : false;
}

function isValueEmpty(value){
    return (value && value.trim()) ? false : true;
}

function TodoInput(props){

    const update = e => {

        if(isEnterPressed(e)) {
            let userInput = e.target.value;
            if(!isValueEmpty(userInput)) {
                props.add(userInput);
                e.target.value = "";
            }
        }
    }

    return (
        <div>
            <input className="form-control" type = "text" placeholder = {props.placeholder} onKeyUp={update} />
        </div>
    );
}

function Tab(props){

    const changeCurrentType = (e) => {
        props.changeType(e.target.getAttribute("data-type"));
    }

    const renderAllButtons = () => {
        const allOptions = ["All",...NOTE_STATUS_OPTIONS];
        return (
            allOptions.map((type) => {
                return (
                    < span key = {type} onClick = {changeCurrentType}
                        data-type = {type} className = {props.currentType === type ? "btn btn-primary active" : "btn btn-primary"}>
                        {type}
                    </span>
                );
            })
        );
    }

    return (
        <div className="btn-group btn-group-justified" >
            {renderAllButtons()}
        </div>
    );
}

function Notes(props){

    const changeNoteType = (e) => {
        if(e.target.classList.contains("option") && !(e.target.classList.contains("disabled"))){
            const target = e.target;
            const newType = target.getAttribute("data-type");
            const noteId = parseInt(target.parentNode.parentNode.getAttribute("data-id"));
            props.changeNoteType(noteId,newType);
        }
    }

    const renderOptionsList = (type) => {
        return (NOTE_STATUS_OPTIONS).map((option) => {
            const classname = option === type ? "option disabled option_small btn btn-primary col-xs-6" : "option option_small btn btn-primary col-xs-6";
            return(
                <span key = {option} data-type = {option} className = {classname}>
                    {option}
                </span>
            );
        });
    }

    const renderNotes = () => {
        const {filteredNotes, currentType} = props;

        return (filteredNotes).map((note) => {
            return (
                <li className="note" key = {note.id} data-id = {note.id}>
                    <span className={(note.type === "Done" && currentType === "All")
                                        ? "note__text col-xs-8 note_done" : "note__text col-xs-8"}>
                        {note.text}
                    </span>
                    <span>
                        {renderOptionsList(note.type)}
                    </span>
                </li>
            );
        });
    }

    return (
        <ul className="notesArea" onClick = {changeNoteType}> {renderNotes()} </ul>
    );
}

class Todo extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            notes : [],
            currentType : "All"
        }
    }

    addNote = (text) => {
        let newNotes = this.state.notes.slice();
        newNotes.push({
            id:Date.now(),
            text,
            type:"Pending"
        });
        this.setState({notes: newNotes});
    }

    changeType = (newType) => {
        this.setState({
            currentType : newType
        });
    }

    changeNoteType = (id, newType) => {
        const oldNotes = this.state.notes;
        const noteToChange = oldNotes.find((note)=> note.id===id);
        const index = oldNotes.findIndex((note)=> note.id===id);
        const newNote = Object.assign({},noteToChange,{type:newType});
        const newState = {notes : [...oldNotes.slice(0,index),newNote,...oldNotes.slice(index+1)]};
        this.setState(newState);
    }

    render(){
        const {notes, currentType} = this.state;
        const filteredNotes = currentType === 'All' ? notes : notes.filter((note)=> note.type === currentType);
        return(
            <div id = "todo" className="todo container-fluid">
                <div className="todo__header"> todos </div>
                <TodoInput placeholder = "Enter note" notes={notes} add = {this.addNote} count = {notes.length}/>
                <Notes filteredNotes={filteredNotes} currentType = {currentType} changeNoteType={this.changeNoteType}/>
                <Tab changeType = {this.changeType} currentType = {currentType}/>
            </div>
        );
    }
}

const todo = <Todo />
const app = document.getElementById('root');

ReactDOM.render(todo,app);
registerServiceWorker();
