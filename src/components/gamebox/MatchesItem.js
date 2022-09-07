import React from 'react'
import matches from '../../static/img/matches.jpg'

export default function MatchesItem(props) {

    const handleChange = (e) => {
        props.valueChange(e.target.checked, props.index, props.pIndex)
    }

    return (
        <div className='matches-item'>
            <input type="checkbox" checked={props.value} onChange={handleChange} disabled={props.disabled}/>
            <img src={matches} alt='火柴'/>
        </div>
    )
}
