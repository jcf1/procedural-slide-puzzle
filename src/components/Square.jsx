import React from 'react';

const style = ({ size, position, color }) => {
    return {
        position: "absolute",
        width: size.width + "%",
        height: size.height + "%",
        top: position.top + '%',
        left: position.left + '%',
        backgroundColor: color,
        border: "1px solid #ffffff"
    };
};

export default (props) => <div style={style(props)}/>