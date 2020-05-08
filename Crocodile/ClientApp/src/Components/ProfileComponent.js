import React, {Component} from 'react';
import avatar from '../images/game/account.svg';

export class ProfileComponent extends Component {
    constructor(props) {
        super(props);
        debugger
    }
    
    render() {
        const h2Style={
            margin: '32px 20px',
            textAlign:'left',
            fontSize:'32px'
        };
        return (
            <div style={{width:'90%', margin:'.8em auto', background:'#96c9e8', borderRadius:'10px' }}>
                <h1 style={{fontSize:'32px',textAlign:'left', margin:'0 100px'}}>Вася 404</h1>
                <div style={{margin:'2em 50px', display:'flex',  }}>
                    <img src={avatar} width='250px' height='250px' style={{background:'#c8c8c8'}} />
                    <div style={{background:'white',borderRadius:'20px', width:'75%', margin:'0 40px', padding: '0 0 160px 0'}}>
                        <h2 style={h2Style}>Игр сыграно</h2>
                        <h2 style={h2Style}>Лучший счет</h2>
                        <h2 style={h2Style}>Угадано</h2>
                        <h2 style={h2Style}>Почти угадано</h2>
                    </div>
                </div>
                <a style={{textDecoration:'none'}} onClick={()=>this.props.setterPageNum(this.props.lastPage[1])} ><button style={{padding: '30px 50px 50px',margin: '0 90px 10px auto'}}
                        className="button">Назад</button></a>
            </div>
        );
    }
}