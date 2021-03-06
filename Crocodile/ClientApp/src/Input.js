import React, {Component} from 'react';
import back from './images/registrationForm/back.svg'
import GoogleLogin from "react-google-login";
import {loginUserGoogle} from './fetchs'


export class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {isInput: true}
        this.good = this.good.bind(this);
    }
    good(x){
        this.props.signInWithGoogle(x.Tt.Du,x.Ea,x.Tt.hL); 
    }
    bad(x){
        console.log(x);
    }

    render() {
        if (this.state.isInput)
            return <form id="formIn">
                <h2 style={{
                    top: '.5em', left: '3.5em', position: 'absolute', fontSize: '6em', margin: '0 auto',
                    textDecoration: 'underline'
                }}>Войти</h2>
                <input className="input" style={{ top: '5em', left: '3em' }} id="userLogin" type="text" defaultValue=""
                       placeholder="Email"
                       required/>
                <input className="input" style={{ top: '9em', left: '3em' }} id="userPassword" type="password" defaultValue=""
                       placeholder="Password"
                       required/>
                <div
                    style={{
                        position: 'absolute', top: '36em', left: '3em', border: 'none', background: 'darkgray',
                        width: '90%', height: '.125em'
                    }}/>
                <h3 style={{margin: 0, position: 'absolute', left: '5.2em', top: '12.5em', fontSize: '3em'}}>Или через
                    соцсети</h3>
                <div style={{position: 'absolute', left: '7em', top: '42.5em'}}>
                    <GoogleLogin onSuccess={this.good} onFailure={this.bad} clientId={'911149693496-da2bvkv35e06aebmf36l1hncgjdj114t.apps.googleusercontent.com'}/>
                </div>
                <a  type="submit" onClick={(parent)=>this.props.signIn()} className="button myButtonIn">Войти</a>
                <span style={{position: 'absolute', fontSize: '2em', left: '15em', top: '32em'}}>
        Нет аккаунта? <a onClick={(x) => {this.setState({isInput: false})}} style={{cursor:"pointer",display: 'inline-block'}}><h4
                    style={{textDecoration: 'underline'}}>Регистрация</h4></a>
    </span>
            </form>;
        else return <form id="formUp">
                <div style={{position: 'relative'}}>
                    <a onClick={(x) => this.setState({isInput: true})}><img style={{cursor:"pointer",
                        height: '6em', width: '6em',
                        position: 'absolute', top: '3em', left: '0.5em'
                    }} src={back}/></a>
                    <h2 style={{
                        top: '.5em', left: '1.9em', position: 'absolute', fontSize: '6em',
                        margin: '0 auto', textDecoration: 'underline'
                    }}>Регистрация</h2>
                    <input className="input" style={{top: '5em', left: '3em'}} id="registLogin" type="text"
                           defaultValue=""
                           placeholder="Логин"
                           required/>
                <input className="input" style={{ top: '9em', left: '3em' }} id="registPassword" type="password"
                           defaultValue=""
                           placeholder="Пароль"
                           required/>
                    <input className="input" style={{top: '12em', left: '3em'}} id="confirmPassword" type="password"
                           defaultValue=""
                           placeholder="Подтвердите пароль"
                           required/>
                    <a type="submit" onClick={()=>this.props.signUp()} className="button myButtonUp">Подтвердить</a>
                </div>
            </form>;
    }
}