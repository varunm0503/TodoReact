import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './bootstrap/css/bootstrap-theme.min.css';
import './bootstrap/css/bootstrap.min.css';
import registerServiceWorker from './registerServiceWorker';

const options = ["Pending","Done"];

function TodoInput(props){

    const update = (e) => {
        var key = e.which || e.keyCode;
        if(key === 13) {
            props.add(e.target.value);
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

    const getButtons = () => {
        const allOptions = ["All",...options];
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
            {getButtons()}
        </div>
    );
}

function Notes(props){

    const changeNoteType = (e) => {
        if(e.target.classList.contains("option") && !(e.target.classList.contains("disabled"))){
            const target = e.target;
            const newType = target.getAttribute("data-type");
            const noteId = parseInt(target.parentNode.parentNode.getAttribute("data-id"));
            props.changeNoteType(newType,noteId);
        }
    }

    const getOptionsList = (type) => {
        return (options).map((option) => {
            const classname = option === type ? "option disabled option_small btn btn-primary col-xs-6" : "option option_small btn btn-primary col-xs-6";
            return(
                <span key = {option} data-type = {option} className = {classname}>
                    {option}
                </span>
            );
        });
    }

    const getNoteList = () => {
        const {notes, currentType} = props;
        const filteredNotes = currentType === 'All' ? notes : notes.filter((note)=> note.type === currentType);

        return (filteredNotes).map((note) => {
            return (
                <li className="note" key = {note.id} data-id = {note.id}>
                    <span className={(note.type === "Done" && props.currentType === "All") ? "col-xs-8 note_done" : "col-xs-8"}>
                        {note.text}
                    </span>
                    <span>
                        {getOptionsList(note.type)}
                    </span>
                </li>
            );
        });
    }

    return (
        <ul className="notesArea" onClick = {changeNoteType}> {getNoteList()} </ul>
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
        const length = newNotes.length;
        newNotes.push({
            id:length+1,
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

    changeNoteType = (newType,id) => {
        const oldNotes = this.state.notes;
        const noteToChange = oldNotes.find((note)=> note.id===id);
        const newNote = Object.assign({},noteToChange,{type:newType});
        const newState = {notes : [...oldNotes.slice(0,id-1),newNote,...oldNotes.slice(id)]};
        this.setState(newState);
    }

    render(){
        const {notes, currentType} = this.state;
        return(
            <div id = "todo" className="todo container-fluid">
                <div className="todo__header"> todos </div>
                <TodoInput placeholder = "Enter note" notes={notes} add = {this.addNote} count = {notes.length}/>
                <Notes notes={notes} currentType = {currentType} changeNoteType={this.changeNoteType}/>
                <Tab changeType = {this.changeType} currentType = {currentType}/>
            </div>
        );
    }
}

const todo = <Todo />
const app = document.getElementById('root');

ReactDOM.render(todo,app);
registerServiceWorker();
