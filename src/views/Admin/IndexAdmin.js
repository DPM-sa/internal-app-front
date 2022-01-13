import React from 'react';
import PostsAdmin from '../Admin/PostsAdmin';
import BibliotecaAdmin from '../Admin/BibliotecaAdmin';
import { useStateValue } from '../../StateProvider'

const IndexAdmin = () => {

    const [{ user }] = useStateValue();
    const admin = ( user.role === "ADMIN_ROLE" );

    return (
        <>
        {
            admin ?
            <PostsAdmin />
            :
            <BibliotecaAdmin />
        }
            
        </>
    )
}

export default IndexAdmin

