import { useState } from 'react';

interface Props {
    className : string,
    user: string | null,

}
const PlayerStack = ({ className, user } : Props) => {
    if(user === null) return null;
    return (
        <div className={className}>
            {user}
        </div>
    )
};

export default PlayerStack;