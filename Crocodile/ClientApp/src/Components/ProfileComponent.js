import React from 'react';
import { browserHistory } from 'react-router/lib';
import * as Fetchs from "../fetchs";
import { Roller } from "react-spinners-css";

export class ProfileComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoad: false }
        this.profile = {};
        Fetchs.getUser(this.props.match.params.id).then(res => {
            debugger;
            this.profile = res;
            this.setState({ isLoad: true });
        });
    }

    render() {
        const h2Style = {
            margin: '32px 20px',
            textAlign: 'left',
            fontSize: '32px'
        };
        if (this.state.isLoad) {
            return (
                <div style={{ width: '90%', margin: '.8em auto', background: 'linear-gradient(180deg, #1d7670 0%, #5aa19b 50%, #19b66f 100%)', borderRadius: '10px', color: '#000844' }}>
                    <h1 style={{ fontSize: '32px', textAlign: 'left', margin: '0 100px' }}>{this.profile.login}</h1>
                    <div style={{ margin: '2em 50px', display: 'flex', }}>
                        <img src={this.profile.photo} width='250px' height='250px' style={{ background: '#c8c8c8' }} alt='avatar' />
                        <div style={{
                            background: 'white',
                            borderRadius: '20px',
                            width: '75%',
                            margin: '0 40px',
                            padding: '0 0 160px 0'
                        }}>
                            <h2 style={h2Style}>{`Игр сыграно: ${this.profile.countGames}`}</h2>
                            <h2 style={h2Style}>{`Лучший счет: ${this.profile.record}`}</h2>
                            <h2 style={h2Style}>{`Угадано: ${this.profile.guessed}`}</h2>
                            <h2 style={h2Style}>{`Почти угадано: ${this.profile.almostGuessed}`}</h2>
                        </div>
                    </div>
                    <a alt='back button' style={{ textDecoration: 'none' }} onClick={browserHistory.goBack}>
                        <button style={{ padding: '30px 50px 50px', margin: '0 90px 10px auto' }}
                            className="button">Назад
                    </button>
                    </a>
                </div>
            );
        } else {
            return (<div className="middleContainer"><Roller color="black" /></div>);
        }
        
    }
}